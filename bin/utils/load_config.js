const fs = require("fs-extra");

module.exports = function (template) {
    return fs.readJSONSync(`${__dirname}/../../templates/${template}.json`);
}