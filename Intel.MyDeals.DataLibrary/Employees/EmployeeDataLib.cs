using System;
using System.Collections.Generic;
using System.Linq;
using Intel.MyDeals.DataAccessLib;
using Intel.MyDeals.Entities;
using Intel.Opaque;
using Intel.Opaque.DBAccess;
using Procs = Intel.MyDeals.DataAccessLib.StoredProcedures.MyDeals;
using SecurityAttribute = Intel.MyDeals.Entities.SecurityAttribute;

namespace Intel.MyDeals.DataLibrary
{
    public class EmployeeDataLib
    {
        #region Employees

        public EmployeeDetailData GetEmployeeDetail(string userIdentifier, string roles, string geos)
        {
            var ret = new EmployeeDetailData(); //Employee detail

            ////var cmd = new Procs.CDMS_MYDEALS.admin.PR_MANAGE_EMPLOYEES_NEW
            ////{
            ////    adminIDSID = Utils.ThreadUser,
            ////    mode = "Select",
            ////    user_identifier = userIdentifier,
            ////    role_list = roles,
            ////    geo_list = geos
            ////};

            ////using (var rdr = DataAccess.ExecuteReader(cmd))
            ////{
            ////    ret.EmpBasicData = new List<EmployeeBasicData>();

            ////    int IDX_EMP_WWID = DB.GetReaderOrdinal(rdr, "EMP_WWID");
            ////    int IDX_IDSID = DB.GetReaderOrdinal(rdr, "IDSID");
            ////    int IDX_FIRST_NAME = DB.GetReaderOrdinal(rdr, "FIRST_NAME");
            ////    int IDX_MIDDLE_NAME = DB.GetReaderOrdinal(rdr, "MIDDLE_NAME");
            ////    int IDX_LAST_NAME = DB.GetReaderOrdinal(rdr, "LAST_NAME");
            ////    int IDX_EMAIL_ADDR = DB.GetReaderOrdinal(rdr, "EMAIL_ADDR");
            ////    int IDX_PHONE_NUMBER = DB.GetReaderOrdinal(rdr, "PHONE_NUMBER");
            ////    int IDX_ACTV_IND = DB.GetReaderOrdinal(rdr, "ACTV_IND");

            ////    while (rdr.Read())
            ////    {
            ////        ret.EmpBasicData.Add(new EmployeeBasicData
            ////        {
            ////            EMP_WWID =
            ////                rdr.IsDBNull(IDX_EMP_WWID)
            ////                    ? default(System.Int32)
            ////                    : rdr.GetFieldValue<System.Int32>(IDX_EMP_WWID),
            ////            IDSID =
            ////                rdr.IsDBNull(IDX_IDSID)
            ////                    ? default(System.String)
            ////                    : rdr.GetFieldValue<System.String>(IDX_IDSID),
            ////            FIRST_NAME =
            ////                rdr.IsDBNull(IDX_FIRST_NAME)
            ////                    ? default(System.String)
            ////                    : rdr.GetFieldValue<System.String>(IDX_FIRST_NAME),
            ////            MIDDLE_NAME =
            ////                rdr.IsDBNull(IDX_MIDDLE_NAME)
            ////                    ? default(System.String)
            ////                    : rdr.GetFieldValue<System.String>(IDX_MIDDLE_NAME),
            ////            LAST_NAME =
            ////                rdr.IsDBNull(IDX_LAST_NAME)
            ////                    ? default(System.String)
            ////                    : rdr.GetFieldValue<System.String>(IDX_LAST_NAME),
            ////            EMAIL_ADDR =
            ////                rdr.IsDBNull(IDX_EMAIL_ADDR)
            ////                    ? default(System.String)
            ////                    : rdr.GetFieldValue<System.String>(IDX_EMAIL_ADDR),
            ////            PHONE_NUMBER =
            ////                rdr.IsDBNull(IDX_PHONE_NUMBER)
            ////                    ? default(System.String)
            ////                    : rdr.GetFieldValue<System.String>(IDX_PHONE_NUMBER),
            ////            ACTV_IND =
            ////                rdr.IsDBNull(IDX_ACTV_IND)
            ////                    ? default(System.Boolean)
            ////                    : rdr.GetFieldValue<System.Boolean>(IDX_ACTV_IND)
            ////        });
            ////    } // while

            ////    rdr.NextResult(); //Employee Roles
            ////    ret.EmpRole = new List<EmployeeRole>();
            ////    IDX_EMP_WWID = DB.GetReaderOrdinal(rdr, "EMP_WWID");
            ////    int IDX_ROLE_TYPE_SID = DB.GetReaderOrdinal(rdr, "ROLE_TYPE_SID");
            ////    int IDX_ROLE_TYPE_CD = DB.GetReaderOrdinal(rdr, "ROLE_TYPE_CD");
            ////    IDX_ACTV_IND = DB.GetReaderOrdinal(rdr, "ACTV_IND");

            ////    while (rdr.Read())
            ////    {
            ////        ret.EmpRole.Add(new EmployeeRole
            ////        {
            ////            EMP_WWID =
            ////                rdr.IsDBNull(IDX_EMP_WWID)
            ////                    ? default(System.Int32)
            ////                    : rdr.GetFieldValue<System.Int32>(IDX_EMP_WWID),
            ////            ROLE_TYPE_SID =
            ////                rdr.IsDBNull(IDX_ROLE_TYPE_SID)
            ////                    ? default(System.Int32)
            ////                    : rdr.GetFieldValue<System.Int32>(IDX_ROLE_TYPE_SID),
            ////            ROLE_TYPE_CD =
            ////                rdr.IsDBNull(IDX_ROLE_TYPE_CD)
            ////                    ? default(System.String)
            ////                    : rdr.GetFieldValue<System.String>(IDX_ROLE_TYPE_CD),
            ////            ACTV_IND =
            ////                rdr.IsDBNull(IDX_ACTV_IND)
            ////                    ? default(System.Boolean)
            ////                    : rdr.GetFieldValue<System.Boolean>(IDX_ACTV_IND)
            ////        });
            ////    } // while

            ////    rdr.NextResult(); //Employee Geos
            ////    ret.EmpGeo = new List<EmployeeGeo>();
            ////    IDX_EMP_WWID = DB.GetReaderOrdinal(rdr, "EMP_WWID");
            ////    int IDX_GEO_MBR_SID = DB.GetReaderOrdinal(rdr, "GEO_MBR_SID");
            ////    int IDX_GEO_NAME = DB.GetReaderOrdinal(rdr, "GEO_NM");
            ////    IDX_ACTV_IND = DB.GetReaderOrdinal(rdr, "ACTV_IND");

            ////    while (rdr.Read())
            ////    {
            ////        ret.EmpGeo.Add(new EmployeeGeo
            ////        {
            ////            EMP_WWID =
            ////                rdr.IsDBNull(IDX_EMP_WWID)
            ////                    ? default(System.Int32)
            ////                    : rdr.GetFieldValue<System.Int32>(IDX_EMP_WWID),
            ////            GEO_MBR_SID =
            ////                rdr.IsDBNull(IDX_GEO_MBR_SID)
            ////                    ? default(System.Int32)
            ////                    : rdr.GetFieldValue<System.Int32>(IDX_GEO_MBR_SID),
            ////            GEO_NM =
            ////                rdr.IsDBNull(IDX_GEO_NAME)
            ////                    ? default(System.String)
            ////                    : rdr.GetFieldValue<System.String>(IDX_GEO_NAME),
            ////            ACTV_IND =
            ////                rdr.IsDBNull(IDX_ACTV_IND)
            ////                    ? default(System.Boolean)
            ////                    : rdr.GetFieldValue<System.Boolean>(IDX_ACTV_IND)
            ////        });
            ////    } // while

            ////    rdr.NextResult(); //Employee Verticals
            ////    ret.EmpVertical = new List<EmployeeVertical>();
            ////    IDX_EMP_WWID = DB.GetReaderOrdinal(rdr, "EMP_WWID");
            ////    int IDX_PRD_MBR_SID = DB.GetReaderOrdinal(rdr, "PRD_MBR_SID");
            ////    int IDX_PRD_CATEGORY_NAME = DB.GetReaderOrdinal(rdr, "PRD_CATEGORY_NAME");
            ////    IDX_ACTV_IND = DB.GetReaderOrdinal(rdr, "ACTV_IND");

            ////    while (rdr.Read())
            ////    {
            ////        ret.EmpVertical.Add(new EmployeeVertical
            ////        {
            ////            EMP_WWID =
            ////                rdr.IsDBNull(IDX_EMP_WWID)
            ////                    ? default(System.Int32)
            ////                    : rdr.GetFieldValue<System.Int32>(IDX_EMP_WWID),
            ////            PRD_MBR_SID =
            ////                rdr.IsDBNull(IDX_PRD_MBR_SID)
            ////                    ? default(System.Int32)
            ////                    : rdr.GetFieldValue<System.Int32>(IDX_PRD_MBR_SID),
            ////            PRD_CATEGORY_NAME =
            ////                rdr.IsDBNull(IDX_PRD_CATEGORY_NAME)
            ////                    ? default(System.String)
            ////                    : rdr.GetFieldValue<System.String>(IDX_PRD_CATEGORY_NAME),
            ////            ACTV_IND =
            ////                rdr.IsDBNull(IDX_ACTV_IND)
            ////                    ? default(System.Boolean)
            ////                    : rdr.GetFieldValue<System.Boolean>(IDX_ACTV_IND)
            ////        });
            ////    } // while

            ////}
            return ret;
        }

        public AppRoleLookup GetApplicationRoles()
        {
            var ret = new AppRoleLookup();

            ////var cmd = new Procs.CDMS_MYDEALS.admin.PR_MANAGE_EMPLOYEES_APPLICATION_ROLES();
            ////using (var rdr = DataAccess.ExecuteReader(cmd))
            ////{
            ////    ret.EmpAppRoles = new List<ApplicationRoleLookup>();
            ////    int IDX_ROLE_TYPE_SID = DB.GetReaderOrdinal(rdr, "ROLE_TYPE_SID");
            ////    int IDX_ROLE_TYPE_CD = DB.GetReaderOrdinal(rdr, "ROLE_TYPE_CD");
            ////    int IDX_IS_SINGLE_SELECT = DB.GetReaderOrdinal(rdr, "IS_SINGLE_SELECT");
            ////    int IDX_APPL_SID = DB.GetReaderOrdinal(rdr, "APPL_SID");
            ////    int IDX_APPL_CD = DB.GetReaderOrdinal(rdr, "APPL_CD");
            ////    int IDX_APPL_SUITE = DB.GetReaderOrdinal(rdr, "APPL_SUITE");
            ////    int IDX_ROLE_SCOPE = DB.GetReaderOrdinal(rdr, "ROLE_SCOPE");

            ////    while (rdr.Read())
            ////    {
            ////        ret.EmpAppRoles.Add(new ApplicationRoleLookup
            ////        {
            ////            ROLE_TYPE_SID =
            ////                rdr.IsDBNull(IDX_ROLE_TYPE_SID)
            ////                    ? default(System.Int32)
            ////                    : rdr.GetFieldValue<System.Int32>(IDX_ROLE_TYPE_SID),
            ////            ROLE_TYPE_CD =
            ////                rdr.IsDBNull(IDX_ROLE_TYPE_CD)
            ////                    ? default(System.String)
            ////                    : rdr.GetFieldValue<System.String>(IDX_ROLE_TYPE_CD),
            ////            IS_SINGLE_SELECT =
            ////                rdr.IsDBNull(IDX_IS_SINGLE_SELECT)
            ////                    ? default(System.Boolean)
            ////                    : rdr.GetFieldValue<System.Boolean>(IDX_IS_SINGLE_SELECT),
            ////            APPL_SID =
            ////                rdr.IsDBNull(IDX_APPL_SID)
            ////                    ? default(System.Byte)
            ////                    : rdr.GetFieldValue<System.Byte>(IDX_APPL_SID),
            ////            APPL_CD =
            ////                rdr.IsDBNull(IDX_APPL_CD)
            ////                    ? default(System.String)
            ////                    : rdr.GetFieldValue<System.String>(IDX_APPL_CD),
            ////            APPL_SUITE =
            ////                rdr.IsDBNull(IDX_APPL_SUITE)
            ////                    ? default(System.String)
            ////                    : rdr.GetFieldValue<System.String>(IDX_APPL_SUITE),
            ////            ROLE_SCOPE =
            ////                rdr.IsDBNull(IDX_ROLE_SCOPE)
            ////                    ? default(System.String)
            ////                    : rdr.GetFieldValue<System.String>(IDX_ROLE_SCOPE)
            ////        });
            ////    } // while
            ////}
            return ret;
        }

        #endregion Employees

        public UserSetting GetUserSettings(OpUserToken opUserToken)
        {
            // Only the idsid is populatied to the user token at this point.  We need to fill in the rest.

            List<UserVitalsRole> tempUserVitalsRole = new List<UserVitalsRole>();
            List<UserVitalsSecurityAction> tempUserVitalsSecurityAction = new List<UserVitalsSecurityAction>();
            List<UserVitalsSecurityMask> tempUserVitalsSecurityMask = new List<UserVitalsSecurityMask>();
            List<UserVitalsVerticals> tempUserVitalsVerticals = new List<UserVitalsVerticals>();
            List<UserVitalsSuper> tempUserVitalsSuper = new List<UserVitalsSuper>();

            UserSetting settings = new UserSetting();

            var cmd = new Procs.dbo.PR_GET_USR_VITALS()
            {
                IDSID = opUserToken.Usr.Idsid,
                APP_NM = "MYDL"
            };

            try
            {
                using (var rdr = DataAccess.ExecuteReader(cmd))
                {
                    //TABLE 1
                    var ret = new List<UserVitalsRole>();
                    int IDX_APP_NM = DB.GetReaderOrdinal(rdr, "APP_NM");
                    int IDX_APP_SID = DB.GetReaderOrdinal(rdr, "APP_SID");
                    int IDX_EMAIL_ADDR = DB.GetReaderOrdinal(rdr, "EMAIL_ADDR");
                    int IDX_EMP_WWID = DB.GetReaderOrdinal(rdr, "EMP_WWID");
                    int IDX_FRST_NM = DB.GetReaderOrdinal(rdr, "FRST_NM");
                    int IDX_IDSID = DB.GetReaderOrdinal(rdr, "IDSID");
                    int IDX_IS_ADMIN = DB.GetReaderOrdinal(rdr, "IS_ADMIN");
                    int IDX_IS_DEVELOPER = DB.GetReaderOrdinal(rdr, "IS_DEVELOPER");
                    int IDX_IS_FINANCE_ADMIN = DB.GetReaderOrdinal(rdr, "IS_FINANCE_ADMIN");
                    int IDX_IS_SUPER = DB.GetReaderOrdinal(rdr, "IS_SUPER");
                    int IDX_IS_TESTER = DB.GetReaderOrdinal(rdr, "IS_TESTER");
                    int IDX_LST_NM = DB.GetReaderOrdinal(rdr, "LST_NM");
                    int IDX_MI = DB.GetReaderOrdinal(rdr, "MI");
                    int IDX_ROLE_DSPLY_NM = DB.GetReaderOrdinal(rdr, "ROLE_DSPLY_NM");
                    int IDX_ROLE_NM = DB.GetReaderOrdinal(rdr, "ROLE_NM");
                    int IDX_ROLE_SID = DB.GetReaderOrdinal(rdr, "ROLE_SID");

                    while (rdr.Read())
                    {
                        tempUserVitalsRole.Add(new UserVitalsRole
                        {
                            APP_NM = (IDX_APP_NM < 0 || rdr.IsDBNull(IDX_APP_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_APP_NM),
                            APP_SID = (IDX_APP_SID < 0 || rdr.IsDBNull(IDX_APP_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_APP_SID),
                            EMAIL_ADDR = (IDX_EMAIL_ADDR < 0 || rdr.IsDBNull(IDX_EMAIL_ADDR)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_EMAIL_ADDR),
                            EMP_WWID = (IDX_EMP_WWID < 0 || rdr.IsDBNull(IDX_EMP_WWID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_EMP_WWID),
                            FRST_NM = (IDX_FRST_NM < 0 || rdr.IsDBNull(IDX_FRST_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_FRST_NM),
                            IDSID = (IDX_IDSID < 0 || rdr.IsDBNull(IDX_IDSID)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_IDSID),
                            IS_ADMIN = (IDX_IS_ADMIN < 0 || rdr.IsDBNull(IDX_IS_ADMIN)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_IS_ADMIN),
                            IS_DEVELOPER = (IDX_IS_DEVELOPER < 0 || rdr.IsDBNull(IDX_IS_DEVELOPER)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_IS_DEVELOPER),
                            IS_FINANCE_ADMIN = (IDX_IS_FINANCE_ADMIN < 0 || rdr.IsDBNull(IDX_IS_FINANCE_ADMIN)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_IS_FINANCE_ADMIN),
                            IS_SUPER = (IDX_IS_SUPER < 0 || rdr.IsDBNull(IDX_IS_SUPER)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_IS_SUPER),
                            IS_TESTER = (IDX_IS_TESTER < 0 || rdr.IsDBNull(IDX_IS_TESTER)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_IS_TESTER),
                            LST_NM = (IDX_LST_NM < 0 || rdr.IsDBNull(IDX_LST_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_LST_NM),
                            MI = (IDX_MI < 0 || rdr.IsDBNull(IDX_MI)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_MI),
                            ROLE_DSPLY_NM = (IDX_ROLE_DSPLY_NM < 0 || rdr.IsDBNull(IDX_ROLE_DSPLY_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_ROLE_DSPLY_NM),
                            ROLE_NM = (IDX_ROLE_NM < 0 || rdr.IsDBNull(IDX_ROLE_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_ROLE_NM),
                            ROLE_SID = (IDX_ROLE_SID < 0 || rdr.IsDBNull(IDX_ROLE_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_ROLE_SID)
                        });
                    } // while

                    rdr.NextResult();

                    //TABLE 2
                    int IDX_ATRB_BIT = DB.GetReaderOrdinal(rdr, "ATRB_BIT");
                    int IDX_ATRB_CD = DB.GetReaderOrdinal(rdr, "ATRB_CD");
                    int IDX_ATRB_MAGNITUDE = DB.GetReaderOrdinal(rdr, "ATRB_MAGNITUDE");
                    int IDX_ATRB_SID = DB.GetReaderOrdinal(rdr, "ATRB_SID");

                    while (rdr.Read())
                    {
                        tempUserVitalsSecurityAction.Add(new UserVitalsSecurityAction
                        {
                            ATRB_BIT = (IDX_ATRB_BIT < 0 || rdr.IsDBNull(IDX_ATRB_BIT)) ? default(System.Int64) : rdr.GetFieldValue<System.Int64>(IDX_ATRB_BIT),
                            ATRB_CD = (IDX_ATRB_CD < 0 || rdr.IsDBNull(IDX_ATRB_CD)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_ATRB_CD),
                            ATRB_MAGNITUDE = (IDX_ATRB_MAGNITUDE < 0 || rdr.IsDBNull(IDX_ATRB_MAGNITUDE)) ? default(System.Int64) : rdr.GetFieldValue<System.Int64>(IDX_ATRB_MAGNITUDE),
                            ATRB_SID = (IDX_ATRB_SID < 0 || rdr.IsDBNull(IDX_ATRB_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_ATRB_SID)
                        });
                    } // while

                    rdr.NextResult();

                    //TABLE 3
                    int IDX_ACTN_NM = DB.GetReaderOrdinal(rdr, "ACTN_NM");
                    int IDX_OBJ_SET_TYPE_CD = DB.GetReaderOrdinal(rdr, "OBJ_SET_TYPE_CD");
                    int IDX_OBJ_SET_TYPE_SID = DB.GetReaderOrdinal(rdr, "OBJ_SET_TYPE_SID");
                    int IDX_OBJ_TYPE_SID = DB.GetReaderOrdinal(rdr, "OBJ_TYPE_SID");
                    int IDX_PERMISSION_MASK = DB.GetReaderOrdinal(rdr, "PERMISSION_MASK");
                    int IDX_ROLE_NM2 = DB.GetReaderOrdinal(rdr, "ROLE_NM");
                    int IDX_ROLE_SID2 = DB.GetReaderOrdinal(rdr, "ROLE_SID");
                    int IDX_SECUR_ACTN_SID = DB.GetReaderOrdinal(rdr, "SECUR_ACTN_SID");
                    int IDX_WFSTG_MBR_SID = DB.GetReaderOrdinal(rdr, "WFSTG_MBR_SID");
                    int IDX_WFSTG_NM = DB.GetReaderOrdinal(rdr, "WFSTG_NM");

                    while (rdr.Read())
                    {
                        tempUserVitalsSecurityMask.Add(new UserVitalsSecurityMask
                        {
                            ACTN_NM = (IDX_ACTN_NM < 0 || rdr.IsDBNull(IDX_ACTN_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_ACTN_NM),
                            OBJ_SET_TYPE_CD = (IDX_OBJ_SET_TYPE_CD < 0 || rdr.IsDBNull(IDX_OBJ_SET_TYPE_CD)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_OBJ_SET_TYPE_CD),
                            OBJ_SET_TYPE_SID = (IDX_OBJ_SET_TYPE_SID < 0 || rdr.IsDBNull(IDX_OBJ_SET_TYPE_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_OBJ_SET_TYPE_SID),
                            OBJ_TYPE_SID = (IDX_OBJ_TYPE_SID < 0 || rdr.IsDBNull(IDX_OBJ_TYPE_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_OBJ_TYPE_SID),
                            PERMISSION_MASK = (IDX_PERMISSION_MASK < 0 || rdr.IsDBNull(IDX_PERMISSION_MASK)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_PERMISSION_MASK),
                            ROLE_NM = (IDX_ROLE_NM2 < 0 || rdr.IsDBNull(IDX_ROLE_NM2)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_ROLE_NM2),
                            ROLE_SID = (IDX_ROLE_SID2 < 0 || rdr.IsDBNull(IDX_ROLE_SID2)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_ROLE_SID2),
                            SECUR_ACTN_SID = (IDX_SECUR_ACTN_SID < 0 || rdr.IsDBNull(IDX_SECUR_ACTN_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_SECUR_ACTN_SID),
                            WFSTG_MBR_SID = (IDX_WFSTG_MBR_SID < 0 || rdr.IsDBNull(IDX_WFSTG_MBR_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_WFSTG_MBR_SID),
                            WFSTG_NM = (IDX_WFSTG_NM < 0 || rdr.IsDBNull(IDX_WFSTG_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_WFSTG_NM)
                        });
                    } // while

                    rdr.NextResult();

                    //TABLE 4 Skipped
                    rdr.NextResult();

                    //TABLE 5
                    int IDX_VERTICAL = DB.GetReaderOrdinal(rdr, "VERTICAL");
                    int IDX_VERTICAL_NM = DB.GetReaderOrdinal(rdr, "VERTICAL_NM");

                    while (rdr.Read())
                    {
                        tempUserVitalsVerticals.Add(new UserVitalsVerticals
                        {
                            VERTICAL = (IDX_VERTICAL < 0 || rdr.IsDBNull(IDX_VERTICAL)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_VERTICAL),
                            VERTICAL_NM = (IDX_VERTICAL_NM < 0 || rdr.IsDBNull(IDX_VERTICAL_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_VERTICAL_NM)
                        });
                    } // while

                    rdr.NextResult();

                    //TABLE 6
                    rdr.NextResult();
                }
            }
            catch (Exception ex)
            {
                throw OpMsgQueue.CreateFault(ex);
            }

            // Start loading the token now...

            if (!tempUserVitalsRole.Any()) return new UserSetting();

            opUserToken.Usr = new OpUser
            {
                UserID = tempUserVitalsRole.First().EMP_WWID,
                Idsid = tempUserVitalsRole.First().IDSID.Trim(),
                WWID = tempUserVitalsRole.First().EMP_WWID,
                LastName = tempUserVitalsRole.First().LST_NM,
                FirstName = tempUserVitalsRole.First().FRST_NM,
                Email = tempUserVitalsRole.First().EMAIL_ADDR,
                AppId = tempUserVitalsRole.First().APP_SID
            };
            // Set Basic SuperBits here that aren't dependant upon roles.  Role based SuperBits are down a few lines.
            opUserToken.Properties[EN.OPUSERTOKEN.IS_SUPER] = tempUserVitalsRole.First().IS_SUPER == 1? true: false;
            opUserToken.Properties[EN.OPUSERTOKEN.IS_TESTER] = tempUserVitalsRole.First().IS_TESTER == 1 ? true : false;
            opUserToken.Properties[EN.OPUSERTOKEN.IS_DEVELOPER] = tempUserVitalsRole.First().IS_DEVELOPER == 1 ? true : false;
            opUserToken.Properties[EN.OPUSERTOKEN.IS_ADMIN] = tempUserVitalsRole.First().IS_ADMIN == 1 ? true : false;
            opUserToken.Properties[EN.OPUSERTOKEN.IS_FINANCE_ADMIN] = tempUserVitalsRole.First().IS_FINANCE_ADMIN == 1 ? true : false;

            opUserToken.Role = new OpRoleType
            {
                RoleTypeCd = tempUserVitalsRole.First().ROLE_NM,
                RoleTypeDescription = tempUserVitalsRole.First().ROLE_DSPLY_NM,
                RoleTypeDisplayName = tempUserVitalsRole.First().ROLE_DSPLY_NM,
                RoleTypeId = tempUserVitalsRole.First().ROLE_SID,
                RoleTier = RoleTypes.Tiers.ContainsKey(tempUserVitalsRole.First().ROLE_NM) ? RoleTypes.Tiers[tempUserVitalsRole.First().ROLE_NM] : ""
            };

            ////// Table 1 contains SecurityAction
            foreach (UserVitalsSecurityAction securityAction in tempUserVitalsSecurityAction)
            {
                SecurityAttribute sa = new SecurityAttribute
                {
                    ATRB_CD = securityAction.ATRB_CD,
                    ATRB_BIT = securityAction.ATRB_BIT,
                    ATRB_MAGNITUDE = securityAction.ATRB_MAGNITUDE
                };

                if (sa.ATRB_CD != null) settings.SecurityActions.Add(sa);
            }

            ////// Table 2 contains SecurityMask
            foreach (UserVitalsSecurityMask securityMask in tempUserVitalsSecurityMask)
            {
                SecurityMask sm = new SecurityMask
                {
                    ACTN_NM = securityMask.ACTN_NM,
                    ROLE_NM = securityMask.ROLE_NM,
                    PERMISSION_MASK = securityMask.PERMISSION_MASK,
                    WFSTG_NM = securityMask.WFSTG_NM,
                    WFSTG_MBR_SID = securityMask.WFSTG_MBR_SID
                };

                if (sm.ACTN_NM != null) settings.SecurityMasks.Add(sm);
            }

            // Set IsSuperSA here because you need to have a role to check against as well.
            opUserToken.Properties[EN.OPUSERTOKEN.IS_SUPER_SA] = (tempUserVitalsRole.First().IS_SUPER == 1 && opUserToken.Role.RoleTypeCd == RoleTypes.SA) ? true : false;

            ////// Table 4 contains Verticals
            foreach (UserVitalsVerticals vitalsVertical in tempUserVitalsVerticals)
            {
                VerticalSecurityItem vsi = new VerticalSecurityItem
                {
                    Id = vitalsVertical.VERTICAL,
                    VerticalName = vitalsVertical.VERTICAL_NM
                };

                if (vsi.Id != 0) settings.VerticalSecurity.Add(vsi);
            }

            ////// Table 1 contains Super Record, to get SuperSA, must merge with Role = SA
            settings.SuperSa = tempUserVitalsRole.First().IS_SUPER == 1 && opUserToken.Role.RoleTypeCd == RoleTypes.SA;

            return settings;
        }

        public List<UserPreference> GetUserPreference()
        {
            var ret = new List<UserPreference>();
            ////using (var rdr = DataAccess.ExecuteReader(new Procs.CDMS_MYDEALS.meta.PR_GET_USER_PREFERENCES()))
            ////{
            ////    int IDX_ID = DB.GetReaderOrdinal(rdr, "ID");
            ////    int IDX_Preference = DB.GetReaderOrdinal(rdr, "Preference");
            ////    int IDX_Value = DB.GetReaderOrdinal(rdr, "Value");
            ////    int IDX_WWID = DB.GetReaderOrdinal(rdr, "WWID");

            ////    while (rdr.Read())
            ////    {
            ////        ret.Add(new UserPreference
            ////        {
            ////            ID = (IDX_ID < 0 || rdr.IsDBNull(IDX_ID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_ID),
            ////            Preference = (IDX_Preference < 0 || rdr.IsDBNull(IDX_Preference)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_Preference),
            ////            Value = (IDX_Value < 0 || rdr.IsDBNull(IDX_Value)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_Value),
            ////            WWID = (IDX_WWID < 0 || rdr.IsDBNull(IDX_WWID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_WWID)
            ////        });
            ////    }
            ////}

            return ret;
        }
    }
}