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
    public class MyDealsManualDataLib : IMyDealsManualDataLib
    {
        public List<ManualsNavItem> GetNavigationItems()
        {
            // Only the idsid is populatied to the user token at this point.  We need to fill in the rest.

            List<ManualsNavItem> rtn = new List<ManualsNavItem>();

            //var cmd = new Procs.dbo.PR_MYDL_GET_USR_ROLE();

            //try
            //{
            //    using (var rdr = DataAccess.ExecuteReader(cmd))
            //    {
            //        //TABLE 1
            //        var ret = new List<UsrProfileRole>();
            //        int IDX_EMAIL_ADDR = DB.GetReaderOrdinal(rdr, "EMAIL_ADDR");
            //        int IDX_EMP_WWID = DB.GetReaderOrdinal(rdr, "EMP_WWID");
            //        int IDX_FRST_NM = DB.GetReaderOrdinal(rdr, "FRST_NM");
            //        int IDX_IDSID = DB.GetReaderOrdinal(rdr, "IDSID");
            //        int IDX_LST_NM = DB.GetReaderOrdinal(rdr, "LST_NM");
            //        int IDX_MI = DB.GetReaderOrdinal(rdr, "MI");
            //        int IDX_ROLE_NM = DB.GetReaderOrdinal(rdr, "ROLE_NM");
            //        int IDX_USR_ACTV_IND = DB.GetReaderOrdinal(rdr, "USR_ACTV_IND");

            //        while (rdr.Read())
            //        {
            //            rtn.Add(new UsrProfileRole
            //            {
            //                EMAIL_ADDR = (IDX_EMAIL_ADDR < 0 || rdr.IsDBNull(IDX_EMAIL_ADDR)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_EMAIL_ADDR),
            //                EMP_WWID = (IDX_EMP_WWID < 0 || rdr.IsDBNull(IDX_EMP_WWID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_EMP_WWID),
            //                FRST_NM = (IDX_FRST_NM < 0 || rdr.IsDBNull(IDX_FRST_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_FRST_NM),
            //                IDSID = (IDX_IDSID < 0 || rdr.IsDBNull(IDX_IDSID)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_IDSID),
            //                LST_NM = (IDX_LST_NM < 0 || rdr.IsDBNull(IDX_LST_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_LST_NM),
            //                MI = (IDX_MI < 0 || rdr.IsDBNull(IDX_MI)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_MI),
            //                ROLE_NM = (IDX_ROLE_NM < 0 || rdr.IsDBNull(IDX_ROLE_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_ROLE_NM),
            //                USR_ACTV_IND = (IDX_USR_ACTV_IND < 0 || rdr.IsDBNull(IDX_USR_ACTV_IND)) ? default(System.Boolean) : rdr.GetFieldValue<System.Boolean>(IDX_USR_ACTV_IND)
            //            });
            //        } // while
            //    }
            //}
            //catch (Exception ex)
            //{
            //    throw OpMsgQueue.CreateFault(ex);
            //}

            return rtn;
        }

    }

}
