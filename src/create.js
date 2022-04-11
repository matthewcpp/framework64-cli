const fs = require("fs");
const path = require("path");
const {spawnSync} = require("child_process");

const framework64Repo ="https://github.com/matthewcpp/framework64.git";

function create(name, projectDir, options) {
    const libDir = path.join(projectDir, "lib");
    const submoduleDir = path.join(libDir, "framework64");
    const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';

    if (fs.existsSync(projectDir)) {
        console.log(`framework64 project directory: ${projectDir}`);
    }
    else {
        console.error(`Directory does not exist: ${projectDir}`);
        process.exit(1);
    }

    const gitStatusResult = spawnSync("git", ["status"], {cwd: projectDir})

    if (options.init && gitStatusResult.status != 0) {
        runSyncCommand("git", ["init"], {cwd: projectDir}, "Initialize git repository in project directory", options);
    }
    else {
        checkSpawnResult(gitStatusResult, `Check for git repository in ${projectDir}`, options);
    }

    if (!fs.existsSync(libDir)) {
        fs.mkdirSync(libDir);
    }

    runSyncCommand("git", ["submodule", "add", framework64Repo, "lib/framework64"], {cwd: projectDir}, "Add framework64 submodule", options);
    runSyncCommand("git", ["submodule", "init"], {cwd: projectDir}, "Initialize framework64 submodule", options);
    runSyncCommand("git", ["add", ".gitmodules"], {cwd: projectDir}, null, options);

    if (options.hasOwnProperty("branch")) {
        runSyncCommand("git", ["checkout", options.branch], {cwd: submoduleDir}, `Checkout framework64 branch: ${options.branch}`, options);
        runSyncCommand("git", ["add", "lib/framework64"], {cwd: projectDir}, null, options);
    }

    runSyncCommand("git", ["commit", "-m", "Add framework64 submodule"], {cwd: projectDir}, "Create initial commit", options);

    runSyncCommand(npmCommand, ["run", "--prefix", "lib/framework64", "create-game", name, projectDir], {cwd: projectDir}, `Run create-game script from framework64 repo`, options);
}

function runSyncCommand(command, args, env, description, options) {
    if (options.verbose) {
        console.log(`Run Command: ${command} ${args.join(' ')} ${JSON.stringify(env)}`)
    }

    if (description) {
        console.log(description);
    }

    const result = spawnSync(command, args, env)

    checkSpawnResult(result, description, options);
}

function checkSpawnResult(result, description, options) {
    if (options.verbose && result.stdout) {
        console.log(result.stdout.toString());
    }

    if (result.status === 0) {
        if (description)
            console.log(`${description}: OK`);

        return;
    }

    if (description)
        console.error(`${description}: Error`);
    
    if (result.stderr && result.stderr.length > 0) 
        console.error(result.stderr.toString());

    throw new Error("Failed to create new Project");
}

module.exports = create;