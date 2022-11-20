# Code taken and adapted from https://www.geeksforgeeks.org/python-sys-settrace/
from sys import settrace
from os import path
import inspect


callTrace = []
classFunctionMap = None

def tracer(frame, event, arg = None):
    global callTrace
    if event == 'call':
        code = frame.f_code
        # Attempt to get name of calling function from the outer frame
        outerFrame = None
        caller = None
        callerClass = None
        try:
            outerFrame = frame.f_back
            # Get caller function module from the outer frame if it exists
            caller = outerFrame.f_code.co_name
            # Construct caller function name with arguments included
            caller = constructFuncName(caller,inspect.getargvalues(outerFrame))
            
            # If the function exists in a class, check if it is user defined
            callerClass = outerFrame.f_locals['self'].__class__.__name__
            result = searchClassFunctionMap(callerClass)
            
            # If the class is user defined, set it as the caller class
            if callerClass != None:
                callerClass = result["class"]
            else:
                raise Exception("Go to last block")
        except KeyError:
            # If the caller function does not belong to a class, set the caller and callerClass to whatever the trace says it is for now
            # and check it when validating callee
            caller = outerFrame.f_code.co_name
            caller = constructFuncName(caller,inspect.getargvalues(outerFrame))
            callerClass = frame.f_back.f_code.co_filename
            callerClass = path.relpath(callerClass)
        except:
            # If outer frame does not exist, set caller and callerClass to None
            caller = None
            callerClass = None

        # Get name of callee function from current frame
        callee = code.co_name
        # Construct callee function name with arguments included
        callee = constructFuncName(callee, inspect.getargvalues(frame))
        calleeClass = None
        # Get caller function module from the current frame
        try:
            # Check if callee function is a class
            calleeClass = frame.f_locals['self'].__class__.__name__
            result = searchClassFunctionMap(calleeClass)
            if result == None:
                raise Exception("Go to last block")
        except:
            # If callee function does not belong to a class, check if it belongs to a user defined module
            calleeClass = code.co_filename
            calleeClass = path.relpath(calleeClass)
            result = searchClassFunctionMap(calleeClass)
            if result == None:
                if callee == "<module>" or calleeClass == "<string>":
                    pass
                else:
                    return
                if caller == "<module>" or callerClass == "<string>":
                    # Try to guess which class or module the function belongs to
                    result = findClassOfFunction(callee)
                    if result != None:
                        calleeClass = result
                    if caller != "<module>":
                        result2 = findClassOfFunction(caller)

                        if result2 != None:
                            callerClass = result2
                
                else:
                    # If caller is not either <module> or <string> this means the function call did not orignate from a user defined 
                    # class or module, so we skip it
                    return 

        callTraceDict = {
            "callee": callee,
            "calleeClass": calleeClass,
            "caller": caller,
            "callerClass": callerClass
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
                constructFunc = constructFunc + "," + posArgs[i]
    
    # If function has both positional arguments and *args, then add "," when adding *args to parameters string
    if varArgs is not None and len(posArgs) > 0:
        constructFunc = constructFunc + "," + varArgs
    # Else if function only has *args, add them without "," to parameters string
    elif varArgs is not None:
        constructFunc = constructFunc + varArgs
    
    # If function has positional arguments or *args, and **args, then add "," when adding **args to parameters string
    if keywordArgs is not None and (varArgs is not None or len(posArgs) > 0):
        constructFunc = constructFunc + "," + keywordArgs
    # Else if function only has **args, add them without "," to parameters string
    elif keywordArgs is not None:
        constructFunc = constructFunc +  keywordArgs

    return constructFunc + ")"


def searchClassFunctionMap(className):
    for classFunc in classFunctionMap:
        # If the class is a user defined class or module, return the class or module name
        if classFunc["class"] == className:
            return className

    return None

def findClassOfFunction(function):
    for classFunc in classFunctionMap:
        className = classFunc["class"]
        funcName = classFunc["functionName"]
        funcArgs = classFunc["args"]
        args = []
        # Guess class or module
        if function != "<module>":
            # Get args
            args = function[function.find("(")+1:function.rfind(")")]
            args = args.split(",")
            if (args == ['']):
                args = []
                        
        lastThree = className[len(className)-3:len(className)]
        if lastThree == ".py":
            strippedFunction = function[0:function.find("(")]
        
            if strippedFunction == funcName and args == funcArgs:
                return className

    return None

def setGlobal(map):
    
    global classFunctionMap

    classFunctionMap = map


def start():
    settrace(tracer)
