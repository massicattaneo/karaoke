packages.create('StreamReader', function() {

    var Reader = Class.create({
        constructor: function(data) {
            this.data = data;
            this.position = 0;
        },
        read: function(length) {
            var result = this.data.substr(this.position, length);
            this.position += length;
            return result;
        },
        /* read a big-endian 32-bit integer */
        readInt32: function() {
            var result = (
            (this.data.charCodeAt(this.position) << 24) +
            (this.data.charCodeAt(this.position + 1) << 16) +
            (this.data.charCodeAt(this.position + 2) << 8) +
            this.data.charCodeAt(this.position + 3));
            this.position += 4;
            return result;
        },
        /* read a big-endian 16-bit integer */
        readInt16: function() {
            var result = (
            (this.data.charCodeAt(this.position) << 8) +
            this.data.charCodeAt(this.position + 1));
            this.position += 2;
            return result;
        },
        /* read an 8-bit integer */
        readInt8: function (signed) {
            var result = this.data.charCodeAt(this.position);
            if (signed && result > 127) {
                result -= 256;
            }
            this.position += 1;
            return result;
        },
        /* read a MIDI-style variable-length integer
         (big-endian value in groups of 7 bits,
         with top bit set to signify that another byte follows)
         */
        readVarInt: function() {
            var result = 0;
            while (true) {
                var byte = this.readInt8();
                if (byte & 0x80) {
                    result += (byte & 0x7f);
                    result <<= 7;
                } else {
                    /* last byte so exit */
                    return result + byte;
                }
            }
        },
        readChunk: function () {
            var id = this.read(4);
            var length = this.readInt32();
            var data = this.read(length);
            return {id: id, length: length, data: data};
        },
        eof: function() {
            return this.position >= this.data.length;
        }
    });

    return Reader;

});