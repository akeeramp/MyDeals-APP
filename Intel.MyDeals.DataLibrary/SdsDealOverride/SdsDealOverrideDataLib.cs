using System;
using System.Collections.Generic;
using Intel.MyDeals.DataAccessLib;
using Intel.MyDeals.Entities;
using Intel.Opaque;
using Intel.Opaque.DBAccess;
using Procs = Intel.MyDeals.DataAccessLib.StoredProcedures.MyDeals;
using Intel.MyDeals.IDataLibrary;
using Newtonsoft.Json;
using System.Data;

namespace Intel.MyDeals.DataLibrary
{

    public class SdsDealOverrideDataLib : ISdsDealOverrideDataLib
    {
        /// <summary>
        /// Get SDS Deal Overrides Rules
        /// </summary>
        /// <returns>list of rules which can be overriden</returns>

        public DataTable GetDTRules()
        {
            OpLog.Log("GetSdsDealOverrideRules");
            DataTable dt = new DataTable("SdsDealOverrideRules");

            DataColumn dc1;
            dc1 = new DataColumn();
            dc1.DataType = typeof(Int32);
            dc1.ColumnName = "rule_id";

            DataColumn dc2;
            dc2 = new DataColumn();
            dc2.DataType = typeof(string);
            dc2.ColumnName = "rule_nm";

            dt.Columns.Add(dc1);
            dt.Columns.Add(dc2);

            dt.Rows.Add(1, "Deal End Date cannot exceed 20 years beyond the Deal Start Date");
            dt.Rows.Add(2, "or 180 days prior to the Deal Start Date");
            dt.Rows.Add(3, "Billing Start Date cannot be backdated beyond 1 year prior to the Deal Start Date");
            dt.Rows.Add(4, "For draining products, the end date is limited to 2 Intel Calendar Years from deal start date");
            dt.Rows.Add(5, "ECAP Price must be a positive number.");
            dt.Rows.Add(6, "End Date is limited to 1 Intel Calendar Year from");
            dt.Rows.Add(7, "Below are the valid vertical combinations allowed in My Deals");

            return dt;
        }

        public List<SdsDealOverride> GetSdsDealOverrideRules()
        {
            OpLog.Log("GetCustomerDivision");

            var ret = new List<SdsDealOverride>();
            try
            {
                DataTable dt = GetDTRules();
                foreach (DataRow dr in dt.Rows)
                {
                    ret.Add(new SdsDealOverride
                    {
                        RULE_ID = Convert.ToInt32(dr[0]),
                        RULE_NM = dr[1].ToString()
                       // IS_CHECKED = false
                    }); ;
                }
            }
            catch (Exception ex)
            {
                OpLogPerf.Log(ex);
                throw;
            }
            return ret;
        }

        public string SaveSdsDealOverride(string _mode, SdsDealOverride data)
        {
            SdsPassedData passedData = new SdsPassedData()
            {
                obj_lvl = data.LVL_ID,
                obj_ids = data.OBJECT_IDS,
                set_value = data.RULE_ID,
                message = "SDS Administrators [" + OpUserStack.MyOpUserToken.Usr.FullName + "] have applied override rules to this deal, rules values were set to [" + data.RULE_ID + "]"
            };

            string jsonStr = JsonConvert.SerializeObject(passedData);

            var cmd = new Procs.dbo.PR_MYDL_SDS_OVERRIDE()
            {
                MODE = _mode,
                JSON_DATA = jsonStr,
                WWID = OpUserStack.MyOpUserToken.Usr.WWID,
                DEBUG = false
            };

            string ret = "";

            try
            {
                using (var rdr = DataAccess.ExecuteReader(cmd))
                {
                    int IDX_RESULTS = DB.GetReaderOrdinal(rdr, "RESULTS");

                    while (rdr.Read())
                    {
                        ret = (IDX_RESULTS < 0 || rdr.IsDBNull(IDX_RESULTS)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_RESULTS);
                    }
                }
            }
            catch(Exception ex)
            {
                OpLogPerf.Log(ex);
                throw;
            }
            return ret;
        }

        public string GetSdsOverrideReport(string _mode)
        {
            var cmd = new Procs.dbo.PR_MYDL_SDS_OVERRIDE()
            {
                MODE = _mode,
                JSON_DATA = "",
                WWID = OpUserStack.MyOpUserToken.Usr.WWID
            };

            string ret = "";

            try
            {
                using (var rdr = DataAccess.ExecuteReader(cmd))
                {
                    int IDX_RESULTS = DB.GetReaderOrdinal(rdr, "RESULTS");

                    while (rdr.Read())
                    {
                        ret = (IDX_RESULTS < 0 || rdr.IsDBNull(IDX_RESULTS)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_RESULTS);
                    }
                }
            }
            catch (Exception ex)
            {
                OpLogPerf.Log(ex);
                throw;
            }
            return ret;
        }

    }
}