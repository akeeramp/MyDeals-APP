using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using Intel.MyDeals.DataAccessLib;
using Intel.MyDeals.Entities;
using Intel.Opaque;
using Intel.Opaque.Data;
using Intel.Opaque.DBAccess;
using Intel.Opaque.Tools;
using Procs = Intel.MyDeals.DataAccessLib.StoredProcedures.MyDeals;

namespace Intel.MyDeals.DataLibrary
{
    public partial class OpDataCollectorDataLib
    {

        /// <summary>
        /// Pull down the initial object templates for all system objects.  Also pulls down customers and calendar information and object level data.
        /// </summary>
        /// <returns></returns>
        public TemplateWrapper GetTemplateData()
        {

            var ret = new TemplateWrapper();

            using (var rdr = DataAccess.ExecuteReader(new Procs.dbo.PR_MYDL_GET_OBJ_TEMPLT()))
            {
                if (rdr.HasRows) // Will be false if cache condition is met...
                {
                    ret.TemplateData = DealTemplateDataGramFromReader(rdr);
                }
            }

            ret.TemplateDict = ConvertDealTemplateDataGramsToOpDataElements(ret.TemplateData);

            return ret;
        }


        /// <summary>
        /// Read the tempalte datagram into template objects.
        /// </summary>
        /// <param name="rdr"></param>
        /// <returns></returns>
        public static List<ObjectTypeTemplate> DealTemplateDataGramFromReader(SqlDataReader rdr)
            {
            // This helper method is template generated.
            // Refer to that template for details to modify this code.

            var ret = new List<ObjectTypeTemplate>();
            int IDX_ATRB_COL_NM = DB.GetReaderOrdinal(rdr, "ATRB_COL_NM");
            int IDX_ATRB_SID = DB.GetReaderOrdinal(rdr, "ATRB_SID");
            int IDX_ATRB_VAL = DB.GetReaderOrdinal(rdr, "ATRB_VAL");
            int IDX_ATRB_MTX_HASH = DB.GetReaderOrdinal(rdr, "ATRB_MTX_HASH");
            int IDX_OBJ_SET_TYPE = DB.GetReaderOrdinal(rdr, "OBJ_SET_TYPE");
            int IDX_OBJ_SET_TYPE_SID = DB.GetReaderOrdinal(rdr, "OBJ_SET_TYPE_SID");
            int IDX_OBJ_TYPE = DB.GetReaderOrdinal(rdr, "OBJ_TYPE");
            int IDX_OBJ_TYPE_SID = DB.GetReaderOrdinal(rdr, "OBJ_TYPE_SID");

            while (rdr.Read())
            {
                ret.Add(new ObjectTypeTemplate
                {
                    ATRB_COL_NM = (IDX_ATRB_COL_NM < 0 || rdr.IsDBNull(IDX_ATRB_COL_NM)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_ATRB_COL_NM),
                    ATRB_SID = (IDX_ATRB_SID < 0 || rdr.IsDBNull(IDX_ATRB_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_ATRB_SID),
                    ATRB_VAL = (IDX_ATRB_VAL < 0 || rdr.IsDBNull(IDX_ATRB_VAL)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_ATRB_VAL),
                    ATRB_MTX_HASH = (IDX_ATRB_MTX_HASH < 0 || rdr.IsDBNull(IDX_ATRB_MTX_HASH)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_ATRB_MTX_HASH),
                    OBJ_SET_TYPE = (IDX_OBJ_SET_TYPE < 0 || rdr.IsDBNull(IDX_OBJ_SET_TYPE)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_OBJ_SET_TYPE),
                    OBJ_SET_TYPE_SID = (IDX_OBJ_SET_TYPE_SID < 0 || rdr.IsDBNull(IDX_OBJ_SET_TYPE_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_OBJ_SET_TYPE_SID),
                    OBJ_TYPE = (IDX_OBJ_TYPE < 0 || rdr.IsDBNull(IDX_OBJ_TYPE)) ? String.Empty : rdr.GetFieldValue<System.String>(IDX_OBJ_TYPE),
                    OBJ_TYPE_SID = (IDX_OBJ_TYPE_SID < 0 || rdr.IsDBNull(IDX_OBJ_TYPE_SID)) ? default(System.Int32) : rdr.GetFieldValue<System.Int32>(IDX_OBJ_TYPE_SID)
                });
            } // while

            return ret;
        }


        private string GetKey(ObjectTypeTemplate template)
        {
            return template.OBJ_TYPE + ":" + template.OBJ_SET_TYPE;
        }

        private OpDataElementAtrbTemplates ConvertDealTemplateDataGramsToOpDataElements(List<ObjectTypeTemplate> templateData)
        {
            // Read the object type templates table and store into OpDataElementUITemplates data type -- table 1 from templates data
            // Bring in existing items for ConvertDealTemplateDataGramsToOpDataElementUIs

            Dictionary<string, OpDataElementAtrbTemplates> ret = new Dictionary<string, OpDataElementAtrbTemplates>();

            AttributeCollection atrbMstr = DataCollections.GetAttributeData();

            foreach (var dd in templateData)
            {
                MyDealsAttribute atrb = null;
                if (!atrbMstr.TryGetValue(dd.ATRB_SID, out atrb))
                {
#if DEBUG
                    System.Diagnostics.Debug.WriteLine(
                        $"DcsDealLibClient.GetTemplates: Error resolving Attribute ID: {dd.ATRB_SID}");
#endif
                    continue;
                }

                string strOt = dd.OBJ_TYPE == "ALL_TYPES" ? "ALL" : OpDataElementTypeConverter.FromString(dd.OBJ_TYPE).ToString();
                string strOst = dd.OBJ_SET_TYPE == "ALL_TYPES" ? "ALL" : OpDataElementSetTypeConverter.FromString(dd.OBJ_SET_TYPE).ToString();

                if (!ret.ContainsKey(strOt)) ret[strOt] = new OpDataElementAtrbTemplates();
                if (!ret[strOt].ContainsKey(strOst)) ret[strOt][strOst] = new OpDataElementAtrbTemplate();

                var value = dd.ATRB_VAL;

                // Create the data element from the db values...
                var ode = new OpDataElement(false)
                {
                    AtrbID = dd.ATRB_SID,
                    AtrbValue = $"{value}",
                    DcID = 0,
                    DcType = dd.OBJ_TYPE_SID,
                    DcParentID = 0,
                    DimKey = dd.ATRB_MTX_HASH,
                    OrigAtrbValue = value,
                    PrevAtrbValue = value,
                    DataType = atrb.DOT_NET_DATA_TYPE,
                    AtrbCd = atrb.ATRB_COL_NM,
                    State = OpDataElementState.Unchanged,
                    Source = OpSourceLocation.Template
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

                ret[strOt][strOst].Add(ode);
            }



            // Transform what we loaded from templates into Philip-consumable format.
            OpDataElementAtrbTemplates retSet = new OpDataElementAtrbTemplates();

            foreach (KeyValuePair<OpDataElementType, List<OpDataElementSetType>> kvp in OpDataElementSetTypeRepository.OpDestCollection.Heirarchy)
            {
                OpDataElementType opDataElementType = kvp.Key;
                foreach (OpDataElementSetType opDataElementSetType in kvp.Value)
                {
                    List<OpDataElement> elements = GetElementList(ret, opDataElementType, opDataElementSetType);
                    string key = $"{opDataElementType}:{opDataElementSetType}";
                    if (!retSet.ContainsKey(key)) retSet[key] = new OpDataElementAtrbTemplate();

                    foreach (OpDataElement dataElement in elements)
                    {
                        retSet[key].Add(new OpDataElementUI
                        {
                            AtrbID = dataElement.AtrbID,
                            AtrbCd = dataElement.AtrbCd,
                            AtrbValue = dataElement.AtrbCd == AttributeCodes.OBJ_SET_TYPE_CD ? opDataElementSetType.ToString() : dataElement.AtrbValue,
                            DataType = dataElement.DataType,
                            DimID = dataElement.DimID,
                            DimKey = dataElement.DimKey,
                            DcID = 0,
                            DcType = opDataElementType.ToId(),
                            DcParentType = 0,
                            DcParentID = opDataElementType.GetParent().ToId()
                        });
                    }

                    AddDcBasics(retSet[key], opDataElementType);
                }

            }

            return retSet;
        }

        private OpDataElementAtrbTemplate GetElementList(Dictionary<string, OpDataElementAtrbTemplates> ret, OpDataElementType opDataElementType, OpDataElementSetType opDataElementSetType)
        {
            OpDataElementAtrbTemplate list = new OpDataElementAtrbTemplate();
            string strOpDataElementType = opDataElementType.ToString();
            string strOpDataElementSetType = opDataElementSetType.ToString();

            if (ret.ContainsKey(strOpDataElementType))
            {
                if (ret[strOpDataElementType].ContainsKey(strOpDataElementSetType))
                {
                    list.AddRange(ret[strOpDataElementType][strOpDataElementSetType]);
                }
                if (ret[strOpDataElementType].ContainsKey("ALL")) {
                    list.AddRange(ret[strOpDataElementType]["ALL"]);
                }
            }

            return list;
        }

        private void AddDcBasics(OpDataElementAtrbTemplate retSet, OpDataElementType opDataElementType)
        {
            retSet.Add(new OpDataElementUI
            {
                AtrbID = 1,
                AtrbCd = AttributeCodes.DC_ID,
                AtrbValue = 0,
                DcID = 0,
                DcType = opDataElementType.ToId(),
                DcParentType = opDataElementType.GetParent().ToId(),
                DcParentID = 0,
                State = OpDataElementState.Unchanged
            });

            retSet.Add(new OpDataElementUI
            {
                AtrbID = 2,
                AtrbCd = AttributeCodes.DC_PARENT_ID,
                AtrbValue = 0,
                DcID = 0,
                DcType = opDataElementType.ToId(),
                DcParentType = opDataElementType.GetParent().ToId(),
                DcParentID = 0,
                State = OpDataElementState.Unchanged
            });
        }




        #region Consts and Structs

        private struct TableName
        {
            // These are hard coded table definations used by the bulk data loader to generate an internal code table to transfer into the DB - much faster then row by row entry.
            public const string MYDL_CL_WIP_ATRB_TMP = "[dbo].[MYDL_CL_WIP_ATRB_TMP]"; // New version of [dbo].[STG_WIP_ATRB]
            public const string MYDL_CL_WIP_ACTN = "[dbo].[MYDL_CL_WIP_ACTN]"; // New version of [dbo].[WIP_ACTN]
        }

        #endregion

#if DEBUG
        private OpMsgQueue LogMessages = new OpMsgQueue();
        private DateTime LastLogTime = DateTime.Now;
#endif


        /// <summary>
        /// Convert a data reader to a collection of OpDataPackets.
        /// The input reader must conform to the view signature for [deal].[VW_DEAL_SRCH_*] views
        /// </summary>
        /// <param name="rdr">Data reader with an appropraite set of columns.</param>
        /// <param name="processDataCollectorLevelData">Process all data at the collector level or not.</param>
        /// <returns>Valid deal objects.</returns>
        public MyDealsData ReaderToDataCollectors(SqlDataReader rdr, bool processDataCollectorLevelData)
        {
            // Load Data Cycle: Point 1
            // Save Data Cycle: Point 2
            // Save Data Cycle: Point 19

#if DEBUG
            DateTime start = DateTime.Now;
            int cells = 0;
            int deals = 0;
#endif
            var odps = new MyDealsData();

            #region Resolve Column Indexes
            // Parent Node Data
            int IDX_PARNT_OBJ_TYPE_SID = DB.GetReaderOrdinal(rdr, "PARNT_OBJ_TYPE_SID"); // Read identity key for object ID (PARENT_OBJ_KEY)
            int IDX_PARNT_OBJ_SID = DB.GetReaderOrdinal(rdr, "PARNT_OBJ_SID"); // Read identity key for object ID (PARENT_OBJ_KEY)

            // Current Node Data
            int IDX_OBJ_TYPE = DB.GetReaderOrdinal(rdr, "OBJ_TYPE"); // Was OBJ_SET, this is cntrct or object type
            int IDX_OBJ_TYPE_SID = DB.GetReaderOrdinal(rdr, "OBJ_TYPE_SID"); // Object_type_id or Object_set_id 
            int IDX_OBJ_SID = DB.GetReaderOrdinal(rdr, "OBJ_SID"); // Real identity key for object ID - the true single table identity col

            int IDX_ATRB_SID = DB.GetReaderOrdinal(rdr, "ATRB_SID"); // Attribute SID
            int IDX_ATRB_COL_NM = DB.GetReaderOrdinal(rdr, "ATRB_COL_NM"); // Attribute Code Name
            int IDX_DOT_NET_DATA_TYPE = DB.GetReaderOrdinal(rdr, "DOT_NET_DATA_TYPE"); // Attribute .NET data type

            int IDX_ATRB_MTX_SID = DB.GetReaderOrdinal(rdr, "ATRB_MTX_SID"); // Attribute Matrix SID 
            int IDX_ATRB_MTX_HASH = DB.GetReaderOrdinal(rdr, "ATRB_MTX_HASH"); // Attribute Matrix Hash, ex. "4:6/10:4"

            int IDX_ATRB_VAL = DB.GetReaderOrdinal(rdr, "ATRB_VAL"); // Atrb val combined

            int IDX_ATRB_RVS_NBR = DB.GetReaderOrdinal(rdr, "ATRB_RVS_NBR"); // Revision number

            // Unique to deal save returned results
            int IDX_BTCH_ID = DB.GetReaderOrdinal(rdr, "BTCH_ID");
            #endregion

            if (IDX_OBJ_TYPE_SID < 0 || IDX_OBJ_SID < 0 || IDX_ATRB_SID < 0)
            {
                throw new InvalidOperationException(
                    "DcsDealLib.ReaderToDataCollectors. Expected columns are missing from a deal result set.  This is often the case when an extra recordset is returned out of sequence, like when a debugging result set is returned before the actual expected data is returned.  Run the calling routine manually to confirm the proper data is being returned in the proper order.  If the problem persists, ensure proper columns are available in the expected result set.");
            }

            // So we don't need to "IF" within the BIG loop, just make sure all our packets exist.
            odps.InitAllPacketTypes();

            #region Get All Data Elements

            // Start the read from the database...
            while (rdr.Read())
            {
#if DEBUG
                cells++;
#endif
                // Since we key by this, get it first.
                var objType = OpDataElementTypeConverter.FromString(rdr[IDX_OBJ_TYPE]); // CNTRCT
                int objTypeSid = rdr.GetTypedValue<int>(IDX_OBJ_TYPE_SID, 0); // 1

                int objSid = rdr.GetTypedValue<int>(IDX_OBJ_SID, 0); // Object Key
                int parntObjSid = rdr.GetTypedValue<int>(IDX_PARNT_OBJ_SID, 0); // Parent ID Key
                int parntObjKeyTypeSid = rdr.GetTypedValue<int>(IDX_PARNT_OBJ_TYPE_SID, 0); // Parent ID Key Type SID -- IE Contract (1)
                var parntObjKeyType = parntObjKeyTypeSid.IdToOpDataElementTypeString(); // CNTRCT
                string objMtxHash = rdr[IDX_ATRB_MTX_HASH].ToString(); // Object MTX Hash
                //int objMtxSid = rdr.GetTypedValue<int>(IDX_ATRB_MTX_SID, 0); // Object Key

                OpDataCollector odc;
                if (!odps[objType].Data.TryGetValue(objSid, out odc)) // See if this belongs to an existing DataCollector or if we need to make a new one
                {
#if DEBUG
                    deals++;
#endif

                    if (IDX_BTCH_ID > -1 && !odps.Any())
                    {
                        // First deal of an obj_set, set the packet details.
                        odps[objType].BatchID = rdr.GetTypedValue<Guid>(IDX_BTCH_ID, Guid.Empty);
                    }

                    odps[objType].Data[objSid] = odc = new OpDataCollector
                    {
                        DcID = objSid,
                        DcType = objType.ToString(),
                        DcParentType = parntObjKeyType.ToString(), // parnt_obj_key_type_sid.ToString(),
                        DcParentID = parntObjSid
                    };
                }

                var value = rdr.GetTypedValue<string>(IDX_ATRB_VAL);

                string dndt = rdr.GetTypedValue<string>(IDX_DOT_NET_DATA_TYPE);

                var ode = OpDataElement.Create
                    (
                        rdr.GetTypedValue<int>(IDX_ATRB_SID), // element id - need to be unique???
                        rdr.GetTypedValue<int>(IDX_ATRB_SID),
                        rdr.GetTypedValue<string>(IDX_ATRB_COL_NM),
                        value,
                        objTypeSid, // dc type - contract
                        objSid, // DcId 
                        parntObjSid, // parent id
                        parntObjKeyTypeSid, // Parent Type
                        0, // Dim - rowcount or order kind of thing
                        objMtxHash, // StringDim
                        dndt, // DotNetType
                        false // Raise Events flag
                    );

                odc.DataElements.Add(ode);
            }

            odps.RemoveEmptyPackets();

            #endregion

            #region Set Group ID and Batch ID

            //OpDataPacket<OpDataElementType> grp;
            //if (odps.TryGetValue(OpDataElementType.Group, out grp))
            //{
            //    int grpId = 0;
            //    foreach (var de in grp.AllDataElements.Where(de => de.DcID > 0))
            //    {
            //        grpId = de.DcID;
            //        break;
            //    }

            //    if (grpId > 0)
            //    {
            //        foreach (var op in odps)
            //        {
            //            op.Value.GroupID = grpId;
            //        }
            //    }
            //}

            #endregion

            #region processDataCollectorLevelData

            if (processDataCollectorLevelData && rdr.NextResult())
            {
                IDX_OBJ_SID = -1; // Real identity key for object ID - the true single table identity col
                IDX_PARNT_OBJ_TYPE_SID = -1; // Read identity key for object ID

                IDX_OBJ_SID = DB.GetReaderOrdinal(rdr, "OBJ_SID"); // Real identity key for object ID - the true single table identity col
                IDX_PARNT_OBJ_TYPE_SID = DB.GetReaderOrdinal(rdr, "PARNT_OBJ_TYPE_SID"); // Read identity key for object ID
                //IDX_DEAL_ALT_SID = DB.GetReaderOrdinal(rdr, "OBJ_SID"); // OBJ SID is the user visable ID - referrs to table specific identity col

                // TODO: Use constants here...
                int IDX_DEAL_CRE_EMP_WWID = DB.GetReaderOrdinal(rdr, "CRE_EMP_WWID");
                int IDX_DEAL_CRE_DTM = DB.GetReaderOrdinal(rdr, "CRE_DTM");
                int IDX_DEAL_CHG_EMP_WWID = DB.GetReaderOrdinal(rdr, "CHG_EMP_WWID");
                int IDX_DEAL_CHG_DTM = DB.GetReaderOrdinal(rdr, "CHG_DTM");

                // Ensure all data fields are in the result set...
                if (
                    IDX_OBJ_SID >= 0
                    && IDX_DEAL_CRE_EMP_WWID >= 0
                    && IDX_DEAL_CRE_DTM >= 0
                    && IDX_DEAL_CHG_EMP_WWID >= 0
                    && IDX_DEAL_CHG_DTM >= 0
                    )
                {
                    // Assume multiple values, hence while vs if
                    while (rdr.Read())
                    {
                        // Records are already keyed at PREP_SID, so get that.
                        //int deal_prep_sid = rdr.GetTypedValue<int>(IDX_DEAL_ALT_SID, 0);

                        OpDataCollector dc = null;
                        // See if it exists in Primary...
                        //if (odps.ContainsKey(OpDataElementType.Deals) &&
                        //    odps[OpDataElementType.Deals].Data.TryGetValue(deal_prep_sid, out dc))
                        //{
                        //}
                        if (dc == null)
                        {
                            // If not, check secondary...
                            //if (odps.ContainsKey(OpDataElementType.Secondary) &&
                            //    odps[OpDataElementType.Secondary].Data.TryGetValue(deal_prep_sid, out dc))
                            //{
                            //}

                            // We have no collector to store the data, skip it.
                            if (dc == null)
                            {
                                continue;
                            }
                        }

                        int deal_sid = rdr.GetTypedValue<int>(IDX_OBJ_SID, 0);

                        // Write the 4 elements to the collection
                        int value1 = rdr.GetTypedValue<int>(IDX_DEAL_CRE_EMP_WWID); // REQ_BY
                        // TODO - Bring these back in
                        ////////dc.DataElements.Add(new OpDataElement(false)
                        ////////{
                        ////////    AtrbID = 19,
                        ////////    AtrbCd = AttributeCodes.REQ_BY,
                        ////////    AtrbValue = value1,
                        ////////    DcID = deal_prep_sid,
                        ////////    DcAltID = deal_sid,
                        ////////    OrigAtrbValue = value1,
                        ////////    PrevAtrbValue = value1
                        ////////});

                        ////////int value2 = rdr.GetTypedValue<int>(IDX_DEAL_CHG_EMP_WWID); // LAST_MOD_BY
                        ////////dc.DataElements.Add(new OpDataElement(false)
                        ////////{
                        ////////    AtrbID = 3326,
                        ////////    AtrbCd = AttributeCodes.LAST_MOD_BY,
                        ////////    AtrbValue = value2,
                        ////////    DcID = deal_prep_sid,
                        ////////    DcAltID = deal_sid,
                        ////////    OrigAtrbValue = value2,
                        ////////    PrevAtrbValue = value2
                        ////////});

                        ////////DateTime value3 = rdr.GetTypedValue<DateTime>(IDX_DEAL_CRE_DTM); // REQ_DT
                        ////////dc.DataElements.Add(new OpDataElement(false)
                        ////////{
                        ////////    AtrbID = 3324,
                        ////////    AtrbCd = AttributeCodes.REQ_DT,
                        ////////    AtrbValue = value3,
                        ////////    DcID = deal_prep_sid,
                        ////////    DcAltID = deal_sid,
                        ////////    OrigAtrbValue = value3,
                        ////////    PrevAtrbValue = value3
                        ////////});

                        ////////DateTime value4 = rdr.GetTypedValue<DateTime>(IDX_DEAL_CHG_DTM); // LAST_MOD_DT
                        ////////dc.DataElements.Add(new OpDataElement(false)
                        ////////{
                        ////////    AtrbID = 3342,
                        ////////    AtrbCd = AttributeCodes.LAST_MOD_DT,
                        ////////    AtrbValue = value4,
                        ////////    DcID = deal_prep_sid,
                        ////////    DcAltID = deal_sid,
                        ////////    OrigAtrbValue = value4,
                        ////////    PrevAtrbValue = value4
                        ////////});
                    }

                }
            }

            #endregion

#if DEBUG
            OpLogPerf.Log(
                String.Format("ReaderToDataCollectors Runtime: {0}ms; DataCollectors: {1}; DataElements: {2};",
                    (DateTime.Now - start).TotalMilliseconds,
                    deals,
                    cells
                    ));

#endif

          return odps;
        }

        //////        /// <summary>
        //////        /// Pivot a packet into a DataTable, where each ATRB_CD = [Column Header]
        //////        /// </summary>
        //////        /// <param name="odp">Packet with Data</param>
        //////        /// <returns>DataTable with data and columns, or empty data table if no data passed in.</returns>
        //////        private DataTable OpDataPacketToDataTablePivoted(OpDataPacket<OpDataElementType> odp)
        //////        {
        //////            return (new OpDataElementDataTableConverter(DataCollections.GetAttributeData())).OpDataElementsToDataTablePivoted(
        //////                odp,
        //////                OpDataElementDataTableConverter.GroupingMode.DataCollectorID
        //////                );
        //////        }

        /// <summary>
        /// Get the passed packets in the preferred order
        /// </summary>
        /// <param name="packets"></param>
        /// <returns></returns>
        private List<OpDataPacket<OpDataElementType>> GetPacketsInOrder(IEnumerable<OpDataPacket<OpDataElementType>> packets)
        {
            if (packets == null)
            {
                return new List<OpDataPacket<OpDataElementType>>();
            }

            return packets
                .Where(odp => odp != null)
                .OrderBy(odp => (int)odp.PacketType)
                .ToList();
        }


        ///// <summary>
        ///// A data packet to a data table
        ///// </summary>
        ///// <param name="odp">A valid data packet</param>
        ///// <param name="custSid">Customer ID to pass to DB</param>
        ///// <returns>A valid DataTable or null if input is invalid.</returns>
        //private DataTable OpDataPacketToImportDataTable(OpDataPacket<OpDataElementType> odp, int custSid)
        //{
        //    // Save Data Cycle: Point 17

        //    if (odp?.Data == null) // If no odp or odp has no actions, bail out
        //    {
        //        return null;
        //    }

        //    DataTable dt = new DataTable();

        //    // The table name must match 1:1 to the import table name...
        //    dt.TableName = TableName.STG_WIP_ATRB;

        //    #region Get Ordinal Indexes
        //    int IDX_DEAL_OBJ_TYPE_SID = dt.Columns.Add(Entities.deal.STG_WIP_ATRB.OBJ_TYPE_SID, typeof(int)).Ordinal; // Entities.deal.STG_WIP_ATRB.OBJ_ATRB_SID in old system

        //    int IDX_ATRB_SID = dt.Columns.Add(Entities.deal.STG_WIP_ATRB.ATRB_SID, typeof(int)).Ordinal;
        //    int IDX_ATRB_VAL = dt.Columns.Add(Entities.deal.STG_WIP_ATRB.ATRB_VAL, typeof(object)).Ordinal;

        //    int IDX_DEAL_ATRB_MTX_SID = dt.Columns.Add(Entities.deal.STG_WIP_ATRB.ATRB_MTX_SID, typeof(int)).Ordinal;
        //    int IDX_DEAL_ATRB_MTX_HASH = dt.Columns.Add(Entities.deal.STG_WIP_ATRB.ATRB_MTX_HASH, typeof(string)).Ordinal;

        //    int IDX_OBJ_KEY = dt.Columns.Add(Entities.deal.STG_WIP_ATRB.OBJ_KEY, typeof(int)).Ordinal; // Internal DB ID for this item
        //    int IDX_PARENT_OBJ_KEY = dt.Columns.Add(Entities.deal.STG_WIP_ATRB.PARENT_OBJ_KEY, typeof(int)).Ordinal;
        //    int IDX_DEAL_ALT_SID = dt.Columns.Add(Entities.deal.STG_WIP_ATRB.OBJ_SID, typeof(int)).Ordinal;

        //    int IDX_CUST_MBR_SID = dt.Columns.Add(Entities.deal.STG_WIP_ATRB.CUST_MBR_SID, typeof(int)).Ordinal;
        //    int IDX_MDX_CD = dt.Columns.Add(Entities.deal.STG_WIP_ATRB.MDX_CD, typeof(string)).Ordinal; // M,D,X (Modify (I,U), Delete, No Action (X)), used to be DATA_TEXT vc(100) 
        //    int IDX_BTCH_ID = dt.Columns.Add(Entities.deal.STG_WIP_ATRB.BTCH_ID, typeof(Guid)).Ordinal;
        //    #endregion

        //    if (!odp.Data.Any())
        //    {
        //        return dt;
        //    }

        //    foreach (var dc in odp.Data) // Good ParallelWait opportunity?
        //    {
        //        foreach (var de in dc.Value.DataElements)
        //        {
        //            // Create new data row to set the values on...
        //            var r = dt.NewRow();
        //            int dcId = (de.DcID == 0 ? dc.Key : de.DcID); // This one makes sense because DC Key is DcId
        //            //int dcSid = (de.DcSID == 0 ? 0 : de.DcSID); //(de.DcSID == 0 ? dc.Key : de.DcSID);
        //            int dcParentSid = (de.DcParentID == 0 ? 0 : de.DcParentID); //(de.DcParentSID == 0 ? dc.Key : de.DcParentSID);

        //            r[IDX_BTCH_ID] = odp.BatchID;
        //            r[IDX_DEAL_OBJ_TYPE_SID] = odp.PacketType.ToId(); // Set packet type
        //            r[IDX_CUST_MBR_SID] = custSid; // Set customer

        //            if (dcId != 0)
        //            {
        //                r[IDX_PARENT_OBJ_KEY] = dcParentSid;
        //                r[IDX_DEAL_ALT_SID] = dcId;
        //                //r[IDX_OBJ_KEY] = dcSid;
        //            }

        //            if (de.ElementID != 0)
        //            {
        //                r[IDX_DEAL_OBJ_TYPE_SID] = de.ElementID;
        //            }

        //            r[IDX_ATRB_SID] = de.AtrbID;
        //            if (de.DimID > 0)
        //            {
        //                r[IDX_DEAL_ATRB_MTX_SID] = de.DimID;
        //            }
        //            else if (de.DimKey.Count > 0) // If we have the DIM ID (above, then don't send the hash)
        //            {
        //                r[IDX_DEAL_ATRB_MTX_HASH] = de.DimKey.HashPairs;
        //            }
        //            r[IDX_ATRB_VAL] = de.AtrbValue;
        //            r[IDX_MDX_CD] = OpDataElementStateConverter.ToString(de.State);

        //            // What about de.DcAltID

        //            if (de.ExtraDimKey != null && de.ExtraDimKey.Count > 0)
        //            { // Must see what happend to extra dim items - might drop...  Commented out for now.
        //                // TODO - DealDataLib_Common.cs - Check to see if extra dim goes away
        //                //Guid pg;
        //                //if (de.ExtraDimKey.TryGet<Guid>(AttributeCodes.PLI_GUID, out pg))
        //                //{
        //                //    r[IDX_PLI_GUID] = pg;
        //                //}

        //                //Guid ag;
        //                //if (de.ExtraDimKey.TryGet<Guid>(AttributeCodes.AGRMNT_GUID, out ag))
        //                //{
        //                //    r[IDX_AGRMNT_GUID] = ag;
        //                //}
        //            }

        //            // If executing in parallel, lock around this....
        //            dt.Rows.Add(r);
        //        }
        //    }

        //    return dt;
        //}

        ///// <summary>
        ///// An action packet to a data table
        ///// </summary>
        ///// <param name="odp">Data packet wiht valid actions</param>
        ///// <param name="groupBatchId">Group batch with which these packets are associated.</param>
        ///// <param name="wwid">WWID of user making the changes.</param>
        ///// <returns></returns>
        //private DataTable OpDataPacketToImportActionTable(OpDataPacket<OpDataElementType> odp, Guid groupBatchId, int wwid)
        //{
        //    // Save Data Cycle: Point 18

        //    if (odp?.Actions == null) // If no odp or odp has no actions, bail out
        //    {
        //        return null;
        //    }

        //    DataTable dt = new DataTable();

        //    // The table name must match 1:1 to the import table name...
        //    dt.TableName = TableName.WIP_ACTN; // Work with Rick to make sure this is correct.

        //    #region Get Ordinal Column Indexes
        //    int IDX_DEAL_OBJ_TYPE_SID = dt.Columns.Add(Entities.deal.WIP_ACTN.OBJ_TYPE_SID, typeof(string)).Ordinal; // Used to be Entities.deal.WIP_ACTN.OBJ_SET in old system
        //    int IDX_DEAL_ALT_SID = dt.Columns.Add(Entities.deal.WIP_ACTN.OBJ_SID, typeof(int)).Ordinal;

        //    int IDX_OLD_OBJ_SID = dt.Columns.Add(Entities.deal.WIP_ACTN.OLD_OBJ_SID, typeof(int)).Ordinal;
        //    int IDX_ACTN_CD = dt.Columns.Add(Entities.deal.WIP_ACTN.ACTN_CD, typeof(string)).Ordinal; // Max Len = 50
        //    int IDX_MSG_CD = dt.Columns.Add(Entities.deal.WIP_ACTN.MSG_CD, typeof(string)).Ordinal; // Max Len = 10
        //    int IDX_ACTN_VAL = dt.Columns.Add(Entities.deal.WIP_ACTN.ACTN_VAL, typeof(string)).Ordinal; // Max Len = 8000
        //    int IDX_ACTN_VAL_LIST = dt.Columns.Add(Entities.deal.WIP_ACTN.ACTN_VAL_LIST, typeof(string)).Ordinal; // Max Len = 8000
        //    int IDX_SRT_ORD = dt.Columns.Add(Entities.deal.WIP_ACTN.SRT_ORD, typeof(int)).Ordinal;
        //    ////int IDX_DEAL_GRP_SID = dt.Columns.Add(Entities.deal.WIP_ACTN.DEAL_GRP_SID, typeof(int)).Ordinal;

        //    // Unique to deal save returned results
        //    int IDX_BTCH_ID = dt.Columns.Add(Entities.deal.WIP_ACTN.BTCH_ID, typeof(Guid)).Ordinal;
        //    int IDX_DEAL_GRP_BTCH_ID = dt.Columns.Add(Entities.deal.WIP_ACTN.DEAL_GRP_BTCH_ID, typeof(Guid)).Ordinal;
        //    int IDX_CHG_EMP_WWID = dt.Columns.Add(Entities.deal.WIP_ACTN.CHG_EMP_WWID, typeof(int)).Ordinal;

        //    // Don't know if we'll need these at some point.
        //    //int IDX_OBJ_KEY = dt.Columns.Add(Entities.deal.STG_WIP_ATRB.OBJ_KEY, typeof(int)).Ordinal; // Internal DB ID for this item
        //    //int IDX_PARENT_OBJ_KEY = dt.Columns.Add(Entities.deal.STG_WIP_ATRB.PARENT_OBJ_KEY, typeof(int)).Ordinal;
        //    #endregion

        //    if (odp.Actions.Count == 0)
        //    {
        //        return dt;
        //    }

        //    int chgWwid = wwid;
        //    bool hasGroupBatch = OpTypeConverter.IsValidGuid(groupBatchId);

        //    if (odp.Actions.Any(a => a.Sort == MyDealsDataAction.DEFAULT_SORT))
        //    {
        //        // Any unsorted actions should come BEFORE all the sorted actions (Mike's request)
        //        const int maxSort = -1000000000;

        //        foreach (var kvpAct in MyDealsDataAction.DEFAULT_ACTION_SORT_ORDER)
        //        {
        //            foreach (
        //                var act in
        //                    odp.Actions.Where(a => a.Action == kvpAct.Key && a.Sort == MyDealsDataAction.DEFAULT_SORT))
        //            {
        //                act.Sort = maxSort + kvpAct.Value;

        //                OpLogPerf.Log("WARNING! Unset Action Sort Order! Action: {0}; Value: {1};  Targets: {2}",
        //                    act.Action,
        //                    act.Value,
        //                    (act.TargetDcIDs == null ? "" : string.Join(", ", act.TargetDcIDs))
        //                    );
        //            }
        //        }
        //    }

        //    foreach (var oa in odp.Actions.Where(a => a.ActionDirection != OpActionDirection.Outbound))
        //    // Good ParallelWait opportunity?
        //    {
        //        var r = dt.NewRow();
        //        r[IDX_BTCH_ID] = odp.BatchID;
        //        r[IDX_CHG_EMP_WWID] = chgWwid;

        //        if (oa.DcID != null && oa.DcID != 0)
        //        {
        //            r[IDX_DEAL_ALT_SID] = oa.DcID;
        //            r[IDX_OLD_OBJ_SID] = oa.DcID;
        //        }

        //        r[IDX_DEAL_OBJ_TYPE_SID] = odp.PacketType.ToId(); // Set packet type
        //        r[IDX_ACTN_CD] = oa.Action;
        //        r[IDX_ACTN_VAL] = oa.Value;
        //        r[IDX_SRT_ORD] = oa.Sort;

        //        if (oa.TargetDcIDs != null && oa.TargetDcIDs.Count > 0)
        //        {
        //            r[IDX_ACTN_VAL_LIST] = String.Join(",", oa.TargetDcIDs);
        //        }

        //        if (hasGroupBatch)
        //        {
        //            r[IDX_DEAL_GRP_BTCH_ID] = groupBatchId;
        //        }

        //        //if (odp.GroupID != null && odp.GroupID > 0)
        //        //{
        //        //    r[IDX_DEAL_GRP_BTCH_ID] = odp.GroupID;
        //        //}

        //        if (oa.MessageCode != OpMsg.MessageType.Debug)
        //        // This is the default, and I couldn't see a reason to write it to the DB...
        //        {
        //            r[IDX_MSG_CD] = Enum.GetName(typeof(OpMsg.MessageType), oa.MessageCode);
        //        }

        //        // If executing in parallel, lock around this....
        //        dt.Rows.Add(r);
        //    }
        //    return dt;
        //}


        /// <summary>
        /// A data packet to a data table
        /// </summary>
        /// <param name="odp">A valid data packet</param>
        /// <param name="custSid">Customer ID to pass to DB</param>
        /// <param name="wwid">Employee wwid to pass to DB</param>
        /// <returns>A valid DataTable or null if input is invalid.</returns>
        private DataTable OpDataPacketToImportDataTable(OpDataPacket<OpDataElementType> odp, int custSid, int wwid)
        {
            // Save Data Cycle: Point 17

            if (odp?.Data == null) // If no odp or odp has no actions, bail out
            {
                return null;
            }

            DataTable dt = new DataTable();

            // The table name must match 1:1 to the import table name...
            dt.TableName = TableName.MYDL_CL_WIP_ATRB_TMP;

            #region Get Ordinal Indexes
            int IDX_BTCH_ID = dt.Columns.Add(Entities.deal.MYDL_CL_WIP_ATRB_TMP.BTCH_ID, typeof(Guid)).Ordinal;
            int IDX_CUST_MBR_SID = dt.Columns.Add(Entities.deal.MYDL_CL_WIP_ATRB_TMP.CUST_MBR_SID, typeof(int)).Ordinal;

            int IDX_OBJ_TYPE_SID = dt.Columns.Add(Entities.deal.MYDL_CL_WIP_ATRB_TMP.OBJ_TYPE_SID, typeof(int)).Ordinal; // Table Type ID for this item - Contract
            int IDX_OBJ_SID = dt.Columns.Add(Entities.deal.MYDL_CL_WIP_ATRB_TMP.OBJ_SID, typeof(int)).Ordinal; // DB table ID for this item

            int IDX_PARNT_OBJ_TYPE_SID = dt.Columns.Add(Entities.deal.MYDL_CL_WIP_ATRB_TMP.PARNT_OBJ_TYPE_SID, typeof(int)).Ordinal;
            int IDX_PARNT_OBJ_SID = dt.Columns.Add(Entities.deal.MYDL_CL_WIP_ATRB_TMP.PARNT_OBJ_SID, typeof(object)).Ordinal;

            int IDX_ATRB_SID = dt.Columns.Add(Entities.deal.MYDL_CL_WIP_ATRB_TMP.ATRB_SID, typeof(int)).Ordinal;
            int IDX_ATRB_VAL = dt.Columns.Add(Entities.deal.MYDL_CL_WIP_ATRB_TMP.ATRB_VAL, typeof(object)).Ordinal;

            int IDX_DEAL_ATRB_MTX_SID = dt.Columns.Add(Entities.deal.MYDL_CL_WIP_ATRB_TMP.ATRB_MTX_SID, typeof(int)).Ordinal;
            int IDX_DEAL_ATRB_MTX_HASH = dt.Columns.Add(Entities.deal.MYDL_CL_WIP_ATRB_TMP.ATRB_MTX_HASH, typeof(string)).Ordinal;
            int IDX_ATRB_RVS_NBR = dt.Columns.Add(Entities.deal.MYDL_CL_WIP_ATRB_TMP.ATRB_RVS_NBR, typeof(int)).Ordinal;

            int IDX_CHG_EMP_WWID = dt.Columns.Add(Entities.deal.MYDL_CL_WIP_ATRB_TMP.CHG_EMP_WWID, typeof(int)).Ordinal;

            // LEAVE IDX_CHG_DTM COMMENTED OUT SO THAT IT DOESN'T OVERRIDE DB COLUMN DEFAULT VALUE
            //int IDX_CHG_DTM = dt.Columns.Add(Entities.deal.MYDL_CL_WIP_ATRB_TMP.CHG_DTM, typeof(int)).Ordinal;

            int IDX_MDX_CD = dt.Columns.Add(Entities.deal.MYDL_CL_WIP_ATRB_TMP.MDX_CD, typeof(string)).Ordinal; // M,D,X (Modify (I,U), Delete, No Action (X)), used to be DATA_TEXT vc(100) 
            #endregion

            if (!odp.Data.Any())
            {
                return dt;
            }

            foreach (var dc in odp.Data) // Good ParallelWait opportunity?
            {
                foreach (var de in dc.Value.DataElements)
                {
                    // Create new data row to set the values on...
                    var r = dt.NewRow();
                    int chgWwid = wwid;
                    //int dcSid = (de.DcSID == 0 ? 0 : de.DcSID); //(de.DcSID == 0 ? dc.Key : de.DcSID);
                    int dcParentSid = (de.DcParentID == 0 ? 0 : de.DcParentID); //(de.DcParentSID == 0 ? dc.Key : de.DcParentSID);

                    r[IDX_BTCH_ID] = odp.BatchID;
                    r[IDX_OBJ_TYPE_SID] = odp.PacketType.ToId(); // Set packet type
                    r[IDX_PARNT_OBJ_TYPE_SID] = odp.PacketType.GetParent().ToId(); // Set parent packet type

                    r[IDX_CUST_MBR_SID] = custSid; // Set customer

                    r[IDX_OBJ_SID] = de.DcID; // Table ID for this item
                    r[IDX_PARNT_OBJ_SID] = de.DcParentID; // Table ID for this item

                    r[IDX_ATRB_SID] = de.AtrbID;
                    if (de.DimID > 0)
                    {
                        r[IDX_DEAL_ATRB_MTX_SID] = de.DimID;
                    }
                    else if (de.DimKey.Count > 0) // If we have the DIM ID (above, then don't send the hash)
                    {
                        r[IDX_DEAL_ATRB_MTX_HASH] = de.DimKey.HashPairs;
                    }
                    r[IDX_ATRB_VAL] = de.AtrbValue;
                    r[IDX_MDX_CD] = OpDataElementStateConverter.ToString(de.State);
                    r[IDX_CHG_EMP_WWID] = chgWwid;
                    //r[IDX_CHG_DTM] = typeof(int)).Ordinal;

                    // What about de.DcAltID

                    if (de.ExtraDimKey != null && de.ExtraDimKey.Count > 0)
                    { // Must see what happend to extra dim items - might drop...  Commented out for now.
                        // TODO - DealDataLib_Common.cs - Check to see if extra dim goes away
                        //Guid pg;
                        //if (de.ExtraDimKey.TryGet<Guid>(AttributeCodes.PLI_GUID, out pg))
                        //{
                        //    r[IDX_PLI_GUID] = pg;
                        //}

                        //Guid ag;
                        //if (de.ExtraDimKey.TryGet<Guid>(AttributeCodes.AGRMNT_GUID, out ag))
                        //{
                        //    r[IDX_AGRMNT_GUID] = ag;
                        //}
                    }

                    // If executing in parallel, lock around this....
                    dt.Rows.Add(r);
                }
            }

            return dt;
        }

        /// <summary>
        /// An action packet to a data table
        /// </summary>
        /// <param name="odp">Data packet wiht valid actions</param>
        /// <param name="groupBatchId">Group batch with which these packets are associated.</param>
        /// <param name="wwid">WWID of user making the changes.</param>
        /// <returns></returns>
        private DataTable OpDataPacketToImportActionTable(OpDataPacket<OpDataElementType> odp, Guid groupBatchId, int wwid)
        {
            // Save Data Cycle: Point 18

            if (odp?.Actions == null) // If no odp or odp has no actions, bail out
            {
                return null;
            }

            DataTable dt = new DataTable();

            // The table name must match 1:1 to the import table name...
            dt.TableName = TableName.MYDL_CL_WIP_ACTN; // Bulk load the actions table

            #region Get Ordinal Column Indexes
            int IDX_BTCH_ID = dt.Columns.Add(Entities.deal.MYDL_CL_WIP_ACTN.BTCH_ID, typeof(Guid)).Ordinal;

            int IDX_OBJ_TYPE_SID = dt.Columns.Add(Entities.deal.MYDL_CL_WIP_ACTN.OBJ_TYPE_SID, typeof(string)).Ordinal; 
            int IDX_DEAL_ALT_SID = dt.Columns.Add(Entities.deal.MYDL_CL_WIP_ACTN.OBJ_SID, typeof(int)).Ordinal;
            int IDX_OLD_OBJ_SID = dt.Columns.Add(Entities.deal.MYDL_CL_WIP_ACTN.OLD_OBJ_SID, typeof(int)).Ordinal;

            int IDX_SRT_ORD = dt.Columns.Add(Entities.deal.MYDL_CL_WIP_ACTN.SRT_ORD, typeof(int)).Ordinal;
            int IDX_ACTN_NM = dt.Columns.Add(Entities.deal.MYDL_CL_WIP_ACTN.ACTN_NM, typeof(string)).Ordinal; // Max Len = 50
            int IDX_MSG_CD = dt.Columns.Add(Entities.deal.MYDL_CL_WIP_ACTN.MSG_CD, typeof(string)).Ordinal; // Max Len = 10
            int IDX_ACTN_VAL_LIST = dt.Columns.Add(Entities.deal.MYDL_CL_WIP_ACTN.ACTN_VAL_LIST, typeof(string)).Ordinal; // Max Len = 8000

            int IDX_CHG_EMP_WWID = dt.Columns.Add(Entities.deal.MYDL_CL_WIP_ACTN.CHG_EMP_WWID, typeof(int)).Ordinal;

            // LEAVE IDX_CHG_DTM COMMENTED OUT SO THAT IT DOESN'T OVERRIDE DB COLUMN DEFAULT VALUE
            //int IDX_CHG_DTM = dt.Columns.Add(Entities.deal.MYDL_CL_WIP_ACTN.CHG_DTM, typeof(int)).Ordinal;
            #endregion

            if (odp.Actions.Count == 0)
            {
                return dt;
            }

            int chgWwid = wwid;
            bool hasGroupBatch = OpTypeConverter.IsValidGuid(groupBatchId);

            if (odp.Actions.Any(a => a.Sort == MyDealsDataAction.DEFAULT_SORT))
            {
                // Any unsorted actions should come BEFORE all the sorted actions (Mike's request)
                const int maxSort = -1000000000;

                foreach (var kvpAct in MyDealsDataAction.DEFAULT_ACTION_SORT_ORDER)
                {
                    foreach (
                        var act in
                            odp.Actions.Where(a => a.Action == kvpAct.Key && a.Sort == MyDealsDataAction.DEFAULT_SORT))
                    {
                        act.Sort = maxSort + kvpAct.Value;

                        OpLogPerf.Log("WARNING! Unset Action Sort Order! Action: {0}; Value: {1};  Targets: {2}",
                            act.Action,
                            act.Value,
                            (act.TargetDcIDs == null ? "" : string.Join(", ", act.TargetDcIDs))
                            );
                    }
                }
            }

            foreach (var oa in odp.Actions.Where(a => a.ActionDirection != OpActionDirection.Outbound))
            // Good ParallelWait opportunity?
            {
                var r = dt.NewRow();
                r[IDX_BTCH_ID] = odp.BatchID;
                r[IDX_CHG_EMP_WWID] = chgWwid;

                if (oa.DcID != null && oa.DcID != 0)
                {
                    r[IDX_DEAL_ALT_SID] = oa.DcID;
                    r[IDX_OLD_OBJ_SID] = oa.DcID;
                }

                r[IDX_OBJ_TYPE_SID] = odp.PacketType.ToId(); // Set the object packet type
                r[IDX_ACTN_NM] = oa.Action;
                //r[IDX_ACTN_VAL] = oa.Value; // Do we need this??
                r[IDX_SRT_ORD] = oa.Sort;

                if (oa.TargetDcIDs != null && oa.TargetDcIDs.Count > 0)
                {
                    r[IDX_ACTN_VAL_LIST] = String.Join(",", oa.TargetDcIDs);
                }

                //if (hasGroupBatch)
                //{
                //    r[IDX_DEAL_GRP_BTCH_ID] = groupBatchId;
                //}

                //if (odp.GroupID != null && odp.GroupID > 0)
                //{
                //    r[IDX_DEAL_GRP_BTCH_ID] = odp.GroupID;
                //}

                if (oa.MessageCode != OpMsg.MessageType.Debug)
                // This is the default, and I couldn't see a reason to write it to the DB...
                {
                    r[IDX_MSG_CD] = Enum.GetName(typeof(OpMsg.MessageType), oa.MessageCode);
                }

                // If executing in parallel, lock around this....
                dt.Rows.Add(r);
            }
            return dt;
        }



    }
}