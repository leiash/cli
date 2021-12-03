#! /usr/bin/env node
const yargs = require("yargs");
const yargsInteractive = require("yargs-interactive");
const keytar = require('keytar');
const validate_generation = require("./utils/validate_generation");
const prepare_temp = require("./utils/prepare_temp");
const copy_app_base = require("./utils/copy_app_base");
const clone_and_copy_app_modules = require("./utils/clone_app_modules");
const load_config = require("./utils/load_config");
const generate_imports_file = require("./utils/generate_imports_file");
const install_dependencies = require("./utils/install_dependencies");
const move_app = require("./utils/move_app");
const path = require("path");
const { execSync } = require("child_process");
const remove_temp = require("./utils/remove_temp");

// methods
function generateApp(name, dir, template) {
    console.log(`Generating new Leia app "${name}" at ${dir} using the ${template} template`);
    const templateName = template.split(" ")[0];
    validate_generation(name, dir, templateName);
    prepare_temp();

    const config = load_config(templateName);
    copy_app_base();
    clone_and_copy_app_modules(config);
    generate_imports_file(config);
    install_dependencies();
    move_app(dir, name);
    remove_temp();

    console.log(`
    Your app has been generated! 
    
    To start your app use 'cd ${path.join(dir, name)}' and 'leia start' or 'leia start dev'
    `)
}

function generateModule(name) {
    console.log(`Generating new Leia module "${name}"`)
}

function addModule(name) {
    console.log(`Adding Leia module "${name}"`)
}

function startApp(mode) {
    console.log(`Starting app in ${mode || "production"} mode`);
    execSync(`yarn start${!mode ? "" : ":" + mode}`, { stdio: "inherit" });
    // const process = spawn(`nest`, [`start${!mode ? "" : ":" + mode}`]);
}

function authLogin(token) {
    console.log(`Authenticating with ${token}`)
    keytar.setPassword("@leiash/cli", "auth1", token);
    keytar.getPassword("@leiash/cli", "auth1").then(console.log).catch(console.log)
}

// Commands

yargs.command(
    {
        command: "start [mode]",
        help: true,
        describe: "Starts your created Leia app locally",
        builder: (yargs) => {
            return yargs.positional("mode", {
                describe: "Start in either prod, dev or debug mode",
                default: "prod"
            })
        },
        handler: (yargs) => {
            startApp(yargs.mode);
        }
    }
)

// Generate app command
yargs.command(
    {
        command: "generate:app [name] [directory]",
        help: true,
        describe: "Generates a new Leia app locally",
        builder: (yargs) => {
            return yargs.positional("name", {
                describe: "Name of your Leia app"
            })
                .positional("directory", {
                    describe: "Directory to generate the app in"
                })
                .positional("template", {
                    describe: "Template to base app off of"
                })
        },
        handler: (yargs) => {
            if (!yargs.name && !yargs.directory && !yargs.template) interactiveAppGeneration();
            else generateApp(yargs.name)
        }
    }
)

// Generate new module
yargs.command(
    {
        command: "generate:module [name]",
        help: true,
        describe: "Generates a new module locally",
        builder: (yargs) => {
            return yargs.positional("name", {
                describe: "Name of your Leia module"
            })
        },
        handler: (yargs) => {
            if (!yargs.name) interactiveModuleGeneration();
            else generateModule(yargs.name, yargs.directory)
        }
    }
)

// Add module to config
yargs.command(
    {
        command: "add:module [name]",
        help: true,
        describe: "Adds a module to your project",
        builder: (yargs) => {
            return yargs.positional("name", {
                describe: "Name of the Leia module"
            })
        },
        handler: (yargs) => {
            if (!yargs.name) interactiveModuleAdding();
            else addModule(yargs.name)
        }
    }
)


// login to cloud api
yargs.command(
    {
        command: "auth:login [token]",
        help: true,
        describe: "Authenticates you with the Leia.sh Cloud API",
        builder: (yargs) => {
            return yargs.positional("token", {
                describe: "Login token (Generate one at https://cloud.leia.sh/account/tokens)"
            })
        },
        handler: (yargs) => {
            if (!yargs.token) interactiveAuthLogin();
            else authLogin(yargs.token);
        }
    }
)


// Interactive commands for certain operations such as generating apps or modules
function interactiveAppGeneration() {
    yargsInteractive()
        .interactive({
            interactive: { default: true },
            name: {
                type: "input",
                describe: "Do you have a name for your Leia app?"
            },
            directory: {
                type: "input",
                describe: "Where do you want to generate the Leia app?"
            },
            template: {
                type: "list",
                describe: "What template would you like to base your app off?",
                choices: [
                    "clean (barebones config with no modules)",
                    "chat (template for a full chat application)",
                    // "social-media (template for a social media platform)",
                    // "blog (template for an easy blog)"
                ]
            }
        }).then(result => {
            console.log(result)
            generateApp(result.name, result.directory, result.template);
        })
}

function interactiveModuleGeneration() {
    yargsInteractive()
        .interactive({
            interactive: { default: true },
            name: {
                type: "input",
                describe: "Name of your Leia module"
            },
        }).then(result => {
            generateModule(result.name);
        })
}

function interactiveModuleAdding() {
    yargsInteractive()
        .interactive({
            interactive: { default: true },
            name: {
                type: "list",
                describe: "What Leia module do you want to include",
                choices: ["core/users", "core/auth", "core/functions", "core/chat"]
            },
        }).then(result => {
            generateModule(result.name);
        })
}

function interactiveAuthLogin() {
    yargsInteractive()
        .interactive({
            interactive: { default: true },
            token: {
                type: "input",
                describe: "Enter your login token (Generate one at https://cloud.leia.sh/account/tokens)",
            },
        }).then(result => {
            authLogin(result.token);
        })
}

// start yargs stuff
yargs
    .usage(`
    Usage: leia <commands>\n
    The Leia CLI tool can be used to create custom modules for your Leia.sh cloud hosted applications but also to create a custom tailored backend for self hosting the Leia Framework.
    View the documentation for more information https://docs.leia.sh/cli
    `)
    .help(true).argv