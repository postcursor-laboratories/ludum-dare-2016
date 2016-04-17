"use strict";

var browserify = require("browserify");
var gulp = require("gulp");
var connect = require("gulp-connect");
var plumber = require("gulp-plumber");
var sourcemaps = require("gulp-sourcemaps");
var watch = require("gulp-watch");
var fs = require("fs");
var mkdirp = require("mkdirp");
var merge = require("merge");
var path = require("path");

var utilities = require("./buildscripts/util");
var timelog = utilities.timelog;
var magicTouchFile = utilities.magicTouchFile;

require("./buildscripts/spritesheet");

// Eww.
var preludeFilePath = path.resolve("./node_modules/browser-pack/prelude.js");
var preludeText = fs.readFileSync(preludeFilePath, {encoding: "utf8"});

// Ensure bin exists
mkdirp.sync("./bin/");
var pages = ["main"].map(function (page) {
        return page + ".js";
    }),
    inputs = pages.map(function (page) {
        return "./src/" + page;
    }),
    outputs = pages.map(function (page) {
        return "./bin/" + page;
    });

function commonTransform(customOpts, watch) {
    var defaults = {
        debug: true,
        prelude: preludeText,
        preludePath: "browserify-prelude.js"
    };
    var opts = merge(defaults, customOpts);
    if (watch) {
        console.log("Enabling watchify");
        opts = merge({
            cache: {},
            packageCache: {},
            plugin: [["watchify", {
                poll: true
            }]]
        }, opts);
    }
    console.log("Using options", JSON.stringify(opts, null, 4));
    var b = browserify(inputs, opts);
    console.log("Applying babelify");
    b = b.transform("babelify");
    console.log("Applying browserify-shim");
    b = b.transform("browserify-shim");
    var doBundle = function doBundle() {
        timelog("Bundling again!");
        return b.bundle(
            function err(err) {
                if (!err) {
                    timelog("An error didn't occur. I think.");
                    return;
                }
                timelog("An error occured:");
                console.log(err.toString());
                console.log(err.codeFrame);
            })
            //.pipe(showProgress(process.stdout))
            .pipe(fs.createWriteStream(magicTouchFile("bin/game.js")))
            .on("finish", function () {
                timelog("done bundling");
            });
    };
    b.on("update", doBundle);
    b.on("log", function log(msg) {
        timelog(msg);
    });
    b.on("error", function (err) {
        timelog("Browserify error", err.message);
        this.emit("end");
    });
    b.on("transform", function (tr, file) {
        timelog("Applying " + tr.constructor.name + " to " + file);
    });
    return doBundle();
}

gulp.task("transform", function () {
    return commonTransform({}, false);
});
gulp.task("transform-on-my-watch", function () {
    return commonTransform({}, true);
});
// setup gulp.copy
gulp.copy = function (src, dest, doWatch) {
    var stream = gulp.src(src);
    if (doWatch) {
        stream = stream.pipe(watch(src)).pipe(plumber());
    }
    return stream.pipe(gulp.dest(dest));
};
gulp.task("copy-static", function () {
    return gulp.copy(["static/**"], "bin", false);
});
gulp.task("copy-static-on-my-watch", function () {
    gulp.copy(["static/**"], "bin", true);
});
gulp.task("site", ["transform", "copy-static", "sheets"]);
gulp.task("dev-server", ["transform-on-my-watch", "copy-static-on-my-watch", "sheets-watch"], function () {
    connect.server({
        root: "bin",
        port: 1337,
        livereload: true
    });
});
