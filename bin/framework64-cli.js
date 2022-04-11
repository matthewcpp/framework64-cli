#!/usr/bin/env node

const { program } = require("commander");

const path = require("path");

program
    .name("framework64-cli")
    .version("1.0.0")
    .description("Initializes a new framework64 game");

program
    .command("create [name] [directory]")
    .action((name, directory) => {
        const projectName = (!!name) ? name : path.basename(process.cwd());
        const projectDir = (!!directory) ? directory : process.cwd();
        try {
            require("../src/create")(projectName, projectDir, program.opts());
        }
        catch(e) {
            console.log("Fatal Error:" + e);
        }
    });

program
    .option("--branch <branch>", "framework64 branch to checkout upon submodule initialization")
    .option("--init", "Initialize git repository if one is not present in the project folder")
    .option("--verbose", "Enable Verbose output");

program.parse();