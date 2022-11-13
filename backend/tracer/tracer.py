# Code taken and adapted from https://www.geeksforgeeks.org/python-sys-settrace/
from sys import settrace

def tracer(frame, event, arg = None):

    code = frame.f_code
  
    func_name = code.co_name

    module_name = code.co_filename

    line_no = frame.f_lineno
  
    print(f"A {event} encountered in \
    {func_name}() at line number {line_no} , in module {module_name}")
  
    return tracer
  
def fun():
    return "MOCK"
  
def check():
    return fun()
  
settrace(tracer)
  
check()