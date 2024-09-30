using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Remoting.Messaging;
using System.Security.Cryptography.X509Certificates;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using Intel.MyDeals.DataLibrary;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IBusinessLogic;

namespace Intel.MyDeals.BusinessLogic
{
    
    public class SDMLib: ISDMLib
    {
        private readonly sdmDataLibrary _sdmDataLib;
        
        public SDMLib()
        {
            _sdmDataLib = new sdmDataLibrary();
        }
        public SDMStageDataResult GetSDMStageData(int take, int skip, string whereStg, string orderBy, bool pageChange)
        {
            return _sdmDataLib.GetSDMStageData(take, skip, whereStg, orderBy, pageChange);
        }

        public SDMMasterProductDetails GetMstrPrdDtls(int take, int skip, string whereStg, bool pageChange)
        {
            return _sdmDataLib.GetMstrPrdDtls(take,skip,whereStg, pageChange);
        }

        public List<string> GetSdmDropValues(SdmDropVal data)
        {
            return _sdmDataLib.GetSdmDropValues(data);
        }

        public List<SDMSummary> UploadSDMData(List<SDMData> SDMData)
        {
            List<SDMSummary> Response = _sdmDataLib.UploadSDMData(SDMData, true);
            if(Response.Count > 0)
            {
                var error = new List<object>();
                error.Add(new
                {
                    CPU_PROCESSOR_NUMBER = "Invalid Product Combination"
                });
                error.Add(new
                {
                    CPU_VRT_NM = "Invalid Product Combination"
                });
                foreach (var row in Response)
                {
                    row.ERROR = error;
                }
            }
            return Response;
        }

        public string UpdtSdmData(List<SDMData> SdmData)
        {
            List<RpdValidation> inDataValidation = RpdDataValidations(SdmData);
            return inDataValidation.Count == 0 ? _sdmDataLib.UploadSDMData(SdmData, false).Count == 0 ? "SUCCESS" : "FAILED" : "FAILED";

        }

        public List<RpdValidation> RpdDataValidations(List<SDMData> RpdLst)
        {
            DateTime errorDate;
            DateTime.TryParse("", out errorDate);

            var Data = RpdLst
                .Select(item =>
                {
                    var errorCol = new List<object>
                    {
                        string.IsNullOrEmpty(item.CYCLE_NM) ? new { CYCLE_NM = "Invalid/Empty Data" } : null,
                        string.IsNullOrEmpty(item.CPU_VRT_NM) ? new { CPU_VRT_NM = "Invalid/Empty Data" } : null,
                        string.IsNullOrEmpty(item.CPU_SKU_NM) ? new { CPU_SKU_NM = "Invalid/Empty Data" } : null,
                        string.IsNullOrEmpty(item.CPU_PROCESSOR_NUMBER) ? new { CPU_PROCESSOR_NUMBER = "Invalid/Empty Data" } : null,
                        string.IsNullOrEmpty(item.IS_DELETE)  ?  new { IS_DELETE = "Empty Field" } : (item.IS_DELETE == "Y"  || item.IS_DELETE == "N" ? null : new { IS_DELETE = "Invalid Data" }),
                        item.CURR_STRT_DT == null || item.CURR_STRT_DT == errorDate ? new { CURR_STRT_DT = "Invalid/Empty Data" } : null,
                        item.CURR_END_DT == null || item.CURR_END_DT == errorDate ? new { CURR_END_DT = "Invalid/Empty Data" } : null,
                        item.CURR_STRT_DT > item.CURR_END_DT ? new { CURR_END_DT = "End Date greater than Start Date" } : null,
                        item.CURR_STRT_DT > item.CURR_END_DT ? new { CURR_STRT_DT = "Start Date lesser than End Date" } : null
                    }.Where(e => e != null).ToList();

                    return (item, errorCol);
                })
                .Where(x => x.errorCol.Any())
                .Select(x => DataAddFn(x.item, x.errorCol))
                .ToList();

            return Data;
        }

        public List<RpdValidation> RpdDupValidations(List<SDMData> RpdLst)
        {
            List<RpdValidation> Data = new List<RpdValidation>();
            var error = new List<object>();
            error.Add(new { CYCLE_NM = "Duplicate combinations found" });
            error.Add(new { CPU_VRT_NM = "Duplicate combination found" });
            error.Add(new { CPU_SKU_NM = "Duplicate combination found" });
            error.Add(new { CPU_PROCESSOR_NUMBER = "Duplicate combination found" });
            foreach (var group in RpdLst.GroupBy(p => new { p.CYCLE_NM, p.CPU_VRT_NM, p.CPU_SKU_NM, p.CPU_PROCESSOR_NUMBER }))
            {
                if (group.Count() > 1)
                {
                    foreach (var row in group)
                    {
                        Data.Add(DataAddFn(row, error));
                    }
                }
            }
            return Data;
        }

        public static RpdValidation DataAddFn(SDMData row, object error)
        {
            RpdValidation data = new RpdValidation();
            data.CYCLE_NM = row.CYCLE_NM;
            data.CURR_STRT_DT = row.CURR_STRT_DT;
            data.CURR_END_DT = row.CURR_END_DT;
            data.CPU_VRT_NM = row.CPU_VRT_NM;
            data.CPU_SKU_NM = row.CPU_SKU_NM;
            data.CPU_PROCESSOR_NUMBER = row.CPU_PROCESSOR_NUMBER;
            data.CPU_FLR = row.CPU_FLR;
            data.APAC_PD = row.APAC_PD;
            data.IJKK_PD = row.IJKK_PD;
            data.EMEA_PD = row.EMEA_PD;
            data.ASMO_PD = row.ASMO_PD;
            data.PRC_PD = row.PRC_PD;
            data.IS_DELETE = row.IS_DELETE;
            data.ERROR = error;

            return data;
        }
        
    }
}
