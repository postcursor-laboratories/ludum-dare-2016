var dateFormat = require("dateformat");
var fs = require("fs");
var mkdirp = require("mkdirp");

function timelog() {
    var modargs = [dateFormat(new Date(), "[hh:MM:ss]")];
    modargs.push.apply(modargs, arguments);
    console.log.apply(console, modargs);
}

function getParent(s) {
    return s.substring(0, s.lastIndexOf("/"));
}

function getFileName(s) {
    return s.substring(s.lastIndexOf("/") + 1);
}

function magicTouchFile(f) {
    var parent = getParent(f);
    // Sooooo goood!
    mkdirp.sync(parent);
    fs.closeSync(fs.openSync(f, "w"));
    return f;
}

module.exports.timelog = timelog;
module.exports.getFileName = getFileName;
module.exports.getParent = getParent;
module.exports.magicTouchFile = magicTouchFile;
