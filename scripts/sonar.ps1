param([string] $Operation, $SONAR_PWD)
try {
    if ($Operation -eq 'Scan'){
        & 'C:\Abhilash\Sonar Scanner\sonar-scanner-4.7.0.2747-windows\bin\sonar-scanner.bat'
    }
    elseif ($Operation -eq 'GetResult'){
        $pair = "$('admin'):$($SONAR_PWD)"
        $encodedCreds = [System.Convert]::ToBase64String([System.Text.Encoding]::ASCII.GetBytes($pair))
        $basicAuthValue = "Basic $encodedCreds"
        $Headers = @{
            Authorization = $basicAuthValue
        }
        # for now only checking blocker severities in sonarQube, but in future we need to check quality gate status also. Refer https://next.sonarqube.com/sonarqube/web_api/api/qualitygates for API details  
        $resp=Invoke-RestMethod -Uri 'http://mydeals-soatest.amr.corp.intel.com:9000/api/issues/search?projectKey=MyDeals-UI&severities=BLOCKER&resolved=false' -Headers $Headers        
        if($resp.total -gt 0){
            Write-Host "New blockers are introduced. Refer 'http://mydeals-soatest.amr.corp.intel.com:9000' using credentials 'username: mydeals, password: mydeals@1234' for more information " -BackgroundColor DarkRed
            EXIT 1
        }
        else{
            Write-Host "The check ran successfully, no Sonar Blockers are present."
        }
    }
}
catch {
    # Get the current error 
    Write-Host $_.Exception.Message -BackgroundColor DarkRed
    EXIT 1
}