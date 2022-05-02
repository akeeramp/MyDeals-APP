param([string] $Operation,$USN,$PWD,$ENV)

try {
    $ENV_DATA = @(
       [pscustomobject]@{env='DEV';DEPLOY_PATH='\\HF2DEVMYDLW01.amr.corp.intel.com\MyDeals';DEPLOY_SERVER='HF2DEVMYDLW01.amr.corp.intel.com'}
       [pscustomobject]@{env='ITT';DEPLOY_PATH='\\HF2ITTMYDLW01.amr.corp.intel.com\MyDeals';DEPLOY_SERVER='HF2ITTMYDLW01.amr.corp.intel.com'}
       [pscustomobject]@{env='EUT';DEPLOY_PATH='\\hf2cinmydlw01.amr.corp.intel.com\MyDealsEUT';DEPLOY_SERVER='hf2cinmydlw01.amr.corp.intel.com'}
       [pscustomobject]@{env='DAY1';DEPLOY_PATH='\\hf2cinmydlw01.amr.corp.intel.com\MyDealsDay1';DEPLOY_SERVER='hf2cinmydlw01.amr.corp.intel.com'}
       [pscustomobject]@{env='UTT1';DEPLOY_PATH='\\HF2UTTMYDLW01.amr.corp.intel.com\MyDeals';DEPLOY_SERVER='HF2UTTMYDLW01.amr.corp.intel.com'}
       [pscustomobject]@{env='UTT2';DEPLOY_PATH='\\HF2UTTMYDLW02.amr.corp.intel.com\MyDeals';DEPLOY_SERVER='HF2UTTMYDLW02.amr.corp.intel.com'}
       [pscustomobject]@{env='CONS1';DEPLOY_PATH='\\FM7CONMYDLW01.amr.corp.intel.com\MyDeals';DEPLOY_SERVER='FM7CONMYDLW01.amr.corp.intel.com'}
       [pscustomobject]@{env='CONS2';DEPLOY_PATH='\\FM7CONMYDLW02.amr.corp.intel.com\MyDeals';DEPLOY_SERVER='FM7CONMYDLW02.amr.corp.intel.com'}
       [pscustomobject]@{env='CIAR';DEPLOY_PATH='\\FM7CIAMYDLW01.amr.corp.intel.com\MyDeals';DEPLOY_SERVER='FM7CIAMYDLW01.amr.corp.intel.com'}
       [pscustomobject]@{env='PERF';DEPLOY_PATH='\\HF2PRFMYD2W01.amr.corp.intel.com\MyDeals';DEPLOY_SERVER='HF2PRFMYD2W01.amr.corp.intel.com'}
       [pscustomobject]@{env='DR';DEPLOY_PATH='\\HF2CINMYDLW01.amr.corp.intel.com\DR';DEPLOY_SERVER='HF2CINMYDLW01.amr.corp.intel.com'}
       [pscustomobject]@{env='PROD1';DEPLOY_PATH='\\HF2CINMYDLW01.amr.corp.intel.com\PROD1';DEPLOY_SERVER='HF2CINMYDLW01.amr.corp.intel.com'}
       [pscustomobject]@{env='PROD2';DEPLOY_PATH='\\HF2CINMYDLW01.amr.corp.intel.com\PROD2';DEPLOY_SERVER='HF2CINMYDLW01.amr.corp.intel.com'}
   )
    if ($Operation -eq 'verifyENV'){
        $result = $ENV_DATA | Where env -eq $ENV;
        if($result -eq $null){
            Write-Host "Please provide correct values for environment" -BackgroundColor DarkRed
            EXIT 1
        }
    }
   
   elseif ($Operation -eq 'copy_latest' ){
     $result =  $ENV_DATA | Where env -eq $ENV;
     if($result -eq $null){
            Write-Host "Please provide correct values for environment" -BackgroundColor DarkRed
            EXIT 1
        }
        else{
            & robocopy output/_PublishedWebsites/Intel.MyDeals 'C:\mydeals_latest'  /e /MT /copyall /secfix ;
             if ($lastexitcode -lt 8) { $global:LASTEXITCODE = $null };
        }
    }
     elseif ($Operation -eq 'Deploy' ){
     $result =  $ENV_DATA | Where env -eq $ENV;
     if($result -eq $null){
            Write-Host "Please provide correct values for environment" -BackgroundColor DarkRed
            EXIT 1
        }
        else
        {
            & robocopy output/_PublishedWebsites/Intel.MyDeals $result.DEPLOY_PATH /e /MT /copyall /secfix ;
            if ($lastexitcode -lt 8) { $global:LASTEXITCODE = $null };
            & robocopy output/_PublishedWebsites/Intel.MyDeals/EnvConfig/$ENV $result.DEPLOY_PATH Web.Config /MT /copyall /secfix;
            if ($lastexitcode -lt 8) { $global:LASTEXITCODE = $null };
        }
   }
      elseif ($Operation -eq 'Deploy_prod' ){
     $result =  $ENV_DATA | Where env -eq $ENV;
     if($result -eq $null){
            Write-Host "Please provide correct values for environment" -BackgroundColor DarkRed
            EXIT 1
        }
        else{
            & net use y: $result.DEPLOY_PATH /user:$USN $PWD /y;
            & robocopy output/_PublishedWebsites/Intel.MyDeals y: /e /MT /copyall /secfix ;
            if ($lastexitcode -lt 8) { $global:LASTEXITCODE = $null };
            & robocopy output/_PublishedWebsites/Intel.MyDeals/EnvConfig/$ENV y: Web.Config /MT /copyall /secfix;
            if ($lastexitcode -lt 8) { $global:LASTEXITCODE = $null };
            & net use * /delete /y;
        }
    }
     elseif ($Operation -eq 'Deploy_latest' ){
     $result =  $ENV_DATA | Where env -eq $ENV;
     if($result -eq $null){
            Write-Host "Please provide correct values for environment" -BackgroundColor DarkRed
            EXIT 1
        }
        else{
            & robocopy C:\mydeals_latest $result.DEPLOY_PATH /e /MT /copyall /secfix ;
            if ($lastexitcode -lt 8) { $global:LASTEXITCODE = $null };
            & robocopy C:\mydeals_latest\EnvConfig\$ENV $result.DEPLOY_PATH Web.Config /MT /copyall /secfix;
            if ($lastexitcode -lt 8) { $global:LASTEXITCODE = $null };
        }
   
    }
    elseif ($Operation -eq 'Deploy_latest_prod' ){
     $result =  $ENV_DATA | Where env -eq $ENV;
     if($result -eq $null){
            Write-Host "Please provide correct values for environment" -BackgroundColor DarkRed
            EXIT 1
        }
        else{
            & net use y: $result.DEPLOY_PATH /user:$USN $PWD /y;
            & robocopy C:\mydeals_latest y: /e /MT /copyall /secfix ;
            if ($lastexitcode -lt 8) { $global:LASTEXITCODE = $null };
            & robocopy C:\mydeals_latest\EnvConfig\$ENV y: Web.Config /MT /copyall /secfix;
            if ($lastexitcode -lt 8) { $global:LASTEXITCODE = $null };
            & net use * /delete /y;
        }
    }
   elseif ($Operation -eq 'IIS_Restart' ){
     $result =  $ENV_DATA | Where env -eq $ENV;
     if($result -eq $null){
            Write-Host "Please provide correct values for environment" -BackgroundColor DarkRed
            EXIT 1
        }
     else{
        $pw = convertto-securestring -AsPlainText -Force -String "$PWD";
        $cred = new-object -typename System.Management.Automation.PSCredential -argumentlist "$USN",$pw; 
        & Invoke-Command -computername $result.DEPLOY_SERVER -credential $cred -ScriptBlock {
            iisreset.exe
        }
     }
    }
    else {
        Write-Host "Please provide correct values" -BackgroundColor DarkRed
        EXIT 1
    }
}
catch {
    # Get the current error
    Write-Host $_.Exception.Message -BackgroundColor DarkRed
    EXIT 1
}
