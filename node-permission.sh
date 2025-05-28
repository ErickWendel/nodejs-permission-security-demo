node --permission \
--allow-fs-read=$(pwd)/src \
--allow-fs-write=$(node -p 'os.tmpdir()') \
--allow-child-process \
src/index.js