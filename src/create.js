const fs = require("fs");
const path = require("path");
const {spawnSync} = require("child_process");

const framework64Repo ="https://github.com/matthewcpp/framework64.git";

let logStdOut = true;

function create(name, projectDir, options) {
    if (fs.existsSync(projectDir)) {
        console.log(`framework64 project directory: ${projectDir}`);
    }
    else {
        console.error(`Directory does not exist: ${projectDir}`);
        process.exit(1);
    }

    checkSpawnResult(spawnSync("git", ["status"], {cwd: projectDir}), `Check for git repository in ${projectDir}`);

    const libDir = path.join(projectDir, "lib");
    if (!fs.existsSync(libDir)) {
        fs.mkdirSync(libDir);
    }

    const submoduleDir = path.join(libDir, "framework64");

    checkSpawnResult(spawnSync("git", ["submodule", "add", framework64Repo, "lib/framework64"], {cwd: projectDir}), "Add framework64 submodule");
    checkSpawnResult(spawnSync("git", ["submodule", "init"], {cwd: projectDir}), "Initialize framework64 submodule");
    checkSpawnResult(spawnSync("git", ["add", ".gitmodules"], {cwd: projectDir}), null);

    if (options.hasOwnProperty("branch")) {
        checkSpawnResult(spawnSync("git", ["checkout", options.branch], {cwd: submoduleDir}), `Checkout framework64 branch: ${options.branch}`);
        checkSpawnResult(spawnSync("git", ["add", "lib/framework64"], {cwd: projectDir}), null);
    }

    checkSpawnResult(spawnSync("git", ["commit", "-m", "Add framework64 submodule"], {cwd: projectDir}), "Create initial commit");

    checkSpawnResult(spawnSync("npm", ["run", "--prefix", "lib/framework64", "create-game", name, projectDir], {cwd: projectDir}), `Create game: ${name}`);
}


function checkSpawnResult(result, description) {
    if (logStdOut && result.stdout) {
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

    process.exit(1);
}

module.exports = create;