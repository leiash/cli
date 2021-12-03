const fs = require("fs-extra");
const path = require("path");

module.exports = (config) => {
    const modules = config.modules;
    const modulesPath = path.resolve(`${__dirname}/../../temp/modules`);

    const loadConfig = (module) => {
        return fs.readJsonSync(`${modulesPath}/${module}/leia-config.json`);
    }

    const findDependencies = (moduleConfig) => {
        if (moduleConfig && Array.isArray(moduleConfig.moduleDependencies)) {
            moduleConfig.moduleDependencies.forEach(dependency => {
                if (!modules.includes(dependency)) {
                    modules.push(dependency);
                    findDependencies(loadConfig(dependency))
                }
            });
        }
    }

    for (let i = 0; i < config.modules.length; i++) {
        const module = config.modules[i];
        if (!fs.existsSync(`${modulesPath}/${module}`)) throw new Error("Trying to load non-existent module");
        const moduleConfig = loadConfig(module);
        findDependencies(moduleConfig);
    }

    return modules;
}