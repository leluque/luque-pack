function debug(message, level = 1) {
  const dashes = '-'.repeat(level * 5);
  console.debug(`${dashes} ${message}`);
}

module.exports = {
  debug,
};
