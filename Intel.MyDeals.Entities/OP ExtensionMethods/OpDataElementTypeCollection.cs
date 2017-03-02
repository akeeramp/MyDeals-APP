using System.Collections.Generic;
using System.Linq;
using Intel.MyDeals.Entities;

namespace Intel.Opaque.Data
{
    public class OpDataElementTypeCollection
    {

        public OpDataElementTypeCollection(IEnumerable<OpDataElementTypeItem> collection, Dictionary<OpDataElementType, OpDataElementType> heirarchy)
        {
            Items = collection.ToList();
            Heirarchy = heirarchy;
        }

        public List<OpDataElementTypeItem> Items { get; set; }

        public Dictionary<OpDataElementType, OpDataElementType> Heirarchy { get; set; }
    }
}