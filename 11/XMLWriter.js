let curScope = null;
let curParentNodeType = null;
let curParentNode = null;
let declaredMap = {};

function xmlWriter(root, useTable = false) {
    
    let out = '';
    let xmlVisit = (node, space) => {
        if (!node.isSuperNode) {
            if (node.type === 'identifier') {
                if (useTable) {
                    if (curParentNodeType === 'class' || curParentNodeType === 'subroutineDec') {
                        if (curParentNodeType === 'class') {
                            out += ' '.repeat(space) + `<${node.type}> ${node.value} [kind: CLASSNAME] </${node.type}>` + '\n';
                        } else if (curParentNodeType === 'subroutineDec'){
                            let curNodeIndex = curParentNode.childrens.findIndex(n => n === node);
                            if (curNodeIndex < curParentNode.childrens.length - 1 && curParentNode.childrens[curNodeIndex + 1].type === 'identifier') {
                                out += ' '.repeat(space) + `<${node.type}> ${node.value} [kind: CLASSNAME] </${node.type}>` + '\n';
                            } else {
                                out += ' '.repeat(space) + `<${node.type}> ${node.value} [kind: SUBROUTINENAME] </${node.type}>` + '\n';
                            }
                        }
                    } else {
                        let name = node.value;
                        let scope = curScope;
                        let kind = null;
                        while(scope) {
                            kind = scope.Kindof(name);
                            if (kind === null) {
                                scope = scope.preScope;
                            } else {
                                break;
                            }
                        }
                        if (kind === null) {
                            // can not find this name from symboltable
                            if (curParentNodeType === 'varDec') {
                                out += ' '.repeat(space) + `<${node.type}> ${node.value} [kind: CLASSNAME] </${node.type}>` + '\n';
                            }
                            else {
                                let curNodeIndex = curParentNode.childrens.findIndex(n => n === node);
                                if (curNodeIndex < curParentNode.childrens.length - 1 && curParentNode.childrens[curNodeIndex + 1].value === '.') {
                                    out += ' '.repeat(space) + `<${node.type}> ${node.value} [kind: CLASSNAME] </${node.type}>` + '\n';
                                } else {
                                    if (curNodeIndex < curParentNode.childrens.length - 1 && curParentNode.childrens[curNodeIndex + 1].value === '(') {
                                        out += ' '.repeat(space) + `<${node.type}> ${node.value} [kind: SUBROUTINENAME] </${node.type}>` + '\n';
                                    } else {
                                        out += ' '.repeat(space) + `<${node.type}> ${node.value} [kind: unkown] </${node.type}>` + '\n';
                                    }
                                }
                                // out += ' '.repeat(space) + `<${node.type}> ${node.value} [kind: unkown | used: unkown] </${node.type}>` + '\n';
                            }
                        } else {
                            let d = (declaredMap[node.value] && declaredMap[node.value].declared) || false;
                            let u = (declaredMap[node.value] && declaredMap[node.value].used) || false;
                            let index = scope.IndexOf(name);
                            out += ' '.repeat(space) + `<${node.type}> ${node.value} [kind: ${kind} | index: ${index} | declared: ${d} | used: ${u}] </${node.type}>` + '\n';
                        }
                    }
                    
                } else {
                    out += ' '.repeat(space) + `<${node.type}> ${node.value} </${node.type}>` + '\n';
                }
            } else {
                out += ' '.repeat(space) + `<${node.type}> ${node.value} </${node.type}>` + '\n';
            }
        } else {
            curParentNode = node;
            curParentNodeType = node.type;
            if (curParentNodeType === 'class') {
                curScope = node.scope;
                declaredMap = node.declaredMap;
            } else if (curParentNodeType === 'subroutineDec') {
                curScope = node.scope;
            }
            out += ' '.repeat(space) + `<${node.type}>` + '\n';
            if (node.childrens.length) {
                for(let i=0;i<node.childrens.length;i++) {
                    xmlVisit(node.childrens[i], space+2);
                }
            }
            out += ' '.repeat(space) + `</${node.type}>` + '\n';
        }
    }
    xmlVisit(root, 0);
    return out;
}

module.exports = {
    xmlWriter
}