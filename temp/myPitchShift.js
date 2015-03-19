/// <reference path="shared/js/base2.js" />

//SYNOPSIS: Routine for doing pitch shifting while maintaining
//* duration using the Short Time Fourier Transform.
//*
//* DESCRIPTION: The routine takes a pitchShift factor value which is between 0.5
//* (one octave down) and 2. (one octave up). A value of exactly 1 does not change
//* the pitch. numSampsToProcess tells the routine how many samples in indata[0...
//* numSampsToProcess-1] should be pitch shifted and moved to outdata[0 ...
//* numSampsToProcess-1]. The two buffers can be identical (ie. it can process the
//* data in-place). fftFrameSize defines the FFT frame size used for the
//* processing. Typical values are 1024, 2048 and 4096. It may be any value <=
//* MAX_FRAME_LENGTH but it MUST be a power of 2. osamp is the STFT
//* oversampling factor which also determines the overlap between adjacent STFT
//* frames. It should at least be 4 for moderate scaling ratios. A value of 32 is
//* recommended for best quality. sampleRate takes the sample rate for the signal 
//* in unit Hz, ie. 44100 for 44.1 kHz audio. The data passed to the routine in 
//* indata[] should be in the range [-1.0, 1.0), which is also the output range 
//* for the data, make sure you scale the data accordingly (for 16bit signed integers
//* you would have to divide (and multiply) by 32768). 

var PitchShifter = Class.create({
    MAX_FRAME_LENGTH: 16000,
    gInFIFO: [],//float
    gOutFIFO: [],//float
    gFFTworksp: [],//float
    gLastPhase: [],//float
    gSumPhase: [],//float
    gOutputAccum: [],//float
    gAnaFreq: [],//float
    gAnaMagn: [],//float
    gSynFreq: [],//float
    gSynMagn: [],//float
    gRover: 0, //long
    gInit: 0, //long

    outdata: [], //output

    constructor: function (/*float*/ pitchShift, /*long*/ numSampsToProcess, /*float*/ sampleRate, /*float[]*/ indata) {
        this.PitchShift(pitchShift, numSampsToProcess, 32, 10, sampleRate, indata);
    },

    PitchShift: function (/*float*/ pitchShift, /*long*/ numSampsToProcess, /*long*/ fftFrameSize, /*long*/ osamp, /*float*/ sampleRate, /*float[]*/ indata) {
        var magn, phase, tmp, windowFrame, real, imag, freqPerBin, expct; //double
        var i, k, qpd, index, inFifoLatency, stepSize, fftFrameSize2; //long

        this.outdata = indata; //float[]

        /* set up some handy variables */
        fftFrameSize2 = fftFrameSize / 2;
        stepSize = fftFrameSize / osamp;
        freqPerBin = sampleRate / fftFrameSize;
        expct = 2.0 * Math.PI * stepSize / fftFrameSize;
        inFifoLatency = fftFrameSize - stepSize;
        if (this.gRover == 0) this.gRover = inFifoLatency;

        /* main processing loop */
        for (i = 0; i < numSampsToProcess; i++) {

            /* As long as we have not yet collected enough data just read in */
            this.gInFIFO[this.gRover] = indata[i];
            this.outdata[i] = this.gOutFIFO[this.gRover - inFifoLatency];
            this.gRover++;

            /* now we have enough data for processing */
            if (this.gRover >= fftFrameSize) {
                this.gRover = inFifoLatency;

                /* do windowing and re,im interleave */
                for (k = 0; k < fftFrameSize; k++) {
                    windowFrame = -.5 * Math.cos(2.0 * Math.PI * k / fftFrameSize) + .5;
                    this.gFFTworksp[2 * k] = (this.gInFIFO[k] * windowFrame);
                    this.gFFTworksp[2 * k + 1] = 0.0;
                }


                /* ***************** ANALYSIS ******************* */
                /* do transform */
                this.ShortTimeFourierTransform(this.gFFTworksp, fftFrameSize, -1);

                /* this is the analysis step */
                for (k = 0; k <= fftFrameSize2; k++) {

                    /* de-interlace FFT buffer */
                    real = this.gFFTworksp[2 * k];
                    imag = this.gFFTworksp[2 * k + 1];

                    /* compute magnitude and phase */
                    magn = 2.0 * Math.sqrt(real * real + imag * imag);
                    phase = Math.atan2(imag, real);

                    /* compute phase difference */
                    tmp = phase - this.gLastPhase[k];
                    this.gLastPhase[k] = phase;

                    /* subtract expected phase difference */
                    tmp -= k * expct;

                    /* map delta phase into +/- Pi interval */
                    qpd = (tmp / Math.PI);
                    if (qpd >= 0) qpd += qpd & 1;
                    else qpd -= qpd & 1;
                    tmp -= Math.PI * qpd;

                    /* get deviation from bin frequency from the +/- Pi interval */
                    tmp = osamp * tmp / (2.0 * Math.PI);

                    /* compute the k-th partials' true frequency */
                    tmp = k * freqPerBin + tmp * freqPerBin;

                    /* store magnitude and true frequency in analysis arrays */
                    this.gAnaMagn[k] = magn;
                    this.gAnaFreq[k] = tmp;

                }

                /* ***************** PROCESSING ******************* */
                /* this does the actual pitch shifting */
                for (zero = 0; zero < fftFrameSize; zero++) {
                    this.gSynMagn[zero] = 0;
                    this.gSynFreq[zero] = 0;
                }

                for (k = 0; k <= fftFrameSize2; k++) {
                    index = (k * pitchShift);
                    if (index <= fftFrameSize2) {
                        this.gSynMagn[index] += this.gAnaMagn[k];
                        this.gSynFreq[index] = this.gAnaFreq[k] * pitchShift;
                    }
                }

                /* ***************** SYNTHESIS ******************* */
                /* this is the synthesis step */
                for (k = 0; k <= fftFrameSize2; k++) {

                    /* get magnitude and true frequency from synthesis arrays */
                    magn = this.gSynMagn[k];
                    tmp = this.gSynFreq[k];

                    /* subtract bin mid frequency */
                    tmp -= k * freqPerBin;

                    /* get bin deviation from freq deviation */
                    tmp /= freqPerBin;

                    /* take osamp into account */
                    tmp = 2.0 * Math.PI * tmp / osamp;

                    /* add the overlap phase advance back in */
                    tmp += k * expct;

                    /* accumulate delta phase to get bin phase */
                    this.gSumPhase[k] += tmp;
                    phase = this.gSumPhase[k];

                    /* get real and imag part and re-interleave */
                    this.gFFTworksp[2 * k] = (magn * Math.cos(phase));
                    this.gFFTworksp[2 * k + 1] = (magn * Math.sin(phase));
                }

                /* zero negative frequencies */
                for (k = fftFrameSize + 2; k < 2 * fftFrameSize; k++) this.gFFTworksp[k] = 0.0;

                /* do inverse transform */
                this.ShortTimeFourierTransform(this.gFFTworksp, fftFrameSize, 1);

                /* do windowing and add to output accumulator */
                for (k = 0; k < fftFrameSize; k++) {
                    windowFrame = -.5 * Math.cos(2.0 * Math.PI * k / fftFrameSize) + .5;
                    this.gOutputAccum[k] += (2.0 * windowFrame * this.gFFTworksp[2 * k] / (fftFrameSize2 * osamp));
                }
                for (k = 0; k < stepSize; k++) this.gOutFIFO[k] = this.gOutputAccum[k];

                /* shift accumulator */
                //memmove(this.gOutputAccum, this.gOutputAccum + stepSize, fftFrameSize * sizeof(float));
                for (k = 0; k < fftFrameSize; k++) {
                    this.gOutputAccum[k] = this.gOutputAccum[k + stepSize];
                }

                /* move input FIFO */
                for (k = 0; k < inFifoLatency; k++) this.gInFIFO[k] = this.gInFIFO[k + stepSize];
            }
        }

    },

    ShortTimeFourierTransform: function (/*float[]*/ fftBuffer, /*long*/ fftFrameSize, /*long*/ sign) {
        var wr, wi, arg, temp, tr, ti, ur, ui; //float
        var i, bitm, j, le, le2, k; //long

        for (i = 2; i < 2 * fftFrameSize - 2; i += 2) {
            for (bitm = 2, j = 0; bitm < 2 * fftFrameSize; bitm = bitm << 1) {
                if ((i & bitm) != 0) j++;
                j = j << 1;
            }
            if (i < j) {
                temp = fftBuffer[i];
                fftBuffer[i] = fftBuffer[j];
                fftBuffer[j] = temp;
                temp = fftBuffer[i + 1];
                fftBuffer[i + 1] = fftBuffer[j + 1];
                fftBuffer[j + 1] = temp;
            }
        }
        max = (Math.log(fftFrameSize) / Math.log(2.0) + .5);
        for (k = 0, le = 2; k < max; k++) {
            le = le << 1;
            le2 = le >> 1;
            ur = 1.0;
            ui = 0.0;
            arg = Math.PI / (le2 >> 1);
            wr = Math.cos(arg);
            wi = (sign * Math.sin(arg));
            for (j = 0; j < le2; j += 2) {

                for (i = j; i < 2 * fftFrameSize; i += le) {
                    tr = fftBuffer[i + le2] * ur - fftBuffer[i + le2 + 1] * ui;
                    ti = fftBuffer[i + le2] * ui + fftBuffer[i + le2 + 1] * ur;
                    fftBuffer[i + le2] = fftBuffer[i] - tr;
                    fftBuffer[i + le2 + 1] = fftBuffer[i + 1] - ti;
                    fftBuffer[i] += tr;
                    fftBuffer[i + 1] += ti;

                }
                tr = ur * wr - ui * wi;
                ui = ur * wi + ui * wr;
                ur = tr;
            }
        }

    }

});