packages
    .imports('StreamReader')
    .imports('Midi-Event')
    .create('Midi-EventStreamReader', function (StreamReader, MidiEvent) {

        var Reader = Class.extend(StreamReader).create({
            constructor: function (data) {
                this.parent(data);
            },
            readSystemMetaEvent: function (eventTypeByte, deltaTime) {
                if (eventTypeByte === 0xff) {
                    var subtypeByte = this.readInt8();
                    var length = this.readVarInt();
                    switch (subtypeByte) {
                        case 0x00:
                            return new MidiEvent.SequenceNumber(deltaTime, length, this.readInt16());
                        case 0x01:
                            return new MidiEvent.Text(deltaTime, this.read(length));
                        case 0x02:
                            return new MidiEvent.CopyrightNotice(deltaTime, this.read(length));
                        case 0x03:
                            return new MidiEvent.TrackName(deltaTime, this.read(length));
                        case 0x04:
                            return new MidiEvent.InstrumentName(deltaTime, this.read(length));
                        case 0x05:
                            return new MidiEvent.Lyrics(deltaTime, this.read(length));
                        case 0x06:
                            return new MidiEvent.Marker(deltaTime, this.read(length));
                        case 0x07:
                            return new MidiEvent.CuePoint(deltaTime, this.read(length));
                        case 0x20:
                            return new MidiEvent.MidiChannelPrefix(deltaTime, length, this.readInt8());
                        case 0x2f:
                            return new MidiEvent.EndOfTrack(deltaTime, length);
                        case 0x51:
                            return new MidiEvent.SetTempo(deltaTime, length, (this.readInt8() << 16) + (this.readInt8() << 8) + this.readInt8());
                        case 0x54:
                            return new MidiEvent.SmpteOffset(deltaTime, length, this.readInt8(), this.readInt8(), this.readInt8(), this.readInt8(), this.readInt8());
                        case 0x58:
                            return new MidiEvent.TimeSignature(deltaTime, length, this.readInt8(), Math.pow(2, this.readInt8()), this.readInt8(), this.readInt8());
                        case 0x59:
                            return new MidiEvent.KeySignature(deltaTime, length, this.readInt8(true), this.readInt8());
                        case 0x7f:
                            return new MidiEvent.SequencerSpecific(deltaTime, this.read(length));
                        default:
                            var unknown = new MidiEvent.Meta('unknown', deltaTime);
                            unknown.data = this.read(length);
                            return unknown;
                    }
                } else if (eventTypeByte === 0xf0) {
                    return new MidiEvent.SysEx(deltaTime, this.read(this.readVarInt()));
                } else if (eventTypeByte === 0xf7) {
                    return new MidiEvent.SysEx(deltaTime, this.read(this.readVarInt()));
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
                        var velocity = this.readInt8();
                        if (velocity) {
                            return new MidiEvent.NoteOn(deltaTime, channel, param1, velocity);
                        } else {
                            return new MidiEvent.NoteOff(deltaTime, channel, param1, velocity);
                        }
                    case 0x0a:
                        return new MidiEvent.NoteAftertouch(deltaTime, channel, param1, this.readInt8());
                    case 0x0b:
                        return new MidiEvent.Controller(deltaTime, channel, param1, this.readInt8());
                    case 0x0c:
                        return new MidiEvent.ProgramChange(deltaTime, channel, param1);
                    case 0x0d:
                        return new MidiEvent.ChannelAfterTouch(deltaTime, channel, param1);
                    case 0x0e:
                        return new MidiEvent.PitchBend(deltaTime, channel, param1 + (this.readInt8() << 7));
                    default:
                        //throw "Unrecognised MIDI event type";
                        return new MidiEvent.Channel(deltaTime, channel);
                }
            },
            readEvent: function () {
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

        return Reader;

});