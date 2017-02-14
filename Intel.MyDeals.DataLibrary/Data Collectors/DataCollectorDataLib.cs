using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using Intel.MyDeals.DataAccessLib;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IDataLibrary;
using Intel.Opaque;
using Intel.Opaque.Data;
using Intel.Opaque.DBAccess;
using Intel.Opaque.Tools;
using Procs = Intel.MyDeals.DataAccessLib.StoredProcedures.MyDeals;

namespace Intel.MyDeals.DataLibrary
{
    public class DataCollectorDataLib : IDataCollectorDataLib
    {

        public MyDealsData GetByIDs(OpDataElementType opDataElementType, IEnumerable<int> ids)
        {
            return GetByIDs(opDataElementType, ids, new List<OpDataElementType> { opDataElementType }, new List<string>());
        }

        public MyDealsData GetByIDs(OpDataElementType opDataElementType, IEnumerable<int> ids, List<OpDataElementType> includeTypes)
        {
            return GetByIDs(opDataElementType, ids, includeTypes, new List<string>());
        }

        public MyDealsData GetByIDs(OpDataElementType opDataElementType, IEnumerable<int> ids, List<OpDataElementType> includeTypes, IEnumerable<string> atrbs)
        {
            // Load Data Cycle: Point 3

            string strInc = "*";
            //string searchGroup = opDataElementType.ToString();

            if (includeTypes != null && includeTypes.Any())
            {
                strInc = string.Join(",", includeTypes.Select(OpDataElementTypeConverter.ToString).Distinct());
            }

            //// TODO change SP to match naming conventions
            //// --'CNTRCT, PRC_ST, PRCNG, WIP_DEAL, DEAL'
            strInc = strInc.Replace(OpDataElementType.Contract.ToString(), "CNTRCT");
            strInc = strInc.Replace(OpDataElementType.PricingStrategy.ToString(), "PRC_ST");
            strInc = strInc.Replace(OpDataElementType.PricingTable.ToString(), "PRCNG");
            strInc = strInc.Replace(OpDataElementType.WipDeals.ToString(), "WIP_DEAL");
            strInc = strInc.Replace(OpDataElementType.Deals.ToString(), "DEAL");

            //searchGroup = searchGroup.Replace(OpDataElementType.Contract.ToString(), "CNTRCT");
            //searchGroup = searchGroup.Replace(OpDataElementType.PricingStrategy.ToString(), "PRC_ST");
            //searchGroup = searchGroup.Replace(OpDataElementType.PricingTable.ToString(), "PRCNG");
            //searchGroup = searchGroup.Replace(OpDataElementType.WipDeals.ToString(), "WIP_DEAL");
            //searchGroup = searchGroup.Replace(OpDataElementType.Deals.ToString(), "DEAL");


            var cmd = new Procs.dbo.PR_GET_OBJS_BY_SIDS() // PR_GET_OBJS_BY_KEYS in original case
            {
                //EMP_WWID = applySecurity ? OpUserStack.MyOpUserToken.Usr.WWID : 0,
                //APPLY_SECURITY = applySecurity,
                OBJ_TYPE = "CNTRCT",
                INCLUDE_GROUPS = strInc,
                //SRCH_GRP = searchGroup,
                OBJ_SIDS = new type_int_list(ids.ToArray())
            };

            //////string[] aAtrbs = atrbs as string[] ?? atrbs.ToArray();
            //////if (atrbs != null && aAtrbs.Any())
            //////{
            //////    cmd.DEAL_SIDS = new type_list(aAtrbs.ToArray());
            //////}
            //////cmd.CONTRACT_SIDS = new type_int_list(ids.ContainsKey(OpDataElementType.Contract.ToString()) ? ids[OpDataElementType.Contract.ToString()].ToArray() : new int[] { });
            //////cmd.STRATEGY_SIDS = new type_int_list(ids.ContainsKey(OpDataElementType.PricingStrategy.ToString()) ? ids[OpDataElementType.PricingStrategy.ToString()].ToArray() : new int[] { });
            //////cmd.PRICETABLE_SIDS = new type_int_list(ids.ContainsKey(OpDataElementType.PricingTable.ToString()) ? ids[OpDataElementType.PricingTable.ToString()].ToArray() : new int[] { });
            //////cmd.WIP_DEAL_SIDS = new type_int_list(ids.ContainsKey(OpDataElementType.WipDeals.ToString()) ? ids[OpDataElementType.WipDeals.ToString()].ToArray() : new int[] { });
            //////cmd.DEAL_SIDS = new type_int_list(ids.ContainsKey(OpDataElementType.Deals.ToString()) ? ids[OpDataElementType.Deals.ToString()].ToArray() : new int[] { });

            MyDealsData odcs;
            using (var rdr = DataAccess.ExecuteReader(cmd))
            {
                
                odcs = new DealDataLib().ReaderToDataCollectors(rdr, true);
            }

            // Add in the negative IDs now
            if (odcs == null) odcs = new MyDealsData(); // We might have to initialize other things in odcs

            foreach (int id in ids.Where(c => c < 0))
            {
                // We have a negative number, so stub in a new contract for that number...
                if (!odcs.ContainsKey(opDataElementType))
                {
                    odcs[opDataElementType] = new OpDataPacket<OpDataElementType>
                    {
                        PacketType = opDataElementType,
                        GroupID = id
                    };
                }
                odcs[opDataElementType].Data[id] = GetDataCollectorFromTemplate(opDataElementType, id, 0);
                // Populate this according to the template

            }

            return odcs;
        }



        public TemplateWrapper GetTemplateData(DateTime lastCacheDate)
        {
            ////return new TemplateWrapper
            ////{
            ////    TemplateDict = ConvertDealTemplateDataGramsToOpDataElementUIs(null)
            ////};
            //lock (LOCK_OBJECT)
            //{
            //    if (_getTemplateData != null) { return _getTemplateData; }
            //}

            if (lastCacheDate < OpaqueConst.SQL_MIN_DATE)
            {
                lastCacheDate = OpaqueConst.SQL_MIN_DATE;
            }

            var ret = new TemplateWrapper();

            using (var rdr = DataAccess.ExecuteReader(new Procs.dbo.PR_GET_NEW_DEAL { CACHE_DATE = lastCacheDate }))
            {
                if (rdr.HasRows) // Will be false if cache condition is met...
                {
                    // Result 1 = Tempates
                    ret.TemplateData = DealTemplateDataGramFromReader(rdr);
                    rdr.NextResult();

                    // Result 2 = Customer Calendars
                    ret.CalendarData = CustomerCalFromReader(rdr);
                    rdr.NextResult();

                    // Result 3 = Deal Types
                    ret.DealTypeData = ObjectTypesFromReader(rdr);
                }
            }

            ret.TemplateDict = ConvertDealTemplateDataGramsToOpDataElementUIs(ret.TemplateData);

            //lock (LOCK_OBJECT)
            //{
            //    _getTemplateData = ret;
            //    return ret;
            //}
            return ret;
        }

        public static List<ObjectTypeTemplate> DealTemplateDataGramFromReader(SqlDataReader rdr)
            {
            // This helper method is template generated.
            // Refer to that template for details to modify this code.

            var ret = new List<ObjectTypeTemplate>();
            int IDX_ATRB_ORDER = DB.GetReaderOrdinal(rdr, "ATRB_ORDER");
            int IDX_ATRB_SCTN_CD = DB.GetReaderOrdinal(rdr, "ATRB_SCTN_CD");
            int IDX_ATRB_SCTN_DESC = DB.GetReaderOrdinal(rdr, "ATRB_SCTN_DESC");
            int IDX_ATRB_SCTN_ORDER = DB.GetReaderOrdinal(rdr, "ATRB_SCTN_ORDER");
            int IDX_ATRB_SID = DB.GetReaderOrdinal(rdr, "ATRB_SID");
            int IDX_ATRB_VAL = DB.GetReaderOrdinal(rdr, "ATRB_VAL");
            int IDX_ATRB_VAL_CHAR = DB.GetReaderOrdinal(rdr, "ATRB_VAL_CHAR");
            int IDX_ATRB_VAL_CHAR_MAX = DB.GetReaderOrdinal(rdr, "ATRB_VAL_CHAR_MAX");
            int IDX_ATRB_VAL_DTM = DB.GetReaderOrdinal(rdr, "ATRB_VAL_DTM");
            int IDX_ATRB_VAL_INT = DB.GetReaderOrdinal(rdr, "ATRB_VAL_INT");
            int IDX_ATRB_VAL_MONEY = DB.GetReaderOrdinal(rdr, "ATRB_VAL_MONEY");
            int IDX_DEAL_ID = DB.GetReaderOrdinal(rdr, "DEAL_ID");
            int IDX_DEAL_NBR = DB.GetReaderOrdinal(rdr, "DEAL_NBR");
            int IDX_OBJ_ATRB_MTX_HASH = DB.GetReaderOrdinal(rdr, "OBJ_ATRB_MTX_HASH");
            int IDX_OBJ_TYPE = DB.GetReaderOrdinal(rdr, "OBJ_TYPE");

            while (rdr.Read())
            {
                ret.Add(new ObjectTypeTemplate
                {
                    ATRB_ORDER = (IDX_ATRB_ORDER < 0 || rdr.IsDBNull(IDX_ATRB_ORDER)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_ATRB_ORDER),
                    ATRB_SCTN_CD = (IDX_ATRB_SCTN_CD < 0 || rdr.IsDBNull(IDX_ATRB_SCTN_CD)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_ATRB_SCTN_CD),
                    ATRB_SCTN_DESC = (IDX_ATRB_SCTN_DESC < 0 || rdr.IsDBNull(IDX_ATRB_SCTN_DESC)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_ATRB_SCTN_DESC),
                    ATRB_SCTN_ORDER = (IDX_ATRB_SCTN_ORDER < 0 || rdr.IsDBNull(IDX_ATRB_SCTN_ORDER)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_ATRB_SCTN_ORDER),
                    ATRB_SID = (IDX_ATRB_SID < 0 || rdr.IsDBNull(IDX_ATRB_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_ATRB_SID),
                    ATRB_VAL = (IDX_ATRB_VAL < 0 || rdr.IsDBNull(IDX_ATRB_VAL)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_ATRB_VAL),
                    ATRB_VAL_CHAR = (IDX_ATRB_VAL_CHAR < 0 || rdr.IsDBNull(IDX_ATRB_VAL_CHAR)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_ATRB_VAL_CHAR),
                    ATRB_VAL_CHAR_MAX = (IDX_ATRB_VAL_CHAR_MAX < 0 || rdr.IsDBNull(IDX_ATRB_VAL_CHAR_MAX)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_ATRB_VAL_CHAR_MAX),
                    ATRB_VAL_DTM = (IDX_ATRB_VAL_DTM < 0 || rdr.IsDBNull(IDX_ATRB_VAL_DTM)) ? default(System.DateTime) : rdr.GetFieldValue<System.DateTime>(IDX_ATRB_VAL_DTM),
                    ATRB_VAL_INT = (IDX_ATRB_VAL_INT < 0 || rdr.IsDBNull(IDX_ATRB_VAL_INT)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_ATRB_VAL_INT),
                    ATRB_VAL_MONEY = (IDX_ATRB_VAL_MONEY < 0 || rdr.IsDBNull(IDX_ATRB_VAL_MONEY)) ? default(System.Decimal) : rdr.GetFieldValue<System.Decimal>(IDX_ATRB_VAL_MONEY),
                    DEAL_ID = (IDX_DEAL_ID < 0 || rdr.IsDBNull(IDX_DEAL_ID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_DEAL_ID),
                    DEAL_NBR = (IDX_DEAL_NBR < 0 || rdr.IsDBNull(IDX_DEAL_NBR)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_DEAL_NBR),
                    OBJ_ATRB_MTX_HASH = (IDX_OBJ_ATRB_MTX_HASH < 0 || rdr.IsDBNull(IDX_OBJ_ATRB_MTX_HASH)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_OBJ_ATRB_MTX_HASH),
                    OBJ_TYPE = (IDX_OBJ_TYPE < 0 || rdr.IsDBNull(IDX_OBJ_TYPE)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_OBJ_TYPE)
                });
            } // while
            return ret;
        }

        private static List<ObjectTypes> ObjectTypesFromReader(SqlDataReader rdr)
        {
            // This helper method is template generated.
            // Refer to that template for details to modify this code.

            var ret = new List<ObjectTypes>();
            int IDX_OBJ_DESC = DB.GetReaderOrdinal(rdr, "OBJ_DESC");
            int IDX_OBJ_TYPE = DB.GetReaderOrdinal(rdr, "OBJ_TYPE");
            int IDX_OBJ_TYPE_SID = DB.GetReaderOrdinal(rdr, "OBJ_TYPE_SID");
            int IDX_OBJ_TYPE_SID1 = DB.GetReaderOrdinal(rdr, "OBJ_TYPE_SID1");
            int IDX_OBJ_TYPE_SID2 = DB.GetReaderOrdinal(rdr, "OBJ_TYPE_SID2");
            int IDX_PERFORM_CTST = DB.GetReaderOrdinal(rdr, "PERFORM_CTST");
            int IDX_TRKR_NBR_DT_LTR = DB.GetReaderOrdinal(rdr, "TRKR_NBR_DT_LTR");

            while (rdr.Read())
            {
                ret.Add(new ObjectTypes
                {
                    OBJ_DESC = (IDX_OBJ_DESC < 0 || rdr.IsDBNull(IDX_OBJ_DESC)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_OBJ_DESC),
                    OBJ_TYPE = (IDX_OBJ_TYPE < 0 || rdr.IsDBNull(IDX_OBJ_TYPE)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_OBJ_TYPE),
                    OBJ_TYPE_SID = (IDX_OBJ_TYPE_SID < 0 || rdr.IsDBNull(IDX_OBJ_TYPE_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_OBJ_TYPE_SID),
                    OBJ_TYPE_SID1 = (IDX_OBJ_TYPE_SID1 < 0 || rdr.IsDBNull(IDX_OBJ_TYPE_SID1)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_OBJ_TYPE_SID1),
                    OBJ_TYPE_SID2 = (IDX_OBJ_TYPE_SID2 < 0 || rdr.IsDBNull(IDX_OBJ_TYPE_SID2)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_OBJ_TYPE_SID2),
                    PERFORM_CTST = (IDX_PERFORM_CTST < 0 || rdr.IsDBNull(IDX_PERFORM_CTST)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_PERFORM_CTST),
                    TRKR_NBR_DT_LTR = (IDX_TRKR_NBR_DT_LTR < 0 || rdr.IsDBNull(IDX_TRKR_NBR_DT_LTR)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_TRKR_NBR_DT_LTR)
                });
            } // while
            return ret;
        }

        private static List<CustomerCal> CustomerCalFromReader(SqlDataReader rdr)
        {
            // This helper method is template generated.
            // Refer to that template for details to modify this code.

            var ret = new List<CustomerCal>();
            int IDX_CUST_MBR_SID = DB.GetReaderOrdinal(rdr, "CUST_MBR_SID");
            int IDX_CUST_NM = DB.GetReaderOrdinal(rdr, "CUST_NM");
            int IDX_END_DT = DB.GetReaderOrdinal(rdr, "END_DT");
            int IDX_PREV_END_DT = DB.GetReaderOrdinal(rdr, "PREV_END_DT");
            int IDX_PREV_QTR_NBR = DB.GetReaderOrdinal(rdr, "PREV_QTR_NBR");
            int IDX_PREV_START_DT = DB.GetReaderOrdinal(rdr, "PREV_START_DT");
            int IDX_PREV_YR_NBR = DB.GetReaderOrdinal(rdr, "PREV_YR_NBR");
            int IDX_QTR_NBR = DB.GetReaderOrdinal(rdr, "QTR_NBR");
            int IDX_START_DT = DB.GetReaderOrdinal(rdr, "START_DT");
            int IDX_YR_NBR = DB.GetReaderOrdinal(rdr, "YR_NBR");

            while (rdr.Read())
            {
                ret.Add(new CustomerCal
                {
                    CUST_MBR_SID = (IDX_CUST_MBR_SID < 0 || rdr.IsDBNull(IDX_CUST_MBR_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_CUST_MBR_SID),
                    CUST_NM = (IDX_CUST_NM < 0 || rdr.IsDBNull(IDX_CUST_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_CUST_NM),
                    END_DT = (IDX_END_DT < 0 || rdr.IsDBNull(IDX_END_DT)) ? default(System.DateTime) : rdr.GetFieldValue<System.DateTime>(IDX_END_DT),
                    PREV_END_DT = (IDX_PREV_END_DT < 0 || rdr.IsDBNull(IDX_PREV_END_DT)) ? default(System.DateTime) : rdr.GetFieldValue<System.DateTime>(IDX_PREV_END_DT),
                    PREV_QTR_NBR = (IDX_PREV_QTR_NBR < 0 || rdr.IsDBNull(IDX_PREV_QTR_NBR)) ? default(System.Int16) : rdr.GetFieldValue<System.Int16>(IDX_PREV_QTR_NBR),
                    PREV_START_DT = (IDX_PREV_START_DT < 0 || rdr.IsDBNull(IDX_PREV_START_DT)) ? default(System.DateTime) : rdr.GetFieldValue<System.DateTime>(IDX_PREV_START_DT),
                    PREV_YR_NBR = (IDX_PREV_YR_NBR < 0 || rdr.IsDBNull(IDX_PREV_YR_NBR)) ? default(System.Int16) : rdr.GetFieldValue<System.Int16>(IDX_PREV_YR_NBR),
                    QTR_NBR = (IDX_QTR_NBR < 0 || rdr.IsDBNull(IDX_QTR_NBR)) ? default(System.Int16) : rdr.GetFieldValue<System.Int16>(IDX_QTR_NBR),
                    START_DT = (IDX_START_DT < 0 || rdr.IsDBNull(IDX_START_DT)) ? default(System.DateTime) : rdr.GetFieldValue<System.DateTime>(IDX_START_DT),
                    YR_NBR = (IDX_YR_NBR < 0 || rdr.IsDBNull(IDX_YR_NBR)) ? default(System.Int16) : rdr.GetFieldValue<System.Int16>(IDX_YR_NBR)
                });
            } // while
            return ret;
        }


        private static TemplateWrapper _getTemplateData;

        public static OpDataCollector GetDataCollectorFromTemplate(OpDataElementType opDataElementType, int id, int parentId)
        {
            return GetOpDataElementUITemplate(opDataElementType).CopyToOpDataCollector(id, parentId);
        }

        public static OpDataElementUITemplate GetOpDataElementUITemplate(OpDataElementType opDataElementType)
        {
            OpDataElementUITemplates ourTemplates = DataCollections.GetOpDataElementUITemplates();
            string key = opDataElementType.ToString();

            // TODO need to be consistent on naming these !!!
            if (opDataElementType == OpDataElementType.PricingTable) key = "PRICING TABLE";
            if (opDataElementType == OpDataElementType.PricingStrategy) key = "PRICING STRAT";

            return ourTemplates.ContainsKey(key.ToUpper())
                ? ourTemplates[key.ToUpper()]
                : new OpDataElementUITemplate();
        }

        private OpDataElementUITemplates ConvertDealTemplateDataGramsToOpDataElementUIs(List<ObjectTypeTemplate> templateData)
        {
            // Bring in existing items for ConvertDealTemplateDataGramsToOpDataElementUIs

            Dictionary<string, List<OpDataElementUI>> ret = new Dictionary<string, List<OpDataElementUI>>();

            AttributeCollection atrbMstr = DataCollections.GetAttributeData();

            foreach (var dd in templateData)
            {
                MyDealsAttribute atrb = null;
                if (!atrbMstr.TryGetValue(dd.ATRB_SID != null ? dd.ATRB_SID : -1, out atrb))
                {
#if DEBUG
                    System.Diagnostics.Debug.WriteLine(string.Format("DcsDealLibClient.GetTemplates: Error resolving Attribute ID: {0}", dd.ATRB_SID));
#endif
                    continue;
                }

                List<OpDataElementUI> coll;
                if (!ret.TryGetValue(dd.OBJ_TYPE, out coll))
                {
                    ret[dd.OBJ_TYPE] = coll = new List<OpDataElementUI>();
                }

                // TODO - THIS IS MUFFED UP RIGHT NOW DUE TO NON-NULLABLE READS
                // Get the value from the database...
                //var value = OpUtilities.Coalesce
                //    (
                //        dd.ATRB_VAL_INT,
                //        dd.ATRB_VAL_CHAR,
                //        dd.ATRB_VAL_MONEY,
                //        dd.ATRB_VAL_DTM,
                //        dd.ATRB_VAL_CHAR_MAX // if they go to one column, must go to dd.ATRB_VAL here
                //    );
                var value = dd.ATRB_VAL;

                //if (value != null)
                //{
                    // A Bit hackish, but this was the only way I could think to do this.
                    // conver to switch as needed if we add more types.
                    //if (atrb.DOT_NET_DATA_TYPE == "System.Boolean")
                    //{
                    //    value = OpTypeConverter.StringToNullableBool(value.ToString()) ?? false;
                    //}
                //}

                // TODO: Fully resolve dim Key.
                // TODO: Complete the section since we are just hard coding attribute items in some cases

                // Create the data element from the db values...
                var ode = new OpDataElementUI(false)
                {
                    AtrbID = atrb.ATRB_SID,
                    AtrbValue = value,
                    DcID = dd.DEAL_ID != null ? dd.DEAL_ID : 0,
                    DimKey = dd.OBJ_ATRB_MTX_HASH,
                    OrigAtrbValue = value,
                    PrevAtrbValue = value,
                    DefaultValue = string.Format("{0}", value),
                    DataType = atrb.DOT_NET_DATA_TYPE,
                    AtrbCd = atrb.ATRB_COL_NM,
                    Description = atrb.ATRB_DESC,
                    Label = atrb.ATRB_LBL,
                    Order = dd.ATRB_ORDER != null ? dd.ATRB_ORDER : 0,
                    SectionCD = "", //dd.ATRB_SCTN_CD,
                    SectionDesc = "", //dd.ATRB_SCTN_DESC,
                    SectionOrder = dd.ATRB_SCTN_ORDER != null ? dd.ATRB_SCTN_ORDER : 0,
                    State = OpDataElementState.Unchanged,
                    UITypeCD = atrb.UI_TYPE_CD,
                    Source = OpSourceLocation.Template  //,
                    //StringFormatMask = atrb.FMT_MSK
                };

                // Try to fully resolve the dim key
                if (ode.DimKey != null && ode.DimKey.Count > 0)
                {
                    foreach (var di in ode.DimKey)
                    {
                        // See if we have master data for it...
                        var mstrItem = atrbMstr.LookupGet(di.AtrbID, di.AtrbItemId);
                        if (mstrItem == null)
                        {
                            // If not, just try to get the ATRB_CD
                            MyDealsAttribute odkAtrb;
                            if (atrbMstr.TryGetValue(di.AtrbID, out odkAtrb))
                            {
                                di.AtrbCd = odkAtrb.ATRB_COL_NM;
                            }
                            continue;
                        }

                        // Else set values
                        di.AtrbCd = mstrItem.AtrbCd;
                        di.AtrbItemValue = mstrItem.AtrbItemValue;
                    }
                }

                coll.Add(ode);
            }

            // Transform what we loaded from templates into Philip-consumable format.
            OpDataElementUITemplates retSet = new OpDataElementUITemplates();
            foreach (KeyValuePair<string, List<OpDataElementUI>> keyValuePair in ret)
            {
                string key = OpDataElementTypeConverter.FromString(keyValuePair.Key).ToString();
                if (!retSet.ContainsKey(key)) // This shuld just be keyValuePair.Key
                {
                    retSet[key] = new OpDataElementUITemplate();
                }
                foreach (OpDataElementUI dataElementUi in keyValuePair.Value)
                {
                    OpDataElementUI blah = new OpDataElementUI
                    {
                        AtrbID = dataElementUi.AtrbID,
                        AtrbCd = dataElementUi.AtrbCd,
                        AtrbValue = dataElementUi.AtrbValue,
                        DataType = dataElementUi.DataType,
                        Description = dataElementUi.Description,
                        DimID = dataElementUi.DimID,
                        DimKey = dataElementUi.DimKey,
                        SectionCD = dataElementUi.SectionCD,
                        SectionDesc = dataElementUi.SectionDesc,
                        SectionOrder = dataElementUi.SectionOrder,
                        Label = dataElementUi.Label,
                        DcID = 0,
                        DcSID = 0,
                        DcParentSID = 0
                    };

                    retSet[key].Add(blah);
                }
            }

            // TODO - Place some hard coded items for now just so that Phil doesn't break much more then he has to...
            retSet[OpDataElementType.Contract.ToString()].Add(new OpDataElementUI
            {
                AtrbID = 11,
                AtrbCd = "dc_id",
                AtrbValue = "",
                DcID = 0,
                DcParentSID = 0,
                DcSID = 0
            });

            retSet[OpDataElementType.Contract.ToString()].Add(new OpDataElementUI
            {
                AtrbID = 12,
                AtrbCd = "dc_parent_id",
                AtrbValue = "",
                DcID = 0,
                DcParentSID = 0,
                DcSID = 0
            });

            retSet[OpDataElementType.Contract.ToString()].Add(new OpDataElementUI
            {
                AtrbID = 143,
                AtrbCd = "DEAL_STG_CD",
                AtrbValue = "",
                DcID = 0,
                DcParentSID = 0,
                DcSID = 0
            });

            // TODO - Place some hard coded items for now just so that Phil doesn't break much more then he has to...
            retSet[OpDataElementType.PricingStrategy.ToString()].Add(new OpDataElementUI
            {
                AtrbID = 11,
                AtrbCd = "dc_id",
                AtrbValue = "",
                DcID = 0,
                DcParentSID = 0,
                DcSID = 0
            });

            retSet[OpDataElementType.PricingStrategy.ToString()].Add(new OpDataElementUI
            {
                AtrbID = 12,
                AtrbCd = "dc_parent_id",
                AtrbValue = "",
                DcID = 0,
                DcParentSID = 0,
                DcSID = 0
            });

            retSet[OpDataElementType.PricingStrategy.ToString()].Add(new OpDataElementUI
            {
                AtrbID = 3319,
                AtrbCd = "START_DT",
                AtrbValue = "",
                DcID = 0,
                DcParentSID = 0,
                DcSID = 0
            });

            retSet[OpDataElementType.PricingStrategy.ToString()].Add(new OpDataElementUI
            {
                AtrbID = 3320,
                AtrbCd = "END_DT",
                AtrbValue = "",
                DcID = 0,
                DcParentSID = 0,
                DcSID = 0
            });

            retSet[OpDataElementType.PricingTable.ToString()].Add(new OpDataElementUI
            {
                AtrbID = 11,
                AtrbCd = "dc_id",
                AtrbValue = "",
                DcID = 0,
                DcParentSID = 0,
                DcSID = 0
            });

            retSet[OpDataElementType.PricingTable.ToString()].Add(new OpDataElementUI
            {
                AtrbID = 12,
                AtrbCd = "dc_parent_id",
                AtrbValue = "",
                DcID = 0,
                DcParentSID = 0,
                DcSID = 0
            });

            return retSet;
        }
    }

}