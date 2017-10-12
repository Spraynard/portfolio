#!/bin/bash

SOURCE_BASE=src/js/
PUBLIC_BASE=javascripts/

for f in ${SOURCE_BASE}*.js
do
	# filename='/ ' read -r -a array <<< "$string"
	# echo "${filename[0]}"
	echo $f
	DIR=$(dirname ${f})
	FILE=$(basename ${f})
	CUT_FILE=$(basename ${f%.js*})
	# echo "${DIR}"
	echo "${FILE}"
	uglifyjs ${SOURCE_BASE}${FILE} \
		-o ${PUBLIC_BASE}${CUT_FILE}.min.js -c -m \
		--source-map "root='http://localhost:8000/',url='${CUT_FILE}.min.js.map'"
done
