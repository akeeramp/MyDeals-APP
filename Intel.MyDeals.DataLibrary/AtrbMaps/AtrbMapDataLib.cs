using System.Collections.Generic;
using System.Linq;
using Intel.MyDeals.DataAccessLib;
using Intel.MyDeals.Entities;
using Intel.Opaque;
using Intel.Opaque.Data;
using Intel.Opaque.DBAccess;
using Procs = Intel.MyDeals.DataAccessLib.StoredProcedures.MyDeals;


namespace Intel.MyDeals.DataLibrary
{
    public class AtrbMapDataLib
    {

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

    }
}