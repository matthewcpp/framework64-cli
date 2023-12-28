# framework64-cli

This package contains command line tools for [framework64](https://github.com/matthewcpp/framework64).

### Creating a new game

The `create` command will handle the creation of a new framework64 game by adding the library as a submodule located at `lib/framework64` and create a minimal example project.

Basic usage:
```bash
./framework64-cli create [projectDirectory] [projectName]
```

##### Usage examples:
Command Argument specification:
```bash
npm install -g @matthewcpp/framework64-cli
mkdir -p  /path/to/mygame
./framework64-cli create /path/to/mygame mygame
```
Default Arguments:
```bash
cd /path/to/mygame
npm install @matthewcpp/framework64-cli
npx framework64-cli create
```

Command Arguements:
|Name|Description|
|----|-----|
`projectDirectory`| The project directory.  If omitted the current working directory will be used
`projectName` | The name of the project.  If omitted the project's directory name will be used

Command Options:
|Name|Description|
|----|-----|
|`--init`| Initialize a git repository in the project directory.
|`--framework-branch`| The framework64 brach to checkout after setting up the submodule.  The default branch is `main`.
|`--starter-branch`| The starter project branch to use.  The default branch is `main`.
|`--verbose`| Enable verbose command output