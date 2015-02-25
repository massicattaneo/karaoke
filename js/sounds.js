/// <reference path="../base2.js" />
var sounds = sounds || {};

// Fix up prefixing
//window.AudioContext = window.AudioContext || window.webkitAudioContext;
//sounds.audioContext = new AudioContext();

sounds.Cnote = base2.Base.extend({
    constructor: function (name) {
        this.name = name;
        this.octave = parseInt(name.substr(1, 1), 10);
        this.note = name.substr(0, 1);
        this.noteVal = parseInt(sounds.Cnote.notes.indexOf(this.note), 10);
        this.alter = 0;
        if (name.substr(2, 1)) {
            if (name.substr(2, 1) === "s") {
                this.alter = 1;
            }
            else {
                this.alter = -1;
            }
        }
        this.absVal = (this.octave * 12) + this.noteVal + this.alter;
    }
}, {
    notes: ["C", "", "D", "", "E", "F", "", "G", "", "A", "", "B"],
    notesSharp: ["C", "Cs", "D", "Ds", "E", "F", "Fs", "G", "Gs", "A", "As", "B"],
    getNoteNameFromAbsVal: function (absVal) {
        var note = "";
        var octave = parseInt(absVal / 12);
        note = this.notesSharp[absVal % 12];

        var array = note.split("");
        array[1] = array[1] || "";
        return "" + array[0] + "" + octave + array[1];
    }
});