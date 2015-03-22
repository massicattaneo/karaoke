describe('FILE READER', function() {

    var gymnopedie = '';//'MThdðMTrkÿXÿYÿQImÿ--NONE--pÿQgZPÿQIm§0ÿQgZPÿQImÉÿQgZPÿQIm²PÿQ÷PÿQÌPÿQ*;PÿQq°PÿQ*;PÿQgZPÿQIm²PÿQgZPÿQImÿQgZPÿQIm ÿQgZPÿQIm@ÿQgZPÿQIm@ÿQ÷PÿQImPÿQImPÿQImpÿQ÷PÿQÅZPÿQåPÿQ,+ÿ/MTrk*ÿ!ÿGymnopedie No.1 by Erik Satieÿ/MTrkEÿ!Ã³³[0N@pNQBpQOHpONJpNIGpIGMpGIJpIJKpJEFPEBK@BpN@pNQBpQOHpONEpNIFpIGMpGIIpIJKpJELPEIJPINHPN@Fp@EFpEGBpGHCpHLIpLJEpJGGpGJMpJHIpHGJpGJK{J5JApJLHpLMEpMOFpOQMpQHIpHJKpJLPpLJJpJGHpGJGJ0JApJOCPONHPNGPpGELpEGLpGIPpIJLpJLLdLIPpIJLpJLLpLBKPBHBPHJ<PJ0N?pNQDpQOFpONHpNIGpIGMpGIKpIJKpJEIPEBExB8N?pNQDpQOBpONGpNIEpIGJpGIHpIJIpJEKPEIKPINEPN@F6@:E@pEG>pGH@pHLFpLJDpJGEpGJKpJHIpHGKpGJKJ0JHpJLMpLMIpMOJpOQNpQHKpHJKpJLNpLJIpJGHpGJFJ0JBpJOHPOMNPMGQpGHLpHMLpMLQpLJLpJHLpHLQpLJLpJHLpHALPAHFPHJ@XJÿ/MTrk­ÿ!Ä´´P´[pB8>8;8M;>BB8=898M9=BB8>8;8M;>BB8=898M9=BB9>9;9`;>BpB<=<9<`9=BpB<><;<`;>BpB<=<9<`9=BpB<><;<`;>BpB9=999`9=BpB3>3;3`;>BpB3=393M9=BB9>9;9`;>BpB;=;9;`9=BpB<><;<`;>BpB<=<9<`9=BpB<=<9<`9=BpB<><;<`;>Bp;878`7;pC8>8;8`;>Cp>79767V69>z@9<999`9<@p@<;<7<`7;@p@<;<7<2<`2@;7p><9<4<0<`0>94p>9996909`0>96pA<<<9<`9<Ap@<<<9<`9<@p@;;;7;2;`2@;7p>;9;4;0;`0>94p>8986808`0>96pC9@9;9`;@CpB;=;9;`9=BpB;>;;;`;>BpE=@===`=@EpE;B;=;9;`9EB=p>;9;/;n/9>C;>;;;4;n4C>;E9@9<9B<@EE6B6>63>BEB6>6;6H;>BB6=696M9=BB6>6;6V;>BzB8=898`9=BpB9>9;9`;>BpB<=<9<`9=BpB<><;<`;>BpB9=999`9=BpB7>7;7`;>BpB6=696`9=BpB3>3;3`;>BpB4=494V9=BzB9>9;9`;>BpB<=<9<`9=BpB<><;<`;>BpB<=<9<`9=BpB9=999`9=BpB8>8;8`;>Bp;676`7;pC6>6;6`;>Cp>69656V59>z@9<999`9<@p@<;<7<`7;@p@<;<7<2<`2@;7p>9994909`0>94p>7975707`0>95pA9<999`9<Ap@=<=9=`9<@p@;;;7;2;`2@;7p>7974707`0>94p>7975707`0>95pC;@;;;`;@CpE=A=>=9=`9EA>pA<<<9<`9<ApE<A<<<`<AEpE<A<<<9<`9EA<p><9</<k/9>C9>9;949k4C>;E9@9<9:<@EE9A9>9 >AEÿ/MTrkYÿ!Åµµ2µ[+=P+&=P&+=P+&=P&+=P+&=P&+=P+&=P&+=P+&=P&+7P+&7P&+=P+&=P&+=P+&=P&*=P*#=P#(=P((;P(&;P&!=P!&=P&&=P&&=P&&=P&&=P&&=P&&=P&&=P&&=P&(=P(*=P*#=P#(=P((=P((=P(7=-=B7-2:-:32-+:P+&:P&+:P+&<P&+=P+&=P&+=P+&=P&+=P+&=P&+7P+&7P&+=P+&=P&+?P+&?P&*=P*#=P#(<P((<P(&:P&!=P!&?P&&?P&&=P&&=P&&=P&&=P&&=P&&=P&&=P&(=P((@P((AP((AP((AP((AP(7=-=:7-2=-=&= &-2ÿ/MTrk%ÿ!ÿA public domain sequenceÿ/MTrkÿ!ÿby David Cookeÿ/';
    var reader;

    beforeEach(function () {
        reader = new MidiFileReader(gymnopedie);
    });

    describe("On reading a File", function () {

        it("should get the byte stream", function () {
            expect(reader.stream).toBeDefined();
        });

        it("should have the header information", function () {
            expect(reader.header.formatType).toEqual(1);
            expect(reader.header.trackCount).toEqual(7);
            expect(reader.header.ticksPerBeat).toEqual(240);
        });

    });

});