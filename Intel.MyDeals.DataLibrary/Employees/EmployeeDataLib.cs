using System.Collections.Generic;
using System.Data;
using System.IO;
using Intel.MyDeals.DataAccessLib;
using Intel.MyDeals.Entities;
using Intel.Opaque;
using Intel.Opaque.DBAccess;
using Procs = Intel.MyDeals.DataAccessLib.StoredProcedures.MyDeals;


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

        private string ExecuteSpDataSetToXMLProc(SP proc)
        {
            var ds = DataAccess.ExecuteDataSet(proc);
            using (var stringWriter = new StringWriter())
            {
                ds.WriteXml(stringWriter, XmlWriteMode.WriteSchema);
                return stringWriter.ToString();
            }
        }

        public UserSetting GetUserSettings()
        {
            // TODO Need to rewrite this with the modern method... not this 2003 XML version

            OpUserToken opUserToken = OpUserStack.MyOpUserToken;

            UserSetting settings = new UserSetting();
            string vitals;

            ////var cmd = new Procs.CDMS_MYDEALS.app.PR_GET_VITALS_USER_IDMS
            ////{
            ////    idsid = opUserToken.Usr.Idsid,
            ////    AppCD = "IDMS"
            ////};

            ////try
            ////{
            ////    vitals = ExecuteSpDataSetToXMLProc(cmd);
            ////}
            ////catch (Exception ex)
            ////{
            ////    throw OpMsgQueue.CreateFault(ex);
            ////}

            ////XDocument source = XDocument.Parse(vitals);

            ////// Table contains User Record
            ////List<OpRoleType> tmpRoles =
            ////    (from elEmp in source.Descendants("Table")
            ////     select new OpRoleType
            ////     {
            ////         RoleTypeCd = (string)elEmp.Element("ROLE_TYPE_CD"),
            ////         RoleTypeDescription = (string)elEmp.Element("ROLE_TYPE_CD"),
            ////         RoleTypeDisplayName = (string)elEmp.Element("ROLE_TYPE_CD"),
            ////         RoleTypeId = 0
            ////     }).ToList();

            ////if (!tmpRoles.Any()) return new UserSetting();

            ////opUserToken.Role = tmpRoles.First();

            ////opUserToken.Usr =
            ////    (from elEmp in source.Descendants("Table")
            ////     select new OpUser
            ////     {
            ////         UserID = (int)elEmp.Element("EMP_WWID"),
            ////         Idsid = ((string)elEmp.Element("IDSID")).Trim(),
            ////         WWID = (int)elEmp.Element("EMP_WWID"),
            ////         LastName = (string)elEmp.Element("LST_NM"),
            ////         FirstName = (string)elEmp.Element("FRST_NM"),
            ////         Email = (string)elEmp.Element("EMAIL_ADDR"),
            ////         AppId = (int)elEmp.Element("APPL_SID")
            ////     }).FirstOrDefault();


            ////// Table 1 contains SecurityAction
            ////settings.SecurityActions =
            ////    (from elSecActn in source.Descendants("Table1")
            ////     select new SecurityAction
            ////     {
            ////         FACT_ATRB_CD = (string)elSecActn.Element("FACT_ATRB_CD"),
            ////         ATRB_BIT = (int)elSecActn.Element("ATRB_BIT"),
            ////         ATRB_MAGNITUDE = (int)elSecActn.Element("ATRB_MAGNITUDE")
            ////     }).ToObservableCollection();


            ////// Table 2 contains SecurityMask    
            ////settings.SecurityMasks =
            ////    (from elSecMask in source.Descendants("Table2")
            ////     select new SecurityMask
            ////     {
            ////         ACTN_CD = (string)elSecMask.Element("ACTN_CD"),
            ////         ROLE_TYPE_CD = (string)elSecMask.Element("ROLE_TYPE_CD"),
            ////         PERMISSION_MASK = (string)elSecMask.Element("PERMISSION_MASK"),
            ////         WFSTG_CD = (string)elSecMask.Element("WFSTG_CD")
            ////     }).ToObservableCollection();

            ////// Table 4 contains Verticals    
            ////settings.VerticalSecurity =
            ////    (from el in source.Descendants("Table4")
            ////     select new VerticalSecurityItem
            ////     {
            ////         Id = (int)el.Element("VERTICAL"),
            ////         VerticalName = (string)el.Element("VERTICAL_NM")
            ////     }).ToObservableCollection();

            ////// Table 6 contains SuperSa Record
            ////List<string> tmpSuperSa =
            ////    (from elEmp in source.Descendants("Table")
            ////     select (string)elEmp.Element("SUPER_SA")
            ////        ).ToList();
            ////settings.SuperSa = tmpSuperSa.First() == "YES";
            ////settings.UserToken = opUserToken;

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
