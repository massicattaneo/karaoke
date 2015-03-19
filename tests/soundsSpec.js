describe('Sounds', function () {

    describe("On creating a note with name", function () {
        it("should retrive correct information", function () {
            var note = new sounds.note('C4');
            expect(note.name).toEqual('C4');
        });
    });

});