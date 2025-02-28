using Intel.MyDeals.DataAccessLib;
using Intel.Opaque.Data;
using Intel.Opaque.DBAccess;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IDataLibrary;
using Intel.Opaque;
using Procs = Intel.MyDeals.DataAccessLib.StoredProcedures.MyDeals;

namespace Intel.MyDeals.DataLibrary
{

    public class OverlapChecksDataLib : IOverlapChecksDataLib
    {

        public List<OverlappingTenders> CheckForOverlappingTenders(int dealId, DateTime startDate, DateTime endDate, string projectName, string endCustomerName, string endCustomerCntry, int customerId, int productId, string consumptionCustomerPlatform, string consumptionCustomerSegment, string consumptionReportedSalesGeo, string consumptionCountryRegion)
        {
            OpLogPerf.Log("DealDataLib.Save:CheckForOverlappingTenders - Start: StartDt:'{0}', EndDt:'{1}', Project:'{2}', End Cust:'{3}', Customer:{4}, Product:{5}, ConsumptionCustomerPlatform:{6}, ConsumptionCustomerSegment:{7}, ConsumptionReportedSalesGeo:{8}, ConsumptionCountryRegion:{9}.", startDate, endDate, projectName, endCustomerName, endCustomerCntry, customerId, productId, consumptionCustomerPlatform, consumptionCustomerSegment, consumptionReportedSalesGeo, consumptionCountryRegion);

            var ret = new List<OverlappingTenders>();

            var cmd = new Procs.dbo.PR_MYDL_GET_OVRLP_TENDERS
            {
                DEAL_ID = dealId,
                START_DATE = startDate,
                END_DATE = endDate,
                QLTR_PROJECT = projectName,
                END_CUSTOMER_RETAIL = endCustomerName,
                END_CUSTOMER_CNTRY = endCustomerCntry,
                CUST_MBR_SID = customerId,
                PRD_MBR_SID = productId,
                CONSUMPTION_CUST_PLATFORM = consumptionCustomerPlatform,
                CONSUMPTION_CUST_SEGMENT = consumptionCustomerSegment,
                CONSUMPTION_CUST_RPT_GEO = consumptionReportedSalesGeo,
                CONSUMPTION_COUNTRY_REGION = consumptionCountryRegion
            };

            try
            {
                using (var rdr = DataAccess.ExecuteReader(cmd))
                {
                    int IDX_OBJ_SID = DB.GetReaderOrdinal(rdr, "OBJ_SID");
                    int IDX_START_DT = DB.GetReaderOrdinal(rdr, "START_DT");
                    int IDX_END_DT = DB.GetReaderOrdinal(rdr, "END_DT");
                    int IDX_WF_STG_CD = DB.GetReaderOrdinal(rdr, "WF_STG_CD");

                    while (rdr.Read())
                    {
                        ret.Add(new OverlappingTenders
                        {
                            DealId = (IDX_OBJ_SID < 0 || rdr.IsDBNull(IDX_OBJ_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_OBJ_SID),
                            StartDt = (IDX_START_DT < 0 || rdr.IsDBNull(IDX_START_DT)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_START_DT),
                            //StartDt = (IDX_START_DT < 0 || rdr.IsDBNull(IDX_START_DT)) ? default(System.DateTime) : rdr.GetFieldValue<System.DateTime>(IDX_START_DT),
                            EndDt = (IDX_END_DT < 0 || rdr.IsDBNull(IDX_END_DT)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_END_DT),
                            //EndDt = (IDX_END_DT < 0 || rdr.IsDBNull(IDX_END_DT)) ? default(System.DateTime) : rdr.GetFieldValue<System.DateTime>(IDX_END_DT),
                            Stage = (IDX_WF_STG_CD < 0 || rdr.IsDBNull(IDX_WF_STG_CD)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_WF_STG_CD)
                        });
                    }
                }
            }
            catch (Exception ex)
            {
                OpLogPerf.Log(ex);
                throw;
            }

            OpLogPerf.Log("DealDataLib.Save:CheckForOverlappingTenders - Done: StartDt:'{0}', EndDt:'{1}', Project:'{2}', End Cust:'{3}', Customer:{4}, Product:{5}, ConsumptionCustomerPlatform:{6}, ConsumptionCustomerSegment:{7}, ConsumptionReportedSalesGeo:{8}, ConsumptionCountryRegion:{9}.", startDate, endDate, projectName, endCustomerName, endCustomerCntry, customerId, productId, consumptionCustomerPlatform, consumptionCustomerSegment, consumptionReportedSalesGeo, consumptionCountryRegion);

            return ret;
        }

    }

}
