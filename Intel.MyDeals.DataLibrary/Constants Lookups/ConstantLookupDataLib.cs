using System;
using System.Collections.Generic;
using System.Linq;
using Intel.MyDeals.DataAccessLib;
using Intel.MyDeals.Entities;
using Intel.Opaque.DBAccess;
using Procs = Intel.MyDeals.DataAccessLib.StoredProcedures.MyDeals;

namespace Intel.MyDeals.DataLibrary
{
    public class ConstantLookupDataLib
    {

        #region ToolConstants
        public List<ToolConstants> GetToolConstants()
        {
            var cmd = new Procs.dbo.PR_GET_CONSTANTS
            {
                cnst_nm = null
            };

            List<ToolConstants> returnConstandsList = new List<ToolConstants>();
            using (var rdr = DataAccess.ExecuteReader(cmd))
            {
                int ConstantNameIdx = DB.GetReaderOrdinal(rdr, "CNST_NM");
                int ConstantDescIdx = DB.GetReaderOrdinal(rdr, "CNST_DESC");
                int ConstantValueIdx = DB.GetReaderOrdinal(rdr, "CNST_VAL_TXT");
                while (rdr.Read())
                {
                    returnConstandsList.Add(new ToolConstants
                    {
                        CNST_NM = rdr.IsDBNull(ConstantNameIdx) ? default(String) : rdr.GetFieldValue<String>(ConstantNameIdx),
                        CNST_DESC = rdr.IsDBNull(ConstantDescIdx) ? default(String) : rdr.GetFieldValue<String>(ConstantDescIdx),
                        CNST_VAL_TXT = rdr.IsDBNull(ConstantValueIdx) ? default(String) : rdr.GetFieldValue<String>(ConstantValueIdx),
                    });
                }
            }

            return returnConstandsList;
        }

        public int GetToolConstInt(string cnstLookup, int defaultValue = 0)
        {
            int constRetValue;
            if (!int.TryParse(GetToolConst(cnstLookup, defaultValue.ToString()), out constRetValue)) constRetValue = defaultValue;

            return constRetValue;
        }

        public string GetToolConst(string cnstLookup, string defaultValue = "")
        {
            return GetToolConstants().Where(c => c.CNST_NM == cnstLookup).Select(c => c.CNST_VAL_TXT).FirstOrDefault() ?? defaultValue;
        }

        #endregion



        //public List<LookupItem> GetLookups()
        //{
        //    var cmd = new Procs.CDMS_MYDEALS.app.PR_GET_LOOKUPS();

        //    List<LookupItem> returnLookupsList = new List<LookupItem>();
        //    using (var rdr = DataAccess.ExecuteReader(cmd))
        //    {
        //        int IDX_ATRB_COL_NM = DB.GetReaderOrdinal(rdr, "ATRB_COL_NM");
        //        int IDX_DEAL_TYPE_CD = DB.GetReaderOrdinal(rdr, "DEAL_TYPE_CD");
        //        int IDX_DROP_DOWN = DB.GetReaderOrdinal(rdr, "DROP_DOWN");
        //        int IDX_DROP_DOWN_DB = DB.GetReaderOrdinal(rdr, "DROP_DOWN_DB");
        //        int IDX_ORD = DB.GetReaderOrdinal(rdr, "ORD");
        //        while (rdr.Read())
        //        {
        //            returnLookupsList.Add(new LookupItem
        //            {
        //                ATRB_COL_NM = (IDX_ATRB_COL_NM < 0 || rdr.IsDBNull(IDX_ATRB_COL_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_ATRB_COL_NM),
        //                DEAL_TYPE_CD = (IDX_DEAL_TYPE_CD < 0 || rdr.IsDBNull(IDX_DEAL_TYPE_CD)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_DEAL_TYPE_CD),
        //                DROP_DOWN = (IDX_DROP_DOWN < 0 || rdr.IsDBNull(IDX_DROP_DOWN)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_DROP_DOWN),
        //                DROP_DOWN_DB = (IDX_DROP_DOWN_DB < 0 || rdr.IsDBNull(IDX_DROP_DOWN_DB)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_DROP_DOWN_DB),
        //                ORD = (IDX_ORD < 0 || rdr.IsDBNull(IDX_ORD)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_ORD)
        //            });
        //        }
        //    }
        //    return returnLookupsList;
        //}



        #region Constants Admin

        public List<AdminConstant> GetAdminConstants()
        {
            var cmd = new Procs.dbo.PR_MANAGE_CONSTANT_VALUES
            {
                mode = CrudModes.Select.ToString()
            };

            List<AdminConstant> returnConstantsList = new List<AdminConstant>();
            using (var rdr = DataAccess.ExecuteReader(cmd))
            {
                int IDX_cnst_desc = DB.GetReaderOrdinal(rdr, "cnst_desc");
                int IDX_cnst_nm = DB.GetReaderOrdinal(rdr, "cnst_nm");
                int IDX_cnst_sid = DB.GetReaderOrdinal(rdr, "cnst_sid");
                int IDX_cnst_val_txt = DB.GetReaderOrdinal(rdr, "cnst_val_txt");
                int IDX_ui_updatable = DB.GetReaderOrdinal(rdr, "ui_updatable");

                while (rdr.Read())
                {
                    returnConstantsList.Add(new AdminConstant
                    {
                        cnst_desc = (IDX_cnst_desc < 0 || rdr.IsDBNull(IDX_cnst_desc)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_cnst_desc),
                        cnst_nm = (IDX_cnst_nm < 0 || rdr.IsDBNull(IDX_cnst_nm)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_cnst_nm),
                        cnst_sid = (IDX_cnst_sid < 0 || rdr.IsDBNull(IDX_cnst_sid)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_cnst_sid),
                        cnst_val_txt = (IDX_cnst_val_txt < 0 || rdr.IsDBNull(IDX_cnst_val_txt)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_cnst_val_txt),
                        ui_updatable = (IDX_ui_updatable < 0 || rdr.IsDBNull(IDX_ui_updatable)) ? default(System.Boolean) : (bool)rdr[IDX_ui_updatable]
                    });
                }
            }

            return returnConstantsList;
        }

        public AdminConstant SetAdminConstants(CrudModes mode, AdminConstant adminValues)
        {
            var ret = new List<AdminConstant>();

            using (var rdr = DataAccess.ExecuteReader(new Procs.dbo.PR_MANAGE_CONSTANT_VALUES
            {
                idsid = Utils.ThreadUser,
                mode = mode.ToString(),
                cnst_nm = adminValues.cnst_nm,
                cnst_sid = adminValues.cnst_sid,
                cnst_desc = adminValues.cnst_desc,
                cnst_val_txt = adminValues.cnst_val_txt,
                ui_updatable = adminValues.ui_updatable,
            }))
            {
                int IDX_cnst_desc = DB.GetReaderOrdinal(rdr, "cnst_desc");
                int IDX_cnst_nm = DB.GetReaderOrdinal(rdr, "cnst_nm");
                int IDX_cnst_sid = DB.GetReaderOrdinal(rdr, "cnst_sid");
                int IDX_cnst_val_txt = DB.GetReaderOrdinal(rdr, "cnst_val_txt");
                int IDX_ui_updatable = DB.GetReaderOrdinal(rdr, "ui_updatable");

                while (rdr.Read())
                {
                    ret.Add(new AdminConstant
                    {
                        cnst_desc = rdr.IsDBNull(IDX_cnst_desc) ? default(String) : rdr.GetFieldValue<String>(IDX_cnst_desc),
                        cnst_nm = rdr.IsDBNull(IDX_cnst_nm) ? default(String) : rdr.GetFieldValue<String>(IDX_cnst_nm),
                        cnst_sid = rdr.IsDBNull(IDX_cnst_sid) ? default(Int32) : rdr.GetFieldValue<Int32>(IDX_cnst_sid),
                        cnst_val_txt = rdr.IsDBNull(IDX_cnst_val_txt) ? default(String) : rdr.GetFieldValue<String>(IDX_cnst_val_txt),
                        ui_updatable = rdr.IsDBNull(IDX_ui_updatable) ? default(Boolean) : rdr.GetFieldValue<Boolean>(IDX_ui_updatable)
                    });
                } // while
            }

            return ret.FirstOrDefault();
        }
        #endregion
    }
}
