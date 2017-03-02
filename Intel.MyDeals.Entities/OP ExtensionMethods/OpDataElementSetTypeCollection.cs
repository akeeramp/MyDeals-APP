using System.Collections.Generic;
using System.Linq;
using Intel.MyDeals.Entities;

namespace Intel.Opaque.Data
{
    public class OpDataElementSetTypeCollection
    {

        public OpDataElementSetTypeCollection(IEnumerable<OpDataElementSetTypeItem> collection, Dictionary<OpDataElementType, OpDataElementSetType> heirarchy)
        {
            Items = collection.ToList();
            Heirarchy = heirarchy;
        }

        public List<OpDataElementSetTypeItem> Items { get; set; }

        public Dictionary<OpDataElementType, OpDataElementSetType> Heirarchy { get; set; }
    }

}