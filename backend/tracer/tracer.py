# Code taken and adapted from https://www.geeksforgeeks.org/python-sys-settrace/
from sys import settrace
from os import path

callTrace = []


def tracer(frame, event, arg = None):

    global callTrace

    if event == 'call':

        code = frame.f_code

        caller = frame.f_back.f_code.co_name

        callerModule = frame.f_back.f_code.co_filename
        

        callerModule = path.relpath(callerModule)

        callee = code.co_name

        calleeModule = code.co_filename

        calleeModule = path.relpath(calleeModule)

        callTraceDict = {
            "callee": callee,
            "calleeModule": calleeModule,
            "caller": caller,
            "callerModule": callerModule
        }

        callTrace.append(callTraceDict)
  
    return tracer
  
def fun():
    return "MOCK"
  
def check():
    return fun()
  
settrace(tracer)
  
check()

check()

print(callTrace)