// Multiplies R0 and R1 and stores the result in R2.
// (R0, R1, R2 refer to RAM[0], RAM[1], and RAM[2], respectively.)

// remember: we can only use 2 registers A and D. 

// Put your code here.
    @2
    M = 0

(LOOP)
    @1
    M = M - 1
    D = M
    @END
    D;JLT

    @0
    D = M
    @2
    M = M + D
    @LOOP
    0;JMP
(END)
    0;JMP
