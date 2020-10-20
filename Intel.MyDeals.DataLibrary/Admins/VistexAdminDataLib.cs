using System;
using System.Collections.Generic;
using Intel.MyDeals.DataAccessLib;
using Intel.MyDeals.Entities;
using Intel.Opaque.DBAccess;
using Procs = Intel.MyDeals.DataAccessLib.StoredProcedures.MyDeals;
using System.Linq;
using Intel.Opaque.Tools;
using Newtonsoft.Json;

namespace Intel.MyDeals.DataLibrary
{
    public class VistexAdminDataLib
    {
        public List<VistexDealOutBound> GetVistexDealOutBoundData()
        {
            List<VistexDealOutBound> lstVistex = new List<VistexDealOutBound>();
            var cmd = new Procs.dbo.PR_MYDL_STG_OUTB_BTCH_DATA
            {
                in_rqst_type = VistexMode.VISTEX_DEALS.ToString("g"),
            };

            using (var rdr = DataAccess.ExecuteReader(cmd))
            {
                int IDX_BTCH_ID = DB.GetReaderOrdinal(rdr, "BTCH_ID");
                int IDX_DEAL_ID = DB.GetReaderOrdinal(rdr, "DEAL_ID");
                int IDX_JSON_DATA = DB.GetReaderOrdinal(rdr, "RQST_JSON_DATA");

                while (rdr.Read())
                {
                    lstVistex.Add(new VistexDealOutBound
                    {
                        VistexAttributes = (from result in JsonConvert.DeserializeObject<Dictionary<string, string>>((IDX_JSON_DATA < 0 || rdr.IsDBNull(IDX_JSON_DATA)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_JSON_DATA)) select new VistexAttributes { Value = result.Value, VistexAttribute = result.Key }).ToList(),
                        DealId = (IDX_DEAL_ID < 0 || rdr.IsDBNull(IDX_DEAL_ID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_DEAL_ID),
                        TransanctionId = (IDX_BTCH_ID < 0 || rdr.IsDBNull(IDX_BTCH_ID)) ? default(Guid) : rdr.GetFieldValue<Guid>(IDX_BTCH_ID)
                    });
                } // while
            }
            return lstVistex;
        }

        public List<VistexProductVerticalOutBound> GetVistexProductVeticalsOutBoundData()
        {
            List<VistexProductVerticalOutBound> lstVistex = new List<VistexProductVerticalOutBound>();
            var cmd = new Procs.dbo.PR_MYDL_STG_OUTB_BTCH_DATA
            {
                in_rqst_type = VistexMode.PROD_VERT_RULES.ToString("g"),
            };

            using (var rdr = DataAccess.ExecuteReader(cmd))
            {
                int IDX_BTCH_ID = DB.GetReaderOrdinal(rdr, "BTCH_ID");
                int IDX_JSON_DATA = DB.GetReaderOrdinal(rdr, "RQST_JSON_DATA");

                while (rdr.Read())
                {
                    lstVistex.Add(new VistexProductVerticalOutBound
                    {
                        ProductVertical = JsonConvert.DeserializeObject<VistexProductVerticalOutBound>((IDX_JSON_DATA < 0 || rdr.IsDBNull(IDX_JSON_DATA)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_JSON_DATA)).ProductVertical,
                        TransanctionId = (IDX_BTCH_ID < 0 || rdr.IsDBNull(IDX_BTCH_ID)) ? default(Guid) : rdr.GetFieldValue<Guid>(IDX_BTCH_ID)
                    });
                } // while
            }
            return lstVistex;
        }

        //Only for internal testing
        public List<VistexLogsInfo> GetVistexLogs(VistexMode vistexMode, DateTime StartDate, DateTime EndDate)
        {
            List<VistexLogsInfo> lstVistex = new List<VistexLogsInfo>();
            var cmd = new Procs.dbo.PR_MYDL_GET_DSA_RQST_RSPN_LOG
            {
                in_rqst_type = vistexMode.ToString("g"),
                in_from_dt = StartDate,
                in_to_dt = EndDate
            };

            using (var rdr = DataAccess.ExecuteReader(cmd))
            {
                int IDX_BTCH_ID = DB.GetReaderOrdinal(rdr, "BTCH_ID");
                int IDX_CRE_DTM = DB.GetReaderOrdinal(rdr, "CRE_DTM");
                int IDX_DEAL_ID = DB.GetReaderOrdinal(rdr, "DEAL_ID");
                int IDX_ERR_MSG = DB.GetReaderOrdinal(rdr, "ERR_MSG");
                int IDX_INTRFC_RQST_DTM = DB.GetReaderOrdinal(rdr, "INTRFC_RQST_DTM");
                int IDX_INTRFC_RSPN_DTM = DB.GetReaderOrdinal(rdr, "INTRFC_RSPN_DTM");
                int IDX_RQST_JSON_DATA = DB.GetReaderOrdinal(rdr, "RQST_JSON_DATA");
                int IDX_RQST_SID = DB.GetReaderOrdinal(rdr, "RQST_SID");
                int IDX_RQST_STS = DB.GetReaderOrdinal(rdr, "RQST_STS");
                int IDX_RQST_TYPE = DB.GetReaderOrdinal(rdr, "RQST_TYPE");
                int IDX_VISTEX_HYBRID_TYPE = DB.GetReaderOrdinal(rdr, "VISTEX_HYBRID_TYPE");

                while (rdr.Read())
                {
                    lstVistex.Add(new VistexLogsInfo
                    {
                        BTCH_ID = (IDX_BTCH_ID < 0 || rdr.IsDBNull(IDX_BTCH_ID)) ? default(System.Guid) : rdr.GetFieldValue<System.Guid>(IDX_BTCH_ID),
                        CRE_DTM = (IDX_CRE_DTM < 0 || rdr.IsDBNull(IDX_CRE_DTM)) ? default(System.DateTime) : rdr.GetFieldValue<System.DateTime>(IDX_CRE_DTM),
                        DEAL_ID = (IDX_DEAL_ID < 0 || rdr.IsDBNull(IDX_DEAL_ID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_DEAL_ID),
                        ERR_MSG = (IDX_ERR_MSG < 0 || rdr.IsDBNull(IDX_ERR_MSG)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_ERR_MSG),
                        INTRFC_RQST_DTM = (IDX_INTRFC_RQST_DTM < 0 || rdr.IsDBNull(IDX_INTRFC_RQST_DTM)) ? default(System.DateTime) : rdr.GetFieldValue<System.DateTime>(IDX_INTRFC_RQST_DTM),
                        INTRFC_RSPN_DTM = (IDX_INTRFC_RSPN_DTM < 0 || rdr.IsDBNull(IDX_INTRFC_RSPN_DTM)) ? default(System.DateTime) : rdr.GetFieldValue<System.DateTime>(IDX_INTRFC_RSPN_DTM),
                        RQST_JSON_DATA = (IDX_RQST_JSON_DATA < 0 || rdr.IsDBNull(IDX_RQST_JSON_DATA)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_RQST_JSON_DATA),
                        RQST_SID = (IDX_RQST_SID < 0 || rdr.IsDBNull(IDX_RQST_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_RQST_SID),
                        RQST_STS = (IDX_RQST_STS < 0 || rdr.IsDBNull(IDX_RQST_STS)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_RQST_STS),
                        RQST_TYPE = (IDX_RQST_TYPE < 0 || rdr.IsDBNull(IDX_RQST_TYPE)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_RQST_TYPE),
                        VISTEX_HYBRID_TYPE = (IDX_VISTEX_HYBRID_TYPE < 0 || rdr.IsDBNull(IDX_VISTEX_HYBRID_TYPE)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_VISTEX_HYBRID_TYPE)
                    });
                } // while
            }

            return lstVistex;
        }


        //Only for internal testing
        public List<string> GetStatuses()
        {
            return Enum.GetValues(typeof(VistexStage)).Cast<VistexStage>().Select(v => v.ToString()).ToList();
        }

        //Only for internal testing
        public Dictionary<string, string> GetVistexBody(int id)
        {
            Dictionary<string, string> dicRtn = new Dictionary<string, string>();
            var cmd = new Procs.dbo.PR_MYDL_GET_DSA_RQST_RSPN_BODY
            {
                rqst_sid = id
            };

            using (var rdr = DataAccess.ExecuteReader(cmd))
            {
                int IDX_RQST_JSON_DATA = DB.GetReaderOrdinal(rdr, "RQST_JSON_DATA");

                while (rdr.Read())
                {
                    dicRtn = JsonConvert.DeserializeObject<Dictionary<string, string>>((IDX_RQST_JSON_DATA < 0 || rdr.IsDBNull(IDX_RQST_JSON_DATA)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_RQST_JSON_DATA));
                } // while
            }

            return dicRtn;
        }

        public List<ProductCategory> GetProductVerticalBody(int id)
        {
            List<ProductCategory> lstRtn = new List<ProductCategory>();
            var cmd = new Procs.dbo.PR_MYDL_GET_DSA_RQST_RSPN_BODY
            {
                rqst_sid = id
            };

            using (var rdr = DataAccess.ExecuteReader(cmd))
            {
                int IDX_RQST_JSON_DATA = DB.GetReaderOrdinal(rdr, "RQST_JSON_DATA");

                while (rdr.Read())
                {
                    lstRtn = JsonConvert.DeserializeObject<VistexProductVerticalOutBound>(((IDX_RQST_JSON_DATA < 0 || rdr.IsDBNull(IDX_RQST_JSON_DATA)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_RQST_JSON_DATA)).Replace("\"CRE_DT\"", "\"CRE_DTM\"").Replace("\"CHG_DT\"", "\"CHG_DTM\"")).ProductVertical;
                } // while
            }

            return lstRtn;
        }

        //Only for internal testing
        public List<VistexLogsInfo> AddVistexData(List<int> lstDealIds)
        {
            List<VistexLogsInfo> lstVistex = new List<VistexLogsInfo>();
            var cmd = new Procs.dbo.PR_MYDL_VISTEX_DEALS_PRCSS
            {
                in_deal_lst = new type_int_list(lstDealIds.ToArray())
            };

            using (var rdr = DataAccess.ExecuteReader(cmd))
            {

               lstVistex = GetVistexLogs(VistexMode.VISTEX_DEALS, DateTime.Now.AddDays(-30), DateTime.Today);
            }
            return lstVistex;
        }

        //Only for internal testing
        public Guid UpdateStatus(Guid batchId, VistexStage vistexStage, int? dealId, string strErrorMessage)
        {
            var myDict = new Dictionary<int, string>
            {
                { dealId.HasValue? dealId.Value:0, strErrorMessage }
            };

            type_int_dictionary opPair = new type_int_dictionary();
            opPair.AddRows(myDict.Select(itm => new OpPair<int, string>
            {
                First = itm.Key,
                Second = itm.Value
            }));

            strErrorMessage = strErrorMessage.Trim();
            var cmd = new Procs.dbo.PR_MYDL_STG_OUTB_BTCH_STS_CHG
            {
                in_btch_id = batchId,
                in_rqst_sts = vistexStage.ToString("g"),
                in_deal_rspn_err = opPair
            };
            DataAccess.ExecuteNonQuery(cmd);
            return batchId;
        }
    }
}