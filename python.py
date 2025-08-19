string = "hello"
operation = 0
for letter in range(len(string)):
    operation += abs(ord(string[letter]) - ord(string[letter]))
    print(operation)
print(operation)