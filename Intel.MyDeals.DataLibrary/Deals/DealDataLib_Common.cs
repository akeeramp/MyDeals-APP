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
using Procs = Intel.MyDeals.DataAccessLib.StoredProcedures.MyDeals;


namespace Intel.MyDeals.DataLibrary
{
    public partial class DealDataLib
    {
//////        #region Consts and Structs

//////        private struct TableName
//////        {
//////            public const string STG_WIP_ATRB = "[tdeal].[STG_WIP_ATRB]";
//////            public const string WIP_ACTN = "[tdeal].[WIP_ACTN]";

//////        }

//////        #endregion

//////        private AttributeCollection AttributeMasterData => GetAttributeCollection();

//////        public int GetAttribId(string atrbCd)
//////        {
//////            return GetAttributeCollection()[atrbCd];
//////        }

//////        public AttributeCollection GetAttributeCollection()
//////        {
//////            return new AttributeCollection(DataCollections.GetAttributeMasterDataDictionary(), DataCollections.GetOpAtrbMapItems());
//////        }


//////#if DEBUG
//////        private OpMsgQueue LogMessages = new OpMsgQueue();
//////        private DateTime LastLogTime = DateTime.Now;
//////#endif

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


//////        /// <summary>
//////        /// Convert a data reader to a collection of OpDataPackets.
//////        /// The input reader must conform to the view signature for [deal].[VW_DEAL_SRCH_*] views
//////        /// </summary>
//////        /// <param name="rdr">Data reader with an appropraite set of columns.</param>
//////        /// <returns>Valid deal objects.</returns>
//////        private MyDealsData ReaderToDataCollectors(SqlDataReader rdr, bool processDataCollectorLevelData)
//////        {
//////            const bool mergeDealAndPrep = false; // Used to be a passed parameter....

//////#if DEBUG
//////            DateTime start = DateTime.Now;
//////            int cells = 0;
//////            int deals = 0;
//////#endif
//////            var odps = new MyDealsData();

//////            #region Resolve Column Indexes

//////            int IDX_DEAL_SET = DB.GetReaderOrdinal(rdr, Entities.deal.DEAL.OBJ_SET);
//////            int IDX_ATRB_SID = DB.GetReaderOrdinal(rdr, Entities.deal.DEAL.ATRB_SID);
//////            int IDX_DEAL_ATRB_SID = DB.GetReaderOrdinal(rdr, Entities.deal.DEAL.OBJ_PARENT_SID);

//////            //int IDX_DEAL_ATRB_MTX_SID = DB.GetReaderOrdinal(rdr, Entities.deal.DEAL.DEAL_ATRB_MTX_SID);
//////            //int IDX_DEAL_ATRB_MTX_HASH = DB.GetReaderOrdinal(rdr, Entities.deal.DEAL.DEAL_ATRB_MTX_HASH);

//////            int IDX_ATRB_VAL_INT = DB.GetReaderOrdinal(rdr, Entities.deal.DEAL.ATRB_VAL_INT);
//////            int IDX_ATRB_VAL_MONEY = DB.GetReaderOrdinal(rdr, Entities.deal.DEAL.ATRB_VAL_MONEY);
//////            int IDX_ATRB_VAL_DTM = DB.GetReaderOrdinal(rdr, Entities.deal.DEAL.ATRB_VAL_DTM);
//////            int IDX_ATRB_VAL_CHAR = DB.GetReaderOrdinal(rdr, Entities.deal.DEAL.ATRB_VAL_CHAR);
//////            int IDX_ATRB_VAL_CHAR_MAX = DB.GetReaderOrdinal(rdr, Entities.deal.DEAL.ATRB_VAL_CHAR_MAX);

//////            int IDX_ATRB_CD = DB.GetReaderOrdinal(rdr, Entities.deal.DEAL.ATRB_CD);
//////            int IDX_DOT_NET_DATA_TYPE = DB.GetReaderOrdinal(rdr, Entities.deal.DEAL.DOT_NET_DATA_TYPE);

//////            // Unique to PR_GET_DEAL_GRP to get full workbook data.
//////            //int IDX_PRD_GUID = DB.GetReaderOrdinal(rdr, Entities.deal.DEAL.PLI_GUID);
//////            //int IDX_AGRMNT_GUID = DB.GetReaderOrdinal(rdr, Entities.deal.DEAL.AGRMNT_GUID);
//////            int IDX_DEAL_SID = DB.GetReaderOrdinal(rdr, Entities.deal.DEAL.OBJ_SID);
//////            int IDX_DEAL_ALT_SID = DB.GetReaderOrdinal(rdr, Entities.deal.DEAL.OBJ_PARENT_SID);

//////            // Unique to deal save returned results
//////            int IDX_BTCH_ID = DB.GetReaderOrdinal(rdr, "BTCH_ID");


//////            /*
//////            int IDX_DEAL_CRE_EMP_WWID = DB.GetReaderOrdinal(rdr, ColumnName.DEAL_CRE_EMP_WWID);
//////            int IDX_DEAL_CRE_DTM = DB.GetReaderOrdinal(rdr, ColumnName.DEAL_CRE_DTM);
//////            int IDX_DEAL_CHG_EMP_WWID = DB.GetReaderOrdinal(rdr, ColumnName.DEAL_CHG_EMP_WWID);
//////            int IDX_DEAL_CHG_DTM = DB.GetReaderOrdinal(rdr, ColumnName.DEAL_CHG_DTM);
//////            int IDX_ATRB_CRE_EMP_WWID = DB.GetReaderOrdinal(rdr, ColumnName.ATRB_CRE_EMP_WWID);
//////            int IDX_ATRB_CRE_DTM = DB.GetReaderOrdinal(rdr, ColumnName.ATRB_CRE_DTM);
//////            int IDX_ATRB_CHG_EMP_WWID = DB.GetReaderOrdinal(rdr, ColumnName.ATRB_CHG_EMP_WWID);
//////            int IDX_ATRB_CHG_DTM = DB.GetReaderOrdinal(rdr, ColumnName.ATRB_CHG_DTM);
//////            */

//////            #endregion

//////            if (IDX_DEAL_SET < 0 || IDX_DEAL_SID < 0 || IDX_DEAL_ATRB_SID < 0 || IDX_ATRB_SID < 0)
//////            {
//////                throw new InvalidOperationException(
//////                    "DcsDealLib.ReaderToDataCollectors. Expected columns are missing from a deal result set.  This is often the case when an extra recordset is returned out of sequence, like when a debugging result set is returned before the actual expected data is returned.  Run the calling routine manually to confirm the proper data is being returned in the proper order.  If the problem persists, ensure proper columns are available in the expected result set.");
//////            }

//////            //bool IS_PRD_GUID = (IDX_PRD_GUID > -1);
//////            //bool IS_AGRMNT_GUID = (IDX_AGRMNT_GUID > -1);

//////            // So we don't need to "IF" within the BIG loop, just make sure all our packets exist.
//////            odps.InitAllPacketTypes();

//////            #region Get All Data Elements

//////            // Start the read from the database...
//////            while (rdr.Read())
//////            {
//////#if DEBUG
//////                cells++;
//////#endif
//////                // Since we key by this, get it first.
//////                var detype = OpDataElementTypeConverter.FromString(rdr[IDX_DEAL_SET]);

//////                // Swap out ids for "DEAL" records where appropriate
//////                bool use_alt_sid = (detype == OpDataElementType.Deals && IDX_DEAL_ALT_SID > -1);
//////                // For DEAL, the Key is always the PREP id... (For better or worse...)
//////                OpDataElementType grouping_type = (mergeDealAndPrep && use_alt_sid)
//////                    ? OpDataElementType.Secondary
//////                    : detype;


//////                int deal_sid = rdr.GetTypedValue<int>(IDX_DEAL_SID, 0);
//////                int alt_sid = rdr.GetTypedValue<int>(IDX_DEAL_ALT_SID, 0);
//////                int wip_id = use_alt_sid
//////                    ? alt_sid // DEAL_PREP_SID
//////                    : deal_sid; // DEAL_SID
//////                int wip_alt_id = use_alt_sid // For DEAL, the key is always the PREP id... (For better or worse...)
//////                    ? deal_sid // And AltID = DEAL_SID
//////                    : alt_sid;

//////                OpDataCollector odc;
//////                if (!odps[grouping_type].Data.TryGetValue(wip_id, out odc))
//////                {
//////#if DEBUG
//////                    deals++;
//////#endif

//////                    if (IDX_BTCH_ID > -1 && !odps.Any())
//////                    {
//////                        // First deal of an obj_set, set the packet details.
//////                        odps[grouping_type].BatchID = rdr.GetTypedValue<Guid>(IDX_BTCH_ID, Guid.Empty);
//////                    }

//////                    odps[grouping_type].Data[wip_id] = odc = new OpDataCollector
//////                    {
//////                        DcID = wip_id,
//////                        DcAltID = wip_alt_id
//////                    };
//////                }

//////                // Get the value from the database...
//////                var value = OpServerUtil.Coalesce
//////                    (
//////                        rdr[IDX_ATRB_VAL_INT],
//////                        rdr[IDX_ATRB_VAL_CHAR],
//////                        rdr[IDX_ATRB_VAL_MONEY],
//////                        rdr[IDX_ATRB_VAL_DTM],
//////                        rdr[IDX_ATRB_VAL_CHAR_MAX]
//////                    );

//////                string dndt = rdr.GetTypedValue<string>(IDX_DOT_NET_DATA_TYPE);

//////                if (value != null)
//////                {
//////                    // A Bit hackish, but this was the only way I could think to do this.
//////                    // conver to switch as needed if we add more types.
//////                    if (dndt == "System.Boolean")
//////                    {
//////                        value = OpTypeConverter.StringToNullableBool(value) ?? false;
//////                    }
//////                }

//////                var ode = OpDataElement.Create
//////                    (
//////                        rdr.GetTypedValue<int>(IDX_DEAL_ATRB_SID),
//////                        rdr.GetTypedValue<int>(IDX_ATRB_SID),
//////                        rdr.GetTypedValue<string>(IDX_ATRB_CD),
//////                        value,
//////                        wip_id,
//////                        wip_alt_id,
//////                        0,
//////                        null,
//////                        dndt,
//////                        false
//////                    );

//////                odc.DataElements.Add(ode);
//////            }

//////            odps.RemoveEmptyPackets();

//////            #endregion

//////            #region Set Group ID and Batch ID

//////            OpDataPacket<OpDataElementType> grp;
//////            if (odps.TryGetValue(OpDataElementType.Group, out grp))
//////            {
//////                int grp_id = 0;
//////                foreach (var de in grp.AllDataElements.Where(de => de.DcID > 0))
//////                {
//////                    grp_id = de.DcID;
//////                    break;
//////                }

//////                if (grp_id > 0)
//////                {
//////                    foreach (var op in odps)
//////                    {
//////                        op.Value.GroupID = grp_id;
//////                    }
//////                }
//////            }

//////            #endregion

//////            #region processDataCollectorLevelData

//////            if (processDataCollectorLevelData && rdr.NextResult())
//////            {
//////                IDX_DEAL_SID = -1;
//////                IDX_DEAL_ALT_SID = -1;

//////                IDX_DEAL_SID = DB.GetReaderOrdinal(rdr, Entities.deal.DEAL.OBJ_SID);
//////                IDX_DEAL_ALT_SID = DB.GetReaderOrdinal(rdr, Entities.deal.DEAL.OBJ_PARENT_SID);

//////                // TODO: Use constants here...
//////                int IDX_DEAL_CRE_EMP_WWID = DB.GetReaderOrdinal(rdr, "CRE_EMP_WWID");
//////                int IDX_DEAL_CRE_DTM = DB.GetReaderOrdinal(rdr, "CRE_DTM");
//////                int IDX_DEAL_CHG_EMP_WWID = DB.GetReaderOrdinal(rdr, "CHG_EMP_WWID");
//////                int IDX_DEAL_CHG_DTM = DB.GetReaderOrdinal(rdr, "CHG_DTM");

//////                // Ensure all data fields are in the result set...
//////                if (
//////                    IDX_DEAL_SID >= 0
//////                    && IDX_DEAL_ALT_SID >= 0
//////                    && IDX_DEAL_CRE_EMP_WWID >= 0
//////                    && IDX_DEAL_CRE_DTM >= 0
//////                    && IDX_DEAL_CHG_EMP_WWID >= 0
//////                    && IDX_DEAL_CHG_DTM >= 0
//////                    )
//////                {
//////                    // Assume multiple values, hence while vs if
//////                    while (rdr.Read())
//////                    {
//////                        // Records are already keyed at PREP_SID, so get that.
//////                        int deal_prep_sid = rdr.GetTypedValue<int>(IDX_DEAL_ALT_SID, 0);

//////                        OpDataCollector dc = null;
//////                        // See if it exists in Primary...
//////                        if (odps.ContainsKey(OpDataElementType.Deals) &&
//////                            odps[OpDataElementType.Deals].Data.TryGetValue(deal_prep_sid, out dc))
//////                        {
//////                        }
//////                        if (dc == null)
//////                        {
//////                            // If not, check secondary...
//////                            if (odps.ContainsKey(OpDataElementType.Secondary) &&
//////                                odps[OpDataElementType.Secondary].Data.TryGetValue(deal_prep_sid, out dc))
//////                            {
//////                            }

//////                            // We have no collector to store the data, skip it.
//////                            if (dc == null)
//////                            {
//////                                continue;
//////                            }
//////                        }

//////                        int deal_sid = rdr.GetTypedValue<int>(IDX_DEAL_SID, 0);

//////                        // Write the 4 elements to the collection
//////                        int value1 = rdr.GetTypedValue<int>(IDX_DEAL_CRE_EMP_WWID); // REQ_BY
//////                        dc.DataElements.Add(new OpDataElement(false)
//////                        {
//////                            AtrbID = 19,
//////                            AtrbCd = AttributeCodes.REQ_BY,
//////                            AtrbValue = value1,
//////                            DcID = deal_prep_sid,
//////                            DcAltID = deal_sid,
//////                            OrigAtrbValue = value1,
//////                            PrevAtrbValue = value1
//////                        });

//////                        int value2 = rdr.GetTypedValue<int>(IDX_DEAL_CHG_EMP_WWID); // LAST_MOD_BY
//////                        dc.DataElements.Add(new OpDataElement(false)
//////                        {
//////                            AtrbID = 3326,
//////                            AtrbCd = AttributeCodes.LAST_MOD_BY,
//////                            AtrbValue = value2,
//////                            DcID = deal_prep_sid,
//////                            DcAltID = deal_sid,
//////                            OrigAtrbValue = value2,
//////                            PrevAtrbValue = value2
//////                        });

//////                        DateTime value3 = rdr.GetTypedValue<DateTime>(IDX_DEAL_CRE_DTM); // REQ_DT
//////                        dc.DataElements.Add(new OpDataElement(false)
//////                        {
//////                            AtrbID = 3324,
//////                            AtrbCd = AttributeCodes.REQ_DT,
//////                            AtrbValue = value3,
//////                            DcID = deal_prep_sid,
//////                            DcAltID = deal_sid,
//////                            OrigAtrbValue = value3,
//////                            PrevAtrbValue = value3
//////                        });

//////                        DateTime value4 = rdr.GetTypedValue<DateTime>(IDX_DEAL_CHG_DTM); // LAST_MOD_DT
//////                        dc.DataElements.Add(new OpDataElement(false)
//////                        {
//////                            AtrbID = 3342,
//////                            AtrbCd = AttributeCodes.LAST_MOD_DT,
//////                            AtrbValue = value4,
//////                            DcID = deal_prep_sid,
//////                            DcAltID = deal_sid,
//////                            OrigAtrbValue = value4,
//////                            PrevAtrbValue = value4
//////                        });
//////                    }

//////                }
//////            }

//////            #endregion

//////#if DEBUG
//////            OpLogPerf.Log(
//////                String.Format("ReaderToDataCollectors Runtime: {0}ms; DataCollectors: {1}; DataElements: {2};",
//////                    (DateTime.Now - start).TotalMilliseconds,
//////                    deals,
//////                    cells
//////                    ));

//////#endif

//////            return odps;
//////        }

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

//////        /// <summary>
//////        /// Get the passed packets in the preferred order
//////        /// </summary>
//////        /// <param name="packets"></param>
//////        /// <returns></returns>
//////        private List<OpDataPacket<OpDataElementType>> GetPacketsInOrder(
//////            IEnumerable<OpDataPacket<OpDataElementType>> packets)
//////        {
//////            if (packets == null)
//////            {
//////                return new List<OpDataPacket<OpDataElementType>>();
//////            }

//////            return packets
//////                .Where(odp => odp != null)
//////                .OrderBy(odp => (int)odp.PacketType)
//////                .ToList();
//////        }

//////        /// <summary>
//////        /// A data packet to a data table
//////        /// </summary>
//////        /// <param name="odp">A valid data packet</param>
//////        /// <returns>A valid DataTable or null if input is invalid.</returns>
//////        private DataTable OpDataPacketToImportDataTable(OpDataPacket<OpDataElementType> odp)
//////        {
//////            if (odp == null || odp.Data == null)
//////            {
//////                return null;
//////            }

//////            DataTable dt = new DataTable();
//////            // This table definition must match 1:1 to the import table...
//////            // The table name must match 1:1 to the import table name...
//////            dt.TableName = TableName.STG_WIP_ATRB; // Work with Rick to make sure this is correct.

//////            #region Get Ordinal Indexes

//////            int IDX_BTCH_ID = dt.Columns.Add(Entities.deal.STG_WIP_ATRB.BTCH_ID, typeof(Guid)).Ordinal;
//////            //dt.Columns.Add(ColumnName.CHG_DTM, typeof(DateTime)); // Trying to standardize on DB time...
//////            int IDX_OBJ_SID = dt.Columns.Add(Entities.deal.STG_WIP_ATRB.OBJ_SID, typeof(int)).Ordinal;
//////            //dt.Columns.Add(ColumnName.OBJ_SET, typeof(string));
//////            int IDX_ATRB_SID = dt.Columns.Add(Entities.deal.STG_WIP_ATRB.ATRB_SID, typeof(int)).Ordinal;
//////            int IDX_ATRB_MTX_SID = dt.Columns.Add(Entities.deal.STG_WIP_ATRB.ATRB_MTX_SID, typeof(int)).Ordinal;
//////            int IDX_ATRB_MTX_HASH = dt.Columns.Add(Entities.deal.STG_WIP_ATRB.ATRB_MTX_HASH, typeof(string)).Ordinal;
//////            int IDX_ATRB_VAL = dt.Columns.Add(Entities.deal.STG_WIP_ATRB.ATRB_VAL, typeof(object)).Ordinal;
//////            int IDX_MDX_CD = dt.Columns.Add(Entities.deal.STG_WIP_ATRB.MDX_CD, typeof(string)).Ordinal;
//////            // M,D,X (Modify (I,U), Delete, No Action (X)), used to be DATA_TEXT vc(100) 
//////            int IDX_PLI_GUID = dt.Columns.Add(Entities.deal.STG_WIP_ATRB.PLI_GUID, typeof(Guid)).Ordinal;
//////            int IDX_AGRMNT_GUID = dt.Columns.Add(Entities.deal.STG_WIP_ATRB.AGRMNT_GUID, typeof(Guid)).Ordinal;
//////            int IDX_OBJ_ATRB_SID = dt.Columns.Add(Entities.deal.STG_WIP_ATRB.OBJ_ATRB_SID, typeof(int)).Ordinal;

//////            #endregion

//////            if (odp.Data.Count() == 0)
//////            {
//////                return dt;
//////            }

//////            //var chg_dtm = DateTime.Now; 

//////            foreach (var dc in odp.Data) // Good ParallelWait opportunity?
//////            {
//////                foreach (var de in dc.Value.DataElements)
//////                {
//////                    // Create new data row to set the values on...
//////                    var r = dt.NewRow();
//////                    int DcID = (de.DcID == 0 ? dc.Key : de.DcID);
//////                    r[IDX_BTCH_ID] = odp.BatchID;

//////                    //r[ColumnName.CHG_DTM] = chg_dtm;
//////                    if (DcID != 0)
//////                    {
//////                        r[IDX_OBJ_SID] = DcID;
//////                    }

//////                    if (de.ElementID != 0)
//////                    {
//////                        r[IDX_OBJ_ATRB_SID] = de.ElementID;
//////                    }

//////                    //r[ColumnName.OBJ_SET] = OpDataElementTypeConverter.ToString(odp.PacketType);
//////                    r[IDX_ATRB_SID] = de.AtrbID;
//////                    if (de.DimID > 0)
//////                    {
//////                        r[IDX_ATRB_MTX_SID] = de.DimID;
//////                    }
//////                    else if (de.DimKey.Count > 0) // If we have the DIM ID (above, then don't send the hash)
//////                    {
//////                        r[IDX_ATRB_MTX_HASH] = de.DimKey.HashPairs;
//////                    }
//////                    r[IDX_ATRB_VAL] = de.AtrbValue;
//////                    r[IDX_MDX_CD] = OpDataElementStateConverter.ToString(de.State);

//////                    // What about de.DcAltID

//////                    if (de.ExtraDimKey != null && de.ExtraDimKey.Count > 0)
//////                    {
//////                        Guid pg;
//////                        if (de.ExtraDimKey.TryGet<Guid>(AttributeCodes.PLI_GUID, out pg))
//////                        {
//////                            r[IDX_PLI_GUID] = pg;
//////                        }

//////                        Guid ag;
//////                        if (de.ExtraDimKey.TryGet<Guid>(AttributeCodes.AGRMNT_GUID, out ag))
//////                        {
//////                            r[IDX_AGRMNT_GUID] = ag;
//////                        }
//////                    }

//////                    // If executing in parallel, lock around this....
//////                    dt.Rows.Add(r);
//////                }
//////            }

//////            return dt;
//////        }

//////        /// <summary>
//////        /// An action packet to a data table
//////        /// </summary>
//////        /// <param name="odp">Data packet wiht valid actions</param>
//////        /// <param name="group_batch_id">Group batch with which these packets are associated.</param>
//////        /// <returns></returns>
//////        private DataTable OpDataPacketToImportActionTable(OpDataPacket<OpDataElementType> odp, Guid group_batch_id, int wwid)
//////        {
//////            if (odp == null || odp.Actions == null)
//////            {
//////                return null;
//////            }

//////            DataTable dt = new DataTable();
//////            // This table definition must match 1:1 to the import table...
//////            // The table name must match 1:1 to the import table name...
//////            dt.TableName = TableName.WIP_ACTN; // Work with Rick to make sure this is correct.

//////            #region Get Ordinal Column Indexes

//////            int IDX_BTCH_ID = dt.Columns.Add(Entities.deal.WIP_ACTN.BTCH_ID, typeof(Guid)).Ordinal;
//////            //dt.Columns.Add(ColumnName.CHG_DTM, typeof(DateTime)); // Trying to standardize on DB time...
//////            int IDX_OBJ_SID = dt.Columns.Add(Entities.deal.WIP_ACTN.OBJ_SID, typeof(int)).Ordinal;
//////            int IDX_OLD_OBJ_SID = dt.Columns.Add(Entities.deal.WIP_ACTN.OLD_OBJ_SID, typeof(int)).Ordinal;
//////            int IDX_OBJ_SET = dt.Columns.Add(Entities.deal.WIP_ACTN.OBJ_SET, typeof(string)).Ordinal;
//////            int IDX_ACTN_CD = dt.Columns.Add(Entities.deal.WIP_ACTN.ACTN_CD, typeof(string)).Ordinal; // Max Len = 50
//////            int IDX_MSG_CD = dt.Columns.Add(Entities.deal.WIP_ACTN.MSG_CD, typeof(string)).Ordinal; // Max Len = 10
//////            int IDX_ACTN_VAL = dt.Columns.Add(Entities.deal.WIP_ACTN.ACTN_VAL, typeof(string)).Ordinal;
//////            // Max Len = 8000
//////            int IDX_ACTN_VAL_LIST = dt.Columns.Add(Entities.deal.WIP_ACTN.ACTN_VAL_LIST, typeof(string)).Ordinal;
//////            // Max Len = 8000
//////            int IDX_SRT_ORD = dt.Columns.Add(Entities.deal.WIP_ACTN.SRT_ORD, typeof(int)).Ordinal;
//////            int IDX_DEAL_GRP_SID = dt.Columns.Add(Entities.deal.WIP_ACTN.DEAL_GRP_SID, typeof(int)).Ordinal;
//////            int IDX_DEAL_GRP_BTCH_ID = dt.Columns.Add(Entities.deal.WIP_ACTN.DEAL_GRP_BTCH_ID, typeof(Guid)).Ordinal;
//////            int IDX_CHG_EMP_WWID = dt.Columns.Add(Entities.deal.WIP_ACTN.CHG_EMP_WWID, typeof(int)).Ordinal;

//////            #endregion

//////            if (odp.Actions.Count == 0)
//////            {
//////                return dt;
//////            }

//////            int CHG_WWID = wwid;

//////            // If it's a deal, always upload as prep, the an action can issue the move to deal...
//////            string obj_set = OpDataElementTypeConverter.ToString(
//////                odp.PacketType == OpDataElementType.Deals
//////                    ? OpDataElementType.Secondary
//////                    : odp.PacketType
//////                );

//////            bool has_group_batch = OpTypeConverter.IsValidGuid(group_batch_id);

//////            if (odp.Actions.Any(a => a.Sort == MyDealsDataAction.DEFAULT_SORT))
//////            {
//////                // Any unsorted actions should come BEFORE all the sorted actions (Mike's request)
//////                const int max_sort = -1000000000;

//////                foreach (var kvp_act in MyDealsDataAction.DEFAULT_ACTION_SORT_ORDER)
//////                {
//////                    foreach (
//////                        var act in
//////                            odp.Actions.Where(a => a.Action == kvp_act.Key && a.Sort == MyDealsDataAction.DEFAULT_SORT))
//////                    {
//////                        act.Sort = max_sort + kvp_act.Value;

//////                        OpLogPerf.Log("WARNING! Unset Action Sort Order! Action: {0}; Value: {1};  Targets: {2}",
//////                            act.Action,
//////                            act.Value,
//////                            (act.TargetDcIDs == null ? "" : string.Join(", ", act.TargetDcIDs))
//////                            );
//////                    }
//////                }
//////            }

//////            // var chg_dtm = DateTime.Now;

//////            foreach (var oa in odp.Actions.Where(a => a.ActionDirection != OpActionDirection.Outbound))
//////            // Good ParallelWait opportunity?
//////            {
//////                var r = dt.NewRow();
//////                r[IDX_BTCH_ID] = odp.BatchID;
//////                r[IDX_CHG_EMP_WWID] = CHG_WWID;

//////                //r[ColumnName.CHG_DTM] = chg_dtm;
//////                if (oa.DcID != null && oa.DcID != 0)
//////                {
//////                    r[IDX_OBJ_SID] = oa.DcID;
//////                    r[IDX_OLD_OBJ_SID] = oa.DcID;
//////                }
//////                r[IDX_OBJ_SET] = obj_set;
//////                r[IDX_ACTN_CD] = oa.Action;
//////                r[IDX_ACTN_VAL] = oa.Value;
//////                r[IDX_SRT_ORD] = oa.Sort;

//////                if (oa.TargetDcIDs != null && oa.TargetDcIDs.Count > 0)
//////                {
//////                    r[IDX_ACTN_VAL_LIST] = String.Join(",", oa.TargetDcIDs);
//////                }

//////                if (has_group_batch)
//////                {
//////                    r[IDX_DEAL_GRP_BTCH_ID] = group_batch_id;
//////                }

//////                if (odp.GroupID != null && odp.GroupID > 0)
//////                {
//////                    r[IDX_DEAL_GRP_SID] = odp.GroupID;
//////                }

//////                if (oa.MessageCode != OpMsg.MessageType.Debug)
//////                // This is the default, and I couldn't see a reason to write it to the DB...
//////                {
//////                    r[IDX_MSG_CD] = Enum.GetName(typeof(OpMsg.MessageType), oa.MessageCode);
//////                }

//////                // If executing in parallel, lock around this....
//////                dt.Rows.Add(r);

//////            }

//////            return dt;
//////        }
    }
}
