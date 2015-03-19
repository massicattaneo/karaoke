﻿var soundSampler = Class.create({
    constructor: function (buffer) {
        this.ch1 = buffer.getChannelData(0);
        this.ch2 = (buffer.numberOfChannels == 2) ? buffer.getChannelData(1) : buffer.getChannelData(0);
        this.ch1Temp = new Float32Array(this.ch1.length);
        this.ch2Temp = new Float32Array(this.ch2.length);
        this.buffer = sounds.audioContext.createBuffer(2, this.ch1.length, 44100);
        this._setBuffer(this.ch1, this.ch2);
    },
    shift: function (/* number od semitones */pitch) {
        //equations        
        // semitones = 69 + 12 * Math.log(frequency / 440);
        // pitchFinal = pitchStart + semitones
        // freqFinal = Math.pow(2, semitones/12) * freqStart
        this.ch1Temp[0] = this.ch1[0];
        this.ch2Temp[0] = this.ch2[0];
        var factor = 1 + (1 / 14.1 * pitch), j = 1;

        for (var i = 1; i < this.ch1.length; i = i + factor) {
            this.ch1Temp[j] = this.ch1[parseInt(i)];
            this.ch2Temp[j] = this.ch2[parseInt(i)];
            j++;
        }
        this._setBuffer(this.ch1Temp, this.ch2Temp);
        return this;
    },
    _setBuffer: function (ch1, ch2) {
        this.buffer.getChannelData(0).set(ch1, 0, 0);
        this.buffer.getChannelData(1).set(ch2, 0, 0);
        this.ch1 = this.buffer.getChannelData(0);
        this.ch2 = this.buffer.getChannelData(1);
    }

});