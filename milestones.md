# Milestone1 #

Discussion with TA:
UML with just static checking might not be enough

We need to think of other use cases or user story requirements to augment our project idea

A suggestion from TA is to add interactivity to the UML diagram; when clicking on a method, show the flow of data and control in a tree like visualization. Ex. Which functions classes or modules get executed for a given input

We can have visualization (UML DIAGRAM) with static checking, and also reason about dynamic properties (the tree like visualization described above)

Things to do by next milestone:
Brainstorm more use cases and settle on an idea

From Jifeng:
The program analysis tool should reason about or investigate the behaviour or properties of the source code WHEN IT IS BEING EXECUTED, such as control flow, data flow, etc., and provide a Visualization, and NOT about some STATIC property of the code as written, such as architecture. It should involve 2~3 non-obvious design choices regarding what the analysis tracks and how it handles some of the cases in the programs it plans to support.
Possible use cases: - Understanding the DYNAMIC BEHAVIOUR of the source code - Validating the DYNAMIC BEHAVIOUR of the source code - Optimizing the DYNAMIC EXECUTION of the source code - Profiling the DYNAMIC EXECUTION of the source code - Finding bugs in the DYNAMIC EXECUTION of the source code - Debugging the DYNAMIC EXECUTION of the source code