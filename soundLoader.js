﻿/// <reference path="sounds.js" />

var counter = 0;
var totalToLoad = 0;
var buffers = [];
var bufferNames = [];

sounds.loader = function (data) {
    totalToLoad = data.length;
    for (i in data) {
        bufferNames[buffers.length] = data[i];
        buffers[buffers.length] = new BufferLoader(
            sounds.audioContext,
            sounds.samples[data[i]],
            sounds.loadedOneLibrary
        );
        buffers[buffers.length - 1].load();
    }
}

sounds.loadedOneLibrary = function () {
    counter++;
    if (totalToLoad == counter) {
        sounds.loadedAllLibraries();
    }
}

sounds.soundsReady = function () {
}

sounds.loadedAllLibraries = function () {
    sounds.fillBuffers();
    //sounds.fadeOutBuffers();
    sounds.soundsReady();
}

BufferLoader = base2.Base.extend({
    constructor: function (context, instrument, callback) {
        this.context = context;
        this.instrument = instrument;
        this.urlList = instrument.samples;
        this.onload = callback;
        this.bufferList = new Array();
        this.notes = new Array();
        this.loadCount = 0;
    },
    loadBuffer: function (url, index) {
        // Load buffer asynchronously
        var request = new XMLHttpRequest();
        request.open("GET", url, true);
        request.responseType = "arraybuffer";

        var loader = this;

        request.onload = function () {
            // Asynchronously decode the audio file data in request.response
            loader.context.decodeAudioData(
                request.response,
                function (buffer) {
                    if (!buffer) {
                        alert('error decoding file data: ' + url);
                        return;
                    }
                    //save the buffer
                    loader.bufferList[index] = buffer;
                    //save the relative note
                    loader.notes[index] = new sounds.Cnote(url.substr(url.lastIndexOf('/') + 1).replace(".wav", ""));

                    if (++loader.loadCount == loader.urlList.length)
                        loader.onload(loader.bufferList);
                },
                function (error) {
                    console.error('decodeAudioData error', error);
                }
            );
        }

        request.onerror = function () {
            alert('BufferLoader: XHR error');
        }

        request.send();
    },
    load: function () {
        var samplePos = 0;
        var sampleNote = new sounds.Cnote(this.instrument.samples[samplePos]).absVal;
        for (i = 0; i < 100; i++) {
            if (i == sampleNote) {
                this.loadBuffer(this.instrument.folder + this.urlList[samplePos] + ".wav", i);
                samplePos++;
                if (samplePos == this.instrument.samples.length) break;
                sampleNote = new sounds.Cnote(this.instrument.samples[samplePos]).absVal;
            }
        }
    }
});

//this.createBuffer(this.bufferList[(samplePos-1)], sounds.Cnote.getNoteNameFromAbsVal(i), i-sampleNote, i)

sounds.fillBuffers = function () {
    for (i in buffers) {
        var temp = buffers[i].bufferList;
        var tempNotes = buffers[i].notes;
        var sampleNote = 0;
        var sampleBuffer = temp[sampleNote];
        for (j = 0; j < temp.length; j++) {
            if (typeof temp[j] == "undefined") {
                var ps = new soundSampler(sampleBuffer);
                ps.shift(j - sampleNote);
                temp[j] = ps.buffer;
                tempNotes[j] = new sounds.Cnote(sounds.Cnote.getNoteNameFromAbsVal(j));
            } else {
                sampleNote = j;
                sampleBuffer = temp[j];
            }
        }
    }
}

sounds.fadeOutBuffers = function () {
    for (i in buffers) {
        var temp = buffers[i].bufferList;
        for (j = 0; j < temp.length; j++) {
            var f = new soundSampler(temp[j]);
            f.fadeOut(10000);
            temp[j] = f.buffer;
        }
    }
}

sounds.samples = {
    piano: {
        folder: "soundsLibrary/StereoGrand/",
        spectrum: {type: "range", from: "C0", to: "C7"},
        samples: ['C0', 'F0', 'C1', 'F1s', 'D2', 'F2', 'D3', 'F3', 'G3', 'C4', 'D4', 'F4', 'C5s', 'G5s', 'C6']
    },
    drum: {
        folder: "soundsLibrary/DrumKit/",
        spectrum: {type: "samples"},
        samples: ['C0', /*Kick*/ 'C1', /*Snare*/ 'C2' /* HiHat */]
    }
};