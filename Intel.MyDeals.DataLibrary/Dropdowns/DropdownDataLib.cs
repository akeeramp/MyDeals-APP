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
using Intel.Opaque.Tools;

namespace Intel.MyDeals.DataLibrary
{
    public class DropdownDataLib : IDropdownDataLib
    {
        public DropdownDataLib()
        {
        }

        /// <summary>
        /// Get All Basic Dropdowns
        /// </summary>
        /// <returns>list of basic dropdown data</returns>
        public List<BasicDropdown> GetBasicDropdowns()
        {
            List<BasicDropdown> ret = ExecuteManageBasicDropdownSP(null, CrudModes.Select);
            return ret;
        }

        public List<DictDropDown> GetDictDropDown(string atrbCd)
        {
            List<DictDropDown> lstRtn = new List<DictDropDown>();
            Procs.dbo.PR_MYDL_GET_DICT_DROPDOWNS cmd = new Procs.dbo.PR_MYDL_GET_DICT_DROPDOWNS { atrb_cd = atrbCd };

            try
            {
                using (var rdr = DataAccess.ExecuteReader(cmd))
                {
                    int IDX_value = DB.GetReaderOrdinal(rdr, "value");

                    while (rdr.Read())
                    {
                        lstRtn.Add(new DictDropDown
                        {
                            value = (IDX_value < 0 || rdr.IsDBNull(IDX_value)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_value)
                        });
                    }
                }
            }
            catch (Exception ex)
            {
                OpLogPerf.Log(ex);
                throw;
            }
            return lstRtn.OrderBy(x => x.value).ToList();
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
                    int IDX_allDealFlag = DB.GetReaderOrdinal(rdr, "allDealFlag");
                    int IDX_dropdownCategory = DB.GetReaderOrdinal(rdr, "dropdownCategory");
                    int IDX_dropdownID = DB.GetReaderOrdinal(rdr, "dropdownID");
                    int IDX_dropdownName = DB.GetReaderOrdinal(rdr, "dropdownName");
                    int IDX_parntAtrbCd = DB.GetReaderOrdinal(rdr, "parntAtrbCd");
                    int IDX_subAtrbCd = DB.GetReaderOrdinal(rdr, "subAtrbCd");
                    int IDX_subAtrbValue = DB.GetReaderOrdinal(rdr, "subAtrbValue");
                    int IDX_subCategory = DB.GetReaderOrdinal(rdr, "subCategory");

                    while (rdr.Read())
                    {
                        ret.Add(new Dropdown
                        {
                            active = (IDX_active < 0 || rdr.IsDBNull(IDX_active)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_active),
                            allDealFlag = (IDX_allDealFlag < 0 || rdr.IsDBNull(IDX_allDealFlag)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_allDealFlag),
                            dropdownCategory = (IDX_dropdownCategory < 0 || rdr.IsDBNull(IDX_dropdownCategory)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_dropdownCategory),
                            dropdownID = (IDX_dropdownID < 0 || rdr.IsDBNull(IDX_dropdownID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_dropdownID),
                            dropdownName = (IDX_dropdownName < 0 || rdr.IsDBNull(IDX_dropdownName)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_dropdownName),
                            parntAtrbCd = (IDX_parntAtrbCd < 0 || rdr.IsDBNull(IDX_parntAtrbCd)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_parntAtrbCd),
                            subAtrbCd = (IDX_subAtrbCd < 0 || rdr.IsDBNull(IDX_subAtrbCd)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_subAtrbCd),
                            subAtrbValue = (IDX_subAtrbValue < 0 || rdr.IsDBNull(IDX_subAtrbValue)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_subAtrbValue),
                            subCategory = (IDX_subCategory < 0 || rdr.IsDBNull(IDX_subCategory)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_subCategory)
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
                    CUST_MBR_SID = 0,
                    ATRB_VAL_TXT = "",
                    ATRB_LKUP_DESC = "",
                    ATRB_LKUP_TTIP = "",
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
                    CUST_MBR_SID = dropdown.CUST_MBR_SID,
                    ATRB_VAL_TXT = dropdown.DROP_DOWN,
                    ATRB_LKUP_DESC = dropdown.ATRB_LKUP_DESC,
                    ATRB_LKUP_TTIP = dropdown.ATRB_LKUP_TTIP,
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
                    int IDX_ATRB_LKUP_DESC = DB.GetReaderOrdinal(rdr, "ATRB_LKUP_DESC");
                    int IDX_ATRB_LKUP_SID = DB.GetReaderOrdinal(rdr, "ATRB_LKUP_SID");
                    int IDX_ATRB_LKUP_TTIP = DB.GetReaderOrdinal(rdr, "ATRB_LKUP_TTIP");
                    int IDX_ATRB_SID = DB.GetReaderOrdinal(rdr, "ATRB_SID");
                    int IDX_CUST_MBR_SID = DB.GetReaderOrdinal(rdr, "CUST_MBR_SID");
                    int IDX_CUST_NM = DB.GetReaderOrdinal(rdr, "CUST_NM");
                    int IDX_DFLT_FLG = DB.GetReaderOrdinal(rdr, "DFLT_FLG");
                    int IDX_DROP_DOWN = DB.GetReaderOrdinal(rdr, "DROP_DOWN");
                    int IDX_OBJ_SET_TYPE_CD = DB.GetReaderOrdinal(rdr, "OBJ_SET_TYPE_CD");
                    int IDX_OBJ_SET_TYPE_SID = DB.GetReaderOrdinal(rdr, "OBJ_SET_TYPE_SID");
                    int IDX_ORD = DB.GetReaderOrdinal(rdr, "ORD");

                    while (rdr.Read())
                    {
                        ret.Add(new BasicDropdown
                        {
                            ACTV_IND = (IDX_ACTV_IND < 0 || rdr.IsDBNull(IDX_ACTV_IND)) ? default(System.Boolean) : rdr.GetFieldValue<System.Boolean>(IDX_ACTV_IND),
                            ATRB_CD = (IDX_ATRB_CD < 0 || rdr.IsDBNull(IDX_ATRB_CD)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_ATRB_CD),
                            ATRB_LKUP_DESC = (IDX_ATRB_LKUP_DESC < 0 || rdr.IsDBNull(IDX_ATRB_LKUP_DESC)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_ATRB_LKUP_DESC),
                            ATRB_LKUP_SID = (IDX_ATRB_LKUP_SID < 0 || rdr.IsDBNull(IDX_ATRB_LKUP_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_ATRB_LKUP_SID),
                            ATRB_LKUP_TTIP = (IDX_ATRB_LKUP_TTIP < 0 || rdr.IsDBNull(IDX_ATRB_LKUP_TTIP)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_ATRB_LKUP_TTIP),
                            ATRB_SID = (IDX_ATRB_SID < 0 || rdr.IsDBNull(IDX_ATRB_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_ATRB_SID),
                            CUST_MBR_SID = (IDX_CUST_MBR_SID < 0 || rdr.IsDBNull(IDX_CUST_MBR_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_CUST_MBR_SID),
                            CUST_NM = (IDX_CUST_NM < 0 || rdr.IsDBNull(IDX_CUST_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_CUST_NM),
                            DFLT_FLG = (IDX_DFLT_FLG < 0 || rdr.IsDBNull(IDX_DFLT_FLG)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_DFLT_FLG),
                            DROP_DOWN = (IDX_DROP_DOWN < 0 || rdr.IsDBNull(IDX_DROP_DOWN)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_DROP_DOWN),
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
                    CUST_MBR_SID = 0,
                    ATRB_VAL_TXT = "",
                    ATRB_LKUP_DESC = "",
                    ATRB_LKUP_TTIP = "",
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

        /// <summary>
        /// Gets a list of deal groups given a dealId
        /// </summary>
        /// <param name="ids">A dealId</param>
        /// <returns>a list of deal groups</returns>
        public List<OverlappingDeal> GetDealGroupDropdown(OpDataElementType opDataElementType, List<int> ids)
        {
            type_int_pair opPair = new type_int_pair();
            opPair.AddRows(ids.Select(id => new OpPair<int, int>
            {
                First = opDataElementType.ToId(),
                Second = id
            }));

            var ret = new List<OverlappingDeal>();
            Procs.dbo.PR_MYDL_GET_OVLP_DEALS cmd = new Procs.dbo.PR_MYDL_GET_OVLP_DEALS()
            {
                in_obj_keys = opPair
            };

            try
            {
                using (var rdr = DataAccess.ExecuteReader(cmd))
                {
                    int IDX_CST_MCP_DEAL_FLAG = DB.GetReaderOrdinal(rdr, "CST_MCP_DEAL_FLAG");
                    int IDX_EXCLD_DEAL_FLAG = DB.GetReaderOrdinal(rdr, "EXCLD_DEAL_FLAG");
                    int IDX_OVLP_ADDITIVE = DB.GetReaderOrdinal(rdr, "OVLP_ADDITIVE");
                    int IDX_OVLP_CNSMPTN_RSN = DB.GetReaderOrdinal(rdr, "OVLP_CNSMPTN_RSN");
                    int IDX_OVLP_CNTRCT_NM = DB.GetReaderOrdinal(rdr, "OVLP_CNTRCT_NM");
                    int IDX_OVLP_DEAL_DESC = DB.GetReaderOrdinal(rdr, "OVLP_DEAL_DESC");
                    int IDX_OVLP_DEAL_END_DT = DB.GetReaderOrdinal(rdr, "OVLP_DEAL_END_DT");
                    int IDX_OVLP_DEAL_ID = DB.GetReaderOrdinal(rdr, "OVLP_DEAL_ID");
                    int IDX_OVLP_DEAL_STRT_DT = DB.GetReaderOrdinal(rdr, "OVLP_DEAL_STRT_DT");
                    int IDX_OVLP_DEAL_TYPE = DB.GetReaderOrdinal(rdr, "OVLP_DEAL_TYPE");
                    int IDX_OVLP_ECAP_PRC = DB.GetReaderOrdinal(rdr, "OVLP_ECAP_PRC");
                    int IDX_OVLP_MAX_RPU = DB.GetReaderOrdinal(rdr, "OVLP_MAX_RPU");
                    int IDX_OVLP_MKT_SEG = DB.GetReaderOrdinal(rdr, "OVLP_MKT_SEG");
                    int IDX_OVLP_OEM_PLTFRM_EOL_DT = DB.GetReaderOrdinal(rdr, "OVLP_OEM_PLTFRM_EOL_DT");
                    int IDX_OVLP_OEM_PLTFRM_LNCH_DT = DB.GetReaderOrdinal(rdr, "OVLP_OEM_PLTFRM_LNCH_DT");
                    int IDX_OVLP_REBT_TYPE = DB.GetReaderOrdinal(rdr, "OVLP_REBT_TYPE");
                    int IDX_OVLP_WF_STG_CD = DB.GetReaderOrdinal(rdr, "OVLP_WF_STG_CD");
                    int IDX_WIP_DEAL_OBJ_SID = DB.GetReaderOrdinal(rdr, "WIP_DEAL_OBJ_SID");

                    while (rdr.Read())
                    {
                        ret.Add(new OverlappingDeal
                        {
                            CST_MCP_DEAL_FLAG = (IDX_CST_MCP_DEAL_FLAG < 0 || rdr.IsDBNull(IDX_CST_MCP_DEAL_FLAG)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_CST_MCP_DEAL_FLAG),
                            EXCLD_DEAL_FLAG = (IDX_EXCLD_DEAL_FLAG < 0 || rdr.IsDBNull(IDX_EXCLD_DEAL_FLAG)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_EXCLD_DEAL_FLAG),
                            OVLP_ADDITIVE = (IDX_OVLP_ADDITIVE < 0 || rdr.IsDBNull(IDX_OVLP_ADDITIVE)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_OVLP_ADDITIVE),
                            OVLP_CNSMPTN_RSN = (IDX_OVLP_CNSMPTN_RSN < 0 || rdr.IsDBNull(IDX_OVLP_CNSMPTN_RSN)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_OVLP_CNSMPTN_RSN),
                            OVLP_CNTRCT_NM = (IDX_OVLP_CNTRCT_NM < 0 || rdr.IsDBNull(IDX_OVLP_CNTRCT_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_OVLP_CNTRCT_NM),
                            OVLP_DEAL_DESC = (IDX_OVLP_DEAL_DESC < 0 || rdr.IsDBNull(IDX_OVLP_DEAL_DESC)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_OVLP_DEAL_DESC),
                            OVLP_DEAL_END_DT = (IDX_OVLP_DEAL_END_DT < 0 || rdr.IsDBNull(IDX_OVLP_DEAL_END_DT)) ? default(System.DateTime) : rdr.GetFieldValue<System.DateTime>(IDX_OVLP_DEAL_END_DT),
                            OVLP_DEAL_ID = (IDX_OVLP_DEAL_ID < 0 || rdr.IsDBNull(IDX_OVLP_DEAL_ID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_OVLP_DEAL_ID),
                            OVLP_DEAL_STRT_DT = (IDX_OVLP_DEAL_STRT_DT < 0 || rdr.IsDBNull(IDX_OVLP_DEAL_STRT_DT)) ? default(System.DateTime) : rdr.GetFieldValue<System.DateTime>(IDX_OVLP_DEAL_STRT_DT),
                            OVLP_DEAL_TYPE = (IDX_OVLP_DEAL_TYPE < 0 || rdr.IsDBNull(IDX_OVLP_DEAL_TYPE)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_OVLP_DEAL_TYPE),
                            OVLP_ECAP_PRC = (IDX_OVLP_ECAP_PRC < 0 || rdr.IsDBNull(IDX_OVLP_ECAP_PRC)) ? default(System.Decimal) : rdr.GetFieldValue<System.Decimal>(IDX_OVLP_ECAP_PRC),
                            OVLP_MAX_RPU = (IDX_OVLP_MAX_RPU < 0 || rdr.IsDBNull(IDX_OVLP_MAX_RPU)) ? default(System.Decimal) : rdr.GetFieldValue<System.Decimal>(IDX_OVLP_MAX_RPU),
                            OVLP_MKT_SEG = (IDX_OVLP_MKT_SEG < 0 || rdr.IsDBNull(IDX_OVLP_MKT_SEG)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_OVLP_MKT_SEG),
                            OVLP_OEM_PLTFRM_EOL_DT = (IDX_OVLP_OEM_PLTFRM_EOL_DT < 0 || rdr.IsDBNull(IDX_OVLP_OEM_PLTFRM_EOL_DT)) ? default(System.DateTime) : rdr.GetFieldValue<System.DateTime>(IDX_OVLP_OEM_PLTFRM_EOL_DT),
                            OVLP_OEM_PLTFRM_LNCH_DT = (IDX_OVLP_OEM_PLTFRM_LNCH_DT < 0 || rdr.IsDBNull(IDX_OVLP_OEM_PLTFRM_LNCH_DT)) ? default(System.DateTime) : rdr.GetFieldValue<System.DateTime>(IDX_OVLP_OEM_PLTFRM_LNCH_DT),
                            OVLP_REBT_TYPE = (IDX_OVLP_REBT_TYPE < 0 || rdr.IsDBNull(IDX_OVLP_REBT_TYPE)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_OVLP_REBT_TYPE),
                            OVLP_WF_STG_CD = (IDX_OVLP_WF_STG_CD < 0 || rdr.IsDBNull(IDX_OVLP_WF_STG_CD)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_OVLP_WF_STG_CD),
                            WIP_DEAL_OBJ_SID = (IDX_WIP_DEAL_OBJ_SID < 0 || rdr.IsDBNull(IDX_WIP_DEAL_OBJ_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_WIP_DEAL_OBJ_SID)
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