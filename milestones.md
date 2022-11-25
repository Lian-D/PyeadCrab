# Milestone 1 #

## Discussion with TA:
UML with just static checking might not be enough

We need to think of other use cases or user story requirements to augment our project idea

A suggestion from TA is to add interactivity to the UML diagram; when clicking on a method, show the flow of data and control in a tree like visualization. Ex. Which functions classes or modules get executed for a given input

We can have visualization (UML DIAGRAM) with static checking, and also reason about dynamic properties (the tree like visualization described above)

## Things to do by next milestone
Brainstorm more use cases and settle on an idea

# Milestone 2 #

Based on feedback and suggestions from our TA, we have decided not to move forward with the UML diagram and instead will be doing a program analysis of function calls.

## Use case ##
Aimed at developers who are trying to debug a program with little to advanced knowledge of it. We will create a call graph which can help determine the importance of each function and where it's called. For example, if we change one function, we can look at the graph to see what functions are called by it and see if they need to be changed as well.

## Brief description of the project ##
After getting the AST, we can make a call graph for functions potentially calling each other (we can generate a call graph statically) ; when we run the code we can record the calls sequences, and those can be considered random walks on the graph. From this information, we can determine which functions are important, as well as the edges (we can also assess the importance of call sites; the edges represent function calls). After processing we can do graph embedding to provide a sufficient visualization.


## Planned division of responsibliities ##
### Frontend ###
Alex <br>
Len <br>

### Backend ###
Lian <br>
Steven <br>
Nathan

## Tentative Roadmap ##
Milestone 3: Bootstrapping and Setup (TBD) <br>
Milestone 4: Functional mockup and first prototype study (TBD) <br>
Milestone 5: Close to full completion of the project and perform user study (TBD) <br>
November 29: Complete project. (TBD)

# Milestone 3 #
Mockup of frontend:
![image](https://media.github.students.cs.ubc.ca/user/2793/files/6935c86a-b8e4-48dd-bbd6-dcfd850f19d1)

## User Study  ##
User is a 3rd year Computer Science major

### Task ###
Identify the location of bugs in a program using the mockup graph

### Feedback ###
* Graph should be directed
* Legend for classes would be helpful
* Circle highlighting for the graph would be nice to have

## Changes to Original Design ##
None at the moment other than the ones stated in the user study

## Progress ##
We are currently on schedule, bootstrapping and setup has started and implementation work will begin soon. No changes to schedule as of now.

# Milestone 4 #
## Implementation status ##
Frontend is progressing smoothly; we now have an interactable directed graph with nodes depicting functions. Backend work has been progressing as well, but we have run into several issues that we hope to resolve today. <br>

## Final user study plan ##
Given a call graph generated dynamically, we will have our user debug a small sample program<br>

## Remaining timeline ## 
We are currently aiming to follow the planned timeline given in the previous milestone. We do not anticipate any major roadblocks that will derail from the timeline at this time <br>

## Progress against planned timeline ##
Everything is progressing on schedule

# Milestone 5 #
## Video plan ##
Work on the video will begin over the weekend

## Final user study ##
Same plan as before, will be conducted on the weekend


## Planned timeline for remaining days ##
Complete implementation over weekend <br>
Work on video and conduct user study over weekend <br>
Monday-Tuesday: Final adjustments

## Progress against planned timeline ##
We are progressing on schedule; the implementation is close to completion; all that remains is some backend work on optimization and analysis, as well as some frontend adjustments <br>
Once that is done we can conduct the final user study and work on the video
