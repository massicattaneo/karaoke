packages
    .create('Audio-LibrarySettings', function () {

        var settings = {
            piano: {
                folder: "../soundsLibrary/StereoGrand/",
                spectrum: {action: "fill"},
                sampleNames: ['C0', 'F0', 'C1', 'F1s', 'D2', 'F2', 'D3', 'F3', 'G3', 'C4', 'F4', 'C5s', 'G5s', 'C6']
            },
            drum: {
                folder: "../soundsLibrary/DrumKit/",
                spectrum: {action: "none"},
                sampleNames: ['C0', /*Kick*/ 'C1', /*Snare*/ 'C2' /* HiHat */]
            }
        };

        return settings;
    });