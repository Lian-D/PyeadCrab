import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

# First convert the function calls into one-hot-encoding

# dynamic = [
#    {
#       "callee":"<module>",
#       "calleeClass":"<string>",
#       "caller":"<module>",
#       "callerClass":"mainDynamic.py"
#    },
#    {
#       "callee":"__init__(self)",
#       "calleeClass":"Classer",
#       "caller":"<module>",
#       "callerClass":"<string>"
#    },
#    {
#       "callee":"func1()",
#       "calleeClass":"main2.py",
#       "caller":"<module>",
#       "callerClass":"<string>"
#    },
#    {
#       "callee":"func2(x,*y,**z)",
#       "calleeClass":"main2.py",
#       "caller":"func1()",
#       "callerClass":"main2.py"
#    },
#    {
#       "callee":"func2(x,*y,**z)",
#       "calleeClass":"main2.py",
#       "caller":"<module>",
#       "callerClass":"<string>"
#    },
#    {
#       "callee":"func3(input)",
#       "calleeClass":"main2.py",
#       "caller":"<module>",
#       "callerClass":"<string>"
#    },
#    {
#       "callee":"morb(self)",
#       "calleeClass":"Classer",
#       "caller":"func3(input)",
#       "callerClass":"<string>"
#    },
#    {
#       "callee":"other(self,x)",
#       "calleeClass":"Classer",
#       "caller":"<module>",
#       "callerClass":"<string>"
#    }
# ]


def analyze(dynamic):
    calleeList = []
    callList = []

    for i in range(len(dynamic)):
        calleeStr = dynamic[i]["callee"] + "@" + dynamic[i]["calleeClass"]
        callerStr = dynamic[i]["caller"] + "@" + dynamic[i]["callerClass"]
        calleeList.append(calleeStr)
        callList.append(calleeStr)
        callList.append(callerStr)

    calleeUni = np.unique(calleeList)
    funcList = np.unique(callList)

    X = np.zeros((len(dynamic),len(funcList)), dtype = int)
    dynlen = len(dynamic)
    y = np.zeros(len(dynamic), dtype = int)

    nodes = []

    for i in range(len(calleeUni)):
        name = calleeUni[i].split("@")
        node = {"id": name[0], "class": name[1],
                "calls": calleeList.count(calleeUni[i])}
        nodes.append(node)


    for i in range(len(dynamic)):
        callerStr = dynamic[i]["caller"] + "@" + dynamic[i]["callerClass"]
        calleeStr = dynamic[i]["callee"] + "@" + dynamic[i]["calleeClass"]
        if(callerStr in callList):
            X[i][np.where(funcList == callerStr)] = 1
            y[i] = np.where(funcList == calleeStr)[0]

    mat = np.c_[X,y]



    _, n = np.shape(mat)
    
    mark = np.identity(n-1)
    #print(mark)
    links = []
    for i in range(n-1):
        ind = np.where(mat[:,i] == 1)
        if(len(ind) != 0):
            callerstr = funcList[i].split("@")
            calleeLinks = mat[ind,n-1][0]
            uniqueLink = np.unique(calleeLinks)
            for j in range(len(uniqueLink)):
                callstr = funcList[uniqueLink[j]].split("@")
                link = {"source": callerstr[0], "target": callstr[0],
                        "calls": np.count_nonzero(calleeLinks == uniqueLink[j])}
                links.append(link)
    
    for i in range(n-1):
        ind = np.where(mat[:,i] == 1)
        uniqueInd = np.unique(ind)
        values = []
        if(len(ind[0]) != 0):
            mark[i,:] = np.zeros(n-1)
            for j in range(len(ind)):
                values.extend(mat[ind[j],n-1])
            uniqueVal = np.unique(values)
            for j in range(len(uniqueVal)):
                mark[i,uniqueVal[j]] = np.count_nonzero(values == uniqueVal[j])/len(values)
    #print(mark)
    #print(links)
    #print(nodes)
    return mark, links, nodes
    
analyze(dynamic)








