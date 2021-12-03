const fs = require("fs-extra");
const remove_temp = require("./remove_temp");

module.exports = function () {

    remove_temp();

    // Create temp dir
    fs.ensureDirSync(`${__dirname}/../../temp/app`);
}