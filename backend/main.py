import sys
import os

def main():
    args = sys.argv[1:]
    print(args)
    command = 'python3 '+sys.argv[1]
    print(command)
    os.system(command)

main()