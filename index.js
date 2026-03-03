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
                    let [name, date, ...text] = todo.split(';');
                    body = {name: name.toLowerCase(), date : date.trim(), text: text.join(';').trim()};
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

function getImportantComments() {
    return todos.filter(todo => todo.important);
}

function showImportantCommand() {
    showComments(getImportantComments());
}

function getUserComments(username) {
    return todos.filter(todo => todo.body?.name === username);
}

function formatColumn(str, maxLength) {
    const formatted = str.length > maxLength ? str.substring(0, maxLength - 3) + '...' : str;
    return formatted.padEnd(maxLength, ' ');
}

function showComments(comments) {
    for (const comment of comments)
    {
        const importanceColumn = comment.important ? '!' : ' ';
        const usernameColumn = comment.body.name ? formatColumn(comment.body.name, 10) : formatColumn('', 10);
        const dateColumn = comment.body.data ? formatColumn(comment.body.data, 12) : formatColumn('', 12);
        const commentColumn = formatColumn(comment.body.text, 50);
        console.log(`${importanceColumn}  |  ${usernameColumn}|  ${dateColumn}|  ${commentColumn}`);
    }
}

function showUserCommand(username) {
    if (username === undefined) {
        console.log('Please, write username!');
        return;
    }
    const userComments = getUserComments(username.toLowerCase());
    showComments(userComments);
}

function countSubstr(str, sub) {
    if (sub === "") return 0;
    return str.split(sub).length - 1;
}

function sortCommand(args) {
    if (args === 'importance') {
        const todosCopy = todos.splice(0).sort((a, b) => countSubstr(b.body.text, '!') - countSubstr(a.body.text, '!'));
        for (const todo of todosCopy) {
            console.log(todo.body.text);
        }       
    }
    else if (args === 'user') {
        for (const todo of todos.splice(0).sort((a, b) => {
            if (a.body.name && b.body.name) {
                return a.body.name.localeCompare(b.body.name);
            }
            return 0;
        })) {
            console.log(todo.body.text);
        }
    }
    else if (args === 'date') {
        for (const todo of todos.splice(0).sort((a, b) => {
            if (a.body.date && b.body.date) {
                return new Date(b.body.date) - new Date(a.body.date);
            }
            return 0;
        })) {
            console.log(todo.body.text);
        }
    }
    else{
        console.log('wrong command');
    }
}

function dateCommand(...args) {
    let dateString = '';
    for (const arg of args) {
        dateString += arg + '-';
    }
    dateString = dateString.slice(0, -1);
    const date = new Date(dateString);
    for (const todo of todos.filter(todo => todo.body.date && new Date(todo.body.date) > date)) {
        console.log(todo.body.text);
    }
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
            showComments(todos);
            break;
        case 'sort':
            sortCommand(args[0]);
            break;
        case 'date':
            dateCommand(...args);
            break;
        default:
            console.log('wrong command');
            break;
    }
}


// TODO you can do it!
