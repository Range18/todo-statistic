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
                const isImportant = todo.includes('!');
                let body;
                if (todo.includes(';')){
                    let [name, data, ...text] = todo.split(';');
                    body = {name: name.toLowerCase(), data, text};
                }
                else {
                    body = {text : todo};
                }
                todos.push({
                    body: body,
                    important: isImportant,
                });
            }
        }
    }
}


function showCommand() {
    for (const todo of todos)
        console.log(todo.body.text);
}

function showImportantCommand() {
    for (const todo of todos.filter(todo => todo.important))
        console.log(todo.body.text);
}

function getUserComments(username) {
    return todos.filter(todo => todo.body?.name === username);
}

function showComments(comments) {
    for (const comment of comments)
        console.log(comment.body.text);
}

function showUserCommand(username) {
    if (username === undefined) {
        console.log('Please, write username!');
        return;
    }
    const userComments = getUserComments(username.toLowerCase());
    showComments(userComments);
}

function processCommand(command, ...args) {
    processFiles();
    switch (command) {
        case 'user':
            showUserCommand(args[0]);
            break;
        case 'exit':
            process.exit(0);
        case 'important':
            showImportantCommand();
            break;
        case 'show':
            showCommand();
            break;
        case 'sort':
            break;
        default:
            console.log(todos);
            console.log('wrong command');
            break;
    }
}


// TODO you can do it!
