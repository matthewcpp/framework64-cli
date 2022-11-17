#!/usr/bin/env node

const { program } = require("commander");

const path = require("path");

async function commandCreate(directory, name) {
    const projectDir = (!!directory) ? directory : process.cwd();
    const projectName = (!!name) ? name : path.basename(process.cwd());
    
    try {
        await (require("../src/create"))(projectDir, projectName, program.opts());
    }
    catch(e) {
        console.log("Fatal Error:" + e);
    }
}

program
    .name("framework64-cli")
    .version("0.0.2")
    .description("Initializes a new framework64 game");

program
    .command("create [directory] [name]")
    .action(commandCreate);

program
    .option("--branch <branch>", "framework64 branch to checkout upon submodule initialization")
    .option("--init", "Initialize git repository if one is not present in the project folder")
    .option("--verbose", "Enable Verbose output");

program.parse();