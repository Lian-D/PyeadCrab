import sys
import static
import dynamic

def main():
    args = sys.argv[1:]
    if (sys.argv[1] == "-s"):
        # static.readRepo(sys.argv[1])
        static.execute(sys.argv[2])
    elif (sys.argv[1] == "-d"):
        dynamic.execute(sys.argv[2], sys.argv[3:])
main()