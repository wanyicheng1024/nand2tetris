#issue
1. if you are using the Win10 Operation Systerm, when you click the D:\build-a-computer\nand2tetris\tools\JackCompiler.bat, wish it can work, it just some error happened and it does not work.
2. the alternative solution is: 

creat a file named jc.cmd, the content are:
```
@echo off
pushd .
call D:\build-a-computer\nand2tetris\tools\JackCompiler.bat %cd%\%1
popd
```
please note that: the upon path is the file path in yourself computer.

then in which file or directory you want compile, you run this:
to compile file
```
.\jc.cmd test.jack
```
or directory
```
.\jc.cmd test
```
please note that: you need to copy all the OS's vm files to your dirctory.