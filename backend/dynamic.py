import sys
import os
import tracer
import ast
from pathlib import Path
# Map of functions and their classes. Key is function name with arguments, value is list of classes/modules it belongs under
functionClassMap = {}
# Set of classes
classSet = set()


def functionGrab(className ,functionAst):
    functionName = functionAst.name
    # Add class set 
    classSet.add(className)
    # Grab the parameters
    posArgs = []
    varArgs = None
    keywordArgs = None
    for arg in functionAst.args.args:
        posArgs.append(arg.arg)
    if functionAst.args.vararg != None:
        varArgs = functionAst.args.vararg.arg
    if functionAst.args.kwarg != None:
        keywordArgs = functionAst.args.kwarg.arg

    funcName = tracer.constructFuncName(functionName,posArgs,varArgs,keywordArgs)
    
    # Check if function already exists in map, if it doesn't, add it
    key = functionClassMap.get(funcName)

    if key != None:
        functionClassMap.get(funcName).append(className)
    else:
        functionClassMap[funcName] = [className]


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

# Get path from command line arguments and insert it into the system
dir_path = os.path.dirname(os.path.realpath(sys.argv[1]))
sys.path.insert(0, dir_path)
# Read the directory of the target program to produce map of user defined classes/modules and their functions
readRepo(dir_path + "\\")
# Pass map to tracer script and start the tracing
tracer.setGlobals(functionClassMap,classSet)
tracer.start()
# Get path to target program from command line arguments
targetPath = sys.argv[1]
# Get name of entry point file
targetEntryPoint = Path(targetPath).name
# Get command line arguments for target program, if any
targetCmdArgs = sys.argv[2:]
finalTargetCmdArgs = [targetEntryPoint]
for arg in targetCmdArgs:
    finalTargetCmdArgs.append(arg)
# Manually set command line arguments so that they are available for target program execution
sys.argv = finalTargetCmdArgs
exec(open(targetPath).read())
tracer.fillInEntry(targetEntryPoint)
print(tracer.callTrace)
print("\n")
print(functionClassMap)
print("\n")
print(classSet)
