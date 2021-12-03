const fs = require("fs-extra");
const path = require("path");

module.exports = (appPath, name) => {
    const tempPath = path.resolve(`${__dirname}/../../temp/app`);
    fs.moveSync(tempPath, `${appPath}/${name}`, { overwrite: true });
}