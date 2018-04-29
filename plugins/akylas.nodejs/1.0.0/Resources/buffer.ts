function decode_base64(s: string) {
    return Ti.Utils.base64decode(s).byteArray;
}
export class Buffer extends Array {
    _isBuffer = true
    constructor(data?: number | string | number[], encoding?: string) {
        super((typeof data === 'string' || Array.isArray(data)) ? 0 : data);
        if (Array.isArray(data)) {
            Array.prototype.push.apply(this, data)
        } else if (typeof data === 'string') {
            //string
            if (encoding == 'hex') {
                for (var i = 0; i < data.length; i += 2) {
                    this.push(parseInt(data.substring(i, i + 1)));
                }
            } else if (encoding == 'base64') {
                Array.prototype.push.apply(this, decode_base64(data))
            } else {
                for (var i = 0; i < data.length; ++i) {
                    this.push(data.charCodeAt(i));
                }
            }
        }
    }
    toString(encoding?: string) {
        if (encoding === 'hex') {
            return this.map(function (ch) {
                return ch.toString(16);
            }).join('');
        }
        var binstr = this.map(function (ch) {
            return String.fromCharCode(ch);
        }).join('');
        return binstr;
    }
}
Buffer.isBuffer = function (b) {
    return b != null && b._isBuffer === true
}
Buffer.alloc = function (size: number) {
    return new Buffer(size);
}
Buffer.concat = function (buffers: Buffer[]) {
    return Buffer.prototype.concat.apply(buffers[0], buffers.slice(1));
}
Buffer.from = function (data: any, encoding?: string) {
    return new Buffer(data, encoding);
}
Buffer.Buffer = Buffer;
module.exports = Buffer;