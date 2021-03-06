export default (string, length) => {
  if (string.length > length) {
    return string.substring(0, length - 3) + '...'
  }

  return string
}