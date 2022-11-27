import sys
import static
import dynamic

def main():
    args = sys.argv[1:]
    if (sys.argv[2] == "-s"):
        # static.readRepo(sys.argv[1])
        static.execute(sys.argv[1])
    elif (sys.argv[2] == "-d"):
        dynamic.execute(sys.argv[1], sys.argv[3:])
main()