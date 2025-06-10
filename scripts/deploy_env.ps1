param([string] $Operation,$USN,$PWD,$SERVER)

try {

 $ENV_DATA = @(
        [pscustomobject]@{env='CIN';DEPLOY_PATH='\\CALMYDCIN01.amr.corp.intel.com\MyDeals';DEPLOY_SERVER='CALMYDCIN01.amr.corp.intel.com';pool="cinmydeals.intel.com";config="CINR"}
        [pscustomobject]@{env='DEV';DEPLOY_PATH='\\HF2DEVMYDLW01.amr.corp.intel.com\MyDeals';DEPLOY_SERVER='HF2DEVMYDLW01.amr.corp.intel.com';pool="devmydeals.inte.com";config="DEV"}
        [pscustomobject]@{env='IAO-DEV';DEPLOY_PATH='\\HF2ITTMYDLW01.amr.corp.intel.com\MyDeals';DEPLOY_SERVER='HF2ITTMYDLW01.amr.corp.intel.com';pool="ittmydeals.intel.com";config="ITT"}
        [pscustomobject]@{env='EUT';DEPLOY_PATH='\\hf2cinmydlw01.amr.corp.intel.com\MyDealsEUT';DEPLOY_SERVER='hf2cinmydlw01.amr.corp.intel.com';pool="eutmydeals.intel.com";config="EUT"}
        [pscustomobject]@{env='DAY1';DEPLOY_PATH='\\hf2cinmydlw01.amr.corp.intel.com\MyDealsDay1';DEPLOY_SERVER='hf2cinmydlw01.amr.corp.intel.com';pool="mydeals-day1.intel.com";config="DAY1"}
        [pscustomobject]@{env='IAO-CONS01';DEPLOY_PATH='\\HF2UTTMYDLW01.amr.corp.intel.com\MyDeals';DEPLOY_SERVER='HF2UTTMYDLW01.amr.corp.intel.com';pool="uttmydeals.intel.com";config="UTT"}
        [pscustomobject]@{env='IAO-CONS02';DEPLOY_PATH='\\HF2UTTMYDLW02.amr.corp.intel.com\MyDeals';DEPLOY_SERVER='HF2UTTMYDLW02.amr.corp.intel.com';pool="uttmydeals.intel.com";config="UTT"}
        [pscustomobject]@{env='CONS1';DEPLOY_PATH='\\FM7CONMYDLW01.amr.corp.intel.com\MyDeals';DEPLOY_SERVER='FM7CONMYDLW01.amr.corp.intel.com';pool="conmydeals.intel.com";config="CONS"}
        [pscustomobject]@{env='CONS2';DEPLOY_PATH='\\FM7CONMYDLW02.amr.corp.intel.com\MyDeals';DEPLOY_SERVER='FM7CONMYDLW02.amr.corp.intel.com';pool="conmydeals.intel.com";config="CONS"}
        [pscustomobject]@{env='CIAR';DEPLOY_PATH='\\FM7CIAMYDLW01.amr.corp.intel.com\MyDeals';DEPLOY_SERVER='FM7CIAMYDLW01.amr.corp.intel.com';pool="ciamydeals.intel.com";config="CIAR"}
        [pscustomobject]@{env='PERF';DEPLOY_PATH='\\HF2PRFMYDLW01.amr.corp.intel.com\MyDeals';DEPLOY_SERVER='HF2PRFMYDLW01.amr.corp.intel.com';pool="perfmydeals.intel.com";config="PERF"}
        [pscustomobject]@{env='DR';DEPLOY_PATH='\\CH2DRMYDLW01.amr.corp.intel.com\MyDeals';DEPLOY_SERVER='CH2DRMYDLW01.amr.corp.intel.com';pool="drmydeals.intel.com";config="PROD"}
        [pscustomobject]@{env='PROD1';DEPLOY_PATH='\\FM1PRDMYDLW01.amr.corp.intel.com\MyDeals';DEPLOY_SERVER='FM1PRDMYDLW01.amr.corp.intel.com';pool="prdmydeals.intel.com";config="PROD"}
        [pscustomobject]@{env='PROD2';DEPLOY_PATH='\\FM1PRDMYDLW02.amr.corp.intel.com\MyDeals';DEPLOY_SERVER='FM1PRDMYDLW02.amr.corp.intel.com';pool="prdmydeals.intel.com";config="PROD"}
   )
    if ($Operation -eq 'verifyENV'){
        $result = $ENV_DATA | Where env -eq $SERVER;
        if($result -eq $null){
            Write-Host "Please provide correct values for environment" -BackgroundColor DarkRed
            EXIT 1
        }
    }
     elseif ($Operation -eq 'MovePublishENV' ){
     $result = $ENV_DATA | Where env -eq $SERVER;
      if($result -eq $null){
              Write-Host "Please provide correct values for environment" -BackgroundColor DarkRed
              EXIT 1
          }
      else {
       $config=$result.config;
       $ClientPath='\Client\src\dist';
       $ClienLocation=$result.DEPLOY_PATH+$ClientPath;
      & robocopy output/_PublishedWebsites/Intel.MyDeals $result.DEPLOY_PATH /e /MT /copyall /secfix ;
      if ($lastexitcode -lt 8) { $global:LASTEXITCODE = $null };
        & robocopy Intel.MyDeals/Client/src/dist $ClienLocation /e /MT /copyall /secfix ;
        #Updating the apigee values - Starts here
 	    $weconfigpath = 'output/_PublishedWebsites/Intel.MyDeals/EnvConfig/'+$config +'/Web.Config';
	    $doc = (Get-Content $weconfigpath) -as [Xml];
  	    $root = $doc.get_DocumentElement();
	    $appSettingNodes = $root.appSettings.SelectNodes("add");
        $apiGeeConsumerKeyNode = $appSettingNodes| Where key -eq  "apiGeeConsumerKey"
        $apiGeeConsumerKeyNode.value = $USN;
	    $apiGeeconsumerSecretNode = $appSettingNodes| Where key -eq  "apiGeeconsumerSecret"
        $apiGeeconsumerSecretNode.value = $PWD;
	    $doc.Save($weconfigpath);
    	Write-Host "Config Updated Successfully!!";
        #updating the apigee Values - Ends here
      if ($lastexitcode -lt 8) { $global:LASTEXITCODE = $null };
      & robocopy output/_PublishedWebsites/Intel.MyDeals/EnvConfig/$config $result.DEPLOY_PATH Web.Config /MT /copyall /secfix;
      if ($lastexitcode -lt 8) { $global:LASTEXITCODE = $null };
      }
    }
    elseif ($Operation -eq 'MovePublish_latest' ){
     $result = $ENV_DATA | Where env -eq $SERVER;
      if($result -eq $null){
              Write-Host "Please provide correct values for environment" -BackgroundColor DarkRed
              EXIT 1
          }
      else {
        $config=$result.config
      & robocopy C:\mydeals_latest_angular  $result.DEPLOY_PATH /e /MT /copyall /secfix ;
      #Updating the apigee values - Starts here
 	    $weconfigpath = 'output/_PublishedWebsites/Intel.MyDeals/EnvConfig/'+$config +'/Web.Config';
	    $doc = (Get-Content $weconfigpath) -as [Xml];
  	    $root = $doc.get_DocumentElement();
	    $appSettingNodes = $root.appSettings.SelectNodes("add");
        $apiGeeConsumerKeyNode = $appSettingNodes| Where key -eq  "apiGeeConsumerKey"
        $apiGeeConsumerKeyNode.value = $USN;
	    $apiGeeconsumerSecretNode = $appSettingNodes| Where key -eq  "apiGeeconsumerSecret"
        $apiGeeconsumerSecretNode.value = $PWD;
	    $doc.Save($weconfigpath);
    	Write-Host "Config Updated Successfully!!";
        #updating the apigee Values - Ends here
      if ($lastexitcode -lt 8) { $global:LASTEXITCODE = $null };
      & robocopy C:\mydeals_latest_angular\EnvConfig\$config $result.DEPLOY_PATH Web.Config /MT /copyall /secfix;
      if ($lastexitcode -lt 8) { $global:LASTEXITCODE = $null };
      }
    }
       elseif ($Operation -eq 'MovePublish_latest_prod' ){
     $result = $ENV_DATA | Where env -eq $SERVER;
      if($result -eq $null){
              Write-Host "Please provide correct values for environment" -BackgroundColor DarkRed
              EXIT 1
          }
      else {
        $config=$result.config
      & robocopy C:\mydeals_ciar_latest_angular  $result.DEPLOY_PATH /e /MT /copyall /secfix ;
      #Updating the apigee values - Starts here
 	    $weconfigpath = 'C:\mydeals_ciar_latest_angular\EnvConfig\'+$config +'\Web.Config';
	    $doc = (Get-Content $weconfigpath) -as [Xml];
  	    $root = $doc.get_DocumentElement();
	    $appSettingNodes = $root.appSettings.SelectNodes("add");
        $apiGeeConsumerKeyNode = $appSettingNodes| Where key -eq  "apiGeeConsumerKey"
        $apiGeeConsumerKeyNode.value = $USN;
	    $apiGeeconsumerSecretNode = $appSettingNodes| Where key -eq  "apiGeeconsumerSecret"
        $apiGeeconsumerSecretNode.value = $PWD;
	    $doc.Save($weconfigpath);
    	Write-Host "Config Updated Successfully!!";
        #updating the apigee Values - Ends here
      if ($lastexitcode -lt 8) { $global:LASTEXITCODE = $null };
      & robocopy C:\mydeals_ciar_latest_angular\EnvConfig\$config $result.DEPLOY_PATH Web.Config /MT /copyall /secfix;
      if ($lastexitcode -lt 8) { $global:LASTEXITCODE = $null };
      }
    }

    elseif ($Operation -eq 'RemoveZipENV' ){
        $result = $ENV_DATA | Where env -eq $SERVER;
        if($result -eq $null){
            Write-Host "Please provide correct values for environment" -BackgroundColor DarkRed
            EXIT 1
        }
        else{
           $pw = convertto-securestring -AsPlainText -Force -String "$PWD";
            $cred = new-object -typename System.Management.Automation.PSCredential -argumentlist "$USN",$pw; 
            if($SERVER -eq 'DAY1'){
                & Invoke-Command -computername  $result.DEPLOY_SERVER -credential $cred -ScriptBlock {if (Test-Path "D:\WebSites\MyDealsDay1\Client.zip") {Remove-Item -Path "D:\WebSites\MyDealsDay1\Client.zip"}};
            }
            elseif($SERVER -eq 'EUT'){
                & Invoke-Command -computername  $result.DEPLOY_SERVER -credential $cred -ScriptBlock {if (Test-Path "D:\WebSites\MyDealsEUT\Client.zip") {Remove-Item -Path "D:\WebSites\MyDealsEUT\Client.zip"}};
            }
            else{
                & Invoke-Command -computername  $result.DEPLOY_SERVER -credential $cred -ScriptBlock {if (Test-Path "D:\WebSites\MyDeals\Client.zip") {Remove-Item -Path "D:\WebSites\MyDeals\Client.zip"}};
            }
        }
   }
   elseif ($Operation -eq 'CopyZipENV' ){
       $result = $ENV_DATA | Where env -eq $SERVER;
        if($result -eq $null){
            Write-Host "Please provide correct values for environment" -BackgroundColor DarkRed
            EXIT 1
        }
        else{
        & Copy-Item "C:\ClientZip\Client.zip" $result.DEPLOY_PATH -Force;
        }
    }
    elseif ($Operation -eq 'DeployENV' ){
          $result = $ENV_DATA | Where env -eq $SERVER;
          $pool = $result.pool;
          if($result -eq $null){
              Write-Host "Please provide correct values for environment" -BackgroundColor DarkRed
              EXIT 1
          }
          else{
            $pw = convertto-securestring -AsPlainText -Force -String "$PWD";
            $cred = new-object -typename System.Management.Automation.PSCredential -argumentlist "$USN",$pw;
            if ($SERVER -ne 'DR' -and $SERVER -ne 'PROD1' -and $SERVER -ne 'PROD2') {
                & Invoke-Command -computername $result.DEPLOY_SERVER -credential $cred -ScriptBlock { param($pool)
                    Restart-WebAppPool -Name  $pool
                } -Argumentlist $pool
            } else {
                Write-Host "Skipping IIS restart for environment: $SERVER"
            } 
          }
            #  if($SERVER -eq 'DAY1') {
            #     Remove-Item "D:\WebSites\MyDealsDay1\Client\*" -Force -Recurse;
            #     Add-Type -assembly "system.io.compression.filesystem";[io.compression.zipfile]::ExtractToDirectory("D:\WebSites\MyDealsDay1\Client.zip", "D:\WebSites\MyDealsDay1\Client\");
            #  }
            #  elseif($SERVER -eq 'EUT'){
            #     Remove-Item "D:\WebSites\MyDealsEUT\Client\*" -Force -Recurse;
            #     Add-Type -assembly "system.io.compression.filesystem";[io.compression.zipfile]::ExtractToDirectory("D:\WebSites\MyDealsEUT\Client.zip", "D:\WebSites\MyDealsEUT\Client\");
            #  }
            #  else{
            #     Remove-Item "D:\WebSites\MyDeals\Client\*" -Force -Recurse;
            #     Add-Type -assembly "system.io.compression.filesystem";[io.compression.zipfile]::ExtractToDirectory("D:\WebSites\MyDeals\Client.zip", "D:\WebSites\MyDeals\Client\");
            #  }
          
    }
    elseif ($Operation -eq 'copy_latestENV' ){
     $result =  $ENV_DATA | Where env -eq $SERVER;
     if($result -eq $null){
            Write-Host "Please provide correct values for environment" -BackgroundColor DarkRed
            EXIT 1
        }
        else{
            & robocopy output/_PublishedWebsites/Intel.MyDeals 'C:\mydeals_latest_angular'  /e /MT /copyall /secfix ;
             if ($lastexitcode -lt 8) { $global:LASTEXITCODE = $null };
                & robocopy Intel.MyDeals/Client/src/dist 'C:\mydeals_latest_angular\Client\src\dist' /e /MT /copyall /secfix ;
             if ($lastexitcode -lt 8) { $global:LASTEXITCODE = $null };
            #  & Copy-Item "C:\ClientZip\Client.zip" 'C:\mydeals_latest_angular' -Force;
        }
    }
     elseif ($Operation -eq 'copy_latest_prodENV' ){
     $result =  $ENV_DATA | Where env -eq $SERVER;
     if($result -eq $null){
            Write-Host "Please provide correct values for environment" -BackgroundColor DarkRed
            EXIT 1
        }
        else{
            if($SERVER -eq 'CIAR') {
             & robocopy output/_PublishedWebsites/Intel.MyDeals 'C:\mydeals_ciar_latest_angular'  /e /MT /copyall /secfix ;
             if ($lastexitcode -lt 8) { $global:LASTEXITCODE = $null };
                & robocopy Intel.MyDeals/Client/src/dist 'C:\mydeals_ciar_latest_angular\Client\src\dist' /e /MT /copyall /secfix ;
             if ($lastexitcode -lt 8) { $global:LASTEXITCODE = $null };
            # & Copy-Item "C:\ClientZip\Client.zip" 'C:\mydeals_ciar_latest_angular' -Force;
            }
        }
    }
    elseif ($Operation -eq 'build_commit_list' ){
        node C:\automation_newman\buildNotification.js $SERVER $USN;
    }
}
catch {
    # Get the current error
    Write-Host $_.Exception.Message -BackgroundColor DarkRed
    EXIT 1
}

