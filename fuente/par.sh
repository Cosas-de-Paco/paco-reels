#!/bin/bash
# usage: par.sh scene.html seconds outdir  -> renders 30 fps in 4 parallel chunks
scene=$1; secs=$2; out=$3; mkdir -p $out
n=$(python3 -c "print(round($secs*30))"); k=$(( (n+3)/4 ))
for i in 0 1 2 3; do node render2.js $scene $secs 30 $out $((i*k)) $(((i+1)*k)) & done; wait
