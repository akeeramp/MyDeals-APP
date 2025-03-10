using System;
using System.Collections.Generic;
using System.Linq;
using Intel.MyDeals.DataAccessLib;
using Intel.MyDeals.Entities;
using Intel.Opaque.DBAccess;
using Procs = Intel.MyDeals.DataAccessLib.StoredProcedures.MyDeals;
using Intel.MyDeals.IDataLibrary;
using Intel.Opaque;
using Intel.MyDeals.IDataLibraries;
using Intel.MyDeals.Entities.TableTypeParameters;


namespace Intel.MyDeals.DataLibrary
{
    public class EnvironmentsDataLib : IEnvironmentsDataLib
    {
        public List<AdminEnvironments> GetEnvDetails()
        {
            var cmd = new Procs.dbo.PR_MANAGE_ENVIRONMENT_VALUES
            {
                mode = CrudModes.Select.ToString(),
                CRE_EMP_WWID = OpUserStack.MyOpUserToken.Usr.WWID
            };

            List<AdminEnvironments> returnEnvironmentsList = new List<AdminEnvironments>();
            using (var rdr = DataAccess.ExecuteReader(cmd))
            {
                int IDX_ENVT_SID = DB.GetReaderOrdinal(rdr, "ENVT_SID");
                int IDX_ENVT_NM = DB.GetReaderOrdinal(rdr, "ENVT_NM");
                int IDX_DB_ENVT_NM = DB.GetReaderOrdinal(rdr, "DB_ENVT_NM");
                int IDX_DB_VANITY_CONN_STR = DB.GetReaderOrdinal(rdr, "DB_VANITY_CONN_STR");
                int IDX_DB_SRVR_DTL = DB.GetReaderOrdinal(rdr, "DB_SRVR_DTL");
                int IDX_GRAFANA_DASHBOARD_LINK = DB.GetReaderOrdinal(rdr, "GRAFANA_DASHBOARD_LINK");
                int IDX_MANAGED_OWNERS = DB.GetReaderOrdinal(rdr, "MANAGED_OWNERS");
                int IDX_WEBISTE_LINK = DB.GetReaderOrdinal(rdr, "WEBISTE_LINK");
                int IDX_APP_SERVER = DB.GetReaderOrdinal(rdr, "APP_SERVER");
                int IDX_WIN_JOBS_HOSTED_MCHN = DB.GetReaderOrdinal(rdr, "WIN_JOBS_HOSTED_MCHN");
                int IDX_SSIS_SRVR_CONN_STR = DB.GetReaderOrdinal(rdr, "SSIS_SRVR_CONN_STR");
                int IDX_SSIS_CATALOGUE_FOLDER = DB.GetReaderOrdinal(rdr, "SSIS_CATALOGUE_FOLDER");
                int IDX_SSIS_CATALOGUE_SRVR_DTL = DB.GetReaderOrdinal(rdr, "SSIS_CATALOGUE_SRVR_DTL");
                int IDX_ACTV_IND = DB.GetReaderOrdinal(rdr, "ACTV_IND");
                while (rdr.Read())
                {
                    returnEnvironmentsList.Add(new AdminEnvironments
                    {
                        ENVT_SID = (IDX_ENVT_SID < 0 || rdr.IsDBNull(IDX_ENVT_SID)) ? 0 : rdr.GetFieldValue<System.Int32>(IDX_ENVT_SID),
                        ENVT_NM = (IDX_ENVT_NM < 0 || rdr.IsDBNull(IDX_ENVT_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_ENVT_NM),
                        DB_ENVT_NM = (IDX_DB_ENVT_NM < 0 || rdr.IsDBNull(IDX_DB_ENVT_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_DB_ENVT_NM),
                        DB_VANITY_CONN_STR = (IDX_DB_VANITY_CONN_STR < 0 || rdr.IsDBNull(IDX_DB_VANITY_CONN_STR)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_DB_VANITY_CONN_STR),
                        DB_SRVR_DTL = (IDX_DB_SRVR_DTL < 0 || rdr.IsDBNull(IDX_DB_SRVR_DTL)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_DB_SRVR_DTL),
                        GRAFANA_DASHBOARD_LINK = (IDX_GRAFANA_DASHBOARD_LINK < 0 || rdr.IsDBNull(IDX_GRAFANA_DASHBOARD_LINK)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_GRAFANA_DASHBOARD_LINK),
                        MANAGED_OWNERS = (IDX_MANAGED_OWNERS < 0 || rdr.IsDBNull(IDX_MANAGED_OWNERS)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_MANAGED_OWNERS),
                        WEBISTE_LINK = (IDX_WEBISTE_LINK < 0 || rdr.IsDBNull(IDX_WEBISTE_LINK)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_WEBISTE_LINK),
                        APP_SERVER = (IDX_APP_SERVER < 0 || rdr.IsDBNull(IDX_APP_SERVER)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_APP_SERVER),
                        WIN_JOBS_HOSTED_MCHN = (IDX_WIN_JOBS_HOSTED_MCHN < 0 || rdr.IsDBNull(IDX_WIN_JOBS_HOSTED_MCHN)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_WIN_JOBS_HOSTED_MCHN),
                        SSIS_SRVR_CONN_STR = (IDX_SSIS_SRVR_CONN_STR < 0 || rdr.IsDBNull(IDX_SSIS_SRVR_CONN_STR)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_SSIS_SRVR_CONN_STR),
                        SSIS_CATALOGUE_FOLDER = (IDX_SSIS_CATALOGUE_FOLDER < 0 || rdr.IsDBNull(IDX_SSIS_CATALOGUE_FOLDER)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_SSIS_CATALOGUE_FOLDER),
                        SSIS_CATALOGUE_SRVR_DTL = (IDX_SSIS_CATALOGUE_SRVR_DTL < 0 || rdr.IsDBNull(IDX_SSIS_CATALOGUE_SRVR_DTL)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_SSIS_CATALOGUE_SRVR_DTL),
                        ACTV_IND = (IDX_ACTV_IND < 0 || rdr.IsDBNull(IDX_ACTV_IND)) ? System.Boolean.Parse("0") : rdr.GetFieldValue<System.Boolean>(IDX_ACTV_IND),
                    });
                }
            }

            return returnEnvironmentsList;
        }

        public AdminEnvironments SetEnvDetails(CrudModes mode, AdminEnvironments adminValues)
        {
            var ret = new AdminEnvironments();
            try
            {
                in_t_mydl_all_envt_dtl obj = new in_t_mydl_all_envt_dtl();
                obj.AddRow(adminValues);
                using (var rdr = DataAccess.ExecuteReader(new Procs.dbo.PR_MANAGE_ENVIRONMENT_VALUES
                {
                    mode = mode.ToString(),
                    MYDL_ALL_ENVT_DTL= obj, 
                    CRE_EMP_WWID = OpUserStack.MyOpUserToken.Usr.WWID,
                }))
                {
                    int IDX_ENVT_SID = DB.GetReaderOrdinal(rdr, "RESULT"); 
                    while (rdr.Read())
                    {
                        ret = new AdminEnvironments
                        {
                            ENVT_SID = (IDX_ENVT_SID < 0 || rdr.IsDBNull(IDX_ENVT_SID)) ? 0 : rdr.GetFieldValue<System.Int32>(IDX_ENVT_SID),   
                        };
                    } 
                }
            }
            catch (Exception ex)
            {
                OpLogPerf.Log(ex);         
            }

            return ret;
        }

        public List<AdminServerDetails> GetServerDetails()
        {
            var cmd = new Procs.dbo.PR_MANAGE_SERVERDETAILS_VALUES
            {
                mode = CrudModes.Select.ToString(),
                CRE_EMP_WWID = OpUserStack.MyOpUserToken.Usr.WWID
            };

            List<AdminServerDetails> returnEnvironmentsList = new List<AdminServerDetails>();
            using (var rdr = DataAccess.ExecuteReader(cmd))
            {
                int IDX_LNKD_SRVR_NM = DB.GetReaderOrdinal(rdr, "LNKD_SRVR_NM");
                int IDX_ENVT = DB.GetReaderOrdinal(rdr, "ENVT");
                int IDX_LNKD_SRVR_CONN_DTL = DB.GetReaderOrdinal(rdr, "LNKD_SRVR_CONN_DTL");
                int IDX_CHK_QUERY = DB.GetReaderOrdinal(rdr, "CHK_QUERY");
                int IDX_LST_CHCKD_DTM = DB.GetReaderOrdinal(rdr, "LST_CHCKD_DTM");
                int IDX_LS_ERR_TXT = DB.GetReaderOrdinal(rdr, "LS_ERR_TXT");
                int IDX_ACTV_IND = DB.GetReaderOrdinal(rdr, "ACTV_IND");
                int IDX_CRE_EMP_WWID = DB.GetReaderOrdinal(rdr, "CRE_EMP_WWID");
                int IDX_CRE_DTM = DB.GetReaderOrdinal(rdr, "CRE_DTM");
                int IDX_CHG_EMP_WWID = DB.GetReaderOrdinal(rdr, "CHG_EMP_WWID");
                int IDX_CHG_DTM = DB.GetReaderOrdinal(rdr, "CHG_DTM");
                while (rdr.Read())
                {
                    returnEnvironmentsList.Add(new AdminServerDetails
                    {
                        LNKD_SRVR_NM = (IDX_LNKD_SRVR_NM < 0 || rdr.IsDBNull(IDX_LNKD_SRVR_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_LNKD_SRVR_NM),
                        ENVT = (IDX_ENVT < 0 || rdr.IsDBNull(IDX_ENVT)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_ENVT),
                        LNKD_SRVR_CONN_DTL = (IDX_LNKD_SRVR_CONN_DTL < 0 || rdr.IsDBNull(IDX_LNKD_SRVR_CONN_DTL)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_LNKD_SRVR_CONN_DTL),
                        CHK_QUERY = (IDX_CHK_QUERY < 0 || rdr.IsDBNull(IDX_CHK_QUERY)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_CHK_QUERY),
                        LST_CHCKD_DTM = (IDX_LST_CHCKD_DTM < 0 || rdr.IsDBNull(IDX_LST_CHCKD_DTM)) ? System.DateTime.Now : rdr.GetFieldValue<System.DateTime>(IDX_LST_CHCKD_DTM),
                        LS_ERR_TXT = (IDX_LS_ERR_TXT < 0 || rdr.IsDBNull(IDX_LS_ERR_TXT)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_LS_ERR_TXT),
                        ACTV_IND = (IDX_ACTV_IND < 0 || rdr.IsDBNull(IDX_ACTV_IND)) ? System.Boolean.Parse("0") : rdr.GetFieldValue<System.Boolean>(IDX_ACTV_IND),
                        CRE_EMP_WWID = (IDX_CRE_EMP_WWID < 0 || rdr.IsDBNull(IDX_CRE_EMP_WWID)) ? 0 : rdr.GetFieldValue<System.Int32>(IDX_CRE_EMP_WWID),
                        CRE_DTM = (IDX_CRE_DTM < 0 || rdr.IsDBNull(IDX_CRE_DTM)) ? System.DateTime.Now : rdr.GetFieldValue<System.DateTime>(IDX_CRE_DTM),
                        CHG_EMP_WWID = (IDX_CHG_EMP_WWID < 0 || rdr.IsDBNull(IDX_CHG_EMP_WWID)) ? 0 : rdr.GetFieldValue<System.Int32>(IDX_CHG_EMP_WWID),
                        CHG_DTM = (IDX_CHG_DTM < 0 || rdr.IsDBNull(IDX_CHG_DTM)) ? System.DateTime.Now : rdr.GetFieldValue<System.DateTime>(IDX_CHG_DTM),
                    });
                }
            }

            return returnEnvironmentsList;
        }


        public AdminServerDetails SetServerDetails(CrudModes mode, AdminServerDetails adminValues)
        { 
            var ret = new AdminServerDetails();
            try
            {
                in_t_lnkd_srvr_nm obj = new in_t_lnkd_srvr_nm();
                obj.AddRow(adminValues, mode.ToString());
                using (var rdr = DataAccess.ExecuteReader(new Procs.dbo.PR_MANAGE_SERVERDETAILS_VALUES
                {
                    mode = mode.ToString(),
                    MYDL_LNKD_SRVR_DTL= obj,               
                    CRE_EMP_WWID = OpUserStack.MyOpUserToken.Usr.WWID, 
                }))
                {
                    int IDX_LNKD_SRVR_NM = DB.GetReaderOrdinal(rdr, "LNKD_SRVR_NM");  
                    while (rdr.Read())
                    {

                       ret=new AdminServerDetails
                        {
                            LNKD_SRVR_NM = (IDX_LNKD_SRVR_NM < 0 || rdr.IsDBNull(IDX_LNKD_SRVR_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_LNKD_SRVR_NM), 
                        };
                    } 
                } 
            }
            catch (Exception ex)
            {
                OpLogPerf.Log(ex);
            }

            return ret;
        }
    }
}
