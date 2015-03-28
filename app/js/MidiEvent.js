var MidiEvent;

(function () {

    MidiEvent = Class.create({
        constructor: function() {

        }
    });

    MidiEvent.Channel = Class.extend(MidiEvent).create({
        constructor: function (deltaTime, channel, subtype) {
            this.deltaTime = deltaTime;
            this.type = 'channel';
            this.channel = channel;
            this.subtype = subtype;
        }
    });

    MidiEvent.NoteOff = Class.extend(MidiEvent.Channel).create({
        constructor: function (deltaTime, channel, noteValue, velocity) {
            this.super(deltaTime, channel, 'noteOff');
            this.noteValue = noteValue;
            this.velocity = velocity;
        }
    });

    MidiEvent.NoteOn = Class.extend(MidiEvent.Channel).create({
        constructor: function (deltaTime, channel, noteValue, velocity) {
            this.super(deltaTime, channel, (velocity) ? 'noteOn' : 'noteOff');
            this.noteValue = noteValue;
            this.velocity = velocity;
        }
    });

    MidiEvent.NoteAftertouch = Class.extend(MidiEvent.Channel).create({
        constructor: function (deltaTime, channel, noteValue, amount) {
            this.super(deltaTime, channel, 'noteAftertouch');
            this.noteValue = noteValue;
            this.amount = amount;
        }
    });

    MidiEvent.Controller = Class.extend(MidiEvent.Channel).create({
        constructor: function (deltaTime, channel, controllerType, value) {
            this.super(deltaTime, channel, 'controller');
            this.controllerType = controllerType;
            this.value = value;
        }
    });

    MidiEvent.ProgramChange = Class.extend(MidiEvent.Channel).create({
        constructor: function (deltaTime, channel, programNumber) {
            this.super(deltaTime, channel, 'programChange');
            this.programNumber = programNumber;
        }
    });

    MidiEvent.ChannelAfterTouch = Class.extend(MidiEvent.Channel).create({
        constructor: function (deltaTime, channel, amount) {
            this.super(deltaTime, channel, 'channelAftertouch');
            this.amount = amount;
        }
    });

    MidiEvent.PitchBend = Class.extend(MidiEvent.Channel).create({
        constructor: function (deltaTime, channel, value) {
            this.super(deltaTime, channel, 'channelAftertouch');
            this.value = value;
        }
    });

    MidiEvent.Meta = Class.extend(MidiEvent).create({
        constructor: function (subtype) {
            this.type = 'meta';
            this.subtype = subtype;
        },
        checkLength: function(length, correct) {
            if (length !== correct) {
                throw "Expected length for " + this.subtype + " event is " + correct + ", got " + length;
            }
        }
    });

    MidiEvent.SequenceNumber = Class.extend(MidiEvent.Meta).create({
        constructor: function (length, number) {
            this.checkLength(length, 2);
            this.super('sequenceNumber');
            this.number = number;
        }
    });

    MidiEvent.Text = Class.extend(MidiEvent.Meta).create({
        constructor: function (text) {
            this.super('text');
            this.text = text;
        }
    });

    MidiEvent.CopyrightNotice = Class.extend(MidiEvent.Meta).create({
        constructor: function (text) {
            this.super('copyrightNotice');
            this.text = text;
        }
    });

    MidiEvent.TrackName = Class.extend(MidiEvent.Meta).create({
        constructor: function (text) {
            this.super('trackName');
            this.text = text;
        }
    });

    MidiEvent.InstrumentName = Class.extend(MidiEvent.Meta).create({
        constructor: function (text) {
            this.super('instrumentName');
            this.text = text;
        }
    });

    MidiEvent.Lyrics = Class.extend(MidiEvent.Meta).create({
        constructor: function (text) {
            this.super('lyrics');
            this.text = text;
        }
    });

    MidiEvent.Marker = Class.extend(MidiEvent.Meta).create({
        constructor: function (text) {
            this.super('marker');
            this.text = text;
        }
    });

    MidiEvent.CuePoint = Class.extend(MidiEvent.Meta).create({
        constructor: function (text) {
            this.super('cuePoint');
            this.text = text;
        }
    });

    MidiEvent.MidiChannelPrefix = Class.extend(MidiEvent.Meta).create({
        constructor: function (length, channel) {
            this.super('midiChannelPrefix');
            this.checkLength(length, 1);
            this.channel = channel;
        }
    });

    MidiEvent.EndOfTrack = Class.extend(MidiEvent.Meta).create({
        constructor: function (length) {
            this.super('endOfTrack');
            this.checkLength(length, 0);
        }
    });

    MidiEvent.SetTempo = Class.extend(MidiEvent.Meta).create({
        constructor: function (length, microsecondsPerBeat) {
            this.super('setTempo');
            this.checkLength(length, 3);
            this.microsecondsPerBeat = microsecondsPerBeat;
        }
    });

    MidiEvent.SmpteOffset = Class.extend(MidiEvent.Meta).create({
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

    MidiEvent.TimeSignature = Class.extend(MidiEvent.Meta).create({
        constructor: function (length, numerator, denominator, metronome, thirtyseconds) {
            this.super('timeSignature');
            this.checkLength(length, 4);
            this.numerator = numerator;
            this.denominator = denominator;
            this.metronome = metronome;
            this.thirtyseconds = thirtyseconds;
        }
    });

    MidiEvent.KeySignature = Class.extend(MidiEvent.Meta).create({
        constructor: function (length, key, scale) {
            this.super('keySignature');
            this.checkLength(length, 2);
            this.key = key;
            this.scale = scale;
        }
    });

    MidiEvent.SequencerSpecific = Class.extend(MidiEvent.Meta).create({
        constructor: function (data) {
            this.super('sequencerSpecific');
            this.data = data;
        }
    });

    MidiEvent.SysEx = Class.extend(MidiEvent).create({
        constructor: function (data) {
            this.type = 'sysEx';
            this.data = data;
        }
    });

    MidiEvent.DividedSysEx = Class.extend(MidiEvent).create({
        constructor: function (data) {
            this.type = 'dividedSysEx';
            this.data = data;
        }
    });

})();