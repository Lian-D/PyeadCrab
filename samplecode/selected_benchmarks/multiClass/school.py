from Faculty import Faculty
from Department import Department
import ubc


science = Faculty("Science", "UBC")
department = Department("Computer Science", "UBC")


science.printName(1)
science.printSchool()
science.printInfo()

department.printName(1)
department.printSchool()
department.printInfo()
