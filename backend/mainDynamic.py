import sys
import os
import tracer
import ast
from pathlib import Path

functionClassMap = []
# This is a function definition table of our valid functions
functionDefinitions = []

def functionGrab(className ,functionAst):
    functionName = functionAst.name

    # Add to function definitions map
    functionDefinitions.append(functionName)
    functionDefinitions.append(className+"."+functionName)

    # Grab the parameters
    functionArgs = []
    for arg in functionAst.args.args:
        functionArgs.append(arg.arg)

    if functionAst.args.vararg != None:
        functionArgs.append("*" + functionAst.args.vararg.arg)

    if functionAst.args.kwarg != None:
        functionArgs.append("**" + functionAst.args.kwarg.arg)

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
    

    for fileName in directoryArr:
        try:
            file = repo+fileName
            tracerFile = open(file,'r').read()
            tracerTree = ast.parse(tracerFile)

            for x in tracerTree.body:
                match x.__class__:
                    case ast.FunctionDef:
                        functionGrab(fileName,x)
                    case ast.ClassDef:
                        classGrab(x)
        except:
            pass



dir_path = os.path.dirname(os.path.realpath(sys.argv[1]))

sys.path.insert(0, dir_path)

readRepo(dir_path + "\\")

tracer.setGlobal(functionClassMap)
tracer.start()

exec(open(sys.argv[1]).read())


trace = tracer.callTrace

# Clean up data and make guesses where appropriate
# Perform class checking one more time as a sanity check
for traceObj in trace:
    if traceObj["caller"] == "<module>" and traceObj["callerClass"] == "<string>":
        traceObj["callerClass"] = Path(sys.argv[1]).name
    

print(tracer.callTrace)
print(functionClassMap)
# print(functionDefinitions)

