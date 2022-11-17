# Code taken and adapted from https://www.geeksforgeeks.org/python-sys-settrace/
from sys import settrace
from os import path
import inspect


callTrace = []


def tracer(frame, event, arg = None):

    global callTrace

    if event == 'call':

        code = frame.f_code
        # Get name of calling function from the outer frame
        caller = frame.f_back.f_code.co_name
        # Construct caller function name with arguments included
        caller = constructFuncName(caller, inspect.getargvalues(frame.f_back))
        # Get caller function module from the outer frame
        callerModule = frame.f_back.f_code.co_filename
        
        callerModule = path.relpath(callerModule)
        # Get name of callee function from current frame
        callee = code.co_name
        # Construct callee function name with arguments included
        callee = constructFuncName(callee, inspect.getargvalues(frame))
        # Get caller function module from the current frame
        calleeModule = code.co_filename

        calleeModule = path.relpath(calleeModule)

        # Ignore internal library calls
        if callerModule[0] == "<":
            return

        if calleeModule[0] == "<":
            return

        if caller != "<module>" and (caller[0] == "<" or callee[0] == "<"):
            return 

        callTraceDict = {
            "callee": callee,
            "calleeModule": calleeModule,
            "caller": caller,
            "callerModule": callerModule
        }

        callTrace.append(callTraceDict)
        
    return tracer


def constructFuncName(funcName, argsTuple):
    if funcName == "<module>":
        return funcName
    
    posArgs = argsTuple.args
    varArgs = argsTuple.varargs
    keywordArgs = argsTuple.keywords
    constructFunc = funcName + "("

    # If function has *args, add * in front of it
    if varArgs is not None:
        varArgs = "*" + varArgs
    # If function has **args, add ** in front of it
    if keywordArgs is not None:
        keywordArgs = "**" + keywordArgs
    
    # If function has positional arguments, add them first to parameters string
    if len(posArgs) > 0:
        for i in range(len(posArgs)):
            if i == 0:
                constructFunc = constructFunc + posArgs[i]
            else:
                constructFunc = constructFunc + ", " + posArgs[i]
    
    # If function has both positional arguments and *args, then add "," when adding *args to parameters string
    if varArgs is not None and len(posArgs) > 0:
        constructFunc = constructFunc + ", " + varArgs
    # Else if function only has *args, add them without "," to parameters string
    elif varArgs is not None:
        constructFunc = constructFunc + varArgs
    
    # If function has positional arguments or *args, and **args, then add "," when adding **args to parameters string
    if keywordArgs is not None and (varArgs is not None or len(posArgs) > 0):
        constructFunc = constructFunc + ", " + keywordArgs
    # Else if function only has **args, add them without "," to parameters string
    elif keywordArgs is not None:
        constructFunc = constructFunc +  keywordArgs

    return constructFunc + ")"
  
def fun():
    return "MOCK"
  
def check(x,a,*y,**z):
    abc = 1
    return fun()
  
settrace(tracer)