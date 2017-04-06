using System;
using System.Collections.Generic;
using System.Linq;
using Intel.MyDeals.DataAccessLib;
using Intel.MyDeals.Entities;
using Intel.Opaque.DBAccess;
using Procs = Intel.MyDeals.DataAccessLib.StoredProcedures.MyDeals;
using Intel.MyDeals.IDataLibrary;
using Intel.Opaque;

namespace Intel.MyDeals.DataLibrary
{
    public class ConstantLookupDataLib : IConstantLookupDataLib
    {
        public List<LookupItem> GetLookups()
        {
            List<LookupItem> fake = new List<LookupItem>();
            fake.Add(new LookupItem { ATRB_CD = "OPTION", ATRB_COL_NM = "OPTION", DEAL_TYPE_CD = "ALL DEALS", ORD = 1, DROP_DOWN = "OPTION 1" });
            fake.Add(new LookupItem { ATRB_CD = "OPTION", ATRB_COL_NM = "OPTION", DEAL_TYPE_CD = "ALL DEALS", ORD = 1, DROP_DOWN = "OPTION 2" });
            fake.Add(new LookupItem { ATRB_CD = "OPTION", ATRB_COL_NM = "OPTION", DEAL_TYPE_CD = "ALL DEALS", ORD = 1, DROP_DOWN = "OPTION 3" });
            fake.Add(new LookupItem { ATRB_CD = "OPTION", ATRB_COL_NM = "OPTION", DEAL_TYPE_CD = "ALL DEALS", ORD = 1, DROP_DOWN = "OPTION 4" });
            fake.Add(new LookupItem { ATRB_CD = "OPTION", ATRB_COL_NM = "OPTION", DEAL_TYPE_CD = "ALL DEALS", ORD = 1, DROP_DOWN = "OPTION 5" });
            fake.Add(new LookupItem { ATRB_CD = "TEST", ATRB_COL_NM = "TEST", DEAL_TYPE_CD = "ALL DEALS", ORD = 1, DROP_DOWN = "TEST 1" });
            fake.Add(new LookupItem { ATRB_CD = "TEST", ATRB_COL_NM = "TEST", DEAL_TYPE_CD = "ALL DEALS", ORD = 1, DROP_DOWN = "TEST 2" });
            fake.Add(new LookupItem { ATRB_CD = "TEST", ATRB_COL_NM = "TEST", DEAL_TYPE_CD = "ALL DEALS", ORD = 1, DROP_DOWN = "TEST 3" });
            fake.Add(new LookupItem { ATRB_CD = "TEST", ATRB_COL_NM = "TEST", DEAL_TYPE_CD = "ALL DEALS", ORD = 1, DROP_DOWN = "TEST 4" });
            fake.Add(new LookupItem { ATRB_CD = "TEST", ATRB_COL_NM = "TEST", DEAL_TYPE_CD = "ALL DEALS", ORD = 1, DROP_DOWN = "TEST 5" });

            fake.Add(new LookupItem { ATRB_CD = "NUM_TIERS", ATRB_COL_NM = "NUM_TIERS", DEAL_TYPE_CD = "ALL DEALS", ORD = 1, DROP_DOWN = "1" });
            fake.Add(new LookupItem { ATRB_CD = "NUM_TIERS", ATRB_COL_NM = "NUM_TIERS", DEAL_TYPE_CD = "ALL DEALS", ORD = 1, DROP_DOWN = "2" });
            fake.Add(new LookupItem { ATRB_CD = "NUM_TIERS", ATRB_COL_NM = "NUM_TIERS", DEAL_TYPE_CD = "ALL DEALS", ORD = 1, DROP_DOWN = "3" });
            fake.Add(new LookupItem { ATRB_CD = "NUM_TIERS", ATRB_COL_NM = "NUM_TIERS", DEAL_TYPE_CD = "ALL DEALS", ORD = 1, DROP_DOWN = "4" });
            fake.Add(new LookupItem { ATRB_CD = "NUM_TIERS", ATRB_COL_NM = "NUM_TIERS", DEAL_TYPE_CD = "ALL DEALS", ORD = 1, DROP_DOWN = "5" });
            fake.Add(new LookupItem { ATRB_CD = "NUM_TIERS", ATRB_COL_NM = "NUM_TIERS", DEAL_TYPE_CD = "ALL DEALS", ORD = 1, DROP_DOWN = "6" });
            fake.Add(new LookupItem { ATRB_CD = "NUM_TIERS", ATRB_COL_NM = "NUM_TIERS", DEAL_TYPE_CD = "ALL DEALS", ORD = 1, DROP_DOWN = "7" });
            fake.Add(new LookupItem { ATRB_CD = "NUM_TIERS", ATRB_COL_NM = "NUM_TIERS", DEAL_TYPE_CD = "ALL DEALS", ORD = 1, DROP_DOWN = "8" });
            fake.Add(new LookupItem { ATRB_CD = "NUM_TIERS", ATRB_COL_NM = "NUM_TIERS", DEAL_TYPE_CD = "ALL DEALS", ORD = 1, DROP_DOWN = "9" });

            fake.Add(new LookupItem { ATRB_CD = "DROPDOWN", ATRB_COL_NM = "DROPDOWN", DEAL_TYPE_CD = "ALL DEALS", ORD = 1, DROP_DOWN = "DROPDOWN 1" });
            fake.Add(new LookupItem { ATRB_CD = "DROPDOWN", ATRB_COL_NM = "DROPDOWN", DEAL_TYPE_CD = "ALL DEALS", ORD = 1, DROP_DOWN = "DROPDOWN 2" });
            fake.Add(new LookupItem { ATRB_CD = "DROPDOWN", ATRB_COL_NM = "DROPDOWN", DEAL_TYPE_CD = "ALL DEALS", ORD = 1, DROP_DOWN = "DROPDOWN 3" });
            fake.Add(new LookupItem { ATRB_CD = "DROPDOWN", ATRB_COL_NM = "DROPDOWN", DEAL_TYPE_CD = "ALL DEALS", ORD = 1, DROP_DOWN = "DROPDOWN 4" });
            fake.Add(new LookupItem { ATRB_CD = "DROPDOWN", ATRB_COL_NM = "DROPDOWN", DEAL_TYPE_CD = "ALL DEALS", ORD = 1, DROP_DOWN = "DROPDOWN 5" });

            fake.Add(new LookupItem { ATRB_CD = "COMBOBOX", ATRB_COL_NM = "COMBOBOX", DEAL_TYPE_CD = "ALL DEALS", ORD = 1, DROP_DOWN = "COMBOBOX 1" });
            fake.Add(new LookupItem { ATRB_CD = "COMBOBOX", ATRB_COL_NM = "COMBOBOX", DEAL_TYPE_CD = "ALL DEALS", ORD = 1, DROP_DOWN = "COMBOBOX 2" });
            fake.Add(new LookupItem { ATRB_CD = "COMBOBOX", ATRB_COL_NM = "COMBOBOX", DEAL_TYPE_CD = "ALL DEALS", ORD = 1, DROP_DOWN = "COMBOBOX 3" });
            fake.Add(new LookupItem { ATRB_CD = "COMBOBOX", ATRB_COL_NM = "COMBOBOX", DEAL_TYPE_CD = "ALL DEALS", ORD = 1, DROP_DOWN = "COMBOBOX 4" });
            fake.Add(new LookupItem { ATRB_CD = "COMBOBOX", ATRB_COL_NM = "COMBOBOX", DEAL_TYPE_CD = "ALL DEALS", ORD = 1, DROP_DOWN = "COMBOBOX 5" });

            return fake;
            ////var cmd = new Procs.CDMS_MYDEALS.app.PR_GET_LOOKUPS();

            ////List<LookupItem> returnLookupsList = new List<LookupItem>();
            ////using (var rdr = DataAccess.ExecuteReader(cmd))
            ////{
            ////    int IDX_ATRB_COL_NM = DB.GetReaderOrdinal(rdr, "ATRB_COL_NM");
            ////    int IDX_DEAL_TYPE_CD = DB.GetReaderOrdinal(rdr, "DEAL_TYPE_CD");
            ////    int IDX_DROP_DOWN = DB.GetReaderOrdinal(rdr, "DROP_DOWN");
            ////    int IDX_DROP_DOWN_DB = DB.GetReaderOrdinal(rdr, "DROP_DOWN_DB");
            ////    int IDX_ORD = DB.GetReaderOrdinal(rdr, "ORD");
            ////    while (rdr.Read())
            ////    {
            ////        returnLookupsList.Add(new LookupItem
            ////        {
            ////            ATRB_COL_NM = (IDX_ATRB_COL_NM < 0 || rdr.IsDBNull(IDX_ATRB_COL_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_ATRB_COL_NM),
            ////            DEAL_TYPE_CD = (IDX_DEAL_TYPE_CD < 0 || rdr.IsDBNull(IDX_DEAL_TYPE_CD)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_DEAL_TYPE_CD),
            ////            DROP_DOWN = (IDX_DROP_DOWN < 0 || rdr.IsDBNull(IDX_DROP_DOWN)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_DROP_DOWN),
            ////            DROP_DOWN_DB = (IDX_DROP_DOWN_DB < 0 || rdr.IsDBNull(IDX_DROP_DOWN_DB)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_DROP_DOWN_DB),
            ////            ORD = (IDX_ORD < 0 || rdr.IsDBNull(IDX_ORD)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_ORD)
            ////        });
            ////    }
            ////}
            ////return returnLookupsList;
        }

        #region Constants Admin

        public int GetAdminToolConstInt(string cnstLookup, int defaultValue = 0)
        {
            int constRetValue;
            if (!int.TryParse(GetAdminToolConst(cnstLookup, defaultValue.ToString()), out constRetValue)) constRetValue = defaultValue;

            return constRetValue;
        }

        public string GetAdminToolConst(string cnstLookup, string defaultValue = "")
        {
            return GetAdminConstants().Where(c => c.CNST_NM == cnstLookup).Select(c => c.CNST_VAL_TXT).FirstOrDefault() ?? defaultValue;
        }

        public List<AdminConstant> GetAdminConstants()
        {
            var cmd = new Procs.dbo.PR_MANAGE_CONSTANT_VALUES
            {
                emp_wwid = OpUserStack.MyOpUserToken.Usr.WWID,
                mode = CrudModes.Select.ToString()
            };

            List<AdminConstant> returnConstantsList = new List<AdminConstant>();
            using (var rdr = DataAccess.ExecuteReader(cmd))
            {
                int IDX_CNST_DESC = DB.GetReaderOrdinal(rdr, "CNST_DESC");
                int IDX_CNST_NM = DB.GetReaderOrdinal(rdr, "CNST_NM");
                int IDX_CNST_SID = DB.GetReaderOrdinal(rdr, "CNST_SID");
                int IDX_CNST_VAL_TXT = DB.GetReaderOrdinal(rdr, "CNST_VAL_TXT");
                int IDX_UI_UPD_FLG = DB.GetReaderOrdinal(rdr, "UI_UPD_FLG");

                while (rdr.Read())
                {
                    returnConstantsList.Add(new AdminConstant
                    {
                        CNST_DESC = (IDX_CNST_DESC < 0 || rdr.IsDBNull(IDX_CNST_DESC)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_CNST_DESC),
                        CNST_NM = (IDX_CNST_NM < 0 || rdr.IsDBNull(IDX_CNST_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_CNST_NM),
                        CNST_SID = (IDX_CNST_SID < 0 || rdr.IsDBNull(IDX_CNST_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_CNST_SID),
                        CNST_VAL_TXT = (IDX_CNST_VAL_TXT < 0 || rdr.IsDBNull(IDX_CNST_VAL_TXT)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_CNST_VAL_TXT),
                        UI_UPD_FLG = rdr.IsDBNull(IDX_UI_UPD_FLG) ? default(System.Boolean) : rdr.GetFieldValue<System.Boolean>(IDX_UI_UPD_FLG),
                    });
                }
            }

            return returnConstantsList;
        }

        public AdminConstant SetAdminConstants(CrudModes mode, AdminConstant adminValues)
        {
            OpLogPerf.Log("SetAdminConstants");
            var ret = new List<AdminConstant>();

            try
            {
                using (var rdr = DataAccess.ExecuteReader(new Procs.dbo.PR_MANAGE_CONSTANT_VALUES
                {
                    emp_wwid = OpUserStack.MyOpUserToken.Usr.WWID,
                    mode = mode.ToString(),
                    cnst_nm = adminValues.CNST_NM,
                    cnst_sid = adminValues.CNST_SID,
                    cnst_desc = adminValues.CNST_DESC,
                    cnst_val_txt = adminValues.CNST_VAL_TXT,
                    ui_upd_flg = adminValues.UI_UPD_FLG,
                }))
                {
                    int IDX_cnst_desc = DB.GetReaderOrdinal(rdr, "CNST_DESC");
                    int IDX_cnst_nm = DB.GetReaderOrdinal(rdr, "CNST_NM");
                    int IDX_cnst_sid = DB.GetReaderOrdinal(rdr, "CNST_SID");
                    int IDX_cnst_val_txt = DB.GetReaderOrdinal(rdr, "CNST_VAL_TXT");
                    int IDX_UI_UPD_FLG = DB.GetReaderOrdinal(rdr, "UI_UPD_FLG");

                    while (rdr.Read())
                    {
                        ret.Add(new AdminConstant
                        {
                            CNST_DESC = rdr.IsDBNull(IDX_cnst_desc) ? default(String) : rdr.GetFieldValue<String>(IDX_cnst_desc),
                            CNST_NM = rdr.IsDBNull(IDX_cnst_nm) ? default(String) : rdr.GetFieldValue<String>(IDX_cnst_nm),
                            CNST_SID = rdr.IsDBNull(IDX_cnst_sid) ? default(Int32) : rdr.GetFieldValue<Int32>(IDX_cnst_sid),
                            CNST_VAL_TXT = rdr.IsDBNull(IDX_cnst_val_txt) ? default(String) : rdr.GetFieldValue<String>(IDX_cnst_val_txt),
                            UI_UPD_FLG = rdr.IsDBNull(IDX_UI_UPD_FLG) ? default(Boolean) : rdr.GetFieldValue<Boolean>(IDX_UI_UPD_FLG)
                        });
                    } // while
                }
                DataCollections.RecycleCache("_getToolConstants");
            }
            catch (Exception ex)
            {
                OpLogPerf.Log(ex);
                throw;
            }

            return ret.FirstOrDefault();
        }

        #endregion Constants Admin
    }
}