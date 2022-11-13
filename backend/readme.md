Install Python here: https://www.python.org/downloads/. When installing Python, make sure it is added to PATH variables <br>

This project uses the Flask framework. Here's how to use it: <br>
1. After Python has been installed, go to the backend directory in the command prompt<br>
2. Flask recommends using a virtual environment to ensure that libraries that use different python versions do not conflict <br>
3. To create the virtual environment, go to the command prompt and enter this: `py -3 -m venv venv` for Windows, and `python3 -m venv venv` for Mac/Linux <br>
4. Activate the virtual environment by entering this in the command prompt: `venv\Scripts\activate` for Windows, and `. venv/bin/activate` for Mac/Linux <br>
5. Install Flask in the virtual environment with `pip install Flask`
6. Navigate to the server directory in the backend directory, and enter this to start the server: `Flask -app server run --port=PORTNUMBERHERE`