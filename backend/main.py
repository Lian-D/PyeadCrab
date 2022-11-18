import sys
import os
import ast
import json

# This is a function class map we use to confirm our data
functionClassMap = []
# This is a function definition table of our valid functions
functionDefinitions = []

# Parser function from https://stackoverflow.com/questions/72064609/how-can-i-retrieve-function-names-and-attributes-from-python-code-with-ast 
# for getting function calls, 
def parse(d, c):
  def parse_chain(d, c, p=[]):
     if isinstance(d, ast.Name):
        # print(p)
        # print(ast.dump(d))
        return [d.id]+p
     if isinstance(d, ast.Call):
        for i in d.args:
           parse(i, c)
        # print(c)
        return parse_chain(d.func, c, p)
     if isinstance(d, ast.Attribute):
        print([d.attr]+p)
        return parse_chain(d.value, c, [d.attr]+p)
  if isinstance(d, (ast.Call, ast.Attribute)):
    #  print(ast.dump(d))
    #  print(c)
     c.append('.'.join(parse_chain(d, c)))
  else:
     for i in getattr(d, '_fields', []):
       if isinstance(t:=getattr(d, i), list):
          for i in t:
             parse(i, c)
       else:
          parse(t, c)


def functionGrab(className ,functionAst):
    functionName = functionAst.name
    # print(ast.dump(functionAst, indent=4))

    # Add to function definitions map
    functionDefinitions.append(functionName)
    functionDefinitions.append(className+"."+functionName)

    # Grab the parameters
    functionArgs = []
    for arg in functionAst.args.args:
        functionArgs.append(arg.arg)

    # if functionAst.args.vararg != None:
    #     functionArgs.append("*" + functionAst.args.vararg.arg)

    # if functionAst.args.kwarg != None:
    #     functionArgs.append("**" + functionAst.args.kwarg.a)
    # Grabs the functions that are called
    callsArr = []
    parse(functionAst, callsArr)
    # Raw List of functions calls checked against our defined functions module
    # callsArr = [value for value in callsArr if value in functionDefinitions]

    # Creates our object
    functionObj = {
        "class": className,
        "functionName": functionName,
        "args": functionArgs,
        "functionCalls": callsArr
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
        tracerFile = open(file,'r').read()
        tracerTree = ast.parse(tracerFile)

        for x in tracerTree.body:
            match x.__class__:
                case ast.FunctionDef:
                    functionGrab(fileName,x)
                case ast.ClassDef:
                    classGrab(x)
    print(functionClassMap)
    print(functionDefinitions)

def createForceGraphStructure(): 
    pass

def main():
    args = sys.argv[1:]
    readRepo(sys.argv[1])
    jsonOutput = json.dumps(functionClassMap, indent=4)
    with open('../frontend/src/data/tempStatic.json', 'w+') as outfile:
        outfile.write(jsonOutput)

main()