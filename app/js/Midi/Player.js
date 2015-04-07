packages
    .create('Midi-Player', function () {

        var TrackState = Class.create({
            constructor: function (nextEventIndex, ticksToNextEvent) {
                this.nextEventIndex = nextEventIndex;
                this.ticksToNextEvent = ticksToNextEvent;
            }
        });

        var MidiPlayer = Class.CollectionOf(TrackState).create({
            constructor: function (midiFile) {
                this.super();
                var self = this;
                midiFile.each(function (index, key, track) {
                    var ticks = (track.isEmpty()) ? null : track.get(0).deltaTime;
                    self.add(new TrackState(0, ticks));
                });
                this.midiFile = midiFile;
                this.ticksPerBeat = midiFile.header.ticksPerBeat;
            },
            readNextEvent: function () {
                var ticksToNextEvent = null;
                var nextEventTrack = null;
                var nextEventIndex = null;

                for (var i = 0; i < this.size(); i++) {
                    if (
                        this.get(i).ticksToNextEvent != null
                        && (ticksToNextEvent == null || this.get(i).ticksToNextEvent < ticksToNextEvent)
                    ) {
                        ticksToNextEvent = this.get(i).ticksToNextEvent;
                        nextEventTrack = i;
                        nextEventIndex = this.get(i).nextEventIndex;
                    }
                }
                if (nextEventTrack != null) {
                    /* consume event from that track */
                    var nextEvent = this.midiFile.get(nextEventTrack).get(nextEventIndex);
                    if (this.midiFile.get(nextEventTrack).get(nextEventIndex + 1)) {
                        this.get(nextEventTrack).ticksToNextEvent += this.midiFile.get(nextEventTrack).get(nextEventIndex + 1).deltaTime;
                    } else {
                        this.get(nextEventTrack).ticksToNextEvent = null;
                    }
                    this.get(nextEventTrack).nextEventIndex += 1;
                    /* advance timings on all tracks by ticksToNextEvent */
                    for (var i = 0; i < this.size(); i++) {
                        if (this.get(i).ticksToNextEvent != null) {
                            this.get(i).ticksToNextEvent -= ticksToNextEvent
                        }
                    }

                    return {
                        'ticksToEvent': ticksToNextEvent,
                        'event': nextEvent,
                        'track': nextEventTrack
                    };
                } else {
                    return null;
                    //samplesToNextEvent = null;
                    //self.finished = true;
                }
            },
            readAndStore: function (samplesToRead) {
                var samplesToNextEvent;
                do {
                    var nextEvent = this.readNextEvent();
                    if (nextEvent) {
                        if (nextEvent.event.subtype === 'setTempo') {
                            this.beatsPerMinute = nextEvent.event.execute();
                        }
                        var beatsToNextEvent = nextEvent.ticksToEvent / this.ticksPerBeat;
                        var secondsToNextEvent = beatsToNextEvent / (this.beatsPerMinute / 60);
                        samplesToNextEvent += secondsToNextEvent * 44100;
                        if (nextEvent.event.subtype === 'noteOn') {
                            //nextEvent.event.execute(playAudio, pianoSamples, playTime);
                        }
                    }
                } while (nextEvent);
            }
        });
        return MidiPlayer;
    });