export function getErrorCode(err) {
    if (err.error && err.error.error && err.error.error.message) {
        err = err.error.error;
    }
    return err.code || err.status || err.statusCode;
}


export function getRealError(err) {
    if (err.error && err.error.error && err.error.error.message) {
        return err.error.error;
    }
    return err;
}


export function dumpError(err, __?, logger?) {
    (logger || console).error('Error :', errorToString(err, __, true));
}
export function errorToString(err, __?: (s: string, data?) => string, showStack = false) {
    __ = __ || function (s) { return s };
    if (typeof err === 'string') {
        return err;
    }
    err = getRealError(err);
    let result;
    if (err.localData) {
        result = __(err.message, err.localData());
    } else {
        result = __(err.message || err.toString());
    }
    if (showStack && err.stack && err.stack.indexOf('\n') !== -1) {
        result += ' ' + err.stack;
    }
    return result;
}

export function isActualError(err) {
    if (typeof err === 'string') {
        return false;
    }
    err = getRealError(err);
    if ( err.stack && err.stack.indexOf('\n') !== -1) {
        return true;
    }
    return false;
}

 export function formatBytes(a,b){if(0==a)return"0 Bytes";var c=1024,d=b||2,e=["Bytes","KB","MB","GB","TB","PB","EB","ZB","YB"],f=Math.floor(Math.log(a)/Math.log(c));return parseFloat((a/Math.pow(c,f)).toFixed(d))+" "+e[f]}
