using System;
using System.Collections.Generic;
using Intel.MyDeals.Entities;
using System.Linq;
using System.Runtime.InteropServices;
using Microsoft.Win32.SafeHandles;
using Procs = Intel.MyDeals.DataAccessLib.StoredProcedures.MyDeals;
using Intel.MyDeals.DataAccessLib;
using Intel.Opaque.DBAccess;
using System.Configuration;
using Vistex;

namespace Intel.MyDeals.DataLibrary
{
    public class VistexAdminDataLib : IDisposable
    {
        // Flag: Has Dispose already been called?
        bool disposed = false;
        // Instantiate a SafeHandle instance.
        SafeHandle handle = new SafeFileHandle(IntPtr.Zero, true);

        // Public implementation of Dispose pattern callable by consumers.
        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }

        // Protected implementation of Dispose pattern.
        protected virtual void Dispose(bool disposing)
        {
            if (disposed)
                return;

            if (disposing)
            {
                handle.Dispose();
                // Free any other managed objects here.
                //
            }

            disposed = true;
        }

        public VistexAdminDataLib()
        {
            DataAccess.ConnectionString = ConfigurationManager.ConnectionStrings["MyDealsConnectionString"].ConnectionString;
        }


        public List<Entities.Vistex> GetVistex(bool isBodyRequired)
        {
            List<Entities.Vistex> lstVistex = new List<Entities.Vistex>();
            var cmd = new Procs.dbo.PR_MYDL_GET_DSA_RQST_RSPN
            {
                in_rqst_type = VistexMode.VISTEX_DEALS.ToString("g"),
            };

            using (var rdr = DataAccess.ExecuteReader(cmd))
            {
                int IDX_RQST_SID = DB.GetReaderOrdinal(rdr, "RQST_SID");
                int IDX_DEAL_ID = DB.GetReaderOrdinal(rdr, "DEAL_ID");
                int IDX_BTCH_ID = DB.GetReaderOrdinal(rdr, "BTCH_ID");
                int IDX_RQST_STS = DB.GetReaderOrdinal(rdr, "RQST_STS");
                int IDX_INTRFC_RQST_DTM = DB.GetReaderOrdinal(rdr, "INTRFC_RQST_DTM");
                int IDX_INTRFC_RSPN_DTM = DB.GetReaderOrdinal(rdr, "INTRFC_RSPN_DTM");
                int IDX_ERR_MSG = DB.GetReaderOrdinal(rdr, "ERR_MSG");
                int IDX_CRE_DTM = DB.GetReaderOrdinal(rdr, "CRE_DTM");

                while (rdr.Read())
                {
                    lstVistex.Add(new Entities.Vistex
                    {
                        Id = (IDX_RQST_SID < 0 || rdr.IsDBNull(IDX_RQST_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_RQST_SID),
                        CreatedOn = (IDX_CRE_DTM < 0 || rdr.IsDBNull(IDX_CRE_DTM)) ? default(System.DateTime) : rdr.GetFieldValue<System.DateTime>(IDX_CRE_DTM),
                        DealId = (IDX_DEAL_ID < 0 || rdr.IsDBNull(IDX_DEAL_ID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_DEAL_ID),
                        Message = (IDX_ERR_MSG < 0 || rdr.IsDBNull(IDX_ERR_MSG)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_ERR_MSG),
                        ProcessedOn = (IDX_INTRFC_RQST_DTM < 0 || rdr.IsDBNull(IDX_INTRFC_RQST_DTM)) ? default(System.DateTime) : rdr.GetFieldValue<System.DateTime>(IDX_INTRFC_RQST_DTM),
                        SendToPoOn = (IDX_INTRFC_RSPN_DTM < 0 || rdr.IsDBNull(IDX_INTRFC_RSPN_DTM)) ? default(System.DateTime) : rdr.GetFieldValue<System.DateTime>(IDX_INTRFC_RSPN_DTM),
                        Status = (IDX_RQST_STS < 0 || rdr.IsDBNull(IDX_RQST_STS)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_RQST_STS),
                        TransanctionId = (IDX_BTCH_ID < 0 || rdr.IsDBNull(IDX_BTCH_ID)) ? default(Guid) : rdr.GetFieldValue<Guid>(IDX_BTCH_ID)
                    });
                } // while
            }

            return lstVistex;
        }

        public List<string> GetStatuses()
        {
            return Enum.GetValues(typeof(VistexStage)).Cast<VistexStage>().Select(v => v.ToString()).ToList();
        }

        public void SendFailureMessage(ResponseType responseType)
        {
            var cmd = new Procs.dbo.PR_SQL_DB_MAIL
            {
                from_user_email = ConfigurationManager.AppSettings["FromEmail"],
                to_user_email = ConfigurationManager.AppSettings["ToEmails"],
                subject = "Error occured in Vistex services",
                message = string.Concat("Unable to invoke service of Vistex due to the reason : ", VistexHttpService.GetResposnseMessage(responseType)),
                dce_cc_list = string.Empty,
                priority = "1",
                attachment = string.Empty,
                query_attachment_filename = string.Empty,
                dce_bcc_list = null
            };
            DataAccess.ExecuteNonQuery(cmd);
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

        public List<Entities.Vistex> GetVistexOutBoundData()
        {
            List<Entities.Vistex> lstVistex = new List<Entities.Vistex>();
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
                    lstVistex.Add(new Entities.Vistex
                    {
                        DataBody = (IDX_JSON_DATA < 0 || rdr.IsDBNull(IDX_JSON_DATA)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_JSON_DATA),
                        DealId = (IDX_DEAL_ID < 0 || rdr.IsDBNull(IDX_DEAL_ID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_DEAL_ID),
                        TransanctionId = (IDX_BTCH_ID < 0 || rdr.IsDBNull(IDX_BTCH_ID)) ? default(Guid) : rdr.GetFieldValue<Guid>(IDX_BTCH_ID)
                    });
                } // while
            }
            return lstVistex;
        }

        public List<Entities.Vistex> AddVistexData(List<int> lstDealIds)
        {
            List<Entities.Vistex> lstVistex = new List<Entities.Vistex>();
            var cmd = new Procs.dbo.PR_MYDL_INS_DSA_RQST_RSPN_LOG
            {
                in_rqst_type = VistexMode.VISTEX_DEALS.ToString("g"),
                in_deal_lst = new type_int_list(lstDealIds.ToArray()),
            };

            using (var rdr = DataAccess.ExecuteReader(cmd))
            {
                int IDX_RQST_SID = DB.GetReaderOrdinal(rdr, "RQST_SID");
                int iDealIndex = 0;
                while (rdr.Read())
                {
                    lstVistex.Add(new Entities.Vistex
                    {
                        Id = (IDX_RQST_SID < 0 || rdr.IsDBNull(IDX_RQST_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_RQST_SID),
                        DealId = lstDealIds[iDealIndex],
                        Message = string.Empty,
                        ProcessedOn = default(System.DateTime),
                        SendToPoOn = default(System.DateTime),
                        Status = VistexStage.Pending.ToString("g"),
                        CreatedOn = DateTime.Now,
                        TransanctionId = default(Guid)
                    });
                    iDealIndex++;
                } // while
            }
            return lstVistex;
        }

        public Guid UpdateStatus(Guid batchId, VistexStage vistexStage, string strErrorMessage)
        {
            //strErrorMessage = strErrorMessage.Trim();
            //var cmd = new Procs.dbo.PR_MYDL_STG_OUTB_BTCH_STS_CHG
            //{
            //    in_btch_id = batchId,
            //    in_rqst_sts = vistexStage.ToString("g"),
            //    in_err_msg = strErrorMessage != string.Empty && strErrorMessage != "null" ? strErrorMessage : null
            //};
            //DataAccess.ExecuteNonQuery(cmd);
            return batchId;
        }
    }
}