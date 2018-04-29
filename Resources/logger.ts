const API = Ti.API;
import * as util from 'util';
import * as fs from 'fs';
import * as path from 'path';

const production = Ti.App.deployType === 'production';
const model = Ti.Platform.model;
const __SIMULATOR__ = /simulator/i.test(model) || /x86_64/i.test(Ti.Platform.deviceId);
const __XCODE__ = /xcode/i.test(model);
const realConsole = API;
console.log('testing require logger', production, __SIMULATOR__, __XCODE__);

const colors = [6, 2, 3, 4, 5, 1];
function getLogPath() {
    return path.join(Ti.Filesystem.tempDirectory, 'Logs');
}
const logPath = path.join(getLogPath(), 'NeOsePro.log');
Ti.Filesystem.getFile(path.dirname(logPath)).createDirectory();
const file = Ti.Filesystem.getFile(logPath);
if (file.exists()) {
    file.deleteFile();
}
file.createFile();
console.debug('logPath', logPath, file.exists());
let stream: titanium.FilesystemFileStream;
if (!__SIMULATOR__) {
    stream = Ti.Filesystem.openStream(Ti.Filesystem.MODE_APPEND, logPath);
}

function useColors(): boolean {
    return __SIMULATOR__ && !__XCODE__;
}
var prevColor = 0;
function selectColor() {
    return colors[prevColor++ % colors.length];
}
var shouldUserColors = useColors();

function coerce(val) {
    // if (val instanceof Error) return val.stack || val.message;
    return val;
}

const formatters: any = {};
formatters.o = formatters.O = function(v, useColors = shouldUserColors) {
    return util.inspect(v, {
        maxArrayLength: 100,
        breakLength: 600,
        depth: 4,
        colors: useColors
    });
    // .replace(/\s*\n\s*/g, ' ');
};

export default class Logger {
    // logger
    color: number;
    namespaceColored: string;
    constructor(public namespace: string, private renderThread = false) {
        this.color = selectColor();
        if (shouldUserColors) {
            this.namespaceColored = '\u001b[3' + this.color + ';1m' + this.namespace + '\u001b[0m';
        }
        // this.debug('creating logger', namespace, this.namespace, this.color);
    }
    formatArgs = (method: string, args: Array<any>, useColor: boolean) => {
        var name = this.namespaceColored || this.namespace;
        args.unshift(name);
        return args;
    };
    format = (args, useColor = shouldUserColors) => {
        var format;
        var sliceArgs = args.slice();
        for (var index = 0; index < sliceArgs.length; index++) {
            var element = sliceArgs[index];
            if ('string' === typeof element) {
                if (/%[a-zA-Z]/.test(element)) {
                    format = element[1];
                    sliceArgs.splice(index, 1);
                    index--;
                }
            } else {
                element = coerce(element);
                if (!format) {
                    format = 'o';
                }
                var formatter: Function = formatters[format];
                if ('function' === typeof formatter) {
                    var val = sliceArgs[index];
                    element = formatter.call(this, element, useColor);
                }
                sliceArgs[index] = element;
                format = undefined;
            }
        }
        return util.format.apply(this, sliceArgs);
    };
    _log = (method: string, args: any, useColor = shouldUserColors) => {
        if (production && method !== 'error') {
            return;
        }
        var format;
        var sliceArgs = args.slice();
        for (var index = 0; index < sliceArgs.length; index++) {
            var element = sliceArgs[index];
            if ('string' === typeof element) {
                if (/%[a-zA-Z]/.test(element)) {
                    format = element[1];
                    sliceArgs.splice(index, 1);
                    index--;
                }
            } else {
                element = coerce(element);
                if (!format) {
                    format = 'o';
                }
                var formatter: Function = formatters[format];
                if ('function' === typeof formatter) {
                    var val = sliceArgs[index];
                    element = formatter.call(this, element, useColor);
                }
                sliceArgs[index] = element;
                format = undefined;
            }
        }

        const toWrite: string = util.format.apply(util, this.formatArgs(method, sliceArgs, useColor));
        realConsole[method](toWrite);
        stream && stream.write(`[${moment().format('DD/MM-hh:mm:ss:SSS')}] ${toWrite}\n`);
    };
    getLogfilePath() {
        return logPath;
    }
    log = (...args) => {
        this._log('log', args);
    };
    error = (...args) => {
        this._log('error', args);
    };
    debug = (...args) => {
        this._log('debug', args);
    };
    warn = (...args) => {
        this._log('warn', args);
    };
    info = (...args) => {
        this._log('info', args);
    };
    trace = (...args) => {
        this._log('trace', args);
    };

    overloadConsole = () => {
        console = this as any;
    };

    //to be assigned as console
    assert() {}
    clear() {}
    count() {}
    dir() {}
    dirxml() {}
    exception() {}
    group() {}
    groupCollapsed() {}
    groupEnd() {}
    _times = new Map();
    time = (label: string) => {
        this._times.set(label, Date.now());
    };
    timeEnd = (label: string) => {
        const time = this._times.get(label);
        if (!time) {
            throw new Error('No such label: ' + label);
        }
        var duration = Date.now() - time;
        this.log(label + ':', duration + 'ms');
    };
    msIsIndependentlyComposed(any) {
        return false;
    }
    profile;
    profileEnd;
    select;
    table;
    Console;
}
