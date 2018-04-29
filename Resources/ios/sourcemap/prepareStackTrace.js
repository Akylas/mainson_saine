
var ErrorStackParser = require('./ErrorStackParser');
module.exports = function prepareStackTrace(error) {
    try {
        error.stack = Error.prepareStackTrace(error, ErrorStackParser.parse(error));
        return error;
    } catch(e) {
        return error;
    }
    
}