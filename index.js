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
            const todoIndex = line.indexOf('TODO') + 4;
            const todo = line.substring(todoIndex, line.indexOf('\n', todoIndex)).trim();
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

function showCommand() {
    for (const todo of todos)
        console.log(todo);
}

function processCommand(command) {
    processFiles();
    switch (command) {
        case 'exit': {
            process.exit(0);
        case 'important':
            console.log(todos.filter(todo => todo.important));
            break;
        case 'show':
            console.log(todos.filter(todo => !todo.important));
            break;
        }
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
