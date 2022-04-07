param([string] $Operation,$USN,$PWD,$SERVER,$ENV,$PATH)

try {
  if ($Operation -eq 'Deploy' ){
     & robocopy output/_PublishedWebsites/Intel.MyDeals $PATH /e /MT /copyall /secfix ;
     if ($lastexitcode -lt 8) { $global:LASTEXITCODE = $null };
     & robocopy output/_PublishedWebsites/Intel.MyDeals/EnvConfig/$ENV $PATH Web.Config /MT /copyall /secfix;
     if ($lastexitcode -lt 8) { $global:LASTEXITCODE = $null };
    }
    elseif ($Operation -eq 'IIS_Restart' ){
     $pw = convertto-securestring -AsPlainText -Force -String "$PWD";
     $cred = new-object -typename System.Management.Automation.PSCredential -argumentlist "$USN",$pw; 
     & Invoke-Command -computername $SERVER -credential $cred -ScriptBlock {
         iisreset.exe
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
