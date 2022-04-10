let classScope = null;
let functionScope = null;
let declaredMap = {};
let usedMap = {};
let curParentNodeType = null;
let curParentNode = null;

function buildSymbolTable(root) {
    let visit = (node) => {
        if (!node.isSuperNode) {
            if (curParentNodeType === 'term') {
                if (node.type === 'identifier') {
                    usedMap[node.value] = true;
                }
            }
        } else {
            curParentNode = node;
            curParentNodeType = node.type;

            if (node.type === 'class') {
                node.scope = classScope = new ScopeTable();
                node.declaredMap = declaredMap;
            }
            if (node.type === 'subroutineDec') {
                node.scope = functionScope = new ScopeTable(classScope);
            }
            if (node.type === 'classVarDec') {
                if (node.childrens.length) {
                    let i = 0;
                    let kind =  node.childrens[i].value.toUpperCase();
                    let type = node.childrens[i+1].value
                    classScope.Define(node.childrens[i+2].value, type, kind);
                    i += 3;
                    while (node.childrens[i].value !== ';') {
                        i += 1;
                        classScope.Define(node.childrens[i].value, type, kind);
                        i += 1;
                    }
                }
            } else if (node.type === 'parameterList') {
                if (node.childrens.length) {
                    let i = 0;
                    while(i < node.childrens.length) {
                        functionScope.Define(node.childrens[i+1].value, node.childrens[i].value, 'ARG');
                        i += 2;
                        if (i < node.childrens.length && node.childrens[i].value === ',') {
                            i += 1;
                        }
                    }
                }
            } else if (node.type === 'varDec') {
                if (node.childrens.length) {
                    let i = 0;
                    let kind =  node.childrens[i].value.toUpperCase();
                    let type = node.childrens[i+1].value
                    functionScope.Define(node.childrens[i+2].value, type, kind);
                    declaredMap[node.childrens[i+2].value] ={
                        declared: true,
                        used: false
                    };
                    i += 3;
                    while (node.childrens[i].value !== ';') {
                        i += 1;
                        functionScope.Define(node.childrens[i].value, type, kind);
                        declaredMap[node.childrens[i].value] ={
                            declared: true,
                            used: false
                        };
                        i += 1;
                    }
                }
            }
            else {
                if (node.childrens.length) {
                    for(let i=0;i<node.childrens.length;i++) {
                        visit(node.childrens[i]);
                    }
                }
            }
        }
    }
    visit(root);
    Object.keys(declaredMap).forEach(key => {
        if (usedMap[key]) {
            declaredMap[key].used = true;
        }
    })
}

class ScopeTable {
    constructor(preScope) {
        this.preScope = preScope;
        this.map = {};
        this.staticIndex = 0;
        this.fieldIndex = 0;
        this.argIndex = 0;
        this.varIndex = 0;
    }

    startSubroutine() {

    }

    Define(name, type, kind) {
        let index = 0;
        if (kind === 'STATIC') {
            index = this.staticIndex++;
        } else if (kind === 'FIELD') {
            index = this.fieldIndex++;
        } else if (kind === 'VAR') {
            index = this.varIndex++;
        } else {
            index = this.argIndex++;
        }
        this.map[name] = new Symbol(name, type, kind, index);
    }

    varCount(kind) {
        if (kind === 'STATIC') {
            return this.staticIndex;
        } else if (kind === 'FIELD') {
            return this.fieldIndex;
        } else if (kind === 'VAR') {
            return this.varIndex;
        } else {
            return this.argIndex;
        }
    }

    Kindof(name) {
        let scope = this;
        let kind = null;
        while(scope) {
            kind = (scope.map[name] && scope.map[name].getKind()) || null;
            if (kind === null) {
                scope = scope.preScope;
            } else {
                break;
            }
        }
        return kind;
    }

    TypeOf(name) {
        let scope = this;
        let type = null;
        while(scope) {
            type = (scope.map[name] && scope.map[name].getType());
            if (type === undefined) {
                scope = scope.preScope;
            } else {
                break;
            }
        }
        return type;
    }

    IndexOf(name) {
        let scope = this;
        let index = null;
        while(scope) {
            index = (scope.map[name] && scope.map[name].getIndex());
            if (index === undefined) {
                scope = scope.preScope;
            } else {
                break;
            }
        }
        return index;
    }
}

class Symbol {
    constructor(name, type, kind, index) {
        this.name = name;
        this.type = type;
        this.kind = kind;
        this.index = index;
    }

    getName() {
        return this.name;
    }

    getType() {
        return this.type;
    }

    getKind() {
        return this.kind;
    }

    getIndex() {
        return this.index;
    }
}

module.exports = {
    buildSymbolTable
}