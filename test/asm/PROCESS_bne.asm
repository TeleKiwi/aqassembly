MOV R0, 0
MOV R1, 1
CMP R0, R1
BNE true
B false
true:
HALT
false:
HALT