import { sum } from './math.min.js'
console.time('elapsed')
console.log('my magic number is', sum(10, 10))
console.timeEnd('elapsed')