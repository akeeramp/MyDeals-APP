using Intel.MyDeals.Entities;
using System.Collections.Generic;

namespace Intel.MyDeals.IBusinessLogic
{
    public interface ISDMLib
    {
        SDMStageDataResult GetSDMStageData(int take, int skip, string whereStg, string orderBy, bool pageChange);

        SDMMasterProductDetails GetMstrPrdDtls(int take, int skip, string whereStg, bool pageChange);

        List<string> GetSdmDropValues(SdmDropVal data);

        List<SDMSummary> UploadSDMData(List<SDMData> SDMData);

        string UpdtSdmData(List<SDMData> SdmData);
        List<RpdValidation> RpdDataValidations(List<SDMData> RpdLst);
        List<RpdValidation> RpdDupValidations(List<SDMData> RpdLst);
    }
}
