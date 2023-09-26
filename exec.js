const child = require("child_process");
const { promisify } = require('util');

const exec = promisify(child.exec);

module.exports = exec;