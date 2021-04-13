param([string]$appPoolName,[string]$Server,[string]$strUser,[string]$password)
#**************************************************************************
# Author: TM (Aug 2017) MB(July 2018)
# To stop IIS AppPool with retry capability.
# This script expects command line arguments.
#**************************************************************************

[object] $objCred = $null
$strPass = New-Object -TypeName System.Security.SecureString
$password.ToCharArray() | ForEach-Object {$strPass.AppendChar($_)}

$objCred = New-Object -TypeName System.Management.Automation.PSCredential -ArgumentList ($strUser, $strPass)


Invoke-Command -ComputerName $Server -Credential $objCred -ScriptBlock {

# Load IIS module:
Import-Module WebAdministration

# Set the number of retries
[int] $retries = 50
# Set the number of attempts
[int] $delay = 500
[string] $errtxt = ""

Try {
    # Check if AppPool exists
    if(Test-Path IIS:\AppPools\$Using:appPoolName) {

        # Stop App Pool if not already stopped
        if ((Get-WebAppPoolState $Using:appPoolName).Value -ne "Stopped") {
            Write-Host "Stopping IIS app pool $Using:appPoolName."
            Stop-WebAppPool $Using:appPoolName

            $state = (Get-WebAppPoolState $Using:appPoolName).Value
            $counter = 1

            # Wait for the app pool to the "Stopped" before proceeding
            do{
                $state = (Get-WebAppPoolState $Using:appPoolName).Value
                Write-Host "$counter/$retries Waiting for IIS app pool $Using:appPoolName to shut down completely. Current status: $state"
                $counter++
                Start-Sleep -Milliseconds $delay
            }
            while($state -ne "Stopped" -and $counter -le $retries)

            # Throw an error if the app pool is not stopped
            if($counter -gt $retries) {
                $errtxt = "Could not shut down IIS app pool $Using:appPoolName. `nTry to increase the number of retries ($retries) or delay between attempts ($delay milliseconds)."
                throw $errtxt 
            }
        }
        else {
            Write-Host "$Using:appPoolName already Stopped."
        }
    }
    else {
        $errtxt = "IIS app pool " + $Using:appPoolName + " does not exist."
        throw $errtxt 
    }
}
Catch {
    # Get the current error
    $ErrorMessage = $_

    # Write a message to stdout to let TeamCity know that the script failed.
    # The exit code is not returned properly to TeamCity due to issues with invoking
    # PowerShell script files using -File
    # Observe that this message is written with Write-Host rather than Write-Error,
    # to make sure the message is written to stdout rather than stderr
    Write-Host "##teamcity[buildProblem description='$ErrorMessage']"

    Write-Error -Message $ErrorMessage

    EXIT 1
}
}