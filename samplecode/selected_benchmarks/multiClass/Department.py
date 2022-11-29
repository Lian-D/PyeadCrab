from Faculty import Faculty

class Department(Faculty):
    
    def printInfo(self):
        print("This is the department of " + self.name + " at " + self.school)
