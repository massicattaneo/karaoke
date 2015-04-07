packages
    .imports('StreamReader')
    .imports('Midi-EventStreamReader')
    .imports('Midi-Track')
    .create('Midi-File', function (StreamReader, MidiEventStreamReader, MidiTrack) {

        var MidiFile = Class.CollectionOf(MidiTrack).create({
            constructor: function (binaryData) {
                this.super();
                this.stream = new StreamReader(binaryData);
                this.setHeaderInfo();
                this.setTracksEvents();
            },
            setHeaderInfo: function () {
                var headerChunk = this.stream.readChunk();
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
            setTracksEvents: function () {
                for (var i = 0; i < this.header.trackCount; i++) {
                    var trackChunk = this.stream.readChunk();

                    if (trackChunk.id !== 'MTrk') {
                        throw "Unexpected chunk - expected MTrk, got " + trackChunk.id;
                    }
                    var midiEventsReader = new MidiEventStreamReader(trackChunk.data);
                    var track = this.new();
                    while (!midiEventsReader.eof()) {
                        track.add(midiEventsReader.readEvent());
                    }
                }
            },
            getEventData: function (trackIndex, eventIndex, attribute) {
                return this.get(trackIndex).get(eventIndex)[attribute]
            }
        });
        MidiFile.load = function (path) {

            var promise = new Promise(),
                httpRequest = new XMLHttpRequest(),
                convertToBinary = function (string) {
                    var binary = [];
                    for (var index = 0; index < string.length; index++) {
                        binary[index] = String.fromCharCode(string.charCodeAt(index) & 255);
                    }
                    return binary.join('');
                };
            httpRequest.open('GET', path);
            httpRequest.overrideMimeType("text/plain; charset=x-user-defined");
            httpRequest.onreadystatechange = function () {
                if (this.readyState === 4 && this.status === 200) {
                    var file = new MidiFile(convertToBinary(this.responseText));
                    promise.resolve(file);
                }
            };

            httpRequest.send();
            return promise;
        };

        return MidiFile;

});
