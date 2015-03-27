var MidiEvent;

(function () {

    MidiEvent = Class.create({
        constructor: function (deltaTime) {
            this.deltaTime = deltaTime;
        }
    });

    MidiEvent.Channel = Class.extend(MidiEvent).create({
        constructor: function (deltaTime, channel) {
            this.super(deltaTime);
            this.type = 'channel';
            this.channel = channel;
        }
    });

    MidiEvent.NoteOff = Class.extend(MidiEvent.Channel).create({
        constructor: function (deltaTime, channel, noteValue, velocity) {
            this.super(deltaTime, channel);
            this.subtype = 'noteOff';
            this.noteValue = noteValue;
            this.velocity = velocity;
        }
    });

    MidiEvent.NoteOn = Class.extend(MidiEvent.Channel).create({
        constructor: function (deltaTime, channel, noteValue, velocity) {
            this.super(deltaTime, channel);
            this.subtype = (velocity) ? 'noteOn' : 'noteOff';
            this.noteValue = noteValue;
            this.velocity = velocity;
        }
    });

    MidiEvent.NoteAftertouch = Class.extend(MidiEvent.Channel).create({
        constructor: function (deltaTime, channel, noteValue, amount) {
            this.subtype = 'noteAftertouch';
            this.super(deltaTime, channel);
            this.noteValue = noteValue;
            this.amount = amount;
        }
    });

    MidiEvent.Controller = Class.extend(MidiEvent.Channel).create({
        constructor: function (deltaTime, channel, controllerType, value) {
            this.subtype = 'controller';
            this.controllerType = controllerType;
            this.value = value;
        }
    });

    MidiEvent.ProgramChange = Class.extend(MidiEvent.Channel).create({
        constructor: function (deltaTime, channel, programNumber) {
            this.subtype = 'programChange';
            this.programNumber = programNumber;
        }
    });

    MidiEvent.ChannelAfterTouch = Class.extend(MidiEvent.Channel).create({
        constructor: function (deltaTime, channel, amount) {
            this.subtype = 'channelAftertouch';
            this.amount = amount;
        }
    });

    MidiEvent.PitchBend = Class.extend(MidiEvent.Channel).create({
        constructor: function (deltaTime, channel, value) {
            this.subtype = 'channelAftertouch';
            this.value = value;
        }
    });

})();