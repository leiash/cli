const fs = require("fs-extra");
const { execSync } = require("child_process");
const path = require("path");

module.exports = () => {
    console.log(`Installing dependencies`);
    const modulesDir = path.resolve(`${__dirname}/../../temp/modules`);
    const tempAppPath = path.resolve(`${__dirname}/../../temp/app`);

    const appPackage = fs.readJSONSync(`${tempAppPath}/package.json`)
    const modulesPackage = fs.readJSONSync(`${modulesDir}/package.json`);

    const ensureDependencies = (depsKey) => {
        for (const key in modulesPackage[depsKey]) {
            if (!appPackage[depsKey][key]) {
                appPackage[depsKey][key] = modulesPackage[depsKey][key];
            }
        }
    }

    ensureDependencies("dependencies");
    ensureDependencies("devDependencies");

    fs.writeJSONSync(`${tempAppPath}/package.json`, appPackage);

    execSync(`cd ${tempAppPath} && yarn --network-timeout 100000`, { stdio: 'inherit' });
}