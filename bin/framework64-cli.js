#!/usr/bin/env node

const { program } = require("commander");

program
    .name("framework64-cli")
    .version("1.0.0")
    .description("Initializes a new framework64 game");

program
    .command("create <name> [directory]")
    .action((name, directory) => {
        const projectDir = (!!directory) ? directory : process.cwd();
        require("../src/create")(name, projectDir, program.opts());
    });

program
    .option("--branch <branch>", "framework64 branch to checkout upon submodule initialization");

program.parse();