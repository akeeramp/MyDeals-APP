using System;
using System.Collections.Generic;
using System.Linq;
using Intel.Opaque.Data;
using Intel.Opaque.DBAccess;
using System.Data;
using System.Data.SqlClient;
using Intel.MyDeals.Entities;
using Intel.Opaque;
using Intel.Opaque.Tools;

namespace Intel.MyDeals.DataLibrary
{
    public partial class DealDataLib
    {
        #region Consts and Structs

        internal struct TableName
        {
            // TODO - These are hard coded table names in our code.  WTH??
            public const string STG_WIP_ATRB = "[dbo].[STG_WIP_ATRB]";
            public const string WIP_ACTN = "[dbo].[WIP_ACTN]";
        }

        #endregion

        //////        private AttributeCollection AttributeMasterData => GetAttributeCollection();

        //////        public int GetAttribId(string atrbCd)
        //////        {
        //////            return GetAttributeCollection()[atrbCd];
        //////        }

        //////        public AttributeCollection GetAttributeCollection()
        //////        {
        //////            return new AttributeCollection(DataCollections.GetAttributeMasterDataDictionary(), DataCollections.GetOpAtrbMapItems());
        //////        }


#if DEBUG
        private OpMsgQueue LogMessages = new OpMsgQueue();
        private DateTime LastLogTime = DateTime.Now;
#endif

        //////        private void DebugLog(string message, params object[] args)
        //////        {
        //////#if DEBUG
        //////            if (string.IsNullOrEmpty(message))
        //////            {
        //////                return;
        //////            }

        //////            if (args.Length > 0)
        //////            {
        //////                message = string.Format(message, args);
        //////            }

        //////            message += string.Format(" - Logging Delta: {0}ms.", (DateTime.Now - LastLogTime).TotalMilliseconds);

        //////            LogMessages.WriteMessage
        //////                (
        //////                    OpMsg.MessageType.Debug,
        //////                    message
        //////                );

        //////            OpLogPerf.Log(message);

        //////            LastLogTime = DateTime.Now;
        //////#endif
        //////        }


        /// <summary>
        /// Convert a data reader to a collection of OpDataPackets.
        /// The input reader must conform to the view signature for [deal].[VW_DEAL_SRCH_*] views
        /// </summary>
        /// <param name="rdr">Data reader with an appropraite set of columns.</param>
        /// <returns>Valid deal objects.</returns>
        public MyDealsData ReaderToDataCollectors(SqlDataReader rdr, bool processDataCollectorLevelData)
        {
            // Load Data Cycle: Point 1
            // Save Data Cycle: Point 2
            // Save Data Cycle: Point 19
            const bool mergeDealAndPrep = false; // Used to be a passed parameter....

#if DEBUG
            DateTime start = DateTime.Now;
            int cells = 0;
            int deals = 0;
#endif
            var odps = new MyDealsData();

            // TODO - Save call returns this as table 2, initial read does it as one...
            //rdr.NextResult(); // added this because they are passing back additional tables - we want the atrbs table...

            #region Resolve Column Indexes

            // TODO - change all of these to Entities.deal.DEAL.ATRB_SID format later
            int IDX_DEAL_OBJ_TYPE = DB.GetReaderOrdinal(rdr, "OBJ_TYPE"); // Was OBJ_SET, this is cntrct or object type
            int IDX_DEAL_OBJ_TYPE_SID = DB.GetReaderOrdinal(rdr, "OBJ_TYPE_SID"); // Object_type_id or Object_set_id // Change to OBJ_TYPE_SID from Entities.deal.DEAL.OBJ_SET

            int IDX_ATRB_SID = DB.GetReaderOrdinal(rdr, "ATRB_SID"); // Attribute SID
            int IDX_DEAL_ATRB_SID = DB.GetReaderOrdinal(rdr, "ATRB_SID"); // Missing, was Entities.deal.DEAL.ATRB_SID
            int IDX_ATRB_COL_NM = DB.GetReaderOrdinal(rdr, "ATRB_COL_NM"); // Attribute Code Name
            int IDX_DOT_NET_DATA_TYPE = DB.GetReaderOrdinal(rdr, "DOT_NET_DATA_TYPE"); // Attribute .NET data type

            int IDX_DEAL_ATRB_MTX_SID = DB.GetReaderOrdinal(rdr, "ATRB_MTX_SID"); // Attribute Matrix SID // Need to bring these back in - obj_atrb_mtx_sid/hash
            int IDX_DEAL_ATRB_MTX_HASH = DB.GetReaderOrdinal(rdr, "OBJ_ATRB_MTX_HASH"); // Attribute Matrix Hash, ex. "5000:32272/5003:1"

            int IDX_ATRB_VAL_INT = DB.GetReaderOrdinal(rdr, "ATRB_VAL_INT"); // Atrb val INT
            int IDX_ATRB_VAL_MONEY = DB.GetReaderOrdinal(rdr, "ATRB_VAL_MONEY"); // Atrb val MONEY
            int IDX_ATRB_VAL_DTM = DB.GetReaderOrdinal(rdr, "ATRB_VAL_DTM"); // Atrb val DATETIME
            int IDX_ATRB_VAL_CHAR = DB.GetReaderOrdinal(rdr, "ATRB_VAL_CHAR"); // Atrb val CHAR
            int IDX_ATRB_VAL_CHAR_MAX = DB.GetReaderOrdinal(rdr, "ATRB_VAL_CHAR_MAX"); // Atrb val CHAR_MAX

            int IDX_OBJ_KEY = DB.GetReaderOrdinal(rdr, "OBJ_KEY"); // Real identity key for object ID - the true single table identity col
            int IDX_PARENT_OBJ_KEY = DB.GetReaderOrdinal(rdr, "PARENT_OBJ_KEY"); // Read identity key for object ID
            int IDX_DEAL_ALT_SID = DB.GetReaderOrdinal(rdr, "OBJ_SID"); // OBJ SID is the user visable ID - referrs to table specific identity col

            // Unique to deal save returned results
            int IDX_BTCH_ID = DB.GetReaderOrdinal(rdr, "BTCH_ID");


            /*
            int IDX_DEAL_CRE_EMP_WWID = DB.GetReaderOrdinal(rdr, ColumnName.DEAL_CRE_EMP_WWID);
            int IDX_DEAL_CRE_DTM = DB.GetReaderOrdinal(rdr, ColumnName.DEAL_CRE_DTM);
            int IDX_DEAL_CHG_EMP_WWID = DB.GetReaderOrdinal(rdr, ColumnName.DEAL_CHG_EMP_WWID);
            int IDX_DEAL_CHG_DTM = DB.GetReaderOrdinal(rdr, ColumnName.DEAL_CHG_DTM);
            int IDX_ATRB_CRE_EMP_WWID = DB.GetReaderOrdinal(rdr, ColumnName.ATRB_CRE_EMP_WWID);
            int IDX_ATRB_CRE_DTM = DB.GetReaderOrdinal(rdr, ColumnName.ATRB_CRE_DTM);
            int IDX_ATRB_CHG_EMP_WWID = DB.GetReaderOrdinal(rdr, ColumnName.ATRB_CHG_EMP_WWID);
            int IDX_ATRB_CHG_DTM = DB.GetReaderOrdinal(rdr, ColumnName.ATRB_CHG_DTM);
            */

            #endregion

            if (IDX_DEAL_OBJ_TYPE_SID < 0 || IDX_OBJ_KEY < 0 || IDX_DEAL_ATRB_SID < 0 || IDX_ATRB_SID < 0)
            {
                throw new InvalidOperationException(
                    "DcsDealLib.ReaderToDataCollectors. Expected columns are missing from a deal result set.  This is often the case when an extra recordset is returned out of sequence, like when a debugging result set is returned before the actual expected data is returned.  Run the calling routine manually to confirm the proper data is being returned in the proper order.  If the problem persists, ensure proper columns are available in the expected result set.");
            }

            //bool IS_PRD_GUID = (IDX_PRD_GUID > -1);
            //bool IS_AGRMNT_GUID = (IDX_AGRMNT_GUID > -1);

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
                var detype = OpDataElementTypeConverter.FromString(rdr[IDX_DEAL_OBJ_TYPE]); // CNTRCT
                int detypeid = rdr.GetTypedValue<int>(IDX_DEAL_OBJ_TYPE_SID, 0); // 1

                int obj_key = rdr.GetTypedValue<int>(IDX_OBJ_KEY, 0); // Object Key
                int parent_obj_key = rdr.GetTypedValue<int>(IDX_PARENT_OBJ_KEY, 0); // Parent ID Key
                int obj_display_sid = rdr.GetTypedValue<int>(IDX_DEAL_ALT_SID, 0); // Object display ID

                OpDataCollector odc;
                if (!odps[detype].Data.TryGetValue(obj_key, out odc)) // See if this belongs to an existing DataCollector or if we need to make a new one
                {
#if DEBUG
                    deals++;
#endif

                    if (IDX_BTCH_ID > -1 && !odps.Any())
                    {
                        // First deal of an obj_set, set the packet details.
                        odps[detype].BatchID = rdr.GetTypedValue<Guid>(IDX_BTCH_ID, Guid.Empty);
                    }

                    odps[detype].Data[obj_key] = odc = new OpDataCollector
                    {
                        DcID = obj_display_sid,
                        DcParentSID = parent_obj_key,
                        DcSID = obj_key,
                        DcType = detype.ToString()
                    };
                }

                // Get the value from the database...
                var value = OpServerUtil.Coalesce
                    (
                        rdr[IDX_ATRB_VAL_INT],
                        rdr[IDX_ATRB_VAL_CHAR],
                        rdr[IDX_ATRB_VAL_MONEY],
                        rdr[IDX_ATRB_VAL_DTM],
                        rdr[IDX_ATRB_VAL_CHAR_MAX]
                    );

                string dndt = rdr.GetTypedValue<string>(IDX_DOT_NET_DATA_TYPE);

                if (value != null)
                {
                    // A Bit hackish, but this was the only way I could think to do this.
                    // conver to switch as needed if we add more types.
                    if (dndt == "System.Boolean")
                    {
                        value = OpTypeConverter.StringToNullableBool(value) ?? false;
                    }
                }

                var ode = OpDataElement.Create
                    (
                        rdr.GetTypedValue<int>(IDX_DEAL_ATRB_SID), // element id - need to be unique???
                        rdr.GetTypedValue<int>(IDX_ATRB_SID),
                        rdr.GetTypedValue<string>(IDX_ATRB_COL_NM),
                        value,
                        obj_key, // DcSID
                        obj_display_sid, // DcId
                        parent_obj_key, // AltDcId
                        0, // Dim
                        null, // StringDim
                        dndt, // DotNetType
                        false // Raise Events flag
                    );

                odc.DataElements.Add(ode);
            }

            odps.RemoveEmptyPackets();

            #endregion

            #region Set Group ID and Batch ID

            OpDataPacket<OpDataElementType> grp;
            if (odps.TryGetValue(OpDataElementType.Group, out grp))
            {
                int grp_id = 0;
                foreach (var de in grp.AllDataElements.Where(de => de.DcID > 0))
                {
                    grp_id = de.DcID;
                    break;
                }

                if (grp_id > 0)
                {
                    foreach (var op in odps)
                    {
                        op.Value.GroupID = grp_id;
                    }
                }
            }

            #endregion

            #region processDataCollectorLevelData

            if (processDataCollectorLevelData && rdr.NextResult())
            {
                IDX_OBJ_KEY = -1; // Real identity key for object ID - the true single table identity col
                IDX_PARENT_OBJ_KEY = -1; // Read identity key for object ID
                IDX_DEAL_ALT_SID = -1; // OBJ SID is the user visable ID - referrs to table specific identity col

                IDX_OBJ_KEY = DB.GetReaderOrdinal(rdr, "OBJ_KEY"); // Real identity key for object ID - the true single table identity col
                IDX_PARENT_OBJ_KEY = DB.GetReaderOrdinal(rdr, "PARENT_OBJ_KEY"); // Read identity key for object ID
                IDX_DEAL_ALT_SID = DB.GetReaderOrdinal(rdr, "OBJ_SID"); // OBJ SID is the user visable ID - referrs to table specific identity col

                // TODO: Use constants here...
                int IDX_DEAL_CRE_EMP_WWID = DB.GetReaderOrdinal(rdr, "CRE_EMP_WWID");
                int IDX_DEAL_CRE_DTM = DB.GetReaderOrdinal(rdr, "CRE_DTM");
                int IDX_DEAL_CHG_EMP_WWID = DB.GetReaderOrdinal(rdr, "CHG_EMP_WWID");
                int IDX_DEAL_CHG_DTM = DB.GetReaderOrdinal(rdr, "CHG_DTM");

                // Ensure all data fields are in the result set...
                if (
                    IDX_OBJ_KEY >= 0
                    && IDX_DEAL_ALT_SID >= 0
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
                        int deal_prep_sid = rdr.GetTypedValue<int>(IDX_DEAL_ALT_SID, 0);

                        OpDataCollector dc = null;
                        // See if it exists in Primary...
                        if (odps.ContainsKey(OpDataElementType.Deals) &&
                            odps[OpDataElementType.Deals].Data.TryGetValue(deal_prep_sid, out dc))
                        {
                        }
                        if (dc == null)
                        {
                            // If not, check secondary...
                            if (odps.ContainsKey(OpDataElementType.Secondary) &&
                                odps[OpDataElementType.Secondary].Data.TryGetValue(deal_prep_sid, out dc))
                            {
                            }

                            // We have no collector to store the data, skip it.
                            if (dc == null)
                            {
                                continue;
                            }
                        }

                        int deal_sid = rdr.GetTypedValue<int>(IDX_OBJ_KEY, 0);

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

        /// <summary>
        /// A data packet to a data table
        /// </summary>
        /// <param name="odp">A valid data packet</param>
        /// <param name="custSid">Customer ID to pass to DB</param>
        /// <returns>A valid DataTable or null if input is invalid.</returns>
        private DataTable OpDataPacketToImportDataTable(OpDataPacket<OpDataElementType> odp, int custSid)
        {
            // Save Data Cycle: Point 17

            if (odp?.Data == null) // If no odp or odp has no actions, bail out
            {
                return null;
            }

            DataTable dt = new DataTable();

            // The table name must match 1:1 to the import table name...
            dt.TableName = TableName.STG_WIP_ATRB; 

            #region Get Ordinal Indexes
            int IDX_DEAL_OBJ_TYPE_SID = dt.Columns.Add(Entities.deal.STG_WIP_ATRB.OBJ_TYPE_SID, typeof(int)).Ordinal; // Entities.deal.STG_WIP_ATRB.OBJ_ATRB_SID in old system

            int IDX_ATRB_SID = dt.Columns.Add(Entities.deal.STG_WIP_ATRB.ATRB_SID, typeof(int)).Ordinal;
            int IDX_ATRB_VAL = dt.Columns.Add(Entities.deal.STG_WIP_ATRB.ATRB_VAL, typeof(object)).Ordinal;

            int IDX_DEAL_ATRB_MTX_SID = dt.Columns.Add(Entities.deal.STG_WIP_ATRB.ATRB_MTX_SID, typeof(int)).Ordinal;
            int IDX_DEAL_ATRB_MTX_HASH = dt.Columns.Add(Entities.deal.STG_WIP_ATRB.ATRB_MTX_HASH, typeof(string)).Ordinal;

            int IDX_OBJ_KEY = dt.Columns.Add(Entities.deal.STG_WIP_ATRB.OBJ_KEY, typeof(int)).Ordinal; // Internal DB ID for this item
            int IDX_PARENT_OBJ_KEY = dt.Columns.Add(Entities.deal.STG_WIP_ATRB.PARENT_OBJ_KEY, typeof(int)).Ordinal;
            int IDX_DEAL_ALT_SID = dt.Columns.Add(Entities.deal.STG_WIP_ATRB.OBJ_SID, typeof(int)).Ordinal;

            int IDX_CUST_MBR_SID = dt.Columns.Add(Entities.deal.STG_WIP_ATRB.CUST_MBR_SID, typeof(int)).Ordinal;
            int IDX_MDX_CD = dt.Columns.Add(Entities.deal.STG_WIP_ATRB.MDX_CD, typeof(string)).Ordinal; // M,D,X (Modify (I,U), Delete, No Action (X)), used to be DATA_TEXT vc(100) 
            int IDX_BTCH_ID = dt.Columns.Add(Entities.deal.STG_WIP_ATRB.BTCH_ID, typeof(Guid)).Ordinal;
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
                    int dcId = (de.DcID == 0 ? dc.Key : de.DcID); // This one makes sense because DC Key is DcId
                    int dcSid = (de.DcSID == 0 ? 0 : de.DcSID); //(de.DcSID == 0 ? dc.Key : de.DcSID);
                    int dcParentSid = (de.DcParentSID == 0 ? 0 : de.DcParentSID); //(de.DcParentSID == 0 ? dc.Key : de.DcParentSID);

                    r[IDX_BTCH_ID] = odp.BatchID;
                    r[IDX_DEAL_OBJ_TYPE_SID] = odp.PacketType.ToId(); // Set packet type
                    r[IDX_CUST_MBR_SID] = custSid; // Set customer

                    if (dcId != 0)
                    {
                        r[IDX_PARENT_OBJ_KEY] = dcParentSid;
                        r[IDX_DEAL_ALT_SID] = dcId;
                        r[IDX_OBJ_KEY] = dcSid;
                    }

                    if (de.ElementID != 0)
                    {
                        r[IDX_DEAL_OBJ_TYPE_SID] = de.ElementID;
                    }

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
            dt.TableName = TableName.WIP_ACTN; // Work with Rick to make sure this is correct.

            #region Get Ordinal Column Indexes
            int IDX_DEAL_OBJ_TYPE_SID = dt.Columns.Add(Entities.deal.WIP_ACTN.OBJ_TYPE_SID, typeof(string)).Ordinal; // Used to be Entities.deal.WIP_ACTN.OBJ_SET in old system
            int IDX_DEAL_ALT_SID = dt.Columns.Add(Entities.deal.WIP_ACTN.OBJ_SID, typeof(int)).Ordinal;

            int IDX_OLD_OBJ_SID = dt.Columns.Add(Entities.deal.WIP_ACTN.OLD_OBJ_SID, typeof(int)).Ordinal;
            int IDX_ACTN_CD = dt.Columns.Add(Entities.deal.WIP_ACTN.ACTN_CD, typeof(string)).Ordinal; // Max Len = 50
            int IDX_MSG_CD = dt.Columns.Add(Entities.deal.WIP_ACTN.MSG_CD, typeof(string)).Ordinal; // Max Len = 10
            int IDX_ACTN_VAL = dt.Columns.Add(Entities.deal.WIP_ACTN.ACTN_VAL, typeof(string)).Ordinal; // Max Len = 8000
            int IDX_ACTN_VAL_LIST = dt.Columns.Add(Entities.deal.WIP_ACTN.ACTN_VAL_LIST, typeof(string)).Ordinal; // Max Len = 8000
            int IDX_SRT_ORD = dt.Columns.Add(Entities.deal.WIP_ACTN.SRT_ORD, typeof(int)).Ordinal;
            ////int IDX_DEAL_GRP_SID = dt.Columns.Add(Entities.deal.WIP_ACTN.DEAL_GRP_SID, typeof(int)).Ordinal;

            // Unique to deal save returned results
            int IDX_BTCH_ID = dt.Columns.Add(Entities.deal.WIP_ACTN.BTCH_ID, typeof(Guid)).Ordinal;
            int IDX_DEAL_GRP_BTCH_ID = dt.Columns.Add(Entities.deal.WIP_ACTN.DEAL_GRP_BTCH_ID, typeof(Guid)).Ordinal;
            int IDX_CHG_EMP_WWID = dt.Columns.Add(Entities.deal.WIP_ACTN.CHG_EMP_WWID, typeof(int)).Ordinal;

            // Don't know if we'll need these at some point.
            //int IDX_OBJ_KEY = dt.Columns.Add(Entities.deal.STG_WIP_ATRB.OBJ_KEY, typeof(int)).Ordinal; // Internal DB ID for this item
            //int IDX_PARENT_OBJ_KEY = dt.Columns.Add(Entities.deal.STG_WIP_ATRB.PARENT_OBJ_KEY, typeof(int)).Ordinal;
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

                r[IDX_DEAL_OBJ_TYPE_SID] = odp.PacketType.ToId(); // Set packet type
                r[IDX_ACTN_CD] = oa.Action;
                r[IDX_ACTN_VAL] = oa.Value;
                r[IDX_SRT_ORD] = oa.Sort;

                if (oa.TargetDcIDs != null && oa.TargetDcIDs.Count > 0)
                {
                    r[IDX_ACTN_VAL_LIST] = String.Join(",", oa.TargetDcIDs);
                }

                if (hasGroupBatch)
                {
                    r[IDX_DEAL_GRP_BTCH_ID] = groupBatchId;
                }

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