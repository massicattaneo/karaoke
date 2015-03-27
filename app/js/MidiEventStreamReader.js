var MidiEventStreamReader;

(function () {
    MidiEventStreamReader = Class.extend(StreamReader).create({
        constructor: function (data) {
            this.super(data);
        },
        readSystemMetaEvent: function (eventTypeByte, deltaTime) {
            if (eventTypeByte === 0xff) {
                /* meta event */
                event.type = 'meta';
                var subtypeByte = this.readInt8();
                var length = this.readVarInt();
                switch (subtypeByte) {
                    case 0x00:
                        event.subtype = 'sequenceNumber';
                        if (length !== 2) {
                            throw "Expected length for sequenceNumber event is 2, got " + length;
                        }
                        event.number = this.readInt16();
                        return event;
                    case 0x01:
                        event.subtype = 'text';
                        event.text = this.read(length);
                        return event;
                    case 0x02:
                        event.subtype = 'copyrightNotice';
                        event.text = this.read(length);
                        return event;
                    case 0x03:
                        event.subtype = 'trackName';
                        event.text = this.read(length);
                        return event;
                    case 0x04:
                        event.subtype = 'instrumentName';
                        event.text = this.read(length);
                        return event;
                    case 0x05:
                        event.subtype = 'lyrics';
                        event.text = this.read(length);
                        return event;
                    case 0x06:
                        event.subtype = 'marker';
                        event.text = this.read(length);
                        return event;
                    case 0x07:
                        event.subtype = 'cuePoint';
                        event.text = this.read(length);
                        return event;
                    case 0x20:
                        event.subtype = 'midiChannelPrefix';
                        if (length !== 1) {
                            throw "Expected length for midiChannelPrefix event is 1, got " + length;
                        }
                        event.channel = this.readInt8();
                        return event;
                    case 0x2f:
                        event.subtype = 'endOfTrack';
                        if (length !== 0) {
                            throw "Expected length for endOfTrack event is 0, got " + length;
                        }
                        return event;
                    case 0x51:
                        event.subtype = 'setTempo';
                        if (length !== 3) {
                            throw "Expected length for setTempo event is 3, got " + length;
                        }
                        event.microsecondsPerBeat = (
                        (this.readInt8() << 16) +
                        (this.readInt8() << 8) +
                        this.readInt8()
                        );
                        return event;
                    case 0x54:
                        event.subtype = 'smpteOffset';
                        if (length !== 5) {
                            throw "Expected length for smpteOffset event is 5, got " + length;
                        }
                        var hourByte = this.readInt8();
                        event.frameRate = {
                            0x00: 24, 0x20: 25, 0x40: 29, 0x60: 30
                        }[hourByte & 0x60];
                        event.hour = hourByte & 0x1f;
                        event.min = this.readInt8();
                        event.sec = this.readInt8();
                        event.frame = this.readInt8();
                        event.subframe = this.readInt8();
                        return event;
                    case 0x58:
                        event.subtype = 'timeSignature';
                        if (length !== 4) {
                            throw "Expected length for timeSignature event is 4, got " + length;
                        }
                        event.numerator = this.readInt8();
                        event.denominator = Math.pow(2, this.readInt8());
                        event.metronome = this.readInt8();
                        event.thirtyseconds = this.readInt8();
                        return event;
                    case 0x59:
                        event.subtype = 'keySignature';
                        if (length !== 2) {
                            throw "Expected length for keySignature event is 2, got " + length;
                        }
                        event.key = this.readInt8(true);
                        event.scale = this.readInt8();
                        return event;
                    case 0x7f:
                        event.subtype = 'sequencerSpecific';
                        event.data = this.read(length);
                        return event;
                    default:
                        // console.log("Unrecognised meta event subtype: " + subtypeByte);
                        event.subtype = 'unknown';
                        event.data = this.read(length);
                        return event;
                }
                event.data = this.read(length);
                return event;
            } else if (eventTypeByte === 0xf0) {
                event.type = 'sysEx';
                var length1 = this.readVarInt();
                event.data = this.read(length1);
                return event;
            } else if (eventTypeByte === 0xf7) {
                event.type = 'dividedSysEx';
                var length2 = this.readVarInt();
                event.data = this.read(length2);
                return event;
            } else {
                throw "Unrecognised MIDI event type byte: " + eventTypeByte;
            }
        },
        readChannelEvent: function (eventTypeByte, deltaTime) {
            var param1, lastEventTypeByte;
            if ((eventTypeByte & 0x80) === 0) {
                param1 = eventTypeByte;
                eventTypeByte = this.lastEventTypeByte;
            } else {
                param1 = this.readInt8();
                this.lastEventTypeByte = eventTypeByte;
            }
            var channel = eventTypeByte & 0x0f;
            switch (eventTypeByte >> 4) {
                case 0x08:
                    return new MidiEvent.NoteOff(deltaTime, channel, param1, this.readInt8());
                case 0x09:
                    return new MidiEvent.NoteOn(deltaTime, channel, param1, this.readInt8());
                case 0x0a:
                    return new MidiEvent.NoteAftertouch(deltaTime, channel, param1, this.readInt8());
                case 0x0b:
                    return new MidiEvent.Controller(deltaTime, channel, param1, this.readInt8());
                case 0x0c:
                    return new MidiEvent.ProgramChange(deltaTime, channel, param1);
                case 0x0d:
                    return new MidiEvent.ChannelAfterTouch(deltaTime, channel, param1);
                case 0x0e:
                    return new MidiEvent.ChannelAfterTouch(deltaTime, channel, param1 + (this.readInt8() << 7));
                default:
                    //throw "Unrecognised MIDI event type";
                    return new MidiEvent.Channel(deltaTime, channel);
            }
        },
        readEvent: function () {
            //var event = new MidiEvent();
            var deltaTime = this.readVarInt();
            var eventTypeByte = this.readInt8();

            if ((eventTypeByte & 0xf0) === 0xf0) {
                return this.readSystemMetaEvent(eventTypeByte, deltaTime);
            }
            else {
                return this.readChannelEvent(eventTypeByte, deltaTime);
            }
        }


    });

})();

