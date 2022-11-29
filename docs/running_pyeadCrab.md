# Running PyeadCrab #

For this program to work, we require you to follow the step up steps.

If set up succeeds, please follow the guide below to run your program.

1. Place program for analysis within the `/head/` directory
2. Ensure that front end is run by `cd frontend` from base directory and running npm start, a webserver should be created
3. enter the backend directory through `cd backend` and run the following commands with your personal specifications
   1. `python main.py -s '../head/<repo>/'` for static analysis
   2. `python main.py -d '../head/<repo>/' '../head/<repo>/<entryfile.py>' <command line args if applicable >` for dynamic analysis
4. Following this, a static and dynamic json should be generated for front end consumption.
5. Return to the front end web page and press the update button
6. If you need to run some samples please refer to our [link](running_samples.md)