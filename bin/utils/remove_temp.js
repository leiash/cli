const fs = require("fs-extra");

module.exports = function () {

    // Remove temp dir
    if (fs.pathExistsSync(`${__dirname}/../../temp`)) {
        fs.rmSync(`${__dirname}/../../temp`, { recursive: true });
    }
}