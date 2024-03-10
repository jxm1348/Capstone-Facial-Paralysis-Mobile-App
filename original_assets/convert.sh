#!/bin/sh

for n in original_assets/face-mp-*; do
    echo convert $n -resize 150x200 src/resources/${n/original_assets\/};
    convert $n -resize 150x200 src/resources/${n/original_assets\/};
done