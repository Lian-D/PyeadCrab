import ast
from tracer import callTrace

# Open the module with the trace function and retrieve its AST
tracerFile = open('tracer.py','r').read()
tracerTree = ast.parse(tracerFile)

# Open the module for the target program and retrieve its AST
programFile = open('target.py', 'r').read()
programTree = ast.parse(programFile)

# Add the nodes in the AST for the trace module to the beginning of the AST for the target program
for i in range(len(tracerTree.body)):
    programTree.body.insert(i,tracerTree.body[i])

# AST cleanup
ast.fix_missing_locations(programTree)

# Execute the program
exec(compile(programTree, filename="target.py", mode="exec"))

# After program execution, retrieve the call trace array
print(callTrace)