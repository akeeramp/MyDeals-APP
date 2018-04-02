SET JMSAPP="D:\Mydeals_JMS\Intel.Mydeals.JMSQueue.exe" 

REM -------------------------------------------------------------------

CLS

REM -- Diagnostics --
%JMSAPP% /diag

@ECHO.
@ECHO If there are errors, abort here.  Press CTRL+C to abort.
@ECHO Any other key continues.
@ECHO.
@PAUSE

REM -- UPLOAD MODE --
%JMSAPP% /mode:ul /dir:send
%JMSAPP% /sleep:20
%JMSAPP% /mode:ul /dir:rec

%JMSAPP% /sleep:5

REM -- EXPIRY MODE --
%JMSAPP% /mode:exp /dir:send
%JMSAPP% /sleep:20
%JMSAPP% /mode:exp /dir:rec

REM -------------------------------------------------------------------
