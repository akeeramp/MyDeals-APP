param(
    [string]$ENV,
    [string]$Action,
    [string]$DowntimeMessage,
    [string]$Date,
    [string]$StartTime,
    [string]$EndTime
)

# Define the environment data
$ENV_DATA = @(
    [pscustomobject]@{env='CIN';DEPLOY_PATH='\\HF2CINMYDLW01.amr.corp.intel.com\MyDeals'}
    [pscustomobject]@{env='DEV';DEPLOY_PATH='\\HF2DEVMYDLW01.amr.corp.intel.com\MyDeals'}
    [pscustomobject]@{env='IAO-DEV';DEPLOY_PATH='\\HF2ITTMYDLW01.amr.corp.intel.com\MyDeals'}
    [pscustomobject]@{env='EUT';DEPLOY_PATH='\\hf2cinmydlw01.amr.corp.intel.com\MyDealsEUT'}
    [pscustomobject]@{env='DAY1';DEPLOY_PATH='\\hf2cinmydlw01.amr.corp.intel.com\MyDealsDay1'}
    [pscustomobject]@{env='IAO-CONS01';DEPLOY_PATH='\\HF2UTTMYDLW01.amr.corp.intel.com\MyDeals'}
    [pscustomobject]@{env='IAO-CONS02';DEPLOY_PATH='\\HF2UTTMYDLW02.amr.corp.intel.com\MyDeals'}
    [pscustomobject]@{env='CONS1';DEPLOY_PATH='\\FM7CONMYDLW01.amr.corp.intel.com\MyDeals'}
    [pscustomobject]@{env='CONS2';DEPLOY_PATH='\\FM7CONMYDLW02.amr.corp.intel.com\MyDeals'}
    [pscustomobject]@{env='CIAR';DEPLOY_PATH='\\FM7CIAMYDLW01.amr.corp.intel.com\MyDeals'}
    [pscustomobject]@{env='DR';DEPLOY_PATH='\\CH2DRMYDLW01.amr.corp.intel.com\MyDeals'}
    [pscustomobject]@{env='PROD1';DEPLOY_PATH='\\FM1PRDMYDLW01.amr.corp.intel.com\MyDeals'}
    [pscustomobject]@{env='PROD2';DEPLOY_PATH='\\FM1PRDMYDLW02.amr.corp.intel.com\MyDeals'}
)

# Find the environment data
$result = $ENV_DATA | Where-Object { $_.env -eq $ENV }

if ($null -eq $result) {
    Write-Host "Invalid environment specified" -BackgroundColor DarkRed
    exit 1
}

$deployPath = $result.DEPLOY_PATH

if ($Action -eq 'Deploy') {
    # Validate date and time formats
    $dateFormat = "dd-MM-yyyy"
    $timeFormat = "hh:mm tt"

    try {
        $parsedDate = [datetime]::ParseExact($Date, $dateFormat, $null)
    } catch {
        Write-Host "Invalid date format. Please use dd-MM-yyyy." -BackgroundColor DarkRed
        exit 1
    }

    try {
        $parsedStartTime = [datetime]::ParseExact($StartTime, $timeFormat, $null)
    } catch {
        Write-Host "Invalid start time format. Please use hh:mm tt." -BackgroundColor DarkRed
        exit 1
    }

    try {
        $parsedEndTime = [datetime]::ParseExact($EndTime, $timeFormat, $null)
    } catch {
        Write-Host "Invalid end time format. Please use hh:mm tt." -BackgroundColor DarkRed
        exit 1
    }

    # Define the HTML content with placeholders
    $content = @"
    <!DOCTYPE html>
    <html lang='en'>
    <head>
        <meta charset='UTF-8'>
        <meta name='viewport' content='width=device-width, initial-scale=1.0'>
        <title>Scheduled Maintenance</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                color: #333;
                text-align: center;
                padding: 50px;
            }
            .container {
                max-width: 900px;
                margin: 0 auto;
                background: #fff;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
            h1 {
                color: #ff6347;
            }
            p {
                font-size: 18px;
            }
            .time {
                font-weight: bold;
                color: #ff6347;
            }
        </style>
    </head>
    <body>
        <div class='container'>
            <h1>We'll be back soon!</h1>
            <p>{{DowntimeMessage}}</p>
            <p>Downtime scheduled for:</p>
            <p>Date: {{Date}} (PST)</p>
            <p>Start Time: {{StartTime}} (PST)</p>
            <p>End Time: {{EndTime}} (PST)</p>
            <p>Once maintenance is completed, all services will be restored, and you can resume normal operations.</p>
            <p>Thank you for your patience.</p>
            <p>For any further support, reach out to <a href='mailto:MyDealsSupport@intel.com'>MyDealsSupport@intel.com</a></p>
        </div>
    </body>
    </html>
"@

    # Replace placeholders with actual values
    $content = $content -replace "{{Date}}", $Date
    $content = $content -replace "{{StartTime}}", $StartTime
    $content = $content -replace "{{EndTime}}", $EndTime
    $content = $content -replace "{{DowntimeMessage}}", $DowntimeMessage

    # Write the content directly to the deploy path
    $offlineFilePathInDeployPath = Join-Path -Path $deployPath -ChildPath "app_offline.htm"
    Set-Content -Path $offlineFilePathInDeployPath -Value $content

    Write-Host "Downtime page deployed successfully" -BackgroundColor DarkGreen
}
elseif ($Action -eq 'Revert') {
    # Remove the app_offline.htm file from the deploy path
    $offlineFilePathInDeployPath = Join-Path -Path $deployPath -ChildPath "app_offline.htm"
    if (Test-Path -Path $offlineFilePathInDeployPath) {
        Remove-Item -Path $offlineFilePathInDeployPath -Force
        Write-Host "Downtime page reverted successfully" -BackgroundColor DarkGreen
    }
    else {
        Write-Host "No downtime page found to revert" -BackgroundColor DarkYellow
    }
}
else {
    Write-Host "Invalid action specified" -BackgroundColor DarkRed
    exit 1
}