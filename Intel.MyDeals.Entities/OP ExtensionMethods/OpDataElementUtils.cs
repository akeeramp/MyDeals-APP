using System;
using System.Linq;
using Intel.MyDeals.Entities;
using Intel.Opaque.Data;

namespace Intel.Opaque.DataElement
{
    public class OpDataElementUtils
    {
        private OpMsgQueue MergeMessages(OpDataPacket<OpDataElementType> into, OpDataPacket<OpDataElementType> from)
        {
            OpMsgQueue ret = new OpMsgQueue();

            if (into == null && from == null)
            {
                return ret;
            }

            if (into != null && ret.Messages != null)
            {
                ret = into.Messages;
            }

            if (@from?.Messages != null && @from.Messages.Count > 0)
            {
                ret.Merge(from.Messages);
            }

            return ret;
        }

        //public void UpdateChangedPackets(OpDataPacket<OpDataElementType> target, OpDataPacket<OpDataElementType> source)
        //{
        //    throw new Exception("This function is untested... If you use it, review the code and test.");

        //    if (target == null) { return; }
        //    if (source == null) { return; }

        //    target.Messages = MergeMessages(target, source);

        //    // Updates
        //    var merge = from src in source.AllDataElements
        //                join tgt in target.AllDataElements
        //                on src.ElementID equals tgt.ElementID
        //                select new
        //                {
        //                    souce_el = src,
        //                    target_el = tgt
        //                };

        //    foreach (var pair_el in merge)
        //    {
        //        pair_el.target_el.AtrbValue = pair_el.souce_el.AtrbValue;
        //        pair_el.target_el.State = OpDataElementState.Updated;
        //    }

        //    var target_ids = target
        //        .AllDataElements
        //        .Select(de => de.ElementID);

        //    // Add new elements added
        //    target.Data.AddRange(
        //        source.AllDataElements.Where(de => !target_ids.Contains(de.ElementID))
        //        );
        //}

        public void ProcessIDChange(OpDataPacket<OpDataElementType> odp)
        {
            //throw new Exception("This function is untested... If you use it, review the code and test.");

            if (odp == null || odp.Actions.Count == 0) { return; }

            foreach (var act in odp.Actions.Where(a => a.Action == DealSaveActionCodes.ID_CHANGE && a.DcID != null && a.AltID != null))
            {
                int new_id = (int)act.DcID; // New id
                int old_id = (int)act.AltID; // Old (-xx) id, but for DEAL (primary), the PREP_ID
                OpDataElementType id_change_target = OpDataElementTypeConverter.FromString(act.Value);

                if (id_change_target == OpDataElementType.Deals)
                {
                    // Since deals are already keyed at PREP, don't need to loop over collectors, just do elements.
                    foreach (var de in odp.AllDataElements.Where(item => item.DcID == old_id))
                    {
                        de.DcID = new_id;
                        de.State = OpDataElementState.Updated;
                    }
                }
                else
                {
                    foreach (var dc in odp.AllDataCollectors.Where(item => item.DcID == old_id))
                    {
                        dc.DcID = new_id;
                        foreach (var de in dc.DataElements)
                        {
                            // What about deal and prep...
                            de.DcID = new_id;
                            de.DcID = (old_id > 0)
                                ? old_id // If the secondary passed the deal ID, set it here.
                                : 0;
                            de.State = OpDataElementState.Updated;
                        }

                        if (old_id != new_id)
                        {
                            // An then re-key the dictionary to have it keyed by the new IDs
                            OpDataCollector dc2;
                            if (odp.Data.TryGetValue(old_id, out dc2))
                            {
                                odp.Data[new_id] = dc2;
                                odp.Data.Remove(old_id);
                            }
                        }
                    } // For Each Data Collector
                } // if id_change_target
            } // Foreach Action
        }

    }
}
