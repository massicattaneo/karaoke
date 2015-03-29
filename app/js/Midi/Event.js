packages
    .create('Midi-Event', function () {

        this.Generic = Class.create({
            constructor: function () {

            }
        });

        this.Channel = Class.extend(this.Generic).create({
            constructor: function (deltaTime, channel, subtype) {
                this.deltaTime = deltaTime;
                this.type = 'channel';
                this.channel = channel;
                this.subtype = subtype;
            }
        });

        this.NoteOff = Class.extend(this.Channel).create({
            constructor: function (deltaTime, channel, noteValue, velocity) {
                this.super(deltaTime, channel, 'noteOff');
                this.noteValue = noteValue;
                this.velocity = velocity;
            }
        });

        this.NoteOn = Class.extend(this.Channel).create({
            constructor: function (deltaTime, channel, noteValue, velocity) {
                this.super(deltaTime, channel, (velocity) ? 'noteOn' : 'noteOff');
                this.noteValue = noteValue;
                this.velocity = velocity;
            }
        });

        this.NoteAftertouch = Class.extend(this.Channel).create({
            constructor: function (deltaTime, channel, noteValue, amount) {
                this.super(deltaTime, channel, 'noteAftertouch');
                this.noteValue = noteValue;
                this.amount = amount;
            }
        });

        this.Controller = Class.extend(this.Channel).create({
            constructor: function (deltaTime, channel, controllerType, value) {
                this.super(deltaTime, channel, 'controller');
                this.controllerType = controllerType;
                this.value = value;
            }
        });

        this.ProgramChange = Class.extend(this.Channel).create({
            constructor: function (deltaTime, channel, programNumber) {
                this.super(deltaTime, channel, 'programChange');
                this.programNumber = programNumber;
            }
        });

        this.ChannelAfterTouch = Class.extend(this.Channel).create({
            constructor: function (deltaTime, channel, amount) {
                this.super(deltaTime, channel, 'channelAftertouch');
                this.amount = amount;
            }
        });

        this.PitchBend = Class.extend(this.Channel).create({
            constructor: function (deltaTime, channel, value) {
                this.super(deltaTime, channel, 'channelAftertouch');
                this.value = value;
            }
        });

        this.Meta = Class.extend(this.Generic).create({
            constructor: function (subtype) {
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
            constructor: function (length, number) {
                this.checkLength(length, 2);
                this.super('sequenceNumber');
                this.number = number;
            }
        });

        this.Text = Class.extend(this.Meta).create({
            constructor: function (text) {
                this.super('text');
                this.text = text;
            }
        });

        this.CopyrightNotice = Class.extend(this.Meta).create({
            constructor: function (text) {
                this.super('copyrightNotice');
                this.text = text;
            }
        });

        this.TrackName = Class.extend(this.Meta).create({
            constructor: function (text) {
                this.super('trackName');
                this.text = text;
            }
        });

        this.InstrumentName = Class.extend(this.Meta).create({
            constructor: function (text) {
                this.super('instrumentName');
                this.text = text;
            }
        });

        this.Lyrics = Class.extend(this.Meta).create({
            constructor: function (text) {
                this.super('lyrics');
                this.text = text;
            }
        });

        this.Marker = Class.extend(this.Meta).create({
            constructor: function (text) {
                this.super('marker');
                this.text = text;
            }
        });

        this.CuePoint = Class.extend(this.Meta).create({
            constructor: function (text) {
                this.super('cuePoint');
                this.text = text;
            }
        });

        this.MidiChannelPrefix = Class.extend(this.Meta).create({
            constructor: function (length, channel) {
                this.super('midiChannelPrefix');
                this.checkLength(length, 1);
                this.channel = channel;
            }
        });

        this.EndOfTrack = Class.extend(this.Meta).create({
            constructor: function (length) {
                this.super('endOfTrack');
                this.checkLength(length, 0);
            }
        });

        this.SetTempo = Class.extend(this.Meta).create({
            constructor: function (length, microsecondsPerBeat) {
                this.super('setTempo');
                this.checkLength(length, 3);
                this.microsecondsPerBeat = microsecondsPerBeat;
            }
        });

        this.SmpteOffset = Class.extend(this.Meta).create({
            constructor: function (length, hourByte, minutes, seconds, frame, subframe) {
                this.super('smpteOffset');
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
            constructor: function (length, numerator, denominator, metronome, thirtyseconds) {
                this.super('timeSignature');
                this.checkLength(length, 4);
                this.numerator = numerator;
                this.denominator = denominator;
                this.metronome = metronome;
                this.thirtyseconds = thirtyseconds;
            }
        });

        this.KeySignature = Class.extend(this.Meta).create({
            constructor: function (length, key, scale) {
                this.super('keySignature');
                this.checkLength(length, 2);
                this.key = key;
                this.scale = scale;
            }
        });

        this.SequencerSpecific = Class.extend(this.Meta).create({
            constructor: function (data) {
                this.super('sequencerSpecific');
                this.data = data;
            }
        });

        this.SysEx = Class.extend(this.Generic).create({
            constructor: function (data) {
                this.type = 'sysEx';
                this.data = data;
            }
        });

        this.DividedSysEx = Class.extend(this.Generic).create({
            constructor: function (data) {
                this.type = 'dividedSysEx';
                this.data = data;
            }
        });

    });