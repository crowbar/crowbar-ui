#!/bin/sh
url=$1
output=$2

[ "$url" == "" -o "$output" == "" ] && { echo "usage: record_status.sh <status url> <scenariodir>"; echo "example url: http://crowbar.vh12.cloud.suse.de/api/upgrade"; exit 1; }

mkdir -p "$output"
state=$(find $output -name '*.json' | sed -r 's/^[^\/]*\///g' | sort -n | tail -1)
num=$(echo $state | sed -r 's/^0*|\.json//g')
echo "last state: $state ($num)"
while true; do
wget -q --http-user=crowbar --http-password=crowbar --header="Accept: application/vnd.crowbar.v2.0+json" $url -O $output/tmp
echo -n '.'
if [ ! -f "$output/$state" ] || ( [ -s $output/tmp ] && ! diff -q $output/$state $output/tmp > /dev/null ); then
  num=$(( $num + 1 ))
  state=$(printf "%06d.json" $num)

  mv $output/tmp $output/$state
  echo "stored state: $state ($num)"
fi
usleep 10000
done
