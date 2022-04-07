const fs = require("fs");
const path = require("path");
const {spawnSync} = require("child_process");

const framework64Repo ="https://github.com/matthewcpp/framework64.git";

function create(name, projectDir, options) {
    if (fs.existsSync(projectDir)) {
        console.log(`framework64 project directory: ${projectDir}`);
    }
    else {
        console.log(`Directory does not exist: ${projectDir}`);
        process.exit(1);
    }

    checkSpawnResult(spawnSync("git", ["status"], {cwd: projectDir}), `Check for git repository in ${projectDir}`);

    const libDir = path.join(projectDir, "lib");
    if (!fs.existsSync(libDir)) {
        fs.mkdirSync(libDir);
    }

    checkSpawnResult(spawnSync("git", ["submodule", "add", framework64Repo, "lib/framework64"], {cwd: projectDir}), "Add framework64 submodule");
    checkSpawnResult(spawnSync("git", ["submodule", "init"], {cwd: projectDir}), "Initialize framework64 submodule");
    checkSpawnResult(spawnSync("git", ["add", "-A"], {cwd: projectDir}), null);
    checkSpawnResult(spawnSync("git", ["commit", "-m", "Add framework64 submodule"], {cwd: projectDir}), "Create initial commit");

    if (options.hasOwnProperty("branch")) {
        const branch = options.branch;
        console.log(`checkout branch: : ${branch}`)
    }
}


function checkSpawnResult(result, description) {
    if (result.status === 0) {
        if (description)
            console.log(`${description}: OK`);

        return;
    }

    console.log(`${description}: Error`);
    if (result.stderr && result.stderr.length > 0) 
        console.log(result.stderr.toString());

    process.exit(1);
}

module.exports = create;