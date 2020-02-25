using System;
using System.Collections.Generic;
using Intel.MyDeals.DataAccessLib;
using Intel.MyDeals.Entities;
using Intel.Opaque.DBAccess;
using System.Data.SqlClient;
using Procs = Intel.MyDeals.DataAccessLib.StoredProcedures.MyDeals;
using System.Linq;

namespace Intel.MyDeals.DataLibrary
{
    public class VistexAdminDataLib
    {
        public List<Vistex> GetVistex(bool isBodyRequired)
        {
            List<Vistex> lstVistex = new List<Vistex>();
            var cmd = new Procs.dbo.PR_MYDL_GET_DSA_RQST_RSPN
            {
            };

            using (var rdr = DataAccess.ExecuteReader(cmd))
            {
                int IDX_RQST_SID = DB.GetReaderOrdinal(rdr, "RQST_SID");
                int IDX_RQST_TYPE = DB.GetReaderOrdinal(rdr, "RQST_TYPE");
                int IDX_DEAL_ID = DB.GetReaderOrdinal(rdr, "DEAL_ID");
                int IDX_BTCH_ID = DB.GetReaderOrdinal(rdr, "BTCH_ID");
                int IDX_RQST_STS = DB.GetReaderOrdinal(rdr, "RQST_STS");
                int IDX_INTRFC_RQST_DTM = DB.GetReaderOrdinal(rdr, "INTRFC_RQST_DTM");
                int IDX_INTRFC_RSPN_DTM = DB.GetReaderOrdinal(rdr, "INTRFC_RSPN_DTM");
                int IDX_ERR_MSG = DB.GetReaderOrdinal(rdr, "ERR_MSG");
                int IDX_CRE_DTM = DB.GetReaderOrdinal(rdr, "CRE_DTM");

                while (rdr.Read())
                {
                    lstVistex.Add(new Vistex
                    {
                        Id = (IDX_RQST_SID < 0 || rdr.IsDBNull(IDX_RQST_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_RQST_SID),
                        CreatedOn = (IDX_CRE_DTM < 0 || rdr.IsDBNull(IDX_CRE_DTM)) ? default(System.DateTime) : rdr.GetFieldValue<System.DateTime>(IDX_CRE_DTM),
                        DealId = (IDX_DEAL_ID < 0 || rdr.IsDBNull(IDX_DEAL_ID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_DEAL_ID),
                        Message = (IDX_ERR_MSG < 0 || rdr.IsDBNull(IDX_ERR_MSG)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_ERR_MSG),
                        Mode = (VistexMode)Enum.Parse(typeof(VistexMode), ((IDX_RQST_TYPE < 0 || rdr.IsDBNull(IDX_RQST_TYPE)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_RQST_TYPE))),
                        ProcessedOn = (IDX_INTRFC_RQST_DTM < 0 || rdr.IsDBNull(IDX_INTRFC_RQST_DTM)) ? default(System.DateTime) : rdr.GetFieldValue<System.DateTime>(IDX_INTRFC_RQST_DTM),
                        SendToPoOn = (IDX_INTRFC_RSPN_DTM < 0 || rdr.IsDBNull(IDX_INTRFC_RSPN_DTM)) ? default(System.DateTime) : rdr.GetFieldValue<System.DateTime>(IDX_INTRFC_RSPN_DTM),
                        Status = (VistexStage)Enum.Parse(typeof(VistexStage), ((IDX_RQST_STS < 0 || rdr.IsDBNull(IDX_RQST_STS)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_RQST_STS))),
                        TransanctionId = (IDX_BTCH_ID < 0 || rdr.IsDBNull(IDX_BTCH_ID)) ? default(Guid) : rdr.GetFieldValue<Guid>(IDX_BTCH_ID)
                    });
                } // while
            }


            //If needed
            lstVistex.ForEach(x =>
            {
                x.ModeLabel = x.Mode.ToString("g");
                x.StatusLabel = x.Status.ToString("g");
            });
            return lstVistex;
        }

        public List<string> GetStatuses()
        {
            return Enum.GetValues(typeof(VistexStage)).Cast<VistexStage>().Select(v => v.ToString()).ToList();
        }

        public string GetVistexBody(int id)
        {
            string strJson = string.Empty;
            var cmd = new Procs.dbo.PR_MYDL_GET_DSA_RQST_RSPN_BODY
            {
                rqst_sid = id
            };

            using (var rdr = DataAccess.ExecuteReader(cmd))
            {
                int IDX_RQST_JSON_DATA = DB.GetReaderOrdinal(rdr, "RQST_JSON_DATA");

                while (rdr.Read())
                {
                    strJson = (IDX_RQST_JSON_DATA < 0 || rdr.IsDBNull(IDX_RQST_JSON_DATA)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_RQST_JSON_DATA);
                } // while
            }
            
            return strJson;
        }

        public void GetVistexOutBoundData()
        {
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
                    Guid batchId = rdr.GetTypedValue<Guid>(IDX_BTCH_ID, Guid.Empty);
                    int iDealId = (IDX_DEAL_ID < 0 || rdr.IsDBNull(IDX_DEAL_ID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_DEAL_ID);
                    string strJsonData = (IDX_JSON_DATA < 0 || rdr.IsDBNull(IDX_JSON_DATA)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_JSON_DATA);
                } // while
            }
        }

        public void AddData(List<int> lstDealIds)
        {
            var cmd = new Procs.dbo.PR_MYDL_INS_DSA_RQST_RSPN_LOG
            {
                in_rqst_type = VistexMode.VISTEX_DEALS.ToString("g"),
                in_deal_lst = new type_int_list(lstDealIds.ToArray()),
            };
            DataAccess.ExecuteNonQuery(cmd);
        }

        public Guid UpdateStatus(Guid batchId, VistexStage vistexStage, string strErrorMessage)
        {
            strErrorMessage = strErrorMessage.Trim();
            var cmd = new Procs.dbo.PR_MYDL_STG_OUTB_BTCH_STS_CHG
            {
                in_btch_id = batchId,
                in_rqst_sts = vistexStage.ToString("g"),
                in_err_msg = strErrorMessage != string.Empty ? strErrorMessage : null
            };
            DataAccess.ExecuteNonQuery(cmd);
            return batchId;
        }
    }
}