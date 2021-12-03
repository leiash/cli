const fs = require("fs-extra");

module.exports = function (name, dir, template) {

    // Check template
    if (!fs.pathExistsSync(`${__dirname}/../../templates/${template}.json`)) {
        throw new Error("Template does not exist");
    }

    // Validate name
    if (!(new RegExp(/^[a-zA-Z0-9-_]+$/).test(name))) {
        throw new Error("Invalid app name, please use only a-z, A-Z, 0-9, - and _");
    }

    // check if dir exists
    if (!fs.pathExistsSync(`${dir}`)) {
        throw new Error("The directory you provided does not exist");
    }
}