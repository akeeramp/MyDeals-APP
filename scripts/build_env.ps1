param([string] $Operation,$PATH,$DIR)

try {
    if ($Operation -eq 'nuget'){
      & $PATH restore;
    }
    elseif ($Operation -eq 'NPMInstall' ){
        Set-Location -Path Intel.MyDeals/Client/ -PassThru;
        npm install --force;
        Set-Location -Path .. -PassThru ; 
        Set-Location -Path ..  -PassThru;
    }
      elseif ($Operation -eq 'NPMBuild' ){
        Set-Location -Path Intel.MyDeals/Client/ -PassThru;
        npm run build_env;
        Set-Location -Path .. -PassThru ; 
        Set-Location -Path ..  -PassThru;
    }
    elseif ($Operation -eq 'MSBuild' ){
     & $PATH /p:OutDir="$DIR/output" /p:TransformConfigFiles=true /p:Configuration=Release /p:Platform="Any CPU" /p:GenerateSerializationAssemblies=Off;
    }

    elseif ($Operation -eq 'MovePublish' ){
     & robocopy output/_PublishedWebsites/Intel.MyDeals $PATH /e /MT /copyall /secfix ;
     if ($lastexitcode -lt 8) { $global:LASTEXITCODE = $null };
     & robocopy output/_PublishedWebsites/Intel.MyDeals/EnvConfig/DEV $PATH Web.Config /MT /copyall /secfix;
     if ($lastexitcode -lt 8) { $global:LASTEXITCODE = $null };
    }
    elseif ($Operation -eq 'ClientZip' ){
     if (Test-Path "C:\ClientZip\Client.zip") {Remove-Item -Path "C:\ClientZip\Client.zip"};
     Add-Type -assembly "system.io.compression.filesystem";[io.compression.zipfile]::CreateFromDirectory((Get-Location).path+"\Intel.MyDeals\Client\", "C:\ClientZip\Client.zip");
    }
    elseif ($Operation -eq 'ClientZip_latest' ){
     if (Test-Path "C:\ClientZip\Client.zip") {Remove-Item -Path "C:\ClientZip\Client.zip"};
     Add-Type -assembly "system.io.compression.filesystem";[io.compression.zipfile]::CreateFromDirectory("C:\mydeals_latest_angular\Client", "C:\ClientZip\Client.zip");
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

