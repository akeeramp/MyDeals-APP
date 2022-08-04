param([string] $Operation,$USN,$PWD,$ENV)

try {
    $ENV_DATA = @(
        [pscustomobject]@{env='DEV';DEPLOY_PATH='\\HF2DEVMYDLW01.amr.corp.intel.com\MyDeals';DEPLOY_SERVER='HF2DEVMYDLW01.amr.corp.intel.com';pool="devmydeals.inte.com"}
        [pscustomobject]@{env='ITT';DEPLOY_PATH='\\HF2ITTMYDLW01.amr.corp.intel.com\MyDeals';DEPLOY_SERVER='HF2ITTMYDLW01.amr.corp.intel.com';pool="ittmydeals.intel.com"}
        [pscustomobject]@{env='EUT';DEPLOY_PATH='\\hf2cinmydlw01.amr.corp.intel.com\MyDealsEUT';DEPLOY_SERVER='hf2cinmydlw01.amr.corp.intel.com';pool="eutmydeals.intel.com"}
        [pscustomobject]@{env='DAY1';DEPLOY_PATH='\\hf2cinmydlw01.amr.corp.intel.com\MyDealsDay1';DEPLOY_SERVER='hf2cinmydlw01.amr.corp.intel.com';pool="mydeals-day1.intel.com"}
        [pscustomobject]@{env='UTT1';DEPLOY_PATH='\\HF2UTTMYDLW01.amr.corp.intel.com\MyDeals';DEPLOY_SERVER='HF2UTTMYDLW01.amr.corp.intel.com';pool="uttmydeals.intel.com"}
        [pscustomobject]@{env='UTT2';DEPLOY_PATH='\\HF2UTTMYDLW02.amr.corp.intel.com\MyDeals';DEPLOY_SERVER='HF2UTTMYDLW02.amr.corp.intel.com';pool="uttmydeals.intel.com"}
        [pscustomobject]@{env='CONS1';DEPLOY_PATH='\\FM7CONMYDLW01.amr.corp.intel.com\MyDeals';DEPLOY_SERVER='FM7CONMYDLW01.amr.corp.intel.com';pool="conmydeals.intel.com"}
        [pscustomobject]@{env='CONS2';DEPLOY_PATH='\\FM7CONMYDLW02.amr.corp.intel.com\MyDeals';DEPLOY_SERVER='FM7CONMYDLW02.amr.corp.intel.com';pool="conmydeals.intel.com"}
        [pscustomobject]@{env='CIAR';DEPLOY_PATH='\\FM7CIAMYDLW01.amr.corp.intel.com\MyDeals';DEPLOY_SERVER='FM7CIAMYDLW01.amr.corp.intel.com';pool="ciamydeals.intel.com"}
        [pscustomobject]@{env='PERF';DEPLOY_PATH='\\HF2PRFMYDLW01.amr.corp.intel.com\MyDeals';DEPLOY_SERVER='HF2PRFMYDLW01.amr.corp.intel.com';pool="perfmydeals.intel.com"}
        [pscustomobject]@{env='DR';DEPLOY_PATH='\\CH2DRMYDLW01.amr.corp.intel.com\MyDeals';DEPLOY_SERVER='CH2DRMYDLW01.amr.corp.intel.com';pool="drmydeals.intel.com"}
        [pscustomobject]@{env='PROD1';DEPLOY_PATH='\\FM1PRDMYDLW01.amr.corp.intel.com\MyDeals';DEPLOY_SERVER='FM1PRDMYDLW01.amr.corp.intel.com';pool="prdmydeals.intel.com"}
        [pscustomobject]@{env='PROD2';DEPLOY_PATH='\\FM1PRDMYDLW02.amr.corp.intel.com\MyDeals';DEPLOY_SERVER='FM1PRDMYDLW02.amr.corp.intel.com';pool="prdmydeals.intel.com"}
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
     elseif ($Operation -eq 'copy_latest_prod' ){
     $result =  $ENV_DATA | Where env -eq $ENV;
     if($result -eq $null){
            Write-Host "Please provide correct values for environment" -BackgroundColor DarkRed
            EXIT 1
        }
        else{
            & robocopy output/_PublishedWebsites/Intel.MyDeals 'C:\mydeals_latest_ciar'  /e /MT /copyall /secfix ;
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
            if($ENV -eq 'PROD1' -or $ENV -eq 'PROD2' -or $ENV -eq 'DR'){
               $ENV='PROD'
                & robocopy output/_PublishedWebsites/Intel.MyDeals $result.DEPLOY_PATH /e /MT /copyall /secfix ;
                if ($lastexitcode -lt 8) { $global:LASTEXITCODE = $null };
                & robocopy output/_PublishedWebsites/Intel.MyDeals/EnvConfig/$ENV $result.DEPLOY_PATH Web.Config /MT /copyall /secfix;
                if ($lastexitcode -lt 8) { $global:LASTEXITCODE = $null };
            }
            else {
                  & robocopy output/_PublishedWebsites/Intel.MyDeals $result.DEPLOY_PATH /e /MT /copyall /secfix ;
                if ($lastexitcode -lt 8) { $global:LASTEXITCODE = $null };
                & robocopy output/_PublishedWebsites/Intel.MyDeals/EnvConfig/$ENV $result.DEPLOY_PATH Web.Config /MT /copyall /secfix;
                if ($lastexitcode -lt 8) { $global:LASTEXITCODE = $null };
            }
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
            if($ENV -eq 'PROD1' -or $ENV -eq 'PROD2' -or $ENV -eq 'DR'){
               $ENV='PROD'
            & robocopy C:\mydeals_latest_ciar $result.DEPLOY_PATH /e /MT /copyall /secfix ;
            if ($lastexitcode -lt 8) { $global:LASTEXITCODE = $null };
            & robocopy C:\mydeals_latest_ciar/EnvConfig/$ENV $result.DEPLOY_PATH Web.Config /MT /copyall /secfix;
            if ($lastexitcode -lt 8) { $global:LASTEXITCODE = $null };
            }
            else {
                  & robocopy C:\mydeals_latest_ciar $result.DEPLOY_PATH /e /MT /copyall /secfix ;
                if ($lastexitcode -lt 8) { $global:LASTEXITCODE = $null };
                & robocopy C:\mydeals_latest_ciar/EnvConfig/$ENV $result.DEPLOY_PATH Web.Config /MT /copyall /secfix;
                if ($lastexitcode -lt 8) { $global:LASTEXITCODE = $null };
            }
        }
    }
   elseif ($Operation -eq 'IIS_Restart' ){
     $result =  $ENV_DATA | Where env -eq $ENV;
     if($result -eq $null){
            Write-Host "Please provide correct values for environment" -BackgroundColor DarkRed
            EXIT 1
        }
     else{
        $AppPool=$result.pool;
        $pw = convertto-securestring -AsPlainText -Force -String "$PWD";
        $cred = new-object -typename System.Management.Automation.PSCredential -argumentlist "$USN",$pw; 
        & Invoke-Command -computername $result.DEPLOY_SERVER -credential $cred -ScriptBlock {
             Restart-WebAppPool -Name $args[0]
        } -ArgumentList $AppPool
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
