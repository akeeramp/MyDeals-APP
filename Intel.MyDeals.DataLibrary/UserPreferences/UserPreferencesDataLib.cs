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
    public class UserPreferencesDataLib : IUserPreferencesDataLib
    {
        public List<UserPreferences> GetUserPreferences(string category, string subCategory)
        {
            var ret = new List<UserPreferences>();
            try
            {
                var cmd = new Procs.dbo.PR_MYDL_GET_USR_PRFR()
                {
                    in_emp_wwid = OpUserStack.MyOpUserToken.Usr.WWID,
                    in_prfr_cat = category,
                    in_prfr_sub_cat = subCategory
                };

                using (var rdr = DataAccess.ExecuteReader(cmd))
                {
                    int IDX_CHG_DTM = DB.GetReaderOrdinal(rdr, "CHG_DTM");
                    int IDX_CHG_EMP_WWID = DB.GetReaderOrdinal(rdr, "CHG_EMP_WWID");
                    int IDX_CRE_DTM = DB.GetReaderOrdinal(rdr, "CRE_DTM");
                    int IDX_CRE_EMP_WWID = DB.GetReaderOrdinal(rdr, "CRE_EMP_WWID");
                    int IDX_EMP_WWID = DB.GetReaderOrdinal(rdr, "EMP_WWID");
                    int IDX_PRFR_CAT = DB.GetReaderOrdinal(rdr, "PRFR_CAT");
                    int IDX_PRFR_KEY = DB.GetReaderOrdinal(rdr, "PRFR_KEY");
                    //int IDX_PRFR_SID = DB.GetReaderOrdinal(rdr, "PRFR_SID");
                    int IDX_PRFR_SUB_CAT = DB.GetReaderOrdinal(rdr, "PRFR_SUB_CAT");
                    int IDX_PRFR_VAL = DB.GetReaderOrdinal(rdr, "PRFR_VAL");

                    while (rdr.Read())
                    {
                        ret.Add(new UserPreferences
                        {
                            CHG_DTM = (IDX_CHG_DTM < 0 || rdr.IsDBNull(IDX_CHG_DTM)) ? default(System.DateTime) : rdr.GetFieldValue<System.DateTime>(IDX_CHG_DTM),
                            CHG_EMP_WWID = (IDX_CHG_EMP_WWID < 0 || rdr.IsDBNull(IDX_CHG_EMP_WWID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_CHG_EMP_WWID),
                            CRE_DTM = (IDX_CRE_DTM < 0 || rdr.IsDBNull(IDX_CRE_DTM)) ? default(System.DateTime) : rdr.GetFieldValue<System.DateTime>(IDX_CRE_DTM),
                            CRE_EMP_WWID = (IDX_CRE_EMP_WWID < 0 || rdr.IsDBNull(IDX_CRE_EMP_WWID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_CRE_EMP_WWID),
                            EMP_WWID = (IDX_EMP_WWID < 0 || rdr.IsDBNull(IDX_EMP_WWID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_EMP_WWID),
                            PRFR_CAT = (IDX_PRFR_CAT < 0 || rdr.IsDBNull(IDX_PRFR_CAT)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_PRFR_CAT),
                            PRFR_KEY = (IDX_PRFR_KEY < 0 || rdr.IsDBNull(IDX_PRFR_KEY)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_PRFR_KEY),
                            //PRFR_SID = (IDX_PRFR_SID < 0 || rdr.IsDBNull(IDX_PRFR_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_PRFR_SID),
                            PRFR_SUB_CAT = (IDX_PRFR_SUB_CAT < 0 || rdr.IsDBNull(IDX_PRFR_SUB_CAT)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_PRFR_SUB_CAT),
                            PRFR_VAL = (IDX_PRFR_VAL < 0 || rdr.IsDBNull(IDX_PRFR_VAL)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_PRFR_VAL)
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

        public List<UserPreferences> UpdateUserPreferences(string category, string subCategory, string key, string value)
        {
            var ret = new List<UserPreferences>();
            try
            {
                var cmd = new Procs.dbo.PR_MYDL_UPD_USR_PRFR()
                {
                    in_mode = "Update",
                    in_emp_wwid = OpUserStack.MyOpUserToken.Usr.WWID,
                    in_prfr_cat = category,
                    in_prfr_sub_cat = subCategory,
                    in_prfr_key = key,
                    in_prfr_val = value,
                    in_chg_emp_wwid = OpUserStack.MyOpUserToken.Usr.WWID,
                };

                using (var rdr = DataAccess.ExecuteReader(cmd))
                {
                    int IDX_CHG_DTM = DB.GetReaderOrdinal(rdr, "CHG_DTM");
                    int IDX_CHG_EMP_WWID = DB.GetReaderOrdinal(rdr, "CHG_EMP_WWID");
                    int IDX_CRE_DTM = DB.GetReaderOrdinal(rdr, "CRE_DTM");
                    int IDX_CRE_EMP_WWID = DB.GetReaderOrdinal(rdr, "CRE_EMP_WWID");
                    int IDX_EMP_WWID = DB.GetReaderOrdinal(rdr, "EMP_WWID");
                    int IDX_PRFR_CAT = DB.GetReaderOrdinal(rdr, "PRFR_CAT");
                    int IDX_PRFR_KEY = DB.GetReaderOrdinal(rdr, "PRFR_KEY");
                    //int IDX_PRFR_SID = DB.GetReaderOrdinal(rdr, "PRFR_SID");
                    int IDX_PRFR_SUB_CAT = DB.GetReaderOrdinal(rdr, "PRFR_SUB_CAT");
                    int IDX_PRFR_VAL = DB.GetReaderOrdinal(rdr, "PRFR_VAL");

                    while (rdr.Read())
                    {
                        ret.Add(new UserPreferences
                        {
                            CHG_DTM = (IDX_CHG_DTM < 0 || rdr.IsDBNull(IDX_CHG_DTM)) ? default(System.DateTime) : rdr.GetFieldValue<System.DateTime>(IDX_CHG_DTM),
                            CHG_EMP_WWID = (IDX_CHG_EMP_WWID < 0 || rdr.IsDBNull(IDX_CHG_EMP_WWID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_CHG_EMP_WWID),
                            CRE_DTM = (IDX_CRE_DTM < 0 || rdr.IsDBNull(IDX_CRE_DTM)) ? default(System.DateTime) : rdr.GetFieldValue<System.DateTime>(IDX_CRE_DTM),
                            CRE_EMP_WWID = (IDX_CRE_EMP_WWID < 0 || rdr.IsDBNull(IDX_CRE_EMP_WWID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_CRE_EMP_WWID),
                            EMP_WWID = (IDX_EMP_WWID < 0 || rdr.IsDBNull(IDX_EMP_WWID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_EMP_WWID),
                            PRFR_CAT = (IDX_PRFR_CAT < 0 || rdr.IsDBNull(IDX_PRFR_CAT)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_PRFR_CAT),
                            PRFR_KEY = (IDX_PRFR_KEY < 0 || rdr.IsDBNull(IDX_PRFR_KEY)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_PRFR_KEY),
                            //PRFR_SID = (IDX_PRFR_SID < 0 || rdr.IsDBNull(IDX_PRFR_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_PRFR_SID),
                            PRFR_SUB_CAT = (IDX_PRFR_SUB_CAT < 0 || rdr.IsDBNull(IDX_PRFR_SUB_CAT)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_PRFR_SUB_CAT),
                            PRFR_VAL = (IDX_PRFR_VAL < 0 || rdr.IsDBNull(IDX_PRFR_VAL)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_PRFR_VAL)
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

        public List<UserPreferences> ClearUserPreferences(string clearMode, string category, string subCategory)
        {
            var ret = new List<UserPreferences>();
            try
            {
                var cmd = new Procs.dbo.PR_MYDL_UPD_USR_PRFR()
                {
                    in_mode = clearMode, // Modes are Clear and ClearAll
                    in_emp_wwid = OpUserStack.MyOpUserToken.Usr.WWID,
                    in_prfr_cat = category,
                    in_prfr_sub_cat = subCategory,
                    in_prfr_key = null,
                    in_prfr_val = null,
                    in_chg_emp_wwid = OpUserStack.MyOpUserToken.Usr.WWID,
                };

                using (var rdr = DataAccess.ExecuteReader(cmd))
                {
                    int IDX_CHG_DTM = DB.GetReaderOrdinal(rdr, "CHG_DTM");
                    int IDX_CHG_EMP_WWID = DB.GetReaderOrdinal(rdr, "CHG_EMP_WWID");
                    int IDX_CRE_DTM = DB.GetReaderOrdinal(rdr, "CRE_DTM");
                    int IDX_CRE_EMP_WWID = DB.GetReaderOrdinal(rdr, "CRE_EMP_WWID");
                    int IDX_EMP_WWID = DB.GetReaderOrdinal(rdr, "EMP_WWID");
                    int IDX_PRFR_CAT = DB.GetReaderOrdinal(rdr, "PRFR_CAT");
                    int IDX_PRFR_KEY = DB.GetReaderOrdinal(rdr, "PRFR_KEY");
                    //int IDX_PRFR_SID = DB.GetReaderOrdinal(rdr, "PRFR_SID");
                    int IDX_PRFR_SUB_CAT = DB.GetReaderOrdinal(rdr, "PRFR_SUB_CAT");
                    int IDX_PRFR_VAL = DB.GetReaderOrdinal(rdr, "PRFR_VAL");

                    while (rdr.Read())
                    {
                        ret.Add(new UserPreferences
                        {
                            CHG_DTM = (IDX_CHG_DTM < 0 || rdr.IsDBNull(IDX_CHG_DTM)) ? default(System.DateTime) : rdr.GetFieldValue<System.DateTime>(IDX_CHG_DTM),
                            CHG_EMP_WWID = (IDX_CHG_EMP_WWID < 0 || rdr.IsDBNull(IDX_CHG_EMP_WWID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_CHG_EMP_WWID),
                            CRE_DTM = (IDX_CRE_DTM < 0 || rdr.IsDBNull(IDX_CRE_DTM)) ? default(System.DateTime) : rdr.GetFieldValue<System.DateTime>(IDX_CRE_DTM),
                            CRE_EMP_WWID = (IDX_CRE_EMP_WWID < 0 || rdr.IsDBNull(IDX_CRE_EMP_WWID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_CRE_EMP_WWID),
                            EMP_WWID = (IDX_EMP_WWID < 0 || rdr.IsDBNull(IDX_EMP_WWID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_EMP_WWID),
                            PRFR_CAT = (IDX_PRFR_CAT < 0 || rdr.IsDBNull(IDX_PRFR_CAT)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_PRFR_CAT),
                            PRFR_KEY = (IDX_PRFR_KEY < 0 || rdr.IsDBNull(IDX_PRFR_KEY)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_PRFR_KEY),
                            //PRFR_SID = (IDX_PRFR_SID < 0 || rdr.IsDBNull(IDX_PRFR_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_PRFR_SID),
                            PRFR_SUB_CAT = (IDX_PRFR_SUB_CAT < 0 || rdr.IsDBNull(IDX_PRFR_SUB_CAT)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_PRFR_SUB_CAT),
                            PRFR_VAL = (IDX_PRFR_VAL < 0 || rdr.IsDBNull(IDX_PRFR_VAL)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_PRFR_VAL)
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
