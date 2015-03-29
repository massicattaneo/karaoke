packages
    .create('Audio-Context', function() {
        var AudioContext = window.AudioContext || window.webkitAudioContext || function () {};
        return new AudioContext();
    });