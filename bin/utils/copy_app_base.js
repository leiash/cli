const fs = require("fs-extra");

module.exports = function () {
    fs.copySync(`${__dirname}/../../base`, `${__dirname}/../../temp/app`, { recursive: true, overwrite: true });
}