import sys

# Simple recursive function to get the nth Fibbonacci number, where n is a command line argument
def fibRecursive(x):
    if x <= 1:
        return x
    return fibRecursive(x-1) + fibRecursive(x-2)

if __name__ == "__main__":
    fib = fibRecursive(int(sys.argv[1]))
    print(fib)