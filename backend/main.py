import sys
import os
import ast
import json

functionClassMap = []
functionDefinitions = []

def functionGrab(className ,functionAst):
    # print("grabbing a function from "+ className)
    # print(ast.dump(functionAst, indent=4))
    functionName = functionAst.name

    # Add to function definitions map
    functionDefinitions.append(functionName)

    # Grab the parameters
    functionArgs = []
    for arg in functionAst.args.args:
        functionArgs.append(arg.arg)

    # Creates our object
    functionObj = {
        "class": className,
        "functionName": functionName,
        "args": functionArgs
    }
    # Appends to the map
    functionClassMap.append(functionObj)

def classGrab(classAst):
    iterateClass(classAst)

def iterateClass(classAst):
    className = classAst.name
    for x in classAst.body:
        match x.__class__:
            case ast.FunctionDef:
                functionGrab(className, x)
            case ast.ClassDef:
                classGrab(x)

def readRepo(repo):
    # Open the module with the trace function and retrieve its AST
    directoryArr = os.listdir(repo)
    print(directoryArr)

    for fileName in directoryArr:
        file = repo+fileName
        # print(file)
        tracerFile = open(file,'r').read()
        tracerTree = ast.parse(tracerFile)
        # print(ast.dump(tracerTree, indent=4))
        for x in tracerTree.body:
            match x.__class__:
                case ast.FunctionDef:
                    functionGrab(fileName,x)
                case ast.ClassDef:
                    classGrab(x)
    print(functionClassMap)
    print(functionDefinitions)

def main():
    args = sys.argv[1:]
    readRepo(sys.argv[1])
    jsonOutput = json.dumps(functionClassMap, indent=4)
    with open('../frontend/src/data/tempStatic.json', 'w+') as outfile:
        outfile.write(jsonOutput)

main()