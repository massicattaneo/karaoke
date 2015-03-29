packages
    .imports('MidiEvent.Generic')
    .create('Note', function (MidiEvent) {

    function getNoteOctave(fullName) {
        return parseInt(fullName.substr(1, 1), 10);
    }

    function getNoteName(fullName) {
        return fullName.substr(0, 1);
    }

    function getNoteOctaveValue(noteName) {
        return parseInt(notes.indexOf(noteName), 10);
    }

    function getNoteAlteration(fullName) {
        var alter = 0;
        if (fullName.substr(2, 1)) {
            if (fullName.substr(2, 1) === "s") {
                alter = 1;
            }
            else {
                alter = -1;
            }
        }
        return alter;
    }

    function getNoteAbsoluteValue(octave, octaveValue, alteration) {
        return (octave * 12) + octaveValue + alteration;
    }

    function getNoteFullName(absoluteValue) {
        var note = "";
        var octave = parseInt(absoluteValue / 12);
        note = notesSharp[absoluteValue % 12];

        var chars = note.split("");
        chars[1] = chars[1] || "";
        return "" + chars[0] + "" + octave + chars[1];
    }

    function detectArgumentType(numOrStr) {
        var fullName;
        if (isNaN(numOrStr)) {
            fullName = numOrStr;
        } else {
            fullName = getNoteFullName(numOrStr);
        }
        return fullName;
    }

    var notes = ["C", "", "D", "", "E", "F", "", "G", "", "A", "", "B"];
    var notesSharp = ["C", "Cs", "D", "Ds", "E", "F", "Fs", "G", "Gs", "A", "As", "B"];

    this.Class = Class.extend(MidiEvent).create({
        constructor: function (/* absoluteValue(Number) || fullName(String) */numOrStr) {
            var fullName = detectArgumentType(numOrStr);
            this.octave = getNoteOctave(fullName);
            this.name = getNoteName(fullName);
            this.octaveValue = getNoteOctaveValue(this.name);
            this.alteration = getNoteAlteration(fullName);
            this.value = getNoteAbsoluteValue(this.octave, this.octaveValue, this.alteration);
            this.fullName = getNoteFullName(this.value);
        }
    });

});