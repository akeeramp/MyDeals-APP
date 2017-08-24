using System;
using System.Collections.Generic;
using Intel.MyDeals.DataAccessLib;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IDataLibrary;
using Intel.Opaque;
using Intel.Opaque.DBAccess;
using Procs = Intel.MyDeals.DataAccessLib.StoredProcedures.MyDeals;

namespace Intel.MyDeals.DataLibrary
{
    public class MeetCompDataLib : IMeetCompDataLib
    {
        public List<MeetComp> GetMeetCompData()
        {
            OpLogPerf.Log("GetMeetComp");

            var ret = new List<MeetComp>();
            var cmd = new Procs.dbo.PR_MYDL_UPD_MEET_COMP { };

            try
            {
                using (var rdr = DataAccess.ExecuteReader(new Procs.dbo.PR_MYDL_UPD_MEET_COMP
                {
                    @MODE = "SELECT"
                }))
                {
                    int IDX_ACTV_IND = DB.GetReaderOrdinal(rdr, "ACTV_IND");
                    int IDX_CHG_DTM = DB.GetReaderOrdinal(rdr, "CHG_DTM");
                    int IDX_CHG_EMP_NM = DB.GetReaderOrdinal(rdr, "CHG_EMP_NM");
                    int IDX_CHG_EMP_WWID = DB.GetReaderOrdinal(rdr, "CHG_EMP_WWID");
                    int IDX_COMP_BNCH = DB.GetReaderOrdinal(rdr, "COMP_BNCH");
                    int IDX_CRE_DTM = DB.GetReaderOrdinal(rdr, "CRE_DTM");
                    int IDX_CRE_EMP_NM = DB.GetReaderOrdinal(rdr, "CRE_EMP_NM");
                    int IDX_CRE_EMP_WWID = DB.GetReaderOrdinal(rdr, "CRE_EMP_WWID");
                    int IDX_CUST_MBR_SID = DB.GetReaderOrdinal(rdr, "CUST_MBR_SID");
                    int IDX_CUST_NM = DB.GetReaderOrdinal(rdr, "CUST_NM");
                    int IDX_HIER_VAL_NM = DB.GetReaderOrdinal(rdr, "HIER_VAL_NM");
                    int IDX_IA_BNCH = DB.GetReaderOrdinal(rdr, "IA_BNCH");
                    int IDX_MEET_COMP_PRC = DB.GetReaderOrdinal(rdr, "MEET_COMP_PRC");
                    int IDX_MEET_COMP_PRD = DB.GetReaderOrdinal(rdr, "MEET_COMP_PRD");
                    int IDX_MEET_COMP_SID = DB.GetReaderOrdinal(rdr, "MEET_COMP_SID");
                    int IDX_PRD_CAT_NM = DB.GetReaderOrdinal(rdr, "PRD_CAT_NM");
                    int IDX_PRD_MBR_SID = DB.GetReaderOrdinal(rdr, "PRD_MBR_SID");

                    while (rdr.Read())
                    {
                        ret.Add(new MeetComp
                        {
                            ACTV_IND = (IDX_ACTV_IND < 0 || rdr.IsDBNull(IDX_ACTV_IND)) ? default(System.Boolean) : rdr.GetFieldValue<System.Boolean>(IDX_ACTV_IND),
                            CHG_DTM = (IDX_CHG_DTM < 0 || rdr.IsDBNull(IDX_CHG_DTM)) ? default(System.DateTime) : rdr.GetFieldValue<System.DateTime>(IDX_CHG_DTM),
                            CHG_EMP_NM = (IDX_CHG_EMP_NM < 0 || rdr.IsDBNull(IDX_CHG_EMP_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_CHG_EMP_NM),
                            CHG_EMP_WWID = (IDX_CHG_EMP_WWID < 0 || rdr.IsDBNull(IDX_CHG_EMP_WWID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_CHG_EMP_WWID),
                            COMP_BNCH = (IDX_COMP_BNCH < 0 || rdr.IsDBNull(IDX_COMP_BNCH)) ? default(System.Decimal) : rdr.GetFieldValue<System.Decimal>(IDX_COMP_BNCH),
                            CRE_DTM = (IDX_CRE_DTM < 0 || rdr.IsDBNull(IDX_CRE_DTM)) ? default(System.DateTime) : rdr.GetFieldValue<System.DateTime>(IDX_CRE_DTM),
                            CRE_EMP_NM = (IDX_CRE_EMP_NM < 0 || rdr.IsDBNull(IDX_CRE_EMP_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_CRE_EMP_NM),
                            CRE_EMP_WWID = (IDX_CRE_EMP_WWID < 0 || rdr.IsDBNull(IDX_CRE_EMP_WWID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_CRE_EMP_WWID),
                            CUST_MBR_SID = (IDX_CUST_MBR_SID < 0 || rdr.IsDBNull(IDX_CUST_MBR_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_CUST_MBR_SID),
                            CUST_NM = (IDX_CUST_NM < 0 || rdr.IsDBNull(IDX_CUST_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_CUST_NM),
                            HIER_VAL_NM = (IDX_HIER_VAL_NM < 0 || rdr.IsDBNull(IDX_HIER_VAL_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_HIER_VAL_NM),
                            IA_BNCH = (IDX_IA_BNCH < 0 || rdr.IsDBNull(IDX_IA_BNCH)) ? default(System.Decimal) : rdr.GetFieldValue<System.Decimal>(IDX_IA_BNCH),
                            MEET_COMP_PRC = (IDX_MEET_COMP_PRC < 0 || rdr.IsDBNull(IDX_MEET_COMP_PRC)) ? default(System.Decimal) : rdr.GetFieldValue<System.Decimal>(IDX_MEET_COMP_PRC),
                            MEET_COMP_PRD = (IDX_MEET_COMP_PRD < 0 || rdr.IsDBNull(IDX_MEET_COMP_PRD)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_MEET_COMP_PRD),
                            MEET_COMP_SID = (IDX_MEET_COMP_SID < 0 || rdr.IsDBNull(IDX_MEET_COMP_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_MEET_COMP_SID),
                            PRD_CAT_NM = (IDX_PRD_CAT_NM < 0 || rdr.IsDBNull(IDX_PRD_CAT_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_PRD_CAT_NM),
                            PRD_MBR_SID = (IDX_PRD_MBR_SID < 0 || rdr.IsDBNull(IDX_PRD_MBR_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_PRD_MBR_SID)
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

        public List<MeetComp> ActivateDeactivateMeetComp(int MEET_COMP_SID, bool ACTV_IND, DateTime CHG_DTM)
        {
            OpLogPerf.Log("UpdateMeetComp");

            var ret = new List<MeetComp>();
            var cmd = new Procs.dbo.PR_MYDL_UPD_MEET_COMP { };

            try
            {
                using (var rdr = DataAccess.ExecuteReader(new Procs.dbo.PR_MYDL_UPD_MEET_COMP
                {
                    @MODE = "UPDATE",
                    @MEET_COMP_SID = MEET_COMP_SID,
                    @ACTV_IND = ACTV_IND,
                    @CHG_EMP_WWID = OpUserStack.MyOpUserToken.Usr.WWID,
                    @CHG_DTM = CHG_DTM
                }))
                {
                    int IDX_MEET_COMP_SID = DB.GetReaderOrdinal(rdr, "MEET_COMP_SID");

                    while (rdr.Read())
                    {
                        ret.Add(new MeetComp
                        {
                            MEET_COMP_SID = (IDX_MEET_COMP_SID < 0 || rdr.IsDBNull(IDX_MEET_COMP_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_MEET_COMP_SID)
                        });
                    } // while
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
