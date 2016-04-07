#!/bin/bash

set -e

./generate_version_config.sh

####
#tar the files
####
echo 'node_modules/*' > exclude
echo 'build.sh' >> exclude
echo 'clone.sh' >> exclude
echo '*.md' >> exclude
echo '*.tar' >> exclude
echo '*.iws' >> exclude
echo '*.iml' >> exclude
echo '*.ipr' >> exclude
echo '.git'  >> exclude
echo '.gitignore' >> exclude
echo 'exclude' >> exclude

BUNDLE=localization-quickfix-web.tar
tar cvf ${BUNDLE} -X exclude .
