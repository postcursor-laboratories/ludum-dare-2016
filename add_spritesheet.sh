#!/usr/bin/env bash


function defineProperty() {
    local prop="$1"
    local prompt="$2"
    if [[ "x$prop" == "x" ]]; then
        echo -n "$prompt: " >&2
        read prop
    fi
    echo "$prop"
}
name="$(defineProperty "$1" Name)"
x="$(defineProperty "$2" 'X-Coord')"
y="$(defineProperty "$3" 'Y-Coord')"
filepath="$(realpath "$(defineProperty $4 'File Path')")"

cd -P -- "$(dirname -- "$0")"

dirtarget="./spritesheets/${name}/${x},${y}"
filetarget="$dirtarget/${filepath##*/}"

mkdir -p "$dirtarget"
cp "$filepath" "$filetarget"
