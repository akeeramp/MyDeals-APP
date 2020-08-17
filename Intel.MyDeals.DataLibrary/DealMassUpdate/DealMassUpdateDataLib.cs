using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IDataLibrary;
using Intel.MyDeals.DataAccessLib;
using Procs = Intel.MyDeals.DataAccessLib.StoredProcedures.MyDeals;
using Intel.Opaque.DBAccess;
using Intel.Opaque;


namespace Intel.MyDeals.DataLibrary
{
    public class DealMassUpdateDataLib : IDealMassUpdateDataLib
    {
        public List<DealMassUpdateResults> UpdateMassDealAttributes(DealMassUpdateData data)
        {
            var result = new List<DealMassUpdateResults>();
            List<int> DealIds = data.DEAL_IDS.Split(',').Select(Int32.Parse).ToList();
            try
            {
                using (var rdr = DataAccess.ExecuteReader(new Procs.dbo.PR_MYDL_UPD_DEAL_ATRBS
                {

                    in_deal_lst = new type_int_list(DealIds.ToArray()),
                    in_atrb_sid = data.ATRB_SID,
                    in_atrb_val = data.UPD_VAL,
                    in_emp_wwid = OpUserStack.MyOpUserToken.Usr.WWID,
                    in_send_vstx_flg = data.SEND_VSTX_FLG

                }))
                {
                    int IDX_DEAL_ID = DB.GetReaderOrdinal(rdr, "DEAL_ID");
                    int IDX_UPD_MSG = DB.GetReaderOrdinal(rdr, "UPD_MSG");
                    int IDX_ERR_FLAG = DB.GetReaderOrdinal(rdr, "ERR_FLAG");

                    while (rdr.Read())
                    {
                        result.Add(new DealMassUpdateResults
                        {
                            DEAL_ID = (IDX_DEAL_ID < 0 || rdr.IsDBNull(IDX_DEAL_ID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_DEAL_ID),
                            UPD_MSG = (IDX_UPD_MSG < 0 || rdr.IsDBNull(IDX_UPD_MSG)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_UPD_MSG),
                            ERR_FLAG = (IDX_ERR_FLAG < 0 || rdr.IsDBNull(IDX_ERR_FLAG)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_ERR_FLAG)

                        });

                    }
                }
            }
            catch (Exception ex)
            {
                OpLogPerf.Log(ex);
                throw;
            }
            return result;
        }

        public List<AttributeFeildvalues> GetAttributeValues(int atrb_sid)
        {
            var result = new List<AttributeFeildvalues>();
            string actn_type = "";
            if (atrb_sid > 0)
            {
                actn_type = "DRPDWN_ATRB_VALS";
            }
            else
            {
                actn_type = "DRPDWN_ATRBS";
            }
            try
            {
                using (var rdr = DataAccess.ExecuteReader(new Procs.dbo.PR_MYDL_GET_ATRB_LKUP_DROPDOWNS
                {
                    in_actn_type = actn_type,
                    in_atrb_sid = atrb_sid

                }))
                {
                    int IDX_ATRB_SID = DB.GetReaderOrdinal(rdr, "ATRB_SID");
                    int IDX_ATRB_LBL = DB.GetReaderOrdinal(rdr, "ATRB_LBL");
                    int IDX_ATRB_VAL_TXT = DB.GetReaderOrdinal(rdr, "ATRB_VAL_TXT");

                    while (rdr.Read())
                    {
                        if (atrb_sid > 0)
                        {
                            result.Add(new AttributeFeildvalues
                            {
                                ATRB_SID = (IDX_ATRB_SID < 0 || rdr.IsDBNull(IDX_ATRB_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_ATRB_SID),
                                ATRB_VAL_TXT = (IDX_ATRB_VAL_TXT < 0 || rdr.IsDBNull(IDX_ATRB_VAL_TXT)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_ATRB_VAL_TXT)
                            });                            
                        }
                        else
                        {
                            result.Add(new AttributeFeildvalues
                            {
                                ATRB_SID = (IDX_ATRB_SID < 0 || rdr.IsDBNull(IDX_ATRB_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_ATRB_SID),
                                ATRB_LBL = (IDX_ATRB_LBL < 0 || rdr.IsDBNull(IDX_ATRB_LBL)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_ATRB_LBL)
                            });
                        }

                    }
                }
            }
            catch(Exception ex)
            {
                OpLogPerf.Log(ex);
                throw;
            }

            return result;
        }
    }
}
