using System;
using System.Collections.Generic;
using Intel.MyDeals.DataAccessLib;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IDataLibrary;
using Intel.Opaque;
using Intel.Opaque.DBAccess;
using Procs = Intel.MyDeals.DataAccessLib.StoredProcedures.MyDeals;
using System.Linq;
using System.Data;

namespace Intel.MyDeals.DataLibrary
{
	public class DropdownDataLib : IDropdownDataLib
	{
		public DropdownDataLib() { }

		/// <summary>
		/// Get All Basic Dropdowns
		/// </summary>
		/// <returns>list of basic dropdown data</returns>
		public List<BasicDropdown> GetBasicDropdowns()
		{
            List<BasicDropdown> ret = ExecuteManageBasicDropdownSP(null, CrudModes.Select);
            return ret;
		}

        /// <summary>
		/// Get All Generic Dropdowns (ex: Deal Types)
		/// </summary>
		/// <returns>list of dropdown data</returns>
        public List<Dropdown> GetDropdowns()
        {
            var ret = new List<Dropdown>();
            Procs.dbo.PR_MYDL_GET_DROPDOWNS cmd = new Procs.dbo.PR_MYDL_GET_DROPDOWNS();

            try
            {
                using (var rdr = DataAccess.ExecuteReader(cmd))
                {
                    int IDX_active = DB.GetReaderOrdinal(rdr, "active");
                    int IDX_dropdownCategory = DB.GetReaderOrdinal(rdr, "dropdownCategory");
                    int IDX_dropdownID = DB.GetReaderOrdinal(rdr, "dropdownID");
                    int IDX_dropdownName = DB.GetReaderOrdinal(rdr, "dropdownName");
                    int IDX_isSubSegment = DB.GetReaderOrdinal(rdr, "isSubSegment");
                    int IDX_parntAtrbCd = DB.GetReaderOrdinal(rdr, "parntAtrbCd");

                    while (rdr.Read())
                    {
                        ret.Add(new Dropdown
                        {
                            active = (IDX_active < 0 || rdr.IsDBNull(IDX_active)) ? default(System.Boolean) : (Convert.ToInt32(rdr[IDX_active]) == 1),
                            dropdownCategory = (IDX_dropdownCategory < 0 || rdr.IsDBNull(IDX_dropdownCategory)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_dropdownCategory),
                            dropdownID = (IDX_dropdownID < 0 || rdr.IsDBNull(IDX_dropdownID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_dropdownID),
                            dropdownName = (IDX_dropdownName < 0 || rdr.IsDBNull(IDX_dropdownName)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_dropdownName),
                            isSubSegment = (IDX_isSubSegment < 0 || rdr.IsDBNull(IDX_isSubSegment)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_isSubSegment),
                            parntAtrbCd = (IDX_parntAtrbCd < 0 || rdr.IsDBNull(IDX_parntAtrbCd)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_parntAtrbCd)
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

        /// <summary>
        /// Updates a Basic Dropdown
        /// </summary>
        /// <returns>updated dropdown or exception depending on whether the SP fails or not</returns>
        public BasicDropdown ManageBasicDropdowns(BasicDropdown dropdown, CrudModes type)
		{
            List<BasicDropdown> ret = ExecuteManageBasicDropdownSP(dropdown, type);
            return ret.FirstOrDefault();
		}

        public List<BasicDropdown> ExecuteManageBasicDropdownSP(BasicDropdown dropdown, CrudModes type)
        {
            var ret = new List<BasicDropdown>();
            Procs.dbo.PR_MYDL_MANAGE_BASIC_DROPDOWNS cmd = new Procs.dbo.PR_MYDL_MANAGE_BASIC_DROPDOWNS();
            if (type.Equals(CrudModes.Select))
            {
                cmd = new Procs.dbo.PR_MYDL_MANAGE_BASIC_DROPDOWNS()
                {
                    MODE = type.ToString(),
                    ATRB_SID = 0,
                    OBJ_SET_TYPE_SID = 0,
                    ATRB_VAL_TXT = "",
                    EMP_WWID = OpUserStack.MyOpUserToken.Usr.WWID
                };
            }
            else
            {
                cmd = new Procs.dbo.PR_MYDL_MANAGE_BASIC_DROPDOWNS()
                {
                    LK_UP_SID = dropdown.ATRB_LKUP_SID,
                    MODE = type.ToString(),
                    ATRB_SID = dropdown.ATRB_SID,
                    OBJ_SET_TYPE_SID = dropdown.OBJ_SET_TYPE_SID,
                    ATRB_VAL_TXT = dropdown.DROP_DOWN,
                    ACTV_IND = dropdown.ACTV_IND,
                    EMP_WWID = OpUserStack.MyOpUserToken.Usr.WWID
                };
            }
            

            try
            {
                using (var rdr = DataAccess.ExecuteReader(cmd))
                {
                    int IDX_ACTV_IND = DB.GetReaderOrdinal(rdr, "ACTV_IND");
                    int IDX_ATRB_CD = DB.GetReaderOrdinal(rdr, "ATRB_CD");
                    int IDX_ATRB_LKUP_SID = DB.GetReaderOrdinal(rdr, "ATRB_LKUP_SID");
                    int IDX_ATRB_SID = DB.GetReaderOrdinal(rdr, "ATRB_SID");
                    int IDX_CUST_NM = DB.GetReaderOrdinal(rdr, "CUST_NM");
                    int IDX_DROP_DOWN = DB.GetReaderOrdinal(rdr, "DROP_DOWN");
                    int IDX_DROP_DOWN_DB = DB.GetReaderOrdinal(rdr, "DROP_DOWN_DB");
                    int IDX_OBJ_SET_TYPE_CD = DB.GetReaderOrdinal(rdr, "OBJ_SET_TYPE_CD");
                    int IDX_OBJ_SET_TYPE_SID = DB.GetReaderOrdinal(rdr, "OBJ_SET_TYPE_SID");
                    int IDX_ORD = DB.GetReaderOrdinal(rdr, "ORD");

                    while (rdr.Read())
                    {
                        ret.Add(new BasicDropdown
                        {
                            ACTV_IND = (IDX_ACTV_IND < 0 || rdr.IsDBNull(IDX_ACTV_IND)) ? default(System.Boolean) : (Convert.ToInt32(rdr[IDX_ACTV_IND]) == 1),
                            ATRB_CD = (IDX_ATRB_CD < 0 || rdr.IsDBNull(IDX_ATRB_CD)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_ATRB_CD),
                            ATRB_LKUP_SID = (IDX_ATRB_LKUP_SID < 0 || rdr.IsDBNull(IDX_ATRB_LKUP_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_ATRB_LKUP_SID),
                            ATRB_SID = (IDX_ATRB_SID < 0 || rdr.IsDBNull(IDX_ATRB_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_ATRB_SID),
                            CUST_NM = (IDX_CUST_NM < 0 || rdr.IsDBNull(IDX_CUST_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_CUST_NM),
                            DROP_DOWN = (IDX_DROP_DOWN < 0 || rdr.IsDBNull(IDX_DROP_DOWN)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_DROP_DOWN),
                            DROP_DOWN_DB = (IDX_DROP_DOWN_DB < 0 || rdr.IsDBNull(IDX_DROP_DOWN_DB)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_DROP_DOWN_DB),
                            OBJ_SET_TYPE_CD = (IDX_OBJ_SET_TYPE_CD < 0 || rdr.IsDBNull(IDX_OBJ_SET_TYPE_CD)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_OBJ_SET_TYPE_CD),
                            OBJ_SET_TYPE_SID = (IDX_OBJ_SET_TYPE_SID < 0 || rdr.IsDBNull(IDX_OBJ_SET_TYPE_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_OBJ_SET_TYPE_SID),
                            ORD = (IDX_ORD < 0 || rdr.IsDBNull(IDX_ORD)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_ORD)
                        });
                    }

                    if (!type.Equals(CrudModes.Select))
                    {
                        // Update Cache after Insert/Update actions
                        DataCollections.RecycleCache("_getBasicDropdowns");
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

        /// <summary>
        /// Deletes a Basic Dropdown
        /// </summary>
        /// <returns>success/failure boolean</returns>
        public bool DeleteBasicDropdown(int id)
        {
            DataSet dsCheckConstraintErrors = null;
            try
            {
                DataAccess.ExecuteDataSet(new Procs.dbo.PR_MYDL_MANAGE_BASIC_DROPDOWNS()
                {
                    LK_UP_SID = id,
                    MODE = CrudModes.Delete.ToString(),
                    ATRB_SID = 0,
                    OBJ_SET_TYPE_SID = 0,
                    ATRB_VAL_TXT = "",
                    EMP_WWID = OpUserStack.MyOpUserToken.Usr.WWID
                }, null, out dsCheckConstraintErrors);

                // Update Cache after Delete actions
                DataCollections.RecycleCache("_getBasicDropdowns");
            }
            catch (Exception ex)
            {
                if (dsCheckConstraintErrors != null && dsCheckConstraintErrors.Tables.Count > 0)
                {
                    OpLogPerf.Log(ex);
                }
                throw;
            }
            return true;
        }
    }
}
