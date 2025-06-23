MOV R0, 1
MOV R1, 0
CMP R0, R1
BGT true
B false
true:
HALT
false:
HALT