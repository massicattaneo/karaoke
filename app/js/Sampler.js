packages
    .create('utility', function() {
        var AudioContext = window.AudioContext || window.webkitAudioContext || function () {};
        this.audioContext = new AudioContext();
    });

packages
    .imports('utility.audioContext')
    .create('Sampler', function (audioContext) {
    var percentages = [0, 5.946, 12.246, 18.921, 25.992, 33.484, 41.421, 49.831, 58.740, 68.179, 78.180, 88.775, 100];
    this.Class = Class.create({
        constructor: function (audioSample) {
            this.channel1 = audioSample.getChannelData(0);
            this.channel2 = (audioSample.numberOfChannels() === 2) ? audioSample.getChannelData(1) : audioSample.getChannelData(0);
            this.length = this.channel1.length;
        },
        shift: function (semitones) {
            var channel1 = new Float32Array(this.length);
            var channel2 = new Float32Array(this.length);
            channel1[0] = this.channel1[0];
            channel2[0] = this.channel2[0];
            var factor = 1 + (percentages[semitones] / 100), j = 1;
            for (var i = 1; i < this.length; i += factor) {
                channel1[j] = this.channel1[Math.ceil(i)];
                channel2[j] = this.channel2[Math.ceil(i)];
                j++;
            }
            return this.createBuffer(channel1, channel2);
        },
        createBuffer: function (ch1, ch2) {
            var buffer = audioContext.createBuffer(2, this.length, 44100);
            buffer.getChannelData(0).set(ch1, 0, 0);
            buffer.getChannelData(1).set(ch2, 0, 0);
            return buffer;
        }
    });
});