import '@testing-library/jest-dom'

// Polyfill TextEncoder/Decoder for jsdom
const { TextEncoder, TextDecoder } = require('util')
if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = TextEncoder
}
if (typeof global.TextDecoder === 'undefined') {
  global.TextDecoder = TextDecoder
}
