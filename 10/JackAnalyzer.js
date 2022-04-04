const fs = require('fs');
const token = require('./JackTokenizer');
const engine = require('./CompilationEngine')
const { Tokenizer } = token;
const { CompilationEngine } = engine;

let path = process.argv[2];

if (fs.lstatSync(path).isDirectory()) {
    fs.readdir(path, (err, files) => {
        files.forEach(file => {
            let tempArry = file.split('.')
            if (tempArry.pop() == 'jack') {
                let preName = tempArry.join('.')
                let data = fs.readFileSync(`${path}/${file}`, 'utf-8')

                let tokenizer = new Tokenizer(data);
                printOut(tokenizer.output(), path + '/' + preName + 'T1');

                let parserTree = new CompilationEngine(tokenizer);
                printOut(parserTree.output(), path + '/' + preName + '1');
                
            }
        })
    })
} else {
    let file = path;
    let tempArry = file.split('.')
    tempArry.pop() 
    let preName = tempArry.join('.')

    fs.readFile(preName, 'utf-8', (err, data) => {
        if (err) {
            throw err;
        }
        
        let tokenizer = new Tokenizer(data);
        printOut(tokenizer, preName + 'T1');

        let parserTree = new CompilationEngine(tokenizer);
        printOut(parserTree, preName + '1');
    })
}

function printOut(content, name) {
    fs.writeFileSync(name + '.xml', content)
}