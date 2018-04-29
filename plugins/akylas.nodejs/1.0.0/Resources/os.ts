// all ti calls will cache when appropriate

namespace os {
    var os = exports;
    var _tmpdir;
    os.tmpdir = function () {
        return _tmpdir || (_tmpdir = Ti.Filesystem.tempDirectory);
    };

    os.endianness = function () {
        return 'LE';
    };

    var _hostname;
    os.hostname = function () {
        return typeof _hostname !== 'undefined' ?
            _hostname : (_hostname = Ti.Platform.address || '');
    };

    var _type;
    os.type = function () {
        return _type || (_type = Ti.Platform.osname);
    };

    var _platform;
    os.platform = function () {
        return _platform || (_platform = Ti.Platform.name);
    };

    var _arch;
    os.arch = function () {
        return _arch || (_arch = Ti.Platform.architecture);
    };

    var _release;
    os.release = function () {
        return _release || (_release = Ti.Platform.version);
    };

    os.uptime = function () { return 0; };

    os.loadavg = function () { return []; };

    os.freemem = function () {
        var avail = Ti.Platform.availableMemory;
        if (avail) {
            return os.platform === 'iPhone OS' ? Math.floor(avail / 1024) : avail;
        } else {
            return Number.MAX_VALUE;
        }
    };

    os.totalmem = function () {
        return Number.MAX_VALUE;
    };

    os.cpus = function () { return []; };

    os.networkInterfaces = os.getNetworkInterfaces = function () { return {}; };

    os.EOL = '\n';
}