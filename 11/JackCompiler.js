const fs = require('fs');
const token = require('./JackTokenizer');
const engine = require('./CompilationEngine')
const Xmlwriter = require('./XMLWriter')
const Vmwriter = require('./VmWriter')
const symboltable = require('./SymbolTable')
const { Tokenizer } = token;
const { CompilationEngine } = engine;
const { xmlWriter } = Xmlwriter;
const { vmWriter } = Vmwriter;
const { buildSymbolTable } = symboltable;


let path = process.argv[2];

if (fs.lstatSync(path).isDirectory()) {
    fs.readdir(path, (err, files) => {
        files.forEach(file => {
            let tempArry = file.split('.')
            if (tempArry.pop() == 'jack') {
                let preName = tempArry.join('.')
                let data = fs.readFileSync(`${path}/${file}`, 'utf-8')

                let tokenizer = new Tokenizer(data);
                // printOut(tokenizer.output(), path + '/' + preName + 'T1', '.xml');

                let enginer = new CompilationEngine(tokenizer);
                let parserTree = enginer.getTree();

                // test xml
                printOut(xmlWriter(parserTree), path + '/' + preName + '1', '.xml');

                // build all symboltables
                buildSymbolTable(parserTree);

                // build xml use symboltable
                // printOut(xmlWriter(parserTree, true), path + '/' + preName + '2', '.xml');

                // // test vm
                printOut(vmWriter(parserTree), path + '/' + preName + '1', '.vm');
            }
        })
    })
} else {
    let file = path;
    let tempArry = file.split('.')
    tempArry.pop() 
    let preName = tempArry.join('.')

    fs.readFile(path, 'utf-8', (err, data) => {
        if (err) {
            throw err;
        }
        
        let tokenizer = new Tokenizer(data);
        printOut(tokenizer, preName + 'T1', '.xml');

        let enginer = new CompilationEngine(tokenizer);
        let parserTree = enginer.getTree();

        // test xml
        printOut(xmlWriter(parserTree), preName + '1', '.xml');

        // build all symboltables
        buildSymbolTable(parserTree);

        // build xml use symboltable
        // printOut(xmlWriter(parserTree, true), preName + '2', '.xml');

        // test vm
        printOut(vmWriter(parserTree), preName + '1', '.vm');
    })
}

function printOut(content, name, post) {
    fs.writeFileSync(name + post, content)
}