// Runs an infinite loop that listens to the keyboard input.
// When a key is pressed (any key), the program blackens the screen,
// i.e. writes "black" in every pixel;
// the screen should remain fully black as long as the key is pressed. 
// When no key is pressed, the program clears the screen, i.e. writes
// "white" in every pixel;
// the screen should remain fully clear as long as no key is pressed.

// Put your code here.

// use RAM[1] to store the current drawing screen position, it's default value is 16384, max value is 24576 - 1 
@16384
D = A
@1
M = D

(LOOP)
// get the keyboard's input value
@24576
D = M
// == 1 draw the screen
@DRAWSCREEN
D;JGT
// else goto clear screen
@CLEARSCREEN
0;JMP

(DRAWSCREEN)
// get the current draw postion
@1
D = M
// if current - max >= 0 goto loop, dont draw
@24576
D = D - A
@LOOP
D;JGE
// draw it
@1
// get current position value
D = M
// get 16 bits to 1, will make this word to be -1
A = D
M = -1
// current position add 1
@1
M = D + 1
// back to loop
@LOOP
0;JMP

(CLEARSCREEN)
@1
D = M
// if current - min < 0 goto loop, dont clear
@16384
D = D - A
@LOOP
D;JLT
@1
D = M
// set 16 bits 0 clear it
A = D
M = 0
// current position subtraction 1
@1
M = D - 1
// back to loop
@LOOP
0;JMP
