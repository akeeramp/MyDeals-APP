using System;
using System.Collections.Generic;
using System.Linq;
using Intel.Opaque;
using Intel.Opaque.Data;

namespace Intel.MyDeals.Entities
{
    public class MyDealsData : Dictionary<OpDataElementType, OpDataPacket<OpDataElementType>>
    {
        public MyDealsData() { }

        public MyDealsData(OpDataPacket<OpDataElementType> odp)
        {
            if (odp != null)
            {
                this[odp.PacketType] = odp;
            }
        }

        public MyDealsData(IEnumerable<OpDataPacket<OpDataElementType>> odps)
        {
            if (odps == null) return;
            foreach (var odp in odps.Where(odp => odp != null))
            {
                this[odp.PacketType] = odp;
            }
        }

        /// <summary>
        /// Ensure there is an opdatapacket for each of the known types
        /// </summary>
        public void InitAllPacketTypes()
        {
            foreach (OpDataElementType odt in Enum.GetValues(typeof(OpDataElementType)))
            {
                OpDataPacket<OpDataElementType> op;
                if (!TryGetValue(odt, out op))
                {
                    this[odt] = op = new OpDataPacket<OpDataElementType>
                    {
                        PacketType = odt
                    };
                }

                if (op == null) // It has a key of the type, but the value was null, new up here...
                {
                    this[odt] = new OpDataPacket<OpDataElementType>
                    {
                        PacketType = odt
                    };
                }
            }
        }

        /// <summary>
        /// Remove packets that have no data.
        /// </summary>
        public void RemoveEmptyPackets()
        {
            // Remove empty collectors...
            var removeItems = this
                .Where(kvp => !kvp.Value.HasData(true))
                .Select(kvp => kvp.Key)
                .ToArray();

            foreach (var key in removeItems)
            {
                Remove(key);
            }
        }

        public bool TryGetByBatch(Guid batchId, out OpDataPacket<OpDataElementType> odp)
        {
            odp = Values.FirstOrDefault(p => p.BatchID == batchId);
            return odp != null;
        }

        public OpDataElement[] GetInvalidModfied()
        {
            // && !de.IsValid()
            return this.SelectMany(kvp => kvp.Value.AllDataElements.Where(de => de.State == OpDataElementState.Modified)).ToArray();
        }

        public OpMsgQueue GetAllMessages()
        {
            OpMsgQueue ret = new OpMsgQueue();
            foreach (var pkt in Values)
            {
                ret.Merge(pkt.Messages);
            }
            return ret;
        }

        public OpMsgQueue GetAllNoDebugMessages()
        {
            OpMsgQueue ret = new OpMsgQueue();
            foreach (var pkt in Values)
            {
                ret.Merge(pkt.Messages, false);
            }
            return ret;
        }

    }



}
