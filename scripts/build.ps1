param([string] $Operation,$PATH,$DIR)

try {
    if ($Operation -eq 'nuget'){
      & $PATH restore;
    }
    elseif ($Operation -eq 'MSBuild' ){
     & $PATH /p:OutDir="$DIR/output" /p:TransformConfigFiles=true /p:Configuration=Release /p:Platform="Any CPU" /p:GenerateSerializationAssemblies=Off;
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
