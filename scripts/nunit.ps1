param($PATH);
#CLI command to trigger unit tests via nunit3-console
$cmdOutput = cmd /c C:\Abhilash\NUnit.Console-3.16.2\bin\nunit3-console.exe $PATH\Intel.MyDeals.BusinessLogicNew.Test\bin\Debug\Intel.MyDeals.BusinessLogicNew.Test.dll --result $PATH\Nunit_Result\TestResult.xml

$testResult = $cmdOutput | Select-String -Pattern 'Overall result'

#Parsing the output and showing success/throwing error
if($testResult -Match "Failed"){
    Write-Host -ForegroundColor Red "`nERROR : One or more unit tests FAILED. `nFor more details, please check the attached report: 'NUnit-Report' in the Artifact Section of the workflow. "
	EXIT 1
}
else{
    Write-Host -ForegroundColor Green "`nAll the unit tests ran successfully. `nFor more details, please check the attached report: 'NUnit-Report' in the Artifact Section of the workflow."
}