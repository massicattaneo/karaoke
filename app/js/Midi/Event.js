packages
    .create('Midi-Event', function () {

        this.Generic = Class.create({
            constructor: function () {
                this.deltaTime = 0;
                this.nextEvent = {};
            },
            execute: function () {
            }
        });

        this.Channel = Class.extend(this.Generic).create({
            constructor: function (deltaTime, channel, subtype) {
                this.deltaTime = deltaTime || 0;
                this.type = 'channel';
                this.channel = channel;
                this.subtype = subtype;
            }
        });

        this.NoteOff = Class.extend(this.Channel).create({
            constructor: function (deltaTime, channel, noteValue, velocity) {
                this.parent(deltaTime, channel, 'noteOff');
                this.noteValue = noteValue;
                this.velocity = velocity;
            }
        });

        this.NoteOn = Class.extend(this.Channel).create({
            constructor: function (deltaTime, channel, noteValue, velocity) {
                this.parent(deltaTime, channel, 'noteOn');
                this.noteValue = noteValue;
                this.velocity = velocity;
            },
            execute: function (audioPlayer, audioSamples, playTime) {
                audioPlayer(audioSamples.get(this.noteValue - 24), playTime, 11, this.velocity / 127);
            }
        });

        this.NoteAftertouch = Class.extend(this.Channel).create({
            constructor: function (deltaTime, channel, noteValue, amount) {
                this.parent(deltaTime, channel, 'noteAftertouch');
                this.noteValue = noteValue;
                this.amount = amount;
            }
        });

        this.Controller = Class.extend(this.Channel).create({
            constructor: function (deltaTime, channel, controllerType, value) {
                this.parent(deltaTime, channel, 'controller');
                this.controllerType = controllerType;
                this.value = value;
            }
        });

        this.ProgramChange = Class.extend(this.Channel).create({
            constructor: function (deltaTime, channel, programNumber) {
                this.parent(deltaTime, channel, 'programChange');
                this.programNumber = programNumber;
            }
        });

        this.ChannelAfterTouch = Class.extend(this.Channel).create({
            constructor: function (deltaTime, channel, amount) {
                this.parent(deltaTime, channel, 'channelAftertouch');
                this.amount = amount;
            }
        });

        this.PitchBend = Class.extend(this.Channel).create({
            constructor: function (deltaTime, channel, value) {
                this.parent(deltaTime, channel, 'channelAftertouch');
                this.value = value;
            }
        });

        this.Meta = Class.extend(this.Generic).create({
            constructor: function (subtype, deltaTime) {
                this.deltaTime = deltaTime || 0;
                this.type = 'meta';
                this.subtype = subtype;
            },
            checkLength: function (length, correct) {
                if (length !== correct) {
                    throw "Expected length for " + this.subtype + " event is " + correct + ", got " + length;
                }
            }
        });

        this.SequenceNumber = Class.extend(this.Meta).create({
            constructor: function (deltaTime, length, number) {
                this.checkLength(length, 2);
                this.parent('sequenceNumber', deltaTime);
                this.number = number;
            }
        });

        this.Text = Class.extend(this.Meta).create({
            constructor: function (deltaTime, text) {
                this.parent('text', deltaTime);
                this.text = text;
            }
        });

        this.CopyrightNotice = Class.extend(this.Meta).create({
            constructor: function (deltaTime, text) {
                this.parent('copyrightNotice', deltaTime);
                this.text = text;
            }
        });

        this.TrackName = Class.extend(this.Meta).create({
            constructor: function (deltaTime, text) {
                this.parent('trackName', deltaTime);
                this.text = text;
            }
        });

        this.InstrumentName = Class.extend(this.Meta).create({
            constructor: function (deltaTime, text) {
                this.parent('instrumentName', deltaTime);
                this.text = text;
            }
        });

        this.Lyrics = Class.extend(this.Meta).create({
            constructor: function (deltaTime, text) {
                this.parent('lyrics', deltaTime);
                this.text = text;
            }
        });

        this.Marker = Class.extend(this.Meta).create({
            constructor: function (deltaTime, text) {
                this.parent('marker', deltaTime);
                this.text = text;
            }
        });

        this.CuePoint = Class.extend(this.Meta).create({
            constructor: function (deltaTime, text) {
                this.parent('cuePoint', deltaTime);
                this.text = text;
            }
        });

        this.MidiChannelPrefix = Class.extend(this.Meta).create({
            constructor: function (deltaTime, length, channel) {
                this.parent('midiChannelPrefix', deltaTime);
                this.checkLength(length, 1);
                this.channel = channel;
            }
        });

        this.EndOfTrack = Class.extend(this.Meta).create({
            constructor: function (deltaTime, length) {
                this.parent('endOfTrack', deltaTime);
                this.checkLength(length, 0);
            }
        });

        this.SetTempo = Class.extend(this.Meta).create({
            constructor: function (deltaTime, length, microsecondsPerBeat) {
                this.parent('setTempo', deltaTime);
                this.checkLength(length, 3);
                this.microsecondsPerBeat = microsecondsPerBeat;
            },
            execute: function () {
                return parseFloat(60000000 / this.microsecondsPerBeat);
            }
        });

        this.SmpteOffset = Class.extend(this.Meta).create({
            constructor: function (deltaTime, length, hourByte, minutes, seconds, frame, subframe) {
                this.parent('smpteOffset', deltaTime);
                this.checkLength(length, 5);
                this.frameRate = {
                    0x00: 24, 0x20: 25, 0x40: 29, 0x60: 30
                }[hourByte & 0x60];
                this.hour = hourByte & 0x1f;
                this.min = minutes;
                this.sec = seconds;
                this.frame = frame;
                this.subframe = subframe;
            }
        });

        this.TimeSignature = Class.extend(this.Meta).create({
            constructor: function (deltaTime, length, numerator, denominator, metronome, thirtyseconds) {
                this.parent('timeSignature', deltaTime);
                this.checkLength(length, 4);
                this.numerator = numerator;
                this.denominator = denominator;
                this.metronome = metronome;
                this.thirtyseconds = thirtyseconds;
            }
        });

        this.KeySignature = Class.extend(this.Meta).create({
            constructor: function (deltaTime, length, key, scale) {
                this.parent('keySignature', deltaTime);
                this.checkLength(length, 2);
                this.key = key;
                this.scale = scale;
            }
        });

        this.SequencerSpecific = Class.extend(this.Meta).create({
            constructor: function (deltaTime, data) {
                this.parent('sequencerSpecific', deltaTime);
                this.data = data;
            }
        });

        this.SysEx = Class.extend(this.Generic).create({
            constructor: function (deltaTime, data) {
                this.deltaTime = deltaTime || 0;
                this.type = 'sysEx';
                this.data = data;
            }
        });

        this.DividedSysEx = Class.extend(this.Generic).create({
            constructor: function (deltaTime, data) {
                this.deltaTime = deltaTime || 0;
                this.type = 'dividedSysEx';
                this.data = data;
            }
        });

    });