const fs = require("fs-extra");
const recursivly_find_dependencies = require("./recursivly_find_dependencies");
const path = require("path");

module.exports = (config) => {
    console.log(`Generating .env file`);
    let code = ``;
    const tempAppPath = path.resolve(`${__dirname}/../../temp/app`);
    // Start modules 
    const modules = recursivly_find_dependencies(config);
    const envs = [];
    // Import code
    for (let i = 0; i < modules.length; i++) {
        const module = modules[i];
        const moduleConfig = fs.readJsonSync(`${tempAppPath}/src/modules/${module}/leia-config.json`);
        if (moduleConfig.requiredEnvs && Array.isArray(moduleConfig.requiredEnvs)) {
            moduleConfig.requiredEnvs.forEach(env => {
                if (!envs.includes(env)) envs.push(env);
            })
        }
    }

    envs.forEach(env => {
        code += `${env}=\n`
    })

    fs.writeFileSync(`${tempAppPath}/.env`, code);
}