var MidiFile, MidiEvent, Track;

(function () {

    var convertIntoBinary = function (data) {
        var binary = [];
        var mx = data.length;
        for (var index = 0; index < mx; index++) {
            binary[index] = String.fromCharCode(data.charCodeAt(index) & 255);
        }
        return binary.join('');
    };

    var readChunk = function(stream) {
        var id = stream.read(4);
        var length = stream.readInt32();
        var data = stream.read(length);
        return {'id': id, 'length': length, 'data': data};
    };

    MidiEvent = Class.create();

    Track = Class.CollectionOf(MidiEvent).create({
        getNotesOn: function () {
            return this.getCollection('subtype', 'noteOn');
        }
    });

    MidiFile = Class.CollectionOf(Track).create({
        constructor: function(data) {
            this.super();
            this.stream = new StreamReader(convertIntoBinary(data));
            this.setHeaderInfo();
            this.setTracksInfo();
        },
        setHeaderInfo: function () {
            var headerChunk = readChunk(this.stream);
            if (headerChunk.id !== 'MThd' || headerChunk.length !== 6) {
                throw "Bad .mid file - header not found";
            }
            var headerStream = new StreamReader(headerChunk.data);
            this.header = {};
            this.header.formatType = headerStream.readInt16();
            this.header.trackCount = headerStream.readInt16();
            var ticksPerBeat = headerStream.readInt16();
            if (ticksPerBeat & 0x8000) {
                throw "Expressing time division in SMTPE frames is not supported yet";
            }
            this.header.ticksPerBeat = ticksPerBeat;
        },
        getTrack: function (track) {
            return this.get(track);
        },
        setTracksInfo: function() {
            for (var i = 0; i < this.header.trackCount; i++) {
                var track = this.new();
                var trackChunk = readChunk(this.stream);
                if (trackChunk.id !== 'MTrk') {
                    throw "Unexpected chunk - expected MTrk, got " + trackChunk.id;
                }
                var trackStream = new StreamReader(trackChunk.data);
                while (!trackStream.eof()) {
                    var event = this.readEvent(trackStream);
                    track.add(event);
                }
            }
        },

        readEvent: function(stream) {
            var event = new MidiEvent();
            event.deltaTime = stream.readVarInt();
            var eventTypeByte = stream.readInt8();
            if ((eventTypeByte & 0xf0) === 0xf0) {
                /* system / meta event */
                if (eventTypeByte === 0xff) {
                    /* meta event */
                    event.type = 'meta';
                    var subtypeByte = stream.readInt8();
                    var length = stream.readVarInt();
                    switch (subtypeByte) {
                        case 0x00:
                            event.subtype = 'sequenceNumber';
                            if (length !== 2) {
                                throw "Expected length for sequenceNumber event is 2, got " + length;
                            }
                            event.number = stream.readInt16();
                            return event;
                        case 0x01:
                            event.subtype = 'text';
                            event.text = stream.read(length);
                            return event;
                        case 0x02:
                            event.subtype = 'copyrightNotice';
                            event.text = stream.read(length);
                            return event;
                        case 0x03:
                            event.subtype = 'trackName';
                            event.text = stream.read(length);
                            return event;
                        case 0x04:
                            event.subtype = 'instrumentName';
                            event.text = stream.read(length);
                            return event;
                        case 0x05:
                            event.subtype = 'lyrics';
                            event.text = stream.read(length);
                            return event;
                        case 0x06:
                            event.subtype = 'marker';
                            event.text = stream.read(length);
                            return event;
                        case 0x07:
                            event.subtype = 'cuePoint';
                            event.text = stream.read(length);
                            return event;
                        case 0x20:
                            event.subtype = 'midiChannelPrefix';
                            if (length !== 1) {
                                throw "Expected length for midiChannelPrefix event is 1, got " + length;
                            }
                            event.channel = stream.readInt8();
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
                            (stream.readInt8() << 16) +
                            (stream.readInt8() << 8) +
                            stream.readInt8()
                            );
                            return event;
                        case 0x54:
                            event.subtype = 'smpteOffset';
                            if (length !== 5) {
                                throw "Expected length for smpteOffset event is 5, got " + length;
                            }
                            var hourByte = stream.readInt8();
                            event.frameRate = {
                                0x00: 24, 0x20: 25, 0x40: 29, 0x60: 30
                            }[hourByte & 0x60];
                            event.hour = hourByte & 0x1f;
                            event.min = stream.readInt8();
                            event.sec = stream.readInt8();
                            event.frame = stream.readInt8();
                            event.subframe = stream.readInt8();
                            return event;
                        case 0x58:
                            event.subtype = 'timeSignature';
                            if (length !== 4) {
                                throw "Expected length for timeSignature event is 4, got " + length;
                            }
                            event.numerator = stream.readInt8();
                            event.denominator = Math.pow(2, stream.readInt8());
                            event.metronome = stream.readInt8();
                            event.thirtyseconds = stream.readInt8();
                            return event;
                        case 0x59:
                            event.subtype = 'keySignature';
                            if (length !== 2) {
                                throw "Expected length for keySignature event is 2, got " + length;
                            }
                            event.key = stream.readInt8(true);
                            event.scale = stream.readInt8();
                            return event;
                        case 0x7f:
                            event.subtype = 'sequencerSpecific';
                            event.data = stream.read(length);
                            return event;
                        default:
                            // console.log("Unrecognised meta event subtype: " + subtypeByte);
                            event.subtype = 'unknown';
                            event.data = stream.read(length);
                            return event;
                    }
                    event.data = stream.read(length);
                    return event;
                } else if (eventTypeByte === 0xf0) {
                    event.type = 'sysEx';
                    var length1 = stream.readVarInt();
                    event.data = stream.read(length1);
                    return event;
                } else if (eventTypeByte === 0xf7) {
                    event.type = 'dividedSysEx';
                    var length2 = stream.readVarInt();
                    event.data = stream.read(length2);
                    return event;
                } else {
                    throw "Unrecognised MIDI event type byte: " + eventTypeByte;
                }
            } else {
                /* channel event */
                var param1;
                if ((eventTypeByte & 0x80) === 0) {
                    /* running status - reuse lastEventTypeByte as the event type.
                     eventTypeByte is actually the first parameter
                     */
                    param1 = eventTypeByte;
                    eventTypeByte = this.lastEventTypeByte;
                } else {
                    param1 = stream.readInt8();
                    this.lastEventTypeByte = eventTypeByte;
                }
                var eventType = eventTypeByte >> 4;
                event.channel = eventTypeByte & 0x0f;
                event.type = 'channel';
                switch (eventType) {
                    case 0x08:
                        event.subtype = 'noteOff';
                        event.noteNumber = param1;
                        event.velocity = stream.readInt8();
                        return event;
                    case 0x09:
                        event.noteNumber = param1;
                        event.velocity = stream.readInt8();
                        if (event.velocity === 0) {
                            event.subtype = 'noteOff';
                        } else {
                            event.subtype = 'noteOn';
                        }
                        return event;
                    case 0x0a:
                        event.subtype = 'noteAftertouch';
                        event.noteNumber = param1;
                        event.amount = stream.readInt8();
                        return event;
                    case 0x0b:
                        event.subtype = 'controller';
                        event.controllerType = param1;
                        event.value = stream.readInt8();
                        return event;
                    case 0x0c:
                        event.subtype = 'programChange';
                        event.programNumber = param1;
                        return event;
                    case 0x0d:
                        event.subtype = 'channelAftertouch';
                        event.amount = param1;
                        return event;
                    case 0x0e:
                        event.subtype = 'pitchBend';
                        event.value = param1 + (stream.readInt8() << 7);
                        return event;
                    default:
                        throw "Unrecognised MIDI event type: " + eventType;
                }
            }
        }
    });

    MidiFile.load = function (path) {
        var promise = new Promise();
        var fetch = new XMLHttpRequest();
        fetch.open('GET', path);
        fetch.overrideMimeType("text/plain; charset=x-user-defined");
        fetch.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                /* munge response into a binary string */
                var t = this.responseText || "";
                var ff = [];
                var mx = t.length;
                var scc = String.fromCharCode;
                for (var z = 0; z < mx; z++) {
                    ff[z] = scc(t.charCodeAt(z) & 255);
                }
                var file = new MidiFile(ff.join(""));
                promise.resolve(file);
            }
        };
        fetch.send();
        return promise;
    }

})();
