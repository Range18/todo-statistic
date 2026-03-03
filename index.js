const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');
const fs = require('fs');

const files = getFiles();

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

const commentStartWith = JSON.parse(fs.readFileSync('secret.json', 'utf8'))["commentStartWith"];

var todos = [];

function processFiles() {
    for (const file of files) {
        for (const line of file.split('\n')) {
            if (line.includes(commentStartWith)) {
                const todoIndex = line.indexOf(commentStartWith) + 7;
                const todo = line.substring(todoIndex).trim();
                if (todo.includes('!')) {
                    todos.push(
                        {
                            body: todo,
                            important: true,
                        }
                    )
                }
                else {
                    todos.push(
                        {
                            body: todo,
                            important: false,
                        }
                    )
                }
            }
        }
    }
}

function showCommand() {
    for (const todo of todos)
        console.log(todo.body);
}

function showImportantCommand() {
    for (const todo of todos.filter(todo => todo.important))
        console.log(todo.body);
}

function processCommand(command) {
    processFiles();
    switch (command) {
        case 'exit':
            process.exit(0);
        case 'important':
            showImportantCommand();
            break;
        case 'show':
            showCommand();
            break;
        default:
            console.log(todos);
            console.log('wrong command');
            break;
    }
}


// TODO you can do it!
