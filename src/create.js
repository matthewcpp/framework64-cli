const download = require("download");
const tmp = require('tmp');
const fse = require("fs-extra");

const fs = require("fs");
const path = require("path");
const {spawnSync} = require("child_process");

const framework64Repo ="https://github.com/matthewcpp/framework64.git";
const framework64StarterUrlBase = "https://github.com/matthewcpp/framework64-starter/archive/refs/heads/";

async function create(projectDir, name, options) {
    const libDir = path.join(projectDir, "lib");
    const submoduleDir = path.join(libDir, "framework64");
    const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';

    console.log(`Creating framework64 game: ${name}`);

    if (fse.existsSync(projectDir)) {
        console.log(`framework64 project directory: ${projectDir}`);
    }
    else {
        if (options.init) {
            fs.mkdirSync(projectDir);
            console.log(`Created game directory: ${projectDir}`);
        }
        else {
            console.error(`Directory does not exist: ${projectDir}`);
            process.exit(1);
        }
    }

    const gitStatusResult = spawnSync("git", ["status"], {cwd: projectDir})

    if (options.init && gitStatusResult.status != 0) {
        spawnSyncCommand("git", ["init"], {cwd: projectDir}, "Initialize git repository in project directory", options);
    }
    else {
        checkSpawnResult(gitStatusResult, `Check for git repository in ${projectDir}`, options);
    }

    if (!fse.existsSync(libDir)) {
        fse.mkdirSync(libDir);
    }

    spawnSyncCommand("git", ["submodule", "add", framework64Repo, "lib/framework64"], {cwd: projectDir}, "Add framework64 submodule", options);
    spawnSyncCommand("git", ["submodule", "init"], {cwd: projectDir}, "Initialize framework64 submodule", options);
    spawnSyncCommand("git", ["add", ".gitmodules"], {cwd: projectDir}, null, options);

    if (options.hasOwnProperty("frameworkBranch")) {
        spawnSyncCommand("git", ["switch", options.frameworkBranch], {cwd: submoduleDir}, `Checkout framework64 branch: ${options.frameworkBranch}`, options);
        spawnSyncCommand("git", ["add", "lib/framework64"], {cwd: projectDir}, null, options);
    }

    spawnSyncCommand("git", ["commit", "-m", "Add framework64 submodule"], {cwd: projectDir}, "Create initial commit", options);

    await downloadStarterProject(projectDir, name, options)
}

async function downloadStarterProject(targetDir, name, options) {
    const starterBranch = options.hasOwnProperty("starterBranch") ? options.starterBranch : "main";
    const starterProjectFileName = `${starterBranch}.zip`
    const framework64StarterUrl = framework64StarterUrlBase + starterProjectFileName;

    const description = `Downloading and configuring starter project from: ${framework64StarterUrl}`;
    const tmpobj = tmp.dirSync();
    console.log(description);

    await download(framework64StarterUrl, tmpobj.name, {
        extract: true
    });
    
    const extractedDirName = `framework64-starter-${starterBranch}`;
    const extractedRepoDir = path.join(tmpobj.name, extractedDirName);
    extractedRepoGameDir = path.join(extractedRepoDir, "game");

    const configureScriptPath = path.join(extractedRepoDir, "scripts", "ConfigureProject");
    require(configureScriptPath)(name, extractedRepoGameDir);

    fse.copySync(extractedRepoGameDir, targetDir);

    console.log(`${description}: OK`);
}

function spawnSyncCommand(command, args, env, description, options) {
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