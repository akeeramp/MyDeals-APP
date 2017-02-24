using Intel.MyDeals.DataAccessLib;
using Intel.Opaque.Data;
using Intel.Opaque.DBAccess;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IDataLibrary;
using Intel.Opaque;
using Intel.Opaque.Tools;
using Procs = Intel.MyDeals.DataAccessLib.StoredProcedures.MyDeals;

namespace Intel.MyDeals.DataLibrary
{
    public partial class DataCollectorDataLib : IDataCollectorDataLib
    {

        /// <summary>
        /// Save deals and process all actions in the Action Queue
        /// </summary>
        /// <param name="packets">Packets to save.</param>
        /// <param name="opUserToken">User information for this save cycle</param>
        /// <param name="custId">Customer ID for this save cycle</param>
        /// <returns>Changed deals</returns>
        public MyDealsData SaveDeals(MyDealsData packets, OpUserToken opUserToken, int custId)
        {
            return SaveDeals(packets, opUserToken, custId, true);
        }


        private MyDealsData SaveDeals(MyDealsData packets, OpUserToken opUserToken, int custId, bool batchMode)
        {
            // Save Data Cycle: Point 15
            try
            {
                OpLogPerf.Log("DealDataLib.Save:SaveDeals - Start.");

                if (packets == null)
                {
                    throw new ArgumentException("packets parameter cannot be null");
                }

                IEnumerable<KeyValuePair<Guid, int>> groupCheck = null;

                try
                {
                    // Ensure Batch to PacketType is 1:1
                    groupCheck =
                    (
                        from p in packets.Values
                        group p by p.BatchID into g
                        select new KeyValuePair<Guid, int>
                        (
                            g.Key,
                            g.Select(itm => itm?.PacketType ?? OpDataElementType.Unknown).Distinct().Count()
                        )
                    )
                    .Where(grp => grp.Value > 1);
                }
                catch (Exception ex)
                {
                    OpLogPerf.Log(ex);
                }


                if (groupCheck != null && groupCheck.Any())
                {
                    throw new ArgumentException(string.Format(
                        "Error in passed saved deal packets.  Each Batch ID should correspond 1:1 with a Packet Type.  Batch \"{0}\" had {1} Packet Types associated with it, which is illegal.",
                        groupCheck.First().Key, groupCheck.First().Value));
                }

                // Process the packets in order
                var orderedPackets = GetPacketsInOrder(packets.Values);

                // Write them to dbo.MYDL_CL_WIP_ATRB
                ImportOpDataPackets(orderedPackets, opUserToken.Usr.WWID, custId);

                OpLogPerf.Log("DcsDealLib.SaveDeals - Exit ImportOpDataPackets.");

                // Get all the actions and process them in order
                MyDealsData ret = batchMode ? ActionDealsBatch(orderedPackets, opUserToken.Usr.WWID) : ActionDeals(orderedPackets);

                OpLogPerf.Log("DcsDealLib.SaveDeals - Exit ActionDeals.");

#if DEBUG
                // Dump random debugging log messsage into the first returned packet.
                if (ret != null && ret.Count > 0 && LogMessages.Count > 0)
                {
                    var firstPacket = ret.First().Value;
                    firstPacket?.Messages.Merge(LogMessages);
                }
#endif

                return ret;
            }
            catch (Exception ex)
            {
                OpLogPerf.Log(ex);

                // TODO: Take rollback actions here...
                // Or, wrap the above in a ADO transaction (see BulkLoadDealDataSetToWipTablesInTransaction)?
                throw;
            }
        }


        /// <summary>
        /// Write data packets and actions to dbo.MYDL_CL_WIP_ATRB and dbo.MYDL_CL_WIP_ACTN
        /// </summary>
        /// <param name="packets">Valid data packets.</param>
        /// <param name="wwid">User WWID to tag to operation.</param>
        /// <param name="custId">Customer ID to tag to operation.</param>
        private void ImportOpDataPackets(IEnumerable<OpDataPacket<OpDataElementType>> packets, int wwid, int custId)
        {
            // Save Data Cycle: Point 16

            if (packets == null) { return; }

            OpLogPerf.Log("DealDataLib.Save:ImportOpDataPackets - Start.");

            Guid groupBatchId = Guid.Empty;

            DataSet dsImport = new DataSet();

            // Create shell tables with proper schema...
            var dtData = OpDataPacketToImportDataTable(new OpDataPacket<OpDataElementType>(), custId, wwid);
            var dtAction = OpDataPacketToImportActionTable(new OpDataPacket<OpDataElementType>(), groupBatchId, wwid);

            foreach (var odp in packets.Where(p => p.PacketType == OpDataElementType.Group && OpTypeConverter.IsValidGuid(p.BatchID)))
            {
                if (groupBatchId != Guid.Empty && groupBatchId != odp.BatchID)
                {
                    throw new ArgumentException("Multiple non-distinct groups (workbooks) were passed to the save routine.  It is expected that each save call contains only one workbook of data.");
                }
                groupBatchId = odp.BatchID;
            }

            if (!OpTypeConverter.IsValidGuid(groupBatchId))
            {
                // So we can make sure all packets are always married together, if no valid group is in the set,
                // create a batch ID to tie them together.
                groupBatchId = Guid.NewGuid();
            }

            OpLogPerf.Log("DealDataLib.Save:ImportOpDataPackets - Begin DataTable Transformation.");

            // Convert each set of packets to data tables so we can bulk upload them.
            OpParallelWait.ForEach<OpDataPacket<OpDataElementType>>(packets, odp =>
            {
                // Insert Data First (attributes to stage table)...
                using (var dt = OpDataPacketToImportDataTable(odp, custId, wwid))
                {
                    if (dt != null && dt.Rows.Count > 0)
                    {
                        lock (dtData)
                        {
                            dtData.Merge(dt, true);
                        }
                    }
                }

                // Then Actions...
                using (var dta = OpDataPacketToImportActionTable(odp, groupBatchId, wwid))
                {
                    if (dta != null && dta.Rows.Count > 0)
                    {
                        lock (dtAction)
                        {
                            dtAction.Merge(dta);
                        }
                    }
                }
            });

            dsImport.Tables.Add(dtData); // Add the attributes table to the import data set
            dsImport.Tables.Add(dtAction); // Add the actions table to the import data set

#if DEBUG
            OpLogPerf.Log("DealDataLib.Save:ImportOpDataPackets - Begin BulkImportDataSet.");
            OpLogPerf.Log("DealDataLib.Save:ImportOpDataPackets - dtData.Rows: {0}.", dtData.Rows.Count);
            OpLogPerf.Log("DealDataLib.Save:ImportOpDataPackets - dtData.Rows: {0}.", dtAction.Rows.Count);
#endif

            // Bulk import all the data to DB...  This is the call that pushes all of the actions and attributes into the DB stage tables.
            (new DSOpDataPacketsToDatabase(DataAccess.ConnectionString)).BulkImportDataSet(dsImport);

            OpLogPerf.Log("DealDataLib.Save:ImportOpDataPackets - Begin PR_MYDL_TMP_TO_WIP_ATRB.");

            DataSet dsCheckConstraintErrors = null;
            try
            {
                // Move the data from dbo.MYDL_CL_WIP_ATRB_TMP to dbo.MYDL_CL_WIP_ATRB 
                DataAccess.ExecuteDataSet(new Procs.dbo.PR_MYDL_TMP_TO_WIP_ATRB()
                {
                    in_emp_wwid = wwid,
                    in_btch_ids = new type_guid_list(packets.Where(p => p.HasData(false)).Select(p => p.BatchID))
                }, null, out dsCheckConstraintErrors);
            }
            catch (Exception ex)
            {
                if (dsCheckConstraintErrors != null && dsCheckConstraintErrors.Tables.Count > 0)
                {
                    if (dsCheckConstraintErrors.Tables[0].Rows.Count > 0)
                    {
                        string data = String.Empty;
                        try
                        {
                            data = OpDbUtils.DataTableToString(dsCheckConstraintErrors.Tables[0]);
                        }
                        catch (Exception ex1)
                        {
                            OpLogPerf.Log(ex1);
                        }

                        if (!String.IsNullOrEmpty(data))
                        {
                            throw new AggregateException
                                (
                                new DataException
                                    (
                                    "\n\nConflict on merge.  This can be triggered by values being sent of an invalid data type (i.e. an integer passed as \"Hello World\") or no value passed (ATRB_VAL is missing) with an MDX_CD of Modified.\n\n"
                                    + data
                                    ),
                                ex
                                );
                        }
                    }
                }

                throw;
            }

            OpLogPerf.Log("DealDataLib.Save:ImportOpDataPackets - Done: deal.PR_MYDL_TMP_TO_WIP_ATRB.");
        }


        private MyDealsData ActionDealsBatch(IEnumerable<OpDataPacket<OpDataElementType>> packets, int wwid)
        {
            // Save Data Cycle: Point 20
#if DEBUG
            OpLogPerf.Log("DealDataLib.Save:ActionDealsBatch - Start: {0} Packets, {1} Elements, {2} Actions.",
                packets.Count(),
                packets.Select(p => p.AllDataElements.Count()).Sum(),
                packets.Select(p => p.Actions.Count()).Sum()
                );
#endif

            var guidList = new type_guid_list(packets.Select(p => p.BatchID));
            var ret = new MyDealsData();
            int? groupId = null;

            if (guidList.Rows.Count == 0)
            {
                return ret;
            }

            using (var rdr = DataAccess.ExecuteReader(new Procs.dbo.PR_MYDL_MNG_WIP_ACTNS
            {
                in_emp_wwid = wwid,
                in_btch_ids = guidList
            }))
            {
                OpLogPerf.Log("DealDataLib.Save:ActionDealsBatch - SP Complete, begin post processing.");

                ret = ReaderToDataCollectors(rdr, false);

                foreach (var srcPacket in packets)
                {
                    OpDataPacket<OpDataElementType> tgtPacket;
                    if (ret.TryGetValue(srcPacket.PacketType, out tgtPacket))
                    {
                        if (tgtPacket.BatchID == default(Guid) || tgtPacket.BatchID == Guid.Empty)
                        {
                            tgtPacket.BatchID = srcPacket.BatchID;
                        }
                    }
                }

                rdr.NextResult();

                ret.InitAllPacketTypes();

                while (rdr.Read())
                {
                    string ACTN_NM = String.Format("{0}", rdr[Entities.deal.MYDL_CL_WIP_ACTN.ACTN_NM]).ToUpper();
                    OpDataElementType objSet = int.Parse(rdr[Entities.deal.MYDL_CL_WIP_ACTN.OBJ_TYPE_SID].ToString()).IdToString();

                    if (objSet == OpDataElementType.Unknown || String.IsNullOrEmpty(ACTN_NM)) { continue; }

                    switch (ACTN_NM)
                    {
                        case DealSaveActionCodes.MESSAGE:
                            WriteMessage(ret[objSet], rdr);
                            break;
                        case DealSaveActionCodes.ID_CHANGE:
                            {
                                int newId = WriteIdChangeAction(ret[objSet], rdr);

                                if (groupId == null && objSet == OpDataElementType.Group && newId > 0) // WARNING: This is predicated on having only one group per processing!!!
                                {
                                    groupId = newId;
                                }

                                break;
                            }
                        case DealSaveActionCodes.ATRB_DELETED:
                        case DealSaveActionCodes.DEAL_DELETED:
                            {
                                WriteIDListAction(ret[objSet], rdr, OpMsg.MessageType.Info, ACTN_NM);
                                break;
                            }
                    }
                }

            }

            ret.RemoveEmptyPackets();

            if (groupId != null)
            {
                foreach (var gp in packets)
                {
                    gp.GroupID = (int)groupId;
                }
                foreach (var kvp in ret)
                {
                    kvp.Value.GroupID = (int)groupId;
                }
            }

            return ret;
        }


        /// <summary>
        /// Perform the requested actions for a deal
        /// </summary>
        /// <param name="packets">Packets with Actions</param>
        /// <returns>Changed Objects, Actions and Messages</returns>
        private MyDealsData ActionDeals(IEnumerable<OpDataPacket<OpDataElementType>> packets)
        {
            // To reduce the liklihood of infinite loops, track what we have procssed
            List<int> processedActions = new List<int>();
            var ret = new MyDealsData();
            int? groupId = null;

            foreach (var op in packets) // -- comes in sorted -- GetPacketsInOrder(packets))
            {
                OpLogPerf.Log("DealDataLib.Save:ActionDeals - Start: {0} '{1}'.", op.PacketType, op.BatchID);

                int? sort = null;
                DataTable dtActionResults;
                MyDealsData changes;
                bool isGroup = (op.PacketType == OpDataElementType.Group);

                while (TryNextAction(op.BatchID, ref processedActions, ref sort, out dtActionResults, out changes))
                {
                    OpLogPerf.Log("DealDataLib.Save:ActionDeals - Post Processing: {0} '{1}'.", op.PacketType, op.BatchID);

                    OpDataPacket<OpDataElementType> retPack;
                    if (!ret.TryGetValue(op.PacketType, out retPack))
                    {
                        ret[op.PacketType] = retPack = new OpDataPacket<OpDataElementType>
                        {
                            PacketType = op.PacketType,
                            BatchID = op.BatchID,
                            GroupID = op.GroupID
                        };
                    }

                    if (changes != null && changes.Count() > 0)
                    {
                        foreach (var kvp in changes)
                        {
                            if (!ret.TryGetValue(kvp.Key, out retPack))
                            {
                                ret[kvp.Key] = retPack = new OpDataPacket<OpDataElementType>
                                {
                                    PacketType = kvp.Key,
                                    BatchID = op.BatchID,
                                    GroupID = op.GroupID
                                };
                            }

                            retPack.Data.MergeRange(kvp.Value.AllDataCollectors);
                        }
                    }

                    if (dtActionResults == null || dtActionResults.Rows.Count <= 0)
                    {
                        continue;
                    }

                    // TODO: Make plug-in-able action handlers...
                    #region MESSAGE

                    OpLogPerf.Log("DealDataLib.Save:ActionDeals - Post Processing MESSAGE: {0} '{1}'.", op.PacketType, op.BatchID);

                    foreach (DataRow dr in dtActionResults.Select(String.Format("{0} = '{1}'", Entities.deal.MYDL_CL_WIP_ACTN.ACTN_NM, DealSaveActionCodes.MESSAGE)))
                    {
                        processedActions.Add((int)dr[Entities.deal.MYDL_CL_WIP_ACTN.WIP_ACTN_SID]);
                        WriteMessage(retPack, new DataRowRecordAdapter(dr));
                    }
                    #endregion

                    #region ID_CHANGE

                    OpLogPerf.Log("DealDataLib.Save:ActionDeals - Post Processing ID_CHANGE: {0} '{1}'.", op.PacketType, op.BatchID);

                    foreach (DataRow dr in dtActionResults.Select(String.Format("{0} = '{1}'", Entities.deal.MYDL_CL_WIP_ACTN.ACTN_NM, DealSaveActionCodes.ID_CHANGE)))
                    {
                        processedActions.Add((int)dr[Entities.deal.MYDL_CL_WIP_ACTN.WIP_ACTN_SID]);

                        int newId = WriteIdChangeAction(retPack, new DataRowRecordAdapter(dr));

                        if (newId > 0 && isGroup && groupId == null) // WARNING: This is predicated on having only one group per processing!!!
                        {
                            groupId = newId;
                        }
                    }

                    #endregion

                    #region ATRB_DELETED

                    OpLogPerf.Log("DealDataLib.Save:ActionDeals - Post Processing ATRB_DELETED: {0} '{1}'.", op.PacketType, op.BatchID);

                    foreach (DataRow dr in dtActionResults.Select(String.Format("{0} IN ('{1}','{2}')",
                        Entities.deal.MYDL_CL_WIP_ACTN.ACTN_NM,
                        DealSaveActionCodes.ATRB_DELETED,
                        DealSaveActionCodes.DEAL_DELETED
                    )))
                    {
                        processedActions.Add((int)dr[Entities.deal.MYDL_CL_WIP_ACTN.WIP_ACTN_SID]);
                        WriteIDListAction(retPack, new DataRowRecordAdapter(dr), OpMsg.MessageType.Info, (string)dr[Entities.deal.MYDL_CL_WIP_ACTN.ACTN_NM]);
                    }

                    #endregion
                }

                OpLogPerf.Log("DealDataLib.Save:ActionDeals - Done: {0} '{1}'.", op.PacketType, op.BatchID);
            }

            if (groupId != null)
            {
                foreach (var gp in packets)
                {
                    gp.GroupID = (int)groupId;
                }
                foreach (var kvp in ret)
                {
                    kvp.Value.GroupID = (int)groupId;
                }
            }

            return ret;
        }


        /// <summary>
        /// Perform a single action
        /// </summary>
        /// <param name="batchId">Batch to get action for</param>
        /// <param name="processedActions">Actions already processed to not do again</param>
        /// <param name="sort">Current sort index of sorted action order.</param>
        /// <param name="actionResults">Data Table wiht actions to perform</param>
        /// <param name="changedData">Data that has changed</param>
        /// <returns>True when actions were performed, else false.</returns>
        private bool TryNextAction(Guid batchId, ref List<int> processedActions, ref int? sort, out DataTable actionResults, out MyDealsData changedData)
        {
            actionResults = null;
            changedData = null;

            if (processedActions == null) { processedActions = new List<int>(); }

            OpLogPerf.Log("DcsDealLib.TryNextAction - DBO.PR_GET_WIP_ACTN '{0}'.", batchId);

            // Get the list of actions...
            var getActionCmd = new Procs.dbo.PR_GET_WIP_ACTN
            {
                BTCH_ID = batchId,
                CSL_DELETE_ACTN_SID = String.Join(",", processedActions),
                OMIT_ACTN_CD = String.Empty
            };

            //... after the last performed action
            if (sort != null)
            {
                getActionCmd.AFTER_SRT_ORD = (int)sort;
            }

            var dtact = DataAccess.ExecuteDataTable(getActionCmd);

            processedActions.Clear(); // The exec of PR_GET_WIP_ACTN would have deleted these actions from the DB...

            // No actions, move to next packet.
            if (dtact == null || dtact.Rows.Count == 0)
            {
                return false;
            }

            int? actionId = null;
            string actionCode = String.Empty;

            foreach (DataRow dr in dtact.Rows)
            {
                if (dr.IsNull(Entities.deal.MYDL_CL_WIP_ACTN.WIP_ACTN_SID)) { continue; }

                actionId = (int)dr[Entities.deal.MYDL_CL_WIP_ACTN.WIP_ACTN_SID];

                // If we have already processed this action, skip it (infinite loop management)
                if (processedActions.Contains((int)actionId))
                {
                    actionId = null;
                    continue;
                }

                sort = dr.IsNull(Entities.deal.MYDL_CL_WIP_ACTN.WIP_ACTN_SID)
                    ? null
                    : (int?)dr[Entities.deal.MYDL_CL_WIP_ACTN.SRT_ORD];

#if DEBUG
                actionCode = String.Format("{0}", dr[Entities.deal.MYDL_CL_WIP_ACTN.ACTN_NM]);
#endif
                break;
            }

            if (actionId != null)
            {

                OpLogPerf.Log(
                    "Processing Action. {0} for {1} @ {2}",
                    actionCode,
                    batchId,
                    sort
                    );

                OpLogPerf.Log("DcsDealLib.TryNextAction - DBO.PR_GET_WIP_ACTN '{0}', {1}.", batchId, actionId);

                // Actually do the action
                // TODO - Bring this back in...
                var doActionCmd = new Procs.dbo.PR_MANAGE_WIP_ACTN
                {
                    BTCH_ID = batchId,
                    WIP_ACTN_SID = (int)actionId
                };

                using (var rdr = DataAccess.ExecuteReader(doActionCmd))
                {
                    changedData = this.ReaderToDataCollectors(rdr, false);

                    rdr.NextResult();

                    actionResults = (new DataReaderHelper()).ToDataTable(rdr);
                }

                processedActions.Add((int)actionId);

                return true;
            }

            return false;
        }


        private void WriteMessage(OpDataPacket<OpDataElementType> odp, IDataRecord record)
        {
            var m = new OpMsg
            {
                LogTime = (DateTime)record[Entities.deal.MYDL_CL_WIP_ACTN.CHG_DTM],
                MsgType = OpMsg.ParseMessageType(record[Entities.deal.MYDL_CL_WIP_ACTN.MSG_CD]),
                Message = String.Format("{0}", record[Entities.deal.MYDL_CL_WIP_ACTN.ACTN_VAL_LIST])
            };

            List<int> msgIds = new List<int>();
            if (!record.IsDBNull(record.GetOrdinal(Entities.deal.MYDL_CL_WIP_ACTN.OBJ_SID)))
            {
                msgIds.Add((int)record[Entities.deal.MYDL_CL_WIP_ACTN.OBJ_SID]);
            }
            else if (!record.IsDBNull(record.GetOrdinal(Entities.deal.MYDL_CL_WIP_ACTN.OLD_OBJ_SID)))
            {
                msgIds.Add((int)record[Entities.deal.MYDL_CL_WIP_ACTN.OLD_OBJ_SID]);
            }
            m.KeyIdentifiers = msgIds.ToArray();

            // For Ecap Validation, we expect a result set back that contains some details, look for it...
            // but to make this fairly generic, just look for the value having something that looks like XML...
            // Example clause to include on query to return results
            // FOR XML PATH('MY_DATA_TABLE_NAME'), TYPE

            //string xmlDataSet = String.Format("{0}", record[Entities.deal.WIP_ACTN.XML_DATA]);

            // TODO: See if XMLData changed into something like MSG_CD
            //if (!String.IsNullOrEmpty(xmlDataSet) && xmlDataSet.IndexOf('<') < xmlDataSet.LastIndexOf('>'))
            //{
            //    try
            //    {
            //        DataSet ds = new DataSet();
            //        using (StringReader sr = new StringReader(String.Format("<{0}>{1}</{0}>", OpMsg.EXTRA_DETAILS_DATA_SET_NAME, xmlDataSet)))
            //        {
            //            ds.ReadXml(sr);
            //        }

            //        if (ds != null && ds.Tables.Count > 0)
            //        {
            //            m.ExtraDetails = ds;
            //        }
            //    }
            //    catch (Exception ex)
            //    {
            //        m.DebugMessage = String.Format("{0}\n\n{1}", ex, xmlDataSet);
            //    }
            //}


            odp.Messages.Write(m);
        }


        private int WriteIdChangeAction(OpDataPacket<OpDataElementType> odp, IDataRecord record)
        {
            object ooid = record[Entities.deal.MYDL_CL_WIP_ACTN.OLD_OBJ_SID];
            object noid = record[Entities.deal.MYDL_CL_WIP_ACTN.OBJ_SID];

            int oldId = (ooid == null || ooid == DBNull.Value) ? 0 : (int)ooid;
            int newId = (noid == null || noid == DBNull.Value) ? 0 : (int)noid;

            if (newId != 0 && oldId != newId)
            {
                odp.Actions.Add(new OpDataAction
                {
                    Action = DealSaveActionCodes.ID_CHANGE,
                    DcID = oldId,
                    AltID = newId,
                    Value = String.Format("{0}", record[Entities.deal.MYDL_CL_WIP_ACTN.OBJ_TYPE_SID]),
                    MessageCode = OpMsg.MessageType.Info
                });
            }

            return newId;
        }


        private void WriteIDListAction(OpDataPacket<OpDataElementType> odp, IDataRecord record, OpMsg.MessageType msgType, string actnNm)
        {
            var intIds = OpTypeConverter.StringToIntList(String.Format("{0}", record[Entities.deal.MYDL_CL_WIP_ACTN.ACTN_VAL_LIST]));
            if (intIds.Count() == 0) { return; }

            var oda = new OpDataAction
            {
                Action = actnNm,
                MessageCode = msgType,
                TargetDcIDs = intIds.ToList()
            };

            int idx = record.GetOrdinal(Entities.deal.MYDL_CL_WIP_ACTN.OBJ_SID);

            if (idx > -1 && !record.IsDBNull(idx))
            {
                oda.DcID = record.GetInt32(idx);
            }
            idx = record.GetOrdinal(Entities.deal.MYDL_CL_WIP_ACTN.OLD_OBJ_SID);
            if (idx > -1 && !record.IsDBNull(idx))
            {
                oda.AltID = record.GetInt32(idx);
            }
            idx = record.GetOrdinal(Entities.deal.MYDL_CL_WIP_ACTN.ACTN_VAL_LIST);
            if (idx > -1 && !record.IsDBNull(idx))
            {
                oda.Value = record.GetString(idx);
            }

            odp.Actions.Add(oda);
        }

    }
}
