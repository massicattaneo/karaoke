packages
    .imports('Audio-Context')
    .imports('Audio-Sampler')
    .imports('Midi-Note')
    .imports('Audio-LibrarySettings')
    .create('Audio-Library', function (audioContext, Sampler, MidiNote, settings) {

        var AudioSample = Class.create({
            constructor: function (noteValue, url) {
                this.url = url;
                this.noteValue = noteValue;
                this.buffer = null;
            },
            load: function () {
                var self = this,
                    promise = new Promise(),
                    request = new XMLHttpRequest();

                request.open("GET", this.url, true);
                request.responseType = "arraybuffer";
                request.onload = function () {
                    audioContext.decodeAudioData(
                        request.response,
                        function (decodedSample) {
                            if (!decodedSample) {
                                promise.unresolvable();
                                return;
                            }
                            self.buffer = decodedSample;
                            promise.resolve(self);
                        },
                        function (error) {
                            promise.unresolvable();
                        }
                    );
                };
                request.onerror = function () {
                    alert('BufferLoader: XHR error');
                    promise.unresolvable();
                };
                request.send();
                return promise;
            },
            getChannelData: function (channel) {
                return this.buffer.getChannelData(channel);
            },
            numberOfChannels: function () {
                return this.buffer.numberOfChannels;
            }
        });

        var AudioSamples = Class.CollectionOf(AudioSample).create({
            constructor: function (instrument, instrumentName) {
                var self = this;
                this.super();
                this.instrument = instrument;
                this.instrumentName = instrumentName;
                this.promise = new Promise();
                this.promises = new Promises(instrument.sampleNames.length);
                this.promises.onFail(function () {
                    self.promise.unresolvable();
                });
                this.promises.onDone(function () {
                    self.promise.resolve();
                });
                this.promise.onDone(function () {
                    self.resampleMissing();
                });
            },
            load: function () {
                var self = this;
                var instrument = this.instrument;
                for (var i in instrument.sampleNames) {
                    var noteValue = new MidiNote(instrument.sampleNames[i]).value;
                    var sampleUrl = instrument.folder + instrument.sampleNames[i] + '.wav';
                    var sample = new AudioSample(noteValue, sampleUrl);
                    var promise = sample.load();
                    promise.onDone(function (audioSample) {
                        self.add(audioSample, audioSample.noteValue);
                    });
                    this.promises.add(promise);
                }
                return this.promise;
            },
            resampleMissing: function () {
                this.sort();
                if (this.instrument.spectrum.action === 'fill') {
                    var newSamples = new InstrumentLibrary();
                    this.each(function (i, noteVal, audioSample) {
                        if (i < this.size()) {
                            var ps = new Sampler(audioSample);
                            var nextNoteVal = this.keys[(parseInt(i, 10) + 1)];
                            for (var newNoteVal = noteVal + 1; newNoteVal < nextNoteVal; newNoteVal++) {
                                var audioSample = new AudioSample(newNoteVal);
                                audioSample.buffer = ps.shift(newNoteVal - noteVal);
                                newSamples.add(audioSample, newNoteVal);
                            }
                        }
                    });
                    this.addCollection(newSamples);
                    this.sort();
                }
            }
        });

        var InstrumentLibrary = Class.CollectionOf(AudioSamples).create();

        var library = {};
        library.load = function (instruments) {
            var library = new InstrumentLibrary();
            var promises = new Promises(instruments.length),
                loadPromise = new Promise();

            for (var index in instruments) {
                var instrumentName = instruments[index];
                var audioSamples = library.add(new AudioSamples(settings[instrumentName], instrumentName), instrumentName);
                promises.add(audioSamples.load());
            }

            promises.onDone(function () {
                loadPromise.resolve(library);
            });

            return loadPromise;
        };

        return library;
    });
