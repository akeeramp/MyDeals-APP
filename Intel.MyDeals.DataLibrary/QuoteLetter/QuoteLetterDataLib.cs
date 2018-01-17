using Intel.MyDeals.DataAccessLib;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IDataLibrary;
using Intel.Opaque;
using Intel.Opaque.DBAccess;
using System;
using System.Collections.Generic;
using Procs = Intel.MyDeals.DataAccessLib.StoredProcedures.MyDeals;

namespace Intel.MyDeals.DataLibrary
{
    public class QuoteLetterDataLib : IQuoteLetterDataLib
    {
        public QuoteLetterDataLib()
        {
        }

        public List<QuoteLetter> GetQuoteLetterTemplates()
        {
            var ret = new List<QuoteLetter>();
            Procs.dbo.PR_MANAGE_QUOTE_LETTER_TEMPLATES cmd = new Procs.dbo.PR_MANAGE_QUOTE_LETTER_TEMPLATES()
            {
                intWWID = OpUserStack.MyOpUserToken.Usr.WWID,
                mode = "Select",
                objSetTypeSid = 3,
                programPaymentType = "FRONTEND",
                headerInfo = null,
                bodyInfo = null,
                debug = false
            };
            
            try
            {
                using (var rdr = DataAccess.ExecuteReader(cmd))
                {
                    int IDX_BODY_INFO = DB.GetReaderOrdinal(rdr, "BODY_INFO");
                    int IDX_HDR_INFO = DB.GetReaderOrdinal(rdr, "HDR_INFO");
                    int IDX_OBJ_SET_TYPE_SID = DB.GetReaderOrdinal(rdr, "OBJ_SET_TYPE_SID");
                    int IDX_PROGRAM_PAYMENT = DB.GetReaderOrdinal(rdr, "PROGRAM_PAYMENT");
                    int IDX_TMPLT_SID = DB.GetReaderOrdinal(rdr, "TMPLT_SID");

                    while (rdr.Read())
                    {
                        ret.Add(new QuoteLetter
                        {
                            BODY_INFO = (IDX_BODY_INFO < 0 || rdr.IsDBNull(IDX_BODY_INFO)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_BODY_INFO),
                            HDR_INFO = (IDX_HDR_INFO < 0 || rdr.IsDBNull(IDX_HDR_INFO)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_HDR_INFO),
                            OBJ_SET_TYPE_SID = (IDX_OBJ_SET_TYPE_SID < 0 || rdr.IsDBNull(IDX_OBJ_SET_TYPE_SID)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_OBJ_SET_TYPE_SID),
                            PROGRAM_PAYMENT = (IDX_PROGRAM_PAYMENT < 0 || rdr.IsDBNull(IDX_PROGRAM_PAYMENT)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_PROGRAM_PAYMENT),
                            TMPLT_SID = (IDX_TMPLT_SID < 0 || rdr.IsDBNull(IDX_TMPLT_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_TMPLT_SID)
                        });
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