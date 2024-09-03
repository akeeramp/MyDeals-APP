using Intel.MyDeals.Entities;
using System.Collections.Generic;

namespace Intel.MyDeals.IDataLibraries
{
    public interface IsdmDataLibrary
    {
        SDMStageDataResult GetSDMStageData(int take, int skip, string whereStg, string orderBy, bool pageChange);

        SDMMasterProductDetails GetMstrPrdDtls(int take, int skip, string whereStg, bool pageChange);

        List<string> GetSdmDropValues(SdmDropVal data);

        List<SDMSummary> UploadSDMData(List<SDMData> SDMData, bool isBulkUpld);
    }
}
