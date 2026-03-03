const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

var todos = [];

function processFiles() {
    for (const line of files) {
        if (line.includes('TODO')) {
            const todo = line.substring(line.indexOf('TODO') + 4, line.indexOf('\\n')).trim();
            if (!todos.includes(todo))
            {
                todos.push(todo);
            }
        }
    }
}

function showCommand() {
    for (const todo of todos)
        console.log(todo);
}

function processCommand(command) {
    processFiles();
    switch (command) {
        case 'exit': {
            process.exit(0);
            break;
        }
        case 'show':
            showCommand();
            break;
        default:
            console.log('wrong command');
            break;
    }
}


// TODO you can do it!
