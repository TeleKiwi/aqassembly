MOV R0, 0
MOV R1, 1
CMP R0, R1
BLT true
B false
true:
HALT
false:
HALT