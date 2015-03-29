packages
    .imports('Audio-Context')
    .create('Audio-Player', function (audioContext) {

        var player = function (audioSample, startTime, length, gain) {
            var source = audioContext.createBufferSource();
            var gainNode = audioContext.createGain();
            gainNode.gain.value = gain || 1;
            source.buffer = audioSample.buffer;
            source.connect(gainNode);
            gainNode.connect(audioContext.destination);
            source.start(startTime);
            if (length) source.stop(startTime + length);
        }

        return player;

    });
