using System;
using System.Collections.Generic;
using Intel.MyDeals.DataAccessLib;
using Intel.MyDeals.Entities;
using Intel.Opaque.DBAccess;
using Procs = Intel.MyDeals.DataAccessLib.StoredProcedures.MyDeals;
using Intel.MyDeals.IDataLibrary;
using Intel.Opaque;

namespace Intel.MyDeals.DataLibrary
{
    public class FunfactDataLib : IFunfactDataLib
    {

        #region Funfact
        /// <summary>
        /// This will return all the Funfact item
        /// </summary>
        /// <returns></returns>
        public List<Funfact> GetFunfactItems()
        {
            var cmd = new Procs.dbo.PR_MYDL_GET_FUN_FACT
            {
            };
            List<Funfact> ret = new List<Funfact>();

            using (var rdr = DataAccess.ExecuteReader(cmd))
            {
                
                int IDX_ACTV_IND = DB.GetReaderOrdinal(rdr, "ACTV_IND");
                int IDX_FACT_HDR = DB.GetReaderOrdinal(rdr, "FACT_HDR");
                int IDX_FACT_ICON = DB.GetReaderOrdinal(rdr, "FACT_ICON");
                int IDX_FACT_SID = DB.GetReaderOrdinal(rdr, "FACT_SID");
                int IDX_FACT_SRC = DB.GetReaderOrdinal(rdr, "FACT_SRC");
                int IDX_FACT_TXT = DB.GetReaderOrdinal(rdr, "FACT_TXT");

                while (rdr.Read())
                {
                    ret.Add(new Funfact
                    {
                        ACTV_IND = (IDX_ACTV_IND < 0 || rdr.IsDBNull(IDX_ACTV_IND)) ? default(System.Boolean) : rdr.GetFieldValue<System.Boolean>(IDX_ACTV_IND),
                        FACT_HDR = (IDX_FACT_HDR < 0 || rdr.IsDBNull(IDX_FACT_HDR)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_FACT_HDR),
                        FACT_ICON = (IDX_FACT_ICON < 0 || rdr.IsDBNull(IDX_FACT_ICON)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_FACT_ICON),
                        FACT_SID = (IDX_FACT_SID < 0 || rdr.IsDBNull(IDX_FACT_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_FACT_SID),
                        FACT_SRC = (IDX_FACT_SRC < 0 || rdr.IsDBNull(IDX_FACT_SRC)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_FACT_SRC),
                        FACT_TXT = (IDX_FACT_TXT < 0 || rdr.IsDBNull(IDX_FACT_TXT)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_FACT_TXT)
                    });
                } // while
            }

            return ret;
        }

        /// <summary>
        /// This will help to INSERT, UPDATE, DELETE from Funfact table
        /// </summary>
        /// <param name="mode"></param> // CrudModes - Insert / Update / Delete
        /// <param name="data"></param>
        /// <returns></returns>
        public List<Funfact> SetFunfacts(CrudModes mode, Funfact data)
        {
            var retFunfact = new List<Funfact>();

            try
            {
                using (var rdr = DataAccess.ExecuteReader(new Procs.dbo.PR_MYDL_UPD_FUN_FACT
                {
                    FACT_SID = data.FACT_SID,
                    FACT_TXT = data.FACT_TXT,
                    FACT_HDR = data.FACT_HDR,
                    FACT_ICON = data.FACT_ICON,
                    FACT_SRC = data.FACT_SRC,
                    ACTV_IND = data.ACTV_IND,
                    EMP_WWID = OpUserStack.MyOpUserToken.Usr.WWID
                }))
                {
                    int IDX_ACTV_IND = DB.GetReaderOrdinal(rdr, "ACTV_IND");
                    int IDX_FACT_HDR = DB.GetReaderOrdinal(rdr, "FACT_HDR");
                    int IDX_FACT_ICON = DB.GetReaderOrdinal(rdr, "FACT_ICON");
                    int IDX_FACT_SID = DB.GetReaderOrdinal(rdr, "FACT_SID");
                    int IDX_FACT_SRC = DB.GetReaderOrdinal(rdr, "FACT_SRC");
                    int IDX_FACT_TXT = DB.GetReaderOrdinal(rdr, "FACT_TXT");

                    while (rdr.Read())
                    {
                        retFunfact.Add(new Funfact
                        {
                            ACTV_IND = (IDX_ACTV_IND < 0 || rdr.IsDBNull(IDX_ACTV_IND)) ? default(System.Boolean) : rdr.GetFieldValue<System.Boolean>(IDX_ACTV_IND),
                            FACT_HDR = (IDX_FACT_HDR < 0 || rdr.IsDBNull(IDX_FACT_HDR)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_FACT_HDR),
                            FACT_ICON = (IDX_FACT_ICON < 0 || rdr.IsDBNull(IDX_FACT_ICON)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_FACT_ICON),
                            FACT_SID = (IDX_FACT_SID < 0 || rdr.IsDBNull(IDX_FACT_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_FACT_SID),
                            FACT_SRC = (IDX_FACT_SRC < 0 || rdr.IsDBNull(IDX_FACT_SRC)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_FACT_SRC),
                            FACT_TXT = (IDX_FACT_TXT < 0 || rdr.IsDBNull(IDX_FACT_TXT)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_FACT_TXT)
                        });
                    } // while

                    DataCollections.RecycleCache("_getFunfactList");
                }
            }
            catch (Exception ex)
            {
                OpLogPerf.Log(ex);
                throw;
            }

            return retFunfact;
        }
        #endregion

    }
}
