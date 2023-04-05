const LOCALE_KEY_REGEX = /[^0-9a-zA-Z]/g

const generateKey = (key) => (
  key.replace(LOCALE_KEY_REGEX, '_').toLowerCase()
)

module.exports = {
  generateKey,
}