const {
  presets: { js, css, md },
} = require('./lint-staged.helpers')

module.exports = {
  '*.{ts,tsx}': js,
  '*.{js,jsx}': js,
  '*.{css,scss,sass,less}': css,
  '*.{md,mdx}': md,
}
