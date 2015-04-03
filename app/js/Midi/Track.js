packages
    .imports('Midi-Event')
    .create('Midi-Track', function (MidiEvent) {

        var MidiTrack = Class.CollectionOf(MidiEvent.Generic).create({
            getNotesOn: function () {
                return this.getCollection('subtype', 'noteOn');
            }
        });

        return MidiTrack;

    });