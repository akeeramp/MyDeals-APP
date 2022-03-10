param([string] $Operation,$USN,$PWD,$SERVER)

try {
  if ($Operation -eq 'RemoveZip' ){
     $pw = convertto-securestring -AsPlainText -Force -String "$PWD";
     $cred = new-object -typename System.Management.Automation.PSCredential -argumentlist "$USN",$pw; 
     & Invoke-Command -computername $SERVER -credential $cred -ScriptBlock {if (Test-Path "D:\WebSites\MyDeals\Client.zip") {Remove-Item -Path "D:\WebSites\MyDeals\Client.zip"}};
   }
   elseif ($Operation -eq 'CopyZip' ){
     & Copy-Item "C:\ClientZip\Client.zip" $SERVER/ -Force;
    }
    elseif ($Operation -eq 'Deploy' ){
     $pw = convertto-securestring -AsPlainText -Force -String "$PWD";
     $cred = new-object -typename System.Management.Automation.PSCredential -argumentlist "$USN",$pw; 
     & Invoke-Command -computername $SERVER -credential $cred -ScriptBlock {
       Remove-Item "D:\WebSites\MyDeals\Client\*" -Force -Recurse;
       Add-Type -assembly "system.io.compression.filesystem";[io.compression.zipfile]::ExtractToDirectory("D:\WebSites\MyDeals\Client.zip", "D:\WebSites\MyDeals\Client\");
       Restart-WebAppPool -Name "cinmydeals.intel.com";
       };
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

