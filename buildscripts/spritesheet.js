"use strict";

var gulp = require("gulp");
var gspritesmith = require("gulp.spritesmith");
var layout = require("layout");
var plumber = require("gulp-plumber");
var merge = require("merge-stream");

var utilities = require("./util");

var X_BY_Y = "x_by_y";

layout.addAlgorithm(X_BY_Y, {
    sort: function sort(images) {
        var width = undefined;
        var height = undefined;
        images.forEach(function logImage(image) {
            if (width !== undefined) {
                if (image.width !== width) {
                    throw "mixed widths";
                }
            } else {
                width = image.width;
            }
            if (height !== undefined) {
                if (image.height !== height) {
                    throw "mixed heights";
                }
            } else {
                height = image.height;
            }
            var filepath = image.meta.img._filepath;
            var xy = utilities.getFileName(utilities.getParent(filepath))
                .split(",")
                .map(function (i) {
                    return parseInt(i);
                });
            image.x = xy[0];
            image.y = xy[1];
        });
        var A_FIRST = -1, SAME = 0, B_FIRST = 1;
        images.sort(function cmp(a, b) {
            if (a.y > b.y) {
                return B_FIRST;
            } else if (a.y < b.y) {
                return A_FIRST;
            }
            if (a.x > b.x) {
                return B_FIRST;
            } else if (a.x < b.x) {
                return A_FIRST;
            }
            return SAME;
        });
        return images;
    }, placeItems: function placeItems(images) {
        var currentWidth = 0;
        var currentHeight = 0;
        var yProcessing = 0;
        images.forEach(function place(image) {
            var xy = [image.x, image.y];
            if (image.y !== yProcessing) {
                yProcessing = image.y;
                currentWidth = 0;
                currentHeight += image.height;
            }
            image.x = currentWidth;
            image.y = currentHeight;
            currentWidth += image.width;
        });
        return images;
    }
});
var sheets = ["tiles"].map(function (name) {
    return [name, "spritesheets/" + name + "/**/*.png"];
});
function makeSheet(data) {
    var src = data[1];
    var spriteData = gulp.src(src);
    spriteData = spriteData.pipe(gspritesmith({
        imgName: data[0] + ".png",
        cssName: "never.used.css",
        algorithm: X_BY_Y
    }));
    utilities.timelog("Making sheet:", src);
    return spriteData.img.pipe(gulp.dest("bin/sprites"));
}

gulp.task("sheets", function processSheets() {
    return merge(sheets.map(function (sheet) {
        return makeSheet(sheet);
    }));
});
gulp.task("sheets-watch", ["sheets"], function processSheets() {
    gulp.watch("spritesheets/**/*.png", ["sheets"]);
});
