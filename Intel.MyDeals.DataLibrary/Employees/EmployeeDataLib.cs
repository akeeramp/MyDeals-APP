using System;
using System.Collections.Generic;
using System.Linq;
using Intel.MyDeals.DataAccessLib;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IDataLibrary;
using Intel.Opaque;
using Intel.Opaque.DBAccess;
using Procs = Intel.MyDeals.DataAccessLib.StoredProcedures.MyDeals;
using SecurityAttribute = Intel.MyDeals.Entities.SecurityAttribute;

namespace Intel.MyDeals.DataLibrary
{
    public class EmployeeDataLib : IEmployeeDataLib
    {
        public List<UsrProfileRole> GetUsrProfileRole()
        {
            // Only the idsid is populatied to the user token at this point.  We need to fill in the rest.

            List<UsrProfileRole> rtn = new List<UsrProfileRole>();

            var cmd = new Procs.dbo.PR_MYDL_GET_USR_ROLE();

            try
            {
                using (var rdr = DataAccess.ExecuteReader(cmd))
                {
                    //TABLE 1
                    var ret = new List<UsrProfileRole>();
                    int IDX_EMAIL_ADDR = DB.GetReaderOrdinal(rdr, "EMAIL_ADDR");
                    int IDX_EMP_WWID = DB.GetReaderOrdinal(rdr, "EMP_WWID");
                    int IDX_FRST_NM = DB.GetReaderOrdinal(rdr, "FRST_NM");
                    int IDX_IDSID = DB.GetReaderOrdinal(rdr, "IDSID");
                    int IDX_LST_NM = DB.GetReaderOrdinal(rdr, "LST_NM");
                    int IDX_MI = DB.GetReaderOrdinal(rdr, "MI");
                    int IDX_ROLE_NM = DB.GetReaderOrdinal(rdr, "ROLE_NM");
                    int IDX_USR_ACTV_IND = DB.GetReaderOrdinal(rdr, "USR_ACTV_IND");

                    while (rdr.Read())
                    {
                        rtn.Add(new UsrProfileRole
                        {
                            EMAIL_ADDR = (IDX_EMAIL_ADDR < 0 || rdr.IsDBNull(IDX_EMAIL_ADDR)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_EMAIL_ADDR),
                            EMP_WWID = (IDX_EMP_WWID < 0 || rdr.IsDBNull(IDX_EMP_WWID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_EMP_WWID),
                            FRST_NM = (IDX_FRST_NM < 0 || rdr.IsDBNull(IDX_FRST_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_FRST_NM),
                            IDSID = (IDX_IDSID < 0 || rdr.IsDBNull(IDX_IDSID)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_IDSID),
                            LST_NM = (IDX_LST_NM < 0 || rdr.IsDBNull(IDX_LST_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_LST_NM),
                            MI = (IDX_MI < 0 || rdr.IsDBNull(IDX_MI)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_MI),
                            ROLE_NM = (IDX_ROLE_NM < 0 || rdr.IsDBNull(IDX_ROLE_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_ROLE_NM),
                            USR_ACTV_IND = (IDX_USR_ACTV_IND < 0 || rdr.IsDBNull(IDX_USR_ACTV_IND)) ? default(System.Boolean) : rdr.GetFieldValue<System.Boolean>(IDX_USR_ACTV_IND)
                        });
                    } // while
                }
            }
            catch (Exception ex)
            {
                throw OpMsgQueue.CreateFault(ex);
            }

            return rtn;
        }

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
            opUserToken.Properties[EN.OPUSERTOKEN.IS_SUPER] = tempUserVitalsRole.First().IS_SUPER == 1 ? true : false;
            opUserToken.Properties[EN.OPUSERTOKEN.IS_TESTER] = tempUserVitalsRole.First().IS_TESTER == 1 ? true : false;
            opUserToken.Properties[EN.OPUSERTOKEN.IS_DEVELOPER] = tempUserVitalsRole.First().IS_DEVELOPER == 1 ? true : false;

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

            return settings;
        }

        public void SetOpUserToken(OpUserTokenParameters data)
        {
            try
            {
                // Call Proc
                DataAccessLib.StoredProcedures.MyDeals.dbo.PR_SET_USR_ROLE cmd = new DataAccessLib.StoredProcedures.MyDeals.dbo.PR_SET_USR_ROLE
                {
                    IDSID = OpUserStack.MyOpUserToken.Usr.Idsid,
                    RoleId = data.roleTypeId,
                    IsDeveloper = data.isDeveloper,
                    IsTester = data.isTester,
                    IsSuper = data.isSuper
                };

                using (var rdr = DataAccess.ExecuteReader(cmd))
                {
                }
            }
            catch (Exception ex)
            {
                OpLogPerf.Log(ex);
                throw;
            }
        }

        public List<ManageUsersInfo> GetManageUserData(int wwid)
        {
            List<ManageUsersInfo> rtn = new List<ManageUsersInfo>();

            var cmd = new Procs.dbo.PR_MANAGE_USERS()
            {
                mode = "Select",
                wwid = wwid
            };

            try
            {
                using (var rdr = DataAccess.ExecuteReader(cmd))
                {
                    //TABLE 1
                    var ret = new List<ManageUsersInfo>();
                    int IDX_ACTV_IND = DB.GetReaderOrdinal(rdr, "ACTV_IND");
                    int IDX_EMP_WWID = DB.GetReaderOrdinal(rdr, "EMP_WWID");
                    int IDX_FRST_NM = DB.GetReaderOrdinal(rdr, "FRST_NM");
                    int IDX_IS_DEVELOPER = DB.GetReaderOrdinal(rdr, "IS_DEVELOPER");
                    int IDX_IS_SUPER = DB.GetReaderOrdinal(rdr, "IS_SUPER");
                    int IDX_IS_TESTER = DB.GetReaderOrdinal(rdr, "IS_TESTER");
                    int IDX_LST_MOD_BY = DB.GetReaderOrdinal(rdr, "LST_MOD_BY");
                    int IDX_LST_MOD_DT = DB.GetReaderOrdinal(rdr, "LST_MOD_DT");
                    int IDX_LST_NM = DB.GetReaderOrdinal(rdr, "LST_NM");
                    int IDX_MI = DB.GetReaderOrdinal(rdr, "MI");
                    int IDX_USR_CUST = DB.GetReaderOrdinal(rdr, "USR_CUST");
                    int IDX_USR_GEOS = DB.GetReaderOrdinal(rdr, "USR_GEOS");
                    int IDX_USR_ROLE = DB.GetReaderOrdinal(rdr, "USR_ROLE");
                    int IDX_USR_VERTS = DB.GetReaderOrdinal(rdr, "USR_VERTS");

                    while (rdr.Read())
                    {
                        rtn.Add(new ManageUsersInfo
                        {
                            ACTV_IND = (IDX_ACTV_IND < 0 || rdr.IsDBNull(IDX_ACTV_IND)) ? default(System.Boolean) : rdr.GetFieldValue<System.Boolean>(IDX_ACTV_IND),
                            EMP_WWID = (IDX_EMP_WWID < 0 || rdr.IsDBNull(IDX_EMP_WWID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_EMP_WWID),
                            FRST_NM = (IDX_FRST_NM < 0 || rdr.IsDBNull(IDX_FRST_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_FRST_NM),
                            IS_DEVELOPER = (IDX_IS_DEVELOPER < 0 || rdr.IsDBNull(IDX_IS_DEVELOPER)) ? default(System.Boolean) : rdr.GetFieldValue<System.Boolean>(IDX_IS_DEVELOPER),
                            IS_SUPER = (IDX_IS_SUPER < 0 || rdr.IsDBNull(IDX_IS_SUPER)) ? default(System.Boolean) : rdr.GetFieldValue<System.Boolean>(IDX_IS_SUPER),
                            IS_TESTER = (IDX_IS_TESTER < 0 || rdr.IsDBNull(IDX_IS_TESTER)) ? default(System.Boolean) : rdr.GetFieldValue<System.Boolean>(IDX_IS_TESTER),
                            LST_MOD_BY = (IDX_LST_MOD_BY < 0 || rdr.IsDBNull(IDX_LST_MOD_BY)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_LST_MOD_BY),
                            LST_MOD_DT = (IDX_LST_MOD_DT < 0 || rdr.IsDBNull(IDX_LST_MOD_DT)) ? default(System.DateTime) : rdr.GetFieldValue<System.DateTime>(IDX_LST_MOD_DT),
                            LST_NM = (IDX_LST_NM < 0 || rdr.IsDBNull(IDX_LST_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_LST_NM),
                            MI = (IDX_MI < 0 || rdr.IsDBNull(IDX_MI)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_MI),
                            USR_CUST = (IDX_USR_CUST < 0 || rdr.IsDBNull(IDX_USR_CUST)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_USR_CUST),
                            USR_GEOS = (IDX_USR_GEOS < 0 || rdr.IsDBNull(IDX_USR_GEOS)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_USR_GEOS),
                            USR_ROLE = (IDX_USR_ROLE < 0 || rdr.IsDBNull(IDX_USR_ROLE)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_USR_ROLE),
                            USR_VERTS = (IDX_USR_VERTS < 0 || rdr.IsDBNull(IDX_USR_VERTS)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_USR_VERTS)
                        });
                    } // while
                }
            }
            catch (Exception ex)
            {
                throw OpMsgQueue.CreateFault(ex);
            }

            return rtn;
        }

        public void SetManageUserData(EmployeeCustomers data)
        {
            try
            {
                var cmd = new Procs.dbo.PR_MANAGE_USERS()
                {
                    mode = "Update",
                    wwid = data.empWWID,
                    cust_ids = new type_int_list(data.custIds.ToArray())
                };

                using (var rdr = DataAccess.ExecuteReader(cmd))
                {
                }
            }
            catch (Exception ex)
            {
                OpLogPerf.Log(ex);
                throw;
            }
        }
    }
}