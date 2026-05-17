module.exports = {
  '*.{ts,tsx,js,jsx}': ['oxfmt --write', 'oxlint --type-aware'],
  '*.{css,scss,sass,less,md,mdx}': ['oxfmt --write'],
}
