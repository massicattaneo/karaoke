var MidiEventStreamReader;

(function () {
    MidiEventStreamReader = Class.extend(StreamReader).create({
        constructor: function (data) {
            this.super(data);
        },
        readSystemMetaEvent: function (eventTypeByte) {
            if (eventTypeByte === 0xff) {
                var subtypeByte = this.readInt8();
                var length = this.readVarInt();
                switch (subtypeByte) {
                    case 0x00:
                        return new MidiEvent.SequenceNumber(length, this.readInt16());
                    case 0x01:
                        return new MidiEvent.Text(this.read(length));
                    case 0x02:
                        return new MidiEvent.CopyrightNotice(this.read(length));
                    case 0x03:
                        return new MidiEvent.TrackName(this.read(length));
                    case 0x04:
                        return new MidiEvent.InstrumentName(this.read(length));
                    case 0x05:
                        return new MidiEvent.Lyrics(this.read(length));
                    case 0x06:
                        return new MidiEvent.Marker(this.read(length));
                    case 0x07:
                        return new MidiEvent.CuePoint(this.read(length));
                    case 0x20:
                        return new MidiEvent.MidiChannelPrefix(length, this.readInt8());
                    case 0x2f:
                        return new MidiEvent.EndOfTrack(length);
                    case 0x51:
                        return new MidiEvent.SetTempo(length, (this.readInt8() << 16) + (this.readInt8() << 8) + this.readInt8());
                    case 0x54:
                        return new MidiEvent.SmpteOffset(length, this.readInt8(), this.readInt8(), this.readInt8(), this.readInt8(), this.readInt8());
                    case 0x58:
                        return new MidiEvent.TimeSignature(length, this.readInt8(), Math.pow(2, this.readInt8()), this.readInt8(), this.readInt8());
                    case 0x59:
                        return new MidiEvent.KeySignature(length, this.readInt8(true), this.readInt8());
                    case 0x7f:
                        return new MidiEvent.SequencerSpecific(this.read(length));
                    default:
                        var unknown = new MidiEvent.Meta('unknown');
                        unknown.data = this.read(length);
                        return unknown;
                }
            } else if (eventTypeByte === 0xf0) {
                return new MidiEvent.SysEx(this.read(this.readVarInt()));
            } else if (eventTypeByte === 0xf7) {
                return new MidiEvent.SysEx(this.read(this.readVarInt()));
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
            var deltaTime = this.readVarInt();
            var eventTypeByte = this.readInt8();

            if ((eventTypeByte & 0xf0) === 0xf0) {
                return this.readSystemMetaEvent(eventTypeByte);
            }
            else {
                return this.readChannelEvent(eventTypeByte, deltaTime);
            }
        }


    });

})();

