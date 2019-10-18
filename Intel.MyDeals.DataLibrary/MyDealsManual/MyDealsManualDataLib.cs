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
        public List<RefManualsNavItem> GetNavigationItems(string refType)
        {
            var retNavigation = new List<RefManualsNavItem>();

            try
            {
                var cmd = new Procs.dbo.PR_MYDL_GET_REF_NAVIGATION()
                {
                    ref_type = refType
                };

                using (var rdr = DataAccess.ExecuteReader(cmd))
                {
                    int IDX_DOC_SID = DB.GetReaderOrdinal(rdr, "DOC_SID");
                    int IDX_ORD = DB.GetReaderOrdinal(rdr, "ORD");
                    int IDX_PARNT = DB.GetReaderOrdinal(rdr, "PARNT");
                    int IDX_REF_LNK = DB.GetReaderOrdinal(rdr, "REF_LNK");
                    int IDX_REF_TTL = DB.GetReaderOrdinal(rdr, "REF_TTL");

                    while (rdr.Read())
                    {
                        retNavigation.Add(new RefManualsNavItem
                        {
                            DOC_SID = (IDX_DOC_SID < 0 || rdr.IsDBNull(IDX_DOC_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_DOC_SID),
                            ORD = (IDX_ORD < 0 || rdr.IsDBNull(IDX_ORD)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_ORD),
                            PARNT = (IDX_PARNT < 0 || rdr.IsDBNull(IDX_PARNT)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_PARNT),
                            REF_LNK = (IDX_REF_LNK < 0 || rdr.IsDBNull(IDX_REF_LNK)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_REF_LNK),
                            REF_TTL = (IDX_REF_TTL < 0 || rdr.IsDBNull(IDX_REF_TTL)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_REF_TTL)
                        });
                    }
                }
            }
            catch (Exception ex)
            {
                OpLogPerf.Log(ex);
                throw;
            }

            return retNavigation;
        }

        public string GetManualPageData(string pageLink)
        {
            var retPage = new List<RefManualsPage>();

            try
            {
                var cmd = new Procs.dbo.PR_MYDL_GET_REF_PAGE()
                {
                    ref_link = pageLink
                };

                using (var rdr = DataAccess.ExecuteReader(cmd))
                {
                    int IDX_PAGE_DATA = DB.GetReaderOrdinal(rdr, "PAGE_DATA");

                    while (rdr.Read())
                    {
                        retPage.Add(new RefManualsPage
                        {
                            PAGE_DATA = (IDX_PAGE_DATA < 0 || rdr.IsDBNull(IDX_PAGE_DATA)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_PAGE_DATA)
                        });
                    }
                }
            }
            catch (Exception ex)
            {
                OpLogPerf.Log(ex);
                throw;
            }

            string rtn = "Under Construction";
            if (retPage.Count > 0) rtn = retPage[0].PAGE_DATA.ToString();

            return rtn;
        }


    }

}
