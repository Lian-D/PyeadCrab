import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

# First convert the function calls into one-hot-encoding

dynamic = [
   {
      "callee":"<module>",
      "calleeClass":"<string>",
      "caller":"<module>",
      "callerClass":"mainDynamic.py"
   },
   {
      "callee":"__init__(self)",
      "calleeClass":"Classer",
      "caller":"<module>",
      "callerClass":"<string>"
   },
   {
      "callee":"func1()",
      "calleeClass":"main2.py",
      "caller":"<module>",
      "callerClass":"<string>"
   },
   {
      "callee":"func2(x,*y,**z)",
      "calleeClass":"main2.py",
      "caller":"func1()",
      "callerClass":"main2.py"
   },
   {
      "callee":"func2(x,*y,**z)",
      "calleeClass":"main2.py",
      "caller":"<module>",
      "callerClass":"<string>"
   },
   {
      "callee":"func3(input)",
      "calleeClass":"main2.py",
      "caller":"<module>",
      "callerClass":"<string>"
   },
   {
      "callee":"morb(self)",
      "calleeClass":"Classer",
      "caller":"func3(input)",
      "callerClass":"<string>"
   },
   {
      "callee":"other(self,x)",
      "calleeClass":"Classer",
      "caller":"<module>",
      "callerClass":"<string>"
   }
]


def analyze(dynamic):
    calleeList = []

    for i in range(len(dynamic)):
        calleeStr = dynamic[i]["callee"] + "@" + dynamic[i]["calleeClass"]
        callerStr = dynamic[i]["caller"] + "@" + dynamic[i]["callerClass"]
        calleeList.append(calleeStr)
        calleeList.append(callerStr)


    funcList = np.unique(calleeList)
    
    X = np.zeros((len(dynamic),len(funcList)))
    y = np.zeros(len(dynamic))

    for i in range(len(dynamic)):
        callerStr = dynamic[i]["caller"] + "@" + dynamic[i]["callerClass"]
        print(callerStr)
        calleeStr = dynamic[i]["callee"] + "@" + dynamic[i]["calleeClass"]
        if(callerStr in calleeList):
            X[i][np.where(funcList == callerStr)] = 1
            y[i] = np.where(funcList == calleeStr)[0]

    print(X)
    print(y)
    print(funcList)






