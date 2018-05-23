<# One time script to create windows schedule tasks for JMSQ, run this script with admin priviledges
Deletes tasks if present and re-creates
 #>

# JMSQ Sender Job set up
#====================================================== variables and function calls============================================================

$username  = Read-Host "Enter Username (Service account name)"
$password  = Read-Host "Eneter password"-AsSecureString

$BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($password)
$password = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)


$JMSQUploadSender = 'JMSQ Upload Sender'
$JMSQUploadSender_Description = "Updates YCS2 price in SAP"
$time_JMSQUploadSender = ("8:00am","4:00pm", "11:30pm")
$JMSQUploadSenderPath = 'D:\MyDeals_JMS\RunCommands\JMSQUploadSend.cmd'

$JMSQUploadReciever = 'JMSQ Upload Reciever'
$JMSQUploadReciever_Description ="Recieves YCS2 price upload acknowledgements"
$time_JMSQUploadReciever = ("8:10am","4:10pm", "11:40pm")
$JMSQUploadRecieverPath = 'D:\MyDeals_JMS\RunCommands\JMSQUploadRecieve.cmd'

$JMSQExpireSender = 'JMSQ Expire Sender'
$JMSQExpireSender_Description ="Expires YCS2 price in SAP"
$time_JMSQExpireSender = ("1:00am", "8:30am","4:30pm")
$JMSQExpireSenderPath = 'D:\MyDeals_JMS\RunCommands\JMSQExpireSend.cmd'

$JMSQExpireReciever = 'JMSQ Expire Reciever'
$JMSQExpireReciever_Description ="Recieves YCS2 price expire acknowledgements"
$time_JMSQExpireReciever = ("1:10am", "8:40am","4:40pm")
$JMSQExpireRecieverPath = 'D:\MyDeals_JMS\RunCommands\JMSQExpireRecieve.cmd'
#================================================================================================================================================


#==================================================Functions(Do not modify)======================================================================
ipmo ScheduledTasks 

function CheckTaskExists($taskName){
    $task = Get-ScheduledTask  | Where-Object {$_.TaskName -like $taskName }
    if($task){
        Write-Host $taskName ":exists, deleting and re-creating it `r`n..." -ForegroundColor Cyan
        Unregister-ScheduledTask -TaskName $taskName -Confirm:$false
    }else{
        Write-Host "Creating task " $taskName "`r`n..." -ForegroundColor Green
    }
}

function CreateTask($taskName, $taskDescription, $taskTriggers, $taskExecutePath){

    # check if task exits
    CheckTaskExists $taskName

    $action = New-ScheduledTaskAction -Execute $taskExecutePath
    $triggers = @()
    ForEach($trigger in $taskTriggers){
        $triggers += New-ScheduledTaskTrigger -Daily -At $trigger
    }
    Register-ScheduledTask -Action $action -Trigger $triggers -TaskName $taskName -Description $taskDescription -User:$username -Password:$password -RunLevel:Highest
}

#===================================================================================================================================================

CreateTask $JMSQUploadSender $JMSQUploadSender_Description $time_JMSQUploadSender $JMSQUploadSenderPath

CreateTask $JMSQUploadReciever $JMSQUploadReciever_Description $time_JMSQUploadReciever $JMSQUploadRecieverPath

CreateTask $JMSQExpireSender $JMSQExpireSender_Description $time_JMSQExpireSender $JMSQExpireSenderPath

CreateTask $JMSQExpireReciever $JMSQExpireReciever_Description $time_JMSQExpireReciever $JMSQExpireRecieverPath

Write-Host "Press any key to exit..." -ForegroundColor Yellow

Read-Host 