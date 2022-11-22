# Code taken and adapted from https://www.geeksforgeeks.org/python-sys-settrace/
from sys import settrace
from os import path
import inspect
from pathlib import Path
import copy
import random

callTrace = []
classFunctionMap = None

def tracer(frame, event, arg = None):

    global callTrace

    if event == 'call':

        code = frame.f_code
        #Try to get name of calling function from the outer frame
        outerFrame = None
        caller = None
        callerClass = None
        try:
            outerFrame = frame.f_back
            caller = outerFrame.f_code.co_name
            # Construct caller function name with arguments included
            caller = constructFuncName(caller, inspect.getargvalues(outerFrame))
            # Get caller function class if it exists from the outer frame
            callerClass = outerFrame.f_locals['self'].__class__.__name__
        except KeyError:
            # If we get a key error, that means the function does not belong to a class, but a module
            outerFrame = frame.f_back
            caller = outerFrame.f_code.co_name
            caller = constructFuncName(caller, inspect.getargvalues(outerFrame))
            callerClass = outerFrame.f_code.co_filename
            callerClass = Path(callerClass).name
        except:
            # Any other error means that the outer frame does not exist
            pass

        # Get name of callee function from current frame
        callee = code.co_name
        # Construct callee function name with arguments included
        callee = constructFuncName(callee, inspect.getargvalues(frame))
        calleeClass = None
        # Get caller function class or module from the current frame
        try:
            calleeClass = frame.f_locals['self'].__class__.__name__
        except:
            calleeClass = code.co_filename
            calleeClass = Path(calleeClass).name


        callTraceDict = {
            "callee": callee,
            "calleeClass": calleeClass,
            "caller": caller,
            "callerClass": callerClass
        }
        
        res = isUserDefined(callTraceDict)
        if res != None:
            callTrace.append(res)
        
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

# Returns a dictionary if user defined functions are involved, returns None otherwise
def isUserDefined(traceObj):
    traceCopy = traceObj.copy()
    callee = traceCopy["callee"]
    calleeClass = traceCopy["calleeClass"]
    caller = traceCopy["caller"]
    callerClass  = traceCopy["callerClass"]

    # If callerClass is <string> then it is possible that the entry point script is calling a function
    if callerClass == "<string>":
        # Check if the function being called is a user defined function
        if caller == "<module>":
            # If caller is <module> then we know for sure that it is the entry point script calling a function
            # Check if the callee function is a user defined one
            userDefinedClass1 = findClassOfFunction(callee)
            # If the class of the callee is user defined, set it and return the object
            if userDefinedClass1 != None:
                traceCopy["calleeClass"] = userDefinedClass1
                return traceCopy
            else:
                return None
        else:
            # If caller is not <module>, check if it is user defined. If not user defined, then we discard it
            userDefinedClass2 = findClassOfFunction(caller)
            if userDefinedClass2 != None:
                # If caller is user defined, set the caller class and check callee
                traceCopy["callerClass"] = userDefinedClass2
                userDefinedClass3 = findClassOfFunction(callee)
                if userDefinedClass3 != None:
                    # If the class of the callee is user defined, set it and return the object
                    traceCopy["calleeClass"] = userDefinedClass3
                    return traceCopy
                else:
                    return None
            else:
                return None
    else:
        # If we are here that means that callerClass is an actual class or module, so we have to check if it is user defined
        validClass1 = searchClassFunctionMap(callerClass)
        if validClass1 != None:
            if caller == "<module>":
                # Check if the callee function is a user defined one
                userDefinedClass4 = findClassOfFunction(callee)
                # If the class of the callee is user defined, set it and return the object
                if userDefinedClass4 != None:
                    traceCopy["calleeClass"] = userDefinedClass4
                    return traceCopy
                else:
                    return None
            else:
                # Check if caller function is user defined
                userDefinedClass5 = findClassOfFunction(caller)
                if userDefinedClass5 != None:
                    # Check if callee function is user defined
                    userDefinedClass6 = findClassOfFunction(callee)
                    if userDefinedClass6 != None:
                        traceCopy["calleeClass"] = userDefinedClass6
                        return traceCopy
                    else:
                        return None
                else:
                    return None
        else:
            return None




def fillInEntry(entryModule):
    global callTrace
    for traceObj in callTrace:
        if traceObj["caller"] == "<module>" and traceObj["callerClass"] == "<string>":
            
            traceObj["callerClass"] = entryModule
            

def searchClassFunctionMap(className):
    for classFunc in classFunctionMap:
        # If the class is a user defined class or module, return the class or module name
        if classFunc["class"] == className:
            return className

    return None


def findClassOfFunction(function):
    resultArr = []
    for classFunc in classFunctionMap:
        className = classFunc["class"]
        funcName = classFunc["functionName"]
        funcArgs = classFunc["args"]
        args = []
        # Get arguments from function name if it isn't <module>
        if function != "<module>":
            args = function[function.find("(")+1:function.rfind(")")]
            args = args.split(",")
            if (args == ['']):
                args = []
        # Get function name without parentheses                
        strippedFunction = function[0:function.find("(")]
        # If a match is found, add class name to an array for further processing
        if strippedFunction == funcName and args == funcArgs:
            resultArr.append(className)

    if len(resultArr) == 0:
        return None
    elif len(resultArr) == 1:
        return resultArr[0]
    else:
        # Randomly guess
        arrLen = len(resultArr)
        randomGuess = random.randint(0,arrLen-1)
        return resultArr[randomGuess]



        
def setGlobal(map):
    
    global classFunctionMap

    classFunctionMap = map


def start():
    settrace(tracer)
