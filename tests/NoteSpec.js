describe('NOTE', function () {
    var note;

    beforeEach(function () {

    });

    describe("On creating a note from a full name", function () {

        it("should get back correct info", function () {
            note = new Note(0);
            expect(note.fullName).toEqual('C0');
            expect(note.value).toEqual(0);
            expect(note.octave).toEqual(0);
            expect(note.alteration).toEqual(0);

            note = new Note(49);
            expect(note.fullName).toEqual('C4s');
            expect(note.value).toEqual(49);
            expect(note.octave).toEqual(4);
            expect(note.alteration).toEqual(1);
        });

    });

    describe("On creating a note from an absolute value", function () {

        it("should get back correct info", function () {
            note = new Note('C5s');
            expect(note.fullName).toEqual('C5s');
            expect(note.value).toEqual(61);
            expect(note.octave).toEqual(5);
            expect(note.alteration).toEqual(1);

            note = new Note('D2b');
            expect(note.fullName).toEqual('C2s');
            expect(note.value).toEqual(25);
            expect(note.octave).toEqual(2);
            expect(note.alteration).toEqual(-1);
        });

    });

});