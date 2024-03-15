#!/bin/sh

for IMAGE_NAME in at-rest big-smile-teeth-closed eyebrows-up eyes-closed-gently eyes-closed-tightly lips-puckered lower-teeth-bared nose-wrinkle small-smile; do
    n=original_assets/face-mp-$IMAGE_NAME.jpg
    echo convert $n -resize 150x200 src/resources/${n/original_assets\/};
    convert $n -resize 150x200 src/resources/${n/original_assets\/};
done