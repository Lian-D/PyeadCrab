class Faculty():
    def __init__(self, name, school):
        self.name = name
        self.school = school

    def printName(self, x, *y, **z):
        print(self.name)

    def printSchool(self):
        print(self.school)

    def printInfo(self):
        print("This is the faculty of " + self.name + " at " + self.school)
