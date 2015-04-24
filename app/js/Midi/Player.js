packages
    .imports('Midi-Event')
    .imports('Audio-Context')
    .create('Midi-Player', function (MidiEvent, audioContext) {

        var TrackState = Class.create({
            constructor: function (nextEventIndex, ticksToNextEvent) {
                this.nextEventIndex = nextEventIndex;
                this.ticksToNextEvent = ticksToNextEvent;
            },
            isNextEventTicksLowerThan: function (ticks) {
                return this.ticksToNextEvent !== null
                    && (ticks === null || this.ticksToNextEvent < ticks)
            },
            setTicksToNextEvent: function (event) {
                if (event) {
                    this.ticksToNextEvent += event.deltaTime;
                } else {
                    this.ticksToNextEvent = null;
                }
                return this;
            },
            incrementIndex: function () {
                this.nextEventIndex += 1;
            }
        });

        var MidiPlayer = Class.CollectionOf(MidiEvent.Generic).create({
            constructor: function (midiFile, samplesLibrary) {
                this.super();
                var self = this;
                this.states = new (Class.CollectionOf(TrackState).create())();

                midiFile.each(function (index, key, track) {
                    var ticks = (track.isEmpty()) ? null : track.get(0).deltaTime;
                    self.addState(new TrackState(0, ticks));
                });
                this.midiFile = midiFile;
                this.ticksPerBeat = midiFile.header.ticksPerBeat;
                this.samplePosition = 0;
                this.beatsPerMinute = 60;
                this.samplesLibrary = samplesLibrary;
                this.p = 0;
            },
            addState: function (state, key) {
                this.states.add(state, key);
            },
            getState: function (key) {
                return this.states.get(key);
            },
            eachState: function (callback) {
                this.states.each(callback);
            },
            readNextEvent: function () {
                var ticksToNextEvent = null;
                var nextEventTrack = null;
                var nextEventIndex = null;

                this.eachState(function (i, key, trackState) {
                    if (trackState.isNextEventTicksLowerThan(ticksToNextEvent)) {
                        ticksToNextEvent = trackState.ticksToNextEvent;
                        nextEventTrack = i;
                        nextEventIndex = trackState.nextEventIndex;
                    }
                });

                if (nextEventTrack === null) {
                    return null;
                }
                var nextEvent = this.midiFile.get(nextEventTrack).get(nextEventIndex);

                this.getState(nextEventTrack)
                    .setTicksToNextEvent(this.midiFile.get(nextEventTrack).get(nextEventIndex + 1))
                    .incrementIndex();

                this.eachState(function (i, k, trackState) {
                    if (trackState.ticksToNextEvent !== null) {
                        trackState.ticksToNextEvent -= ticksToNextEvent;
                    }
                });

                nextEvent.nextEvent.ticks = ticksToNextEvent;
                nextEvent.nextEvent.track = nextEventTrack;

                return {
                    'ticksToEvent': ticksToNextEvent,
                    'event': nextEvent,
                    'track': nextEventTrack
                }
            },
            handleNextEvent: function (nextEvent) {
                var samplesToNextEvent = 0;

                if (nextEvent) {

                    if (nextEvent.event.subtype === 'setTempo') {
                        this.beatsPerMinute = parseFloat(60000000 / nextEvent.event.microsecondsPerBeat);
                    } else {
                        this.add(nextEvent.event, nextEvent.event.noteValue);
                    }

                    var beatsToNextEvent = nextEvent.ticksToEvent / this.ticksPerBeat;
                    var secondsToNextEvent = beatsToNextEvent / (this.beatsPerMinute / 60);

                    samplesToNextEvent += (secondsToNextEvent * 44100);
                    this.samplePosition += parseInt(samplesToNextEvent, 10);
                    nextEvent.event.samplePosition = this.samplePosition;
                }
            },
            createAudio: function () {

            }
        });

        return MidiPlayer;
    });