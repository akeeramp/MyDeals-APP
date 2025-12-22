param(
    [Parameter(Mandatory=$true)]
    [string]$TWCID    
)

# path to verifyTestCaseAttachment.js file
$NodeJsFilePath = "C:\automation_newman\verifyTestCaseAttachment.js"

# Validate if the verifyTestCaseAttachment.js file exists
if (-not (Test-Path $NodeJsFilePath)) {
    Write-Error "verifyTestCaseAttachment.js file not found at: $NodeJsFilePath"
    exit 1
}

try {
    Write-Host "Starting the execution to verify test script attachment..." -ForegroundColor Yellow
    Write-Host "Parameters: TWCID=$TWCID" -ForegroundColor Cyan
    
    # Execute the verifyTestCaseAttachment.js file with required parameters
    $process = Start-Process -FilePath "node" -ArgumentList "`"$NodeJsFilePath`"", "`"$TWCID`"" -Wait -PassThru -NoNewWindow
    
    # Check the exit code
    if ($process.ExitCode -eq 0) {
        Write-Host "Test Case Verification script executed successfully!" -ForegroundColor Green
    }
    else {
        Write-Error "Test Case Verification script failed with exit code: $($process.ExitCode)"
        exit $process.ExitCode
    }
}
catch {
    Write-Error "An error occurred while executing the verifyTestCaseAttachment.js script: $($_.Exception.Message)"
    exit 1
}