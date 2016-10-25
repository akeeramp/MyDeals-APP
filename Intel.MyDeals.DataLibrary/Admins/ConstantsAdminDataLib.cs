using System;
using System.Collections.Generic;
using System.Linq;
using Intel.MyDeals.DataAccessLib;
using Intel.MyDeals.Entities;
using Intel.Opaque.DBAccess;
using Procs = Intel.MyDeals.DataAccessLib.StoredProcedures.MyDeals;

namespace Intel.MyDeals.DataLibrary
{
    public class ConstantsAdminDataLib
    {
        //#region AdminConstants
        //public List<AdminConstants> GetAdminConstants()
        //{
        //    var ret = new List<AdminConstants>();

        //    using (var rdr = DataAccess.ExecuteReader(new DataAccessLib.StoredProcedures.CDMS_MYDEALS.admin.PR_MANAGE_CONSTANT_VALUES() { idsid = Utils.ThreadUser, mode = "Select" }))
        //    {
        //        int IDX_cnst_desc = DB.GetReaderOrdinal(rdr, "cnst_desc");
        //        int IDX_cnst_nm = DB.GetReaderOrdinal(rdr, "cnst_nm");
        //        int IDX_cnst_sid = DB.GetReaderOrdinal(rdr, "cnst_sid");
        //        int IDX_cnst_val_txt = DB.GetReaderOrdinal(rdr, "cnst_val_txt");
        //        int IDX_ui_updatable = DB.GetReaderOrdinal(rdr, "ui_updatable");

        //        while (rdr.Read())
        //        {
        //            ret.Add(new AdminConstants
        //            {
        //                cnst_desc = rdr.IsDBNull(IDX_cnst_desc) ? default(String) : rdr.GetFieldValue<String>(IDX_cnst_desc),
        //                cnst_nm = rdr.IsDBNull(IDX_cnst_nm) ? default(String) : rdr.GetFieldValue<String>(IDX_cnst_nm),
        //                cnst_sid = rdr.IsDBNull(IDX_cnst_sid) ? default(Int32) : rdr.GetFieldValue<Int32>(IDX_cnst_sid),
        //                cnst_val_txt = rdr.IsDBNull(IDX_cnst_val_txt) ? default(String) : rdr.GetFieldValue<String>(IDX_cnst_val_txt),
        //                ui_updatable = rdr.IsDBNull(IDX_ui_updatable) ? default(Boolean) : rdr.GetFieldValue<Boolean>(IDX_ui_updatable)
        //            });
        //        } // while
        //    }

        //    return ret;
        //}

        //public AdminConstants SetAdminConstants(string mode, AdminConstants adminValues)
        //{
        //    var ret = new List<AdminConstants>();

        //    using (var rdr = DataAccess.ExecuteReader(new DataAccessLib.StoredProcedures.CDMS_MYDEALS.admin.PR_MANAGE_CONSTANT_VALUES()
        //    {
        //        idsid = Utils.ThreadUser,
        //        mode = mode,
        //        cnst_nm = adminValues.cnst_nm,
        //        cnst_sid = adminValues.cnst_sid,
        //        cnst_desc = adminValues.cnst_desc,
        //        cnst_val_txt = adminValues.cnst_val_txt,
        //        ui_updatable = adminValues.ui_updatable,
        //    }))
        //    {
        //        int IDX_cnst_desc = DB.GetReaderOrdinal(rdr, "cnst_desc");
        //        int IDX_cnst_nm = DB.GetReaderOrdinal(rdr, "cnst_nm");
        //        int IDX_cnst_sid = DB.GetReaderOrdinal(rdr, "cnst_sid");
        //        int IDX_cnst_val_txt = DB.GetReaderOrdinal(rdr, "cnst_val_txt");
        //        int IDX_ui_updatable = DB.GetReaderOrdinal(rdr, "ui_updatable");

        //        while (rdr.Read())
        //        {
        //            ret.Add(new AdminConstants
        //            {
        //                cnst_desc = rdr.IsDBNull(IDX_cnst_desc) ? default(String) : rdr.GetFieldValue<String>(IDX_cnst_desc),
        //                cnst_nm = rdr.IsDBNull(IDX_cnst_nm) ? default(String) : rdr.GetFieldValue<String>(IDX_cnst_nm),
        //                cnst_sid = rdr.IsDBNull(IDX_cnst_sid) ? default(Int32) : rdr.GetFieldValue<Int32>(IDX_cnst_sid),
        //                cnst_val_txt = rdr.IsDBNull(IDX_cnst_val_txt) ? default(String) : rdr.GetFieldValue<String>(IDX_cnst_val_txt),
        //                ui_updatable = rdr.IsDBNull(IDX_ui_updatable) ? default(Boolean) : rdr.GetFieldValue<Boolean>(IDX_ui_updatable)
        //            });
        //        } // while
        //    }

        //    return ret.FirstOrDefault();
        //}
        //#endregion
    }
}
