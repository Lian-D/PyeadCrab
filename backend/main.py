import sys
import static
# import dynamic

def main():
    args = sys.argv[1:]
    if (sys.argv[2] == "-s"):
        static.readRepo(sys.argv[1])
    if (sys.argv[2] == "-d"):
        pass
    if (sys.argv[2] == "-sd"):
        static.readRepo(sys.argv[1])

main()