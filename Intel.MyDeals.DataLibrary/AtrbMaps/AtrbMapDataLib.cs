using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using Intel.MyDeals.DataAccessLib;
using Intel.MyDeals.DataAccessLib.StoredProcedures.MyDeals.dbo;
using Intel.MyDeals.Entities;
using Intel.Opaque;
using Intel.Opaque.Data;
using Intel.Opaque.DBAccess;
using Procs = Intel.MyDeals.DataAccessLib.StoredProcedures.MyDeals;


namespace Intel.MyDeals.DataLibrary
{
    public class AtrbMapDataLib
    {
        private static readonly string[] GetOpAtrbMapItemsExclusions = {
        };

        /// <summary>
        /// Get lookup data for attributes that contain pointers to other data.
        /// </summary>
        /// <returns></returns>
        public List<OpAtrbMap> GetOpAtrbMapItems()
        {
            return new List<OpAtrbMap>();
            ////var ret = new List<OpAtrbMap>();

            ////using (var rdr = DataAccess.ExecuteReader(new Procs.CDMS_MYDEALS.meta.PR_GET_ATRB_MSTR_FK_DATA { exclude_atrb_cd = string.Join(",", GetOpAtrbMapItemsExclusions) }))
            ////{
            ////    int ATRB_SID_IDX = rdr.GetOrdinal("ATRB_SID");
            ////    int ATRB_ITEM_SID_IDX = rdr.GetOrdinal("ATRB_ITEM_SID");
            ////    int ATRB_CD_IDX = rdr.GetOrdinal("ATRB_CD");
            ////    int ATRB_ITEM_VALUE_IDX = rdr.GetOrdinal("ATRB_ITEM_VALUE");

            ////    while (rdr.Read())
            ////    {
            ////        if (rdr.IsDBNull(ATRB_SID_IDX) || rdr.IsDBNull(ATRB_ITEM_SID_IDX)) { continue; }

            ////        ret.Add(new OpAtrbMap
            ////        {
            ////            AtrbID = rdr.GetInt32(ATRB_SID_IDX),
            ////            AtrbItemId = rdr.GetInt32(ATRB_ITEM_SID_IDX),
            ////            AtrbCd = $"{rdr[ATRB_CD_IDX]}".Trim().ToUpper(),
            ////            AtrbItemValue = $"{rdr[ATRB_ITEM_VALUE_IDX]}".Trim()
            ////        });
            ////    }
            ////}

            ////return ret;

        }

        /// <summary>
        /// Get all ATBR_MSTR records
        /// </summary>
        /// <returns></returns>
        public Dictionary<int, MyDealsAttribute> GetAttributeMasterDataDictionary()
        {
            return GetAttributeMasterDataDictionary(null);
        }

//        private static readonly string[] GetOpAtrbMapItemsExclusions =
//        {
//            AttributeCodes.PLI_LOCATOR,
//            AttributeCodes.PRD_MBR_SID
//        };

//        /// <summary>
//        /// Get lookup data for attributes that contain pointers to other data.
//        /// </summary>
//        /// <returns></returns>
//        public List<OpAtrbMap> GetOpAtrbMapItems()
//        {
//            var ret = new List<OpAtrbMap>();

//            using (var rdr = DataAccess.ExecuteReader(new Procs.CDMS_MYDEALS.meta.PR_GET_ATRB_MSTR_FK_DATA { exclude_atrb_cd = string.Join(",", GetOpAtrbMapItemsExclusions) }))
//            {
//                int ATRB_SID_IDX = rdr.GetOrdinal("ATRB_SID");
//                int ATRB_ITEM_SID_IDX = rdr.GetOrdinal("ATRB_ITEM_SID");
//                int ATRB_CD_IDX = rdr.GetOrdinal("ATRB_CD");
//                int ATRB_ITEM_VALUE_IDX = rdr.GetOrdinal("ATRB_ITEM_VALUE");

//                while (rdr.Read())
//                {
//                    if (rdr.IsDBNull(ATRB_SID_IDX) || rdr.IsDBNull(ATRB_ITEM_SID_IDX)) { continue; }

//                    ret.Add(new OpAtrbMap
//                    {
//                        AtrbID = rdr.GetInt32(ATRB_SID_IDX),
//                        AtrbItemId = rdr.GetInt32(ATRB_ITEM_SID_IDX),
//                        AtrbCd = $"{rdr[ATRB_CD_IDX]}".Trim().ToUpper(),
//                        AtrbItemValue = $"{rdr[ATRB_ITEM_VALUE_IDX]}".Trim()
//                    });
//                }
//            }

//            return ret;

//        }

//        /// <summary>
//        /// Get all ATBR_MSTR records
//        /// </summary>
//        /// <returns></returns>
//        public Dictionary<int, MyDealsAttribute> GetAttributeMasterDataDictionary()
//        {
//            return GetAttributeMasterDataDictionary(null);
//        }


//        /// <summary>
//        /// Get a subset of Attribute Master data where you know what attributes you want to get
//        /// </summary>
//        /// <param name="atrbSids">Filter list of ATRB_SID or null</param>
//        /// <returns>Subset of master data.</returns>
//        public Dictionary<int, MyDealsAttribute> GetAttributeMasterDataDictionary(IEnumerable<int> atrbSids)
//        {
//            var ret = new Dictionary<int, MyDealsAttribute>();
//#if DEBUG
//            OpLogPerf.Log("MetaDataLib.GetAttributeMasterDataDictionary: ExecuteReader");
//#endif
//            using (var rdr = DataAccess.ExecuteReader(new Procs.CDMS_MYDEALS.meta.PR_GET_ATRB_MSTR()))
//            {
//                var readerColumns = new Dictionary<int, string>();
//                var ty = typeof(MyDealsAttribute);

//                OpLogPerf.Log("Getting Columns");
//                for (int i = rdr.VisibleFieldCount - 1; i >= 0; --i)
//                {
//                    readerColumns[i] = (rdr.GetName(i).Trim().ToUpper());
//                }

//                // Since DcsAttribute is primarily created dynamically based on meta.VW_ATRB_MSTR, synch properties based on names.
//                var matchedColumns = (from rc in readerColumns
//                                      join pn in ty.GetProperties().Where(pi => pi.CanRead && pi.CanWrite)
//                                      on rc.Value equals pn.Name.Trim().ToUpper()
//                                      select new
//                                      {
//                                          col_idx = rc.Key,
//                                          prop_info = pn
//                                      }).ToArray();

//                OpLogPerf.Log("Getting Data");
//                while (rdr.Read())
//                {
//                    var item = new MyDealsAttribute();
//                    foreach (var mc in matchedColumns)
//                    {
//                        if (!rdr.IsDBNull(mc.col_idx))
//                        {
//                            mc.prop_info.SetValue(item, rdr[mc.col_idx]);
//                        }
//                    }

//                    ret[item.ATRB_SID] = item;
//                }

//#if DEBUG
//                OpLogPerf.Log("End Getting Data");
//#endif
//            }

//            return ret;
//        }

//        #region MasterAttribute


//        public List<MasterAttributes> CrudMasterAttribute(string groupCode, int wwId, string mode, params int[] attributeCodeList)
//        {
//            using (var rdr = DataAccess.ExecuteReader(new Procs.CDMS_MYDEALS.admin.PR_MANAGE_ATRB_GRP()
//            {
//                ATRBS = new type_int_list(attributeCodeList),
//                GRP_CD = groupCode,
//                EMP_WWID = wwId,
//                MODE = mode
//            }))
//            {
//                var ret = new List<MasterAttributes>();
//                int IDX_ATRB_CD = DB.GetReaderOrdinal(rdr, "ATRB_CD");
//                int IDX_ATRB_CD_DESC = DB.GetReaderOrdinal(rdr, "ATRB_CD_DESC");
//                int IDX_ATRB_SID = DB.GetReaderOrdinal(rdr, "ATRB_SID");
//                int IDX_GRP_CD = DB.GetReaderOrdinal(rdr, "GRP_CD");

//                while (rdr.Read())
//                {
//                    ret.Add(new MasterAttributes
//                    {
//                        ATRB_CD = (IDX_ATRB_CD < 0 || rdr.IsDBNull(IDX_ATRB_CD)) ? string.Empty : rdr.GetFieldValue<System.String>(IDX_ATRB_CD),
//                        ATRB_CD_DESC = (IDX_ATRB_CD_DESC < 0 || rdr.IsDBNull(IDX_ATRB_CD_DESC)) ? string.Empty : rdr.GetFieldValue<System.String>(IDX_ATRB_CD_DESC),
//                        ATRB_SID = (IDX_ATRB_SID < 0 || rdr.IsDBNull(IDX_ATRB_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_ATRB_SID),
//                        GRP_CD = (IDX_GRP_CD < 0 || rdr.IsDBNull(IDX_GRP_CD)) ? string.Empty : rdr.GetFieldValue<System.String>(IDX_GRP_CD)
//                    });
//                } // while
//                return ret;
//            }
//        }

//        #endregion

        /// <summary>
        /// Get a subset of Attribute Master data where you know what attributes you want to get
        /// </summary>
        /// <param name="atrbSids">Filter list of ATRB_SID or null</param>
        /// <returns>Subset of master data.</returns>
        public Dictionary<int, MyDealsAttribute> GetAttributeMasterDataDictionary(IEnumerable<int> atrbSids)
        {
            var ret = new Dictionary<int, MyDealsAttribute>();

            List<AtrbMstr> atrbMstrs = new DataCollectionsDataLib().GetAtrbMstrs();
            foreach (AtrbMstr atrbMstr in atrbMstrs)
            {
                ret[atrbMstr.ATRB_SID ?? 0] = new MyDealsAttribute
                {
                    ACTV_IND = (bool) atrbMstr.ACTV_IND,
                    ATRB_COL_NM = atrbMstr.ATRB_CD,
                    ATRB_DESC = atrbMstr.ATRB_DESC,
                    ATRB_LBL = atrbMstr.ATRB_LBL,
                    DATA_TYPE_CD = atrbMstr.DATA_TYPE_CD,
                    DIM_CD = atrbMstr.DIM_CD,
                    DOT_NET_DATA_TYPE = atrbMstr.DOT_NET_DATA_TYPE,
                    TGT_COL_TYPE = atrbMstr.TGT_COL_TYPE,
                    UI_TYPE_CD = atrbMstr.UI_TYPE_CD,
                    ATRB_MAX_LEN = atrbMstr.ATRB_MAX_LEN ?? 0,
                    ATRB_SID = atrbMstr.ATRB_SID ?? 0,
                    ATRB_SRT_ORD = atrbMstr.ATRB_SRT_ORD ?? 0,
                    DIM_SID = atrbMstr.DIM_SID ?? short.MinValue,
                    //IS_FACT = atrbMstr.IS_FACT ?? false,
                    PIVOT_MSK = atrbMstr.PVT_MSK ?? 0
                };
            }

            return ret;
        }


        
        public List<AtrbMstr> GetAtrbMstrs()
        {
            var cmd = new PR_GET_ATRB_MSTR();
            return AtrbMstrFromReader(DataAccess.ExecuteReader(cmd));
        }


        private static List<AtrbMstr> AtrbMstrFromReader(SqlDataReader rdr)
        {
            // This helper method is template generated.
            // Refer to that template for details to modify this code.

            var ret = new List<AtrbMstr>();
            int IDX_ACTV_IND = DB.GetReaderOrdinal(rdr, "ACTV_IND");
            int IDX_ATRB_ACTV_IND = DB.GetReaderOrdinal(rdr, "ATRB_ACTV_IND");
            int IDX_ATRB_CD = DB.GetReaderOrdinal(rdr, "ATRB_CD");
            int IDX_ATRB_DESC = DB.GetReaderOrdinal(rdr, "ATRB_DESC");
            int IDX_ATRB_EXT_PRO = DB.GetReaderOrdinal(rdr, "ATRB_EXT_PRO");
            int IDX_ATRB_FK_TBL_DSPLY_COL_NM = DB.GetReaderOrdinal(rdr, "ATRB_FK_TBL_DSPLY_COL_NM");
            int IDX_ATRB_FK_TBL_NM = DB.GetReaderOrdinal(rdr, "ATRB_FK_TBL_NM");
            int IDX_ATRB_FK_TBL_PK_COL_NM = DB.GetReaderOrdinal(rdr, "ATRB_FK_TBL_PK_COL_NM");
            int IDX_ATRB_FK_TBL_SCH = DB.GetReaderOrdinal(rdr, "ATRB_FK_TBL_SCH");
            int IDX_ATRB_LBL = DB.GetReaderOrdinal(rdr, "ATRB_LBL");
            int IDX_ATRB_MAX_LEN = DB.GetReaderOrdinal(rdr, "ATRB_MAX_LEN");
            int IDX_ATRB_SID = DB.GetReaderOrdinal(rdr, "ATRB_SID");
            int IDX_ATRB_SRT_ORD = DB.GetReaderOrdinal(rdr, "ATRB_SRT_ORD");
            int IDX_ATRB_TGT_COL = DB.GetReaderOrdinal(rdr, "ATRB_TGT_COL");
            int IDX_ATRB_TGT_TBL_NM = DB.GetReaderOrdinal(rdr, "ATRB_TGT_TBL_NM");
            int IDX_ATRB_TGT_TBL_SCH = DB.GetReaderOrdinal(rdr, "ATRB_TGT_TBL_SCH");
            int IDX_ATRB_UNIQ_IND = DB.GetReaderOrdinal(rdr, "ATRB_UNIQ_IND");
            int IDX_ATRB_UNIQ_LEVELS = DB.GetReaderOrdinal(rdr, "ATRB_UNIQ_LEVELS");
            int IDX_CHG_DTM = DB.GetReaderOrdinal(rdr, "CHG_DTM");
            int IDX_CHG_EMP_WWID = DB.GetReaderOrdinal(rdr, "CHG_EMP_WWID");
            int IDX_CRE_DTM = DB.GetReaderOrdinal(rdr, "CRE_DTM");
            int IDX_CRE_EMP_WWID = DB.GetReaderOrdinal(rdr, "CRE_EMP_WWID");
            int IDX_DATA_TYPE_ACTV_IND = DB.GetReaderOrdinal(rdr, "DATA_TYPE_ACTV_IND");
            int IDX_DATA_TYPE_CD = DB.GetReaderOrdinal(rdr, "DATA_TYPE_CD");
            int IDX_DATA_TYPE_DESC = DB.GetReaderOrdinal(rdr, "DATA_TYPE_DESC");
            int IDX_DATA_TYPE_SID = DB.GetReaderOrdinal(rdr, "DATA_TYPE_SID");
            int IDX_DIM_ACTV_IND = DB.GetReaderOrdinal(rdr, "DIM_ACTV_IND");
            int IDX_DIM_ATRB_COL_NM = DB.GetReaderOrdinal(rdr, "DIM_ATRB_COL_NM");
            int IDX_DIM_CD = DB.GetReaderOrdinal(rdr, "DIM_CD");
            int IDX_DIM_DATA_COL_NM = DB.GetReaderOrdinal(rdr, "DIM_DATA_COL_NM");
            int IDX_DIM_DFLT_ROOT_ATRB_NM = DB.GetReaderOrdinal(rdr, "DIM_DFLT_ROOT_ATRB_NM");
            int IDX_DIM_INTRFC_TBL_NM = DB.GetReaderOrdinal(rdr, "DIM_INTRFC_TBL_NM");
            int IDX_DIM_INTRFC_TBL_SCH = DB.GetReaderOrdinal(rdr, "DIM_INTRFC_TBL_SCH");
            int IDX_DIM_MAT_VW_NM = DB.GetReaderOrdinal(rdr, "DIM_MAT_VW_NM");
            int IDX_DIM_MAT_VW_SCH = DB.GetReaderOrdinal(rdr, "DIM_MAT_VW_SCH");
            int IDX_DIM_NM = DB.GetReaderOrdinal(rdr, "DIM_NM");
            int IDX_DIM_SID = DB.GetReaderOrdinal(rdr, "DIM_SID");
            int IDX_DIM_TBL_NM = DB.GetReaderOrdinal(rdr, "DIM_TBL_NM");
            int IDX_DIM_TBL_SCH = DB.GetReaderOrdinal(rdr, "DIM_TBL_SCH");
            int IDX_DOT_NET_DATA_TYPE = DB.GetReaderOrdinal(rdr, "DOT_NET_DATA_TYPE");
            int IDX_FMT_MSK = DB.GetReaderOrdinal(rdr, "FMT_MSK");
            int IDX_IS_IDX = DB.GetReaderOrdinal(rdr, "IS_IDX");
            int IDX_LEGACY_NM = DB.GetReaderOrdinal(rdr, "LEGACY_NM");
            int IDX_LKUP_ROOT_SID = DB.GetReaderOrdinal(rdr, "LKUP_ROOT_SID");
            int IDX_PARNT_ATRB_SID = DB.GetReaderOrdinal(rdr, "PARNT_ATRB_SID");
            int IDX_PVT_MSK = DB.GetReaderOrdinal(rdr, "PVT_MSK");
            int IDX_SQL_DATA_TYPE = DB.GetReaderOrdinal(rdr, "SQL_DATA_TYPE");
            int IDX_SQL_DATA_TYPE_FQ = DB.GetReaderOrdinal(rdr, "SQL_DATA_TYPE_FQ");
            int IDX_TGT_COL_TYPE = DB.GetReaderOrdinal(rdr, "TGT_COL_TYPE");
            int IDX_UI_TYPE_CD = DB.GetReaderOrdinal(rdr, "UI_TYPE_CD");

            while (rdr.Read())
            {
                ret.Add(new AtrbMstr
                {
                    ACTV_IND = (IDX_ACTV_IND < 0 || rdr.IsDBNull(IDX_ACTV_IND)) ? default(Nullable<System.Boolean>) : rdr.GetFieldValue<Nullable<System.Boolean>>(IDX_ACTV_IND),
                    ATRB_ACTV_IND = (IDX_ATRB_ACTV_IND < 0 || rdr.IsDBNull(IDX_ATRB_ACTV_IND)) ? default(Nullable<System.Boolean>) : rdr.GetFieldValue<Nullable<System.Boolean>>(IDX_ATRB_ACTV_IND),
                    ATRB_CD = (IDX_ATRB_CD < 0 || rdr.IsDBNull(IDX_ATRB_CD)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_ATRB_CD),
                    ATRB_DESC = (IDX_ATRB_DESC < 0 || rdr.IsDBNull(IDX_ATRB_DESC)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_ATRB_DESC),
                    ATRB_EXT_PRO = (IDX_ATRB_EXT_PRO < 0 || rdr.IsDBNull(IDX_ATRB_EXT_PRO)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_ATRB_EXT_PRO),
                    ATRB_FK_TBL_DSPLY_COL_NM = (IDX_ATRB_FK_TBL_DSPLY_COL_NM < 0 || rdr.IsDBNull(IDX_ATRB_FK_TBL_DSPLY_COL_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_ATRB_FK_TBL_DSPLY_COL_NM),
                    ATRB_FK_TBL_NM = (IDX_ATRB_FK_TBL_NM < 0 || rdr.IsDBNull(IDX_ATRB_FK_TBL_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_ATRB_FK_TBL_NM),
                    ATRB_FK_TBL_PK_COL_NM = (IDX_ATRB_FK_TBL_PK_COL_NM < 0 || rdr.IsDBNull(IDX_ATRB_FK_TBL_PK_COL_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_ATRB_FK_TBL_PK_COL_NM),
                    ATRB_FK_TBL_SCH = (IDX_ATRB_FK_TBL_SCH < 0 || rdr.IsDBNull(IDX_ATRB_FK_TBL_SCH)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_ATRB_FK_TBL_SCH),
                    ATRB_LBL = (IDX_ATRB_LBL < 0 || rdr.IsDBNull(IDX_ATRB_LBL)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_ATRB_LBL),
                    ATRB_MAX_LEN = (IDX_ATRB_MAX_LEN < 0 || rdr.IsDBNull(IDX_ATRB_MAX_LEN)) ? default(Nullable<System.Int32>) : rdr.GetFieldValue<Nullable<System.Int32>>(IDX_ATRB_MAX_LEN),
                    ATRB_SID = (IDX_ATRB_SID < 0 || rdr.IsDBNull(IDX_ATRB_SID)) ? default(Nullable<System.Int32>) : rdr.GetFieldValue<Nullable<System.Int32>>(IDX_ATRB_SID),
                    ATRB_SRT_ORD = (IDX_ATRB_SRT_ORD < 0 || rdr.IsDBNull(IDX_ATRB_SRT_ORD)) ? default(Nullable<System.Int32>) : rdr.GetFieldValue<Nullable<System.Int32>>(IDX_ATRB_SRT_ORD),
                    ATRB_TGT_COL = (IDX_ATRB_TGT_COL < 0 || rdr.IsDBNull(IDX_ATRB_TGT_COL)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_ATRB_TGT_COL),
                    ATRB_TGT_TBL_NM = (IDX_ATRB_TGT_TBL_NM < 0 || rdr.IsDBNull(IDX_ATRB_TGT_TBL_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_ATRB_TGT_TBL_NM),
                    ATRB_TGT_TBL_SCH = (IDX_ATRB_TGT_TBL_SCH < 0 || rdr.IsDBNull(IDX_ATRB_TGT_TBL_SCH)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_ATRB_TGT_TBL_SCH),
                    ATRB_UNIQ_IND = (IDX_ATRB_UNIQ_IND < 0 || rdr.IsDBNull(IDX_ATRB_UNIQ_IND)) ? default(Nullable<System.Boolean>) : rdr.GetFieldValue<Nullable<System.Boolean>>(IDX_ATRB_UNIQ_IND),
                    ATRB_UNIQ_LEVELS = (IDX_ATRB_UNIQ_LEVELS < 0 || rdr.IsDBNull(IDX_ATRB_UNIQ_LEVELS)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_ATRB_UNIQ_LEVELS),
                    CHG_DTM = (IDX_CHG_DTM < 0 || rdr.IsDBNull(IDX_CHG_DTM)) ? default(Nullable<System.DateTime>) : rdr.GetFieldValue<Nullable<System.DateTime>>(IDX_CHG_DTM),
                    CHG_EMP_WWID = (IDX_CHG_EMP_WWID < 0 || rdr.IsDBNull(IDX_CHG_EMP_WWID)) ? default(Nullable<System.Int32>) : rdr.GetFieldValue<Nullable<System.Int32>>(IDX_CHG_EMP_WWID),
                    CRE_DTM = (IDX_CRE_DTM < 0 || rdr.IsDBNull(IDX_CRE_DTM)) ? default(Nullable<System.DateTime>) : rdr.GetFieldValue<Nullable<System.DateTime>>(IDX_CRE_DTM),
                    CRE_EMP_WWID = (IDX_CRE_EMP_WWID < 0 || rdr.IsDBNull(IDX_CRE_EMP_WWID)) ? default(Nullable<System.Int32>) : rdr.GetFieldValue<Nullable<System.Int32>>(IDX_CRE_EMP_WWID),
                    DATA_TYPE_ACTV_IND = (IDX_DATA_TYPE_ACTV_IND < 0 || rdr.IsDBNull(IDX_DATA_TYPE_ACTV_IND)) ? default(Nullable<System.Boolean>) : rdr.GetFieldValue<Nullable<System.Boolean>>(IDX_DATA_TYPE_ACTV_IND),
                    DATA_TYPE_CD = (IDX_DATA_TYPE_CD < 0 || rdr.IsDBNull(IDX_DATA_TYPE_CD)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_DATA_TYPE_CD),
                    DATA_TYPE_DESC = (IDX_DATA_TYPE_DESC < 0 || rdr.IsDBNull(IDX_DATA_TYPE_DESC)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_DATA_TYPE_DESC),
                    DATA_TYPE_SID = (IDX_DATA_TYPE_SID < 0 || rdr.IsDBNull(IDX_DATA_TYPE_SID)) ? default(Nullable<System.Int32>) : rdr.GetFieldValue<Nullable<System.Int32>>(IDX_DATA_TYPE_SID),
                    DIM_ACTV_IND = (IDX_DIM_ACTV_IND < 0 || rdr.IsDBNull(IDX_DIM_ACTV_IND)) ? default(Nullable<System.Boolean>) : rdr.GetFieldValue<Nullable<System.Boolean>>(IDX_DIM_ACTV_IND),
                    DIM_ATRB_COL_NM = (IDX_DIM_ATRB_COL_NM < 0 || rdr.IsDBNull(IDX_DIM_ATRB_COL_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_DIM_ATRB_COL_NM),
                    DIM_CD = (IDX_DIM_CD < 0 || rdr.IsDBNull(IDX_DIM_CD)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_DIM_CD),
                    DIM_DATA_COL_NM = (IDX_DIM_DATA_COL_NM < 0 || rdr.IsDBNull(IDX_DIM_DATA_COL_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_DIM_DATA_COL_NM),
                    DIM_DFLT_ROOT_ATRB_NM = (IDX_DIM_DFLT_ROOT_ATRB_NM < 0 || rdr.IsDBNull(IDX_DIM_DFLT_ROOT_ATRB_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_DIM_DFLT_ROOT_ATRB_NM),
                    DIM_INTRFC_TBL_NM = (IDX_DIM_INTRFC_TBL_NM < 0 || rdr.IsDBNull(IDX_DIM_INTRFC_TBL_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_DIM_INTRFC_TBL_NM),
                    DIM_INTRFC_TBL_SCH = (IDX_DIM_INTRFC_TBL_SCH < 0 || rdr.IsDBNull(IDX_DIM_INTRFC_TBL_SCH)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_DIM_INTRFC_TBL_SCH),
                    DIM_MAT_VW_NM = (IDX_DIM_MAT_VW_NM < 0 || rdr.IsDBNull(IDX_DIM_MAT_VW_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_DIM_MAT_VW_NM),
                    DIM_MAT_VW_SCH = (IDX_DIM_MAT_VW_SCH < 0 || rdr.IsDBNull(IDX_DIM_MAT_VW_SCH)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_DIM_MAT_VW_SCH),
                    DIM_NM = (IDX_DIM_NM < 0 || rdr.IsDBNull(IDX_DIM_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_DIM_NM),
                    DIM_SID = (IDX_DIM_SID < 0 || rdr.IsDBNull(IDX_DIM_SID)) ? default(Nullable<System.Int16>) : rdr.GetFieldValue<Nullable<System.Int16>>(IDX_DIM_SID),
                    DIM_TBL_NM = (IDX_DIM_TBL_NM < 0 || rdr.IsDBNull(IDX_DIM_TBL_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_DIM_TBL_NM),
                    DIM_TBL_SCH = (IDX_DIM_TBL_SCH < 0 || rdr.IsDBNull(IDX_DIM_TBL_SCH)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_DIM_TBL_SCH),
                    DOT_NET_DATA_TYPE = (IDX_DOT_NET_DATA_TYPE < 0 || rdr.IsDBNull(IDX_DOT_NET_DATA_TYPE)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_DOT_NET_DATA_TYPE),
                    FMT_MSK = (IDX_FMT_MSK < 0 || rdr.IsDBNull(IDX_FMT_MSK)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_FMT_MSK),
                    IS_IDX = (IDX_IS_IDX < 0 || rdr.IsDBNull(IDX_IS_IDX)) ? default(Nullable<System.Boolean>) : rdr.GetFieldValue<Nullable<System.Boolean>>(IDX_IS_IDX),
                    LEGACY_NM = (IDX_LEGACY_NM < 0 || rdr.IsDBNull(IDX_LEGACY_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_LEGACY_NM),
                    LKUP_ROOT_SID = (IDX_LKUP_ROOT_SID < 0 || rdr.IsDBNull(IDX_LKUP_ROOT_SID)) ? default(Nullable<System.Int32>) : rdr.GetFieldValue<Nullable<System.Int32>>(IDX_LKUP_ROOT_SID),
                    PARNT_ATRB_SID = (IDX_PARNT_ATRB_SID < 0 || rdr.IsDBNull(IDX_PARNT_ATRB_SID)) ? default(Nullable<System.Int32>) : rdr.GetFieldValue<Nullable<System.Int32>>(IDX_PARNT_ATRB_SID),
                    PVT_MSK = (IDX_PVT_MSK < 0 || rdr.IsDBNull(IDX_PVT_MSK)) ? default(Nullable<System.Int32>) : rdr.GetFieldValue<Nullable<System.Int32>>(IDX_PVT_MSK),
                    SQL_DATA_TYPE = (IDX_SQL_DATA_TYPE < 0 || rdr.IsDBNull(IDX_SQL_DATA_TYPE)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_SQL_DATA_TYPE),
                    SQL_DATA_TYPE_FQ = (IDX_SQL_DATA_TYPE_FQ < 0 || rdr.IsDBNull(IDX_SQL_DATA_TYPE_FQ)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_SQL_DATA_TYPE_FQ),
                    TGT_COL_TYPE = (IDX_TGT_COL_TYPE < 0 || rdr.IsDBNull(IDX_TGT_COL_TYPE)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_TGT_COL_TYPE),
                    UI_TYPE_CD = (IDX_UI_TYPE_CD < 0 || rdr.IsDBNull(IDX_UI_TYPE_CD)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_UI_TYPE_CD)
                });
            } // while
            return ret;
        }



        #region MasterAttribute


        public List<MasterAttributes> CrudMasterAttribute(string groupCode, int wwId, string mode, params int[] attributeCodeList)
        {
            return new List<MasterAttributes>();
            ////using (var rdr = DataAccess.ExecuteReader(new Procs.CDMS_MYDEALS.admin.PR_MANAGE_ATRB_GRP()
            ////{
            ////    ATRBS = new type_int_list(attributeCodeList),
            ////    GRP_CD = groupCode,
            ////    EMP_WWID = wwId,
            ////    MODE = mode
            ////}))
            ////{
            ////    var ret = new List<MasterAttributes>();
            ////    int IDX_ATRB_CD = DB.GetReaderOrdinal(rdr, "ATRB_CD");
            ////    int IDX_ATRB_CD_DESC = DB.GetReaderOrdinal(rdr, "ATRB_CD_DESC");
            ////    int IDX_ATRB_SID = DB.GetReaderOrdinal(rdr, "ATRB_SID");
            ////    int IDX_GRP_CD = DB.GetReaderOrdinal(rdr, "GRP_CD");

            ////    while (rdr.Read())
            ////    {
            ////        ret.Add(new MasterAttributes
            ////        {
            ////            ATRB_CD = (IDX_ATRB_CD < 0 || rdr.IsDBNull(IDX_ATRB_CD)) ? string.Empty : rdr.GetFieldValue<System.String>(IDX_ATRB_CD),
            ////            ATRB_CD_DESC = (IDX_ATRB_CD_DESC < 0 || rdr.IsDBNull(IDX_ATRB_CD_DESC)) ? string.Empty : rdr.GetFieldValue<System.String>(IDX_ATRB_CD_DESC),
            ////            ATRB_SID = (IDX_ATRB_SID < 0 || rdr.IsDBNull(IDX_ATRB_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_ATRB_SID),
            ////            GRP_CD = (IDX_GRP_CD < 0 || rdr.IsDBNull(IDX_GRP_CD)) ? string.Empty : rdr.GetFieldValue<System.String>(IDX_GRP_CD)
            ////        });
            ////    } // while
            ////    return ret;
            ////}
        }

        #endregion

    }
}
