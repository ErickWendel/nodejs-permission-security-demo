rm ./src/math.min.js

npx -y javascript-obfuscator ./src/math.js \
  --output ./src/math.min.js \
  --compact true \
  --reserved-names sum \
  --target node \
  --control-flow-flattening true \
  --dead-code-injection true \
  --self-defending true \
  --string-array true \
  --string-array-encoding base64 \
  --string-array-wrappers-type function \
  --string-array-threshold 1 \
  --split-strings true \
  --split-strings-chunk-length 8 \
  --rename-globals false \
  --identifier-names-generator hexadecimal
