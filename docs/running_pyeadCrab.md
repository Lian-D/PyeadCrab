# Running PyeadCrab #

For this program to work, we require you to follow the following set up steps.

## Installation ##
1. Install NodeJS
2. Navigate to the frontend directory and run `npm install`
3. Navigate to the backend directory and install python and the necessary python packages. See [here](https://github.students.cs.ubc.ca/CPSC410-2022W-T1/Project2Group8/blob/main/backend/readme.md).

If set up succeeds, please follow the guide below to run your program.
## Usage ##
1. Place program for analysis within the `/head/` directory
2. Ensure that front end is run by `cd frontend` from base directory and running npm start, a webserver should be created
3. Enter the backend directory through `cd backend` and run the following commands with your personal specifications
   1. `python main.py -s '../head/<repo>/'` for static analysis
   2. `python main.py -d '../head/<repo>/' '../head/<repo>/<entryfile.py>' <command line args if applicable >` for dynamic analysis
4. Following this, a static and dynamic json should be generated for front end consumption.
5. Return to the front end web page and press the update button
6. If you need to run some samples please refer to our [link](running_samples.md) <br> <br>

 **Note:** The more complex or computationally heavy your program is, the longer the analysis will take to run.