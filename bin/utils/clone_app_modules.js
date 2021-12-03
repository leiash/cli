const { execSync } = require("child_process");
const fs = require("fs-extra");
const recursivly_find_dependencies = require("./recursivly_find_dependencies");
const path = require("path");

module.exports = function (config) {
    const modulesDir = path.resolve(`${__dirname}/../../temp/modules`);
    const tempAppPath = path.resolve(`${__dirname}/../../temp/app`);
    if (fs.existsSync(modulesDir)) fs.rmSync(modulesDir, { recursive: true, force: true });
    execSync(`git clone https://github.com/leiash/modules ${modulesDir}`, { stdio: "inherit" });

    // Find all needed modules
    const modules = recursivly_find_dependencies(config);

    // Move them to temp path
    for (let i = 0; i < modules.length; i++) {
        const module = modules[i];
        if (!fs.existsSync(`${modulesDir}/${module}`)) throw new Error("Trying to load non-existent module");

        fs.ensureDirSync(`${tempAppPath}/src/modules/${module}`)
        fs.copySync(`${modulesDir}/${module}/leia-config.json`, `${tempAppPath}/src/modules/${module}/leia-config.json`, {});
        fs.copySync(`${modulesDir}/${module}`, `${tempAppPath}/src/modules/${module}`, {});
    }
}