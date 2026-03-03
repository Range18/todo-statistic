const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}


var todos = []

function processFiles() {
    for (const line of files) {
        if (line.includes('TODO')) {
            const todo = line.substring(line.indexOf('TODO') + 4).trim();
            todos.push(todo);
        }
    }
}

function processCommand(command) {  
    switch (command) {
        case 'exit':
            process.exit(0);
            break;
        default:
            console.log('wrong command');
            break;
    }
}


// TODO you can do it!
