using System;
using System.Collections.Generic;
using System.Linq;
using Intel.MyDeals.Entities;

namespace Intel.Opaque.Data
{
    public class OpDataElementSetTypeCollection
    {

        public OpDataElementSetTypeCollection(IEnumerable<OpDataElementSetTypeItem> collection, Dictionary<OpDataElementType, List<OpDataElementSetType>> heirarchy)
        {
            Items = collection.ToList();
            Heirarchy = heirarchy;
        }

        public List<OpDataElementSetTypeItem> Items { get; set; }

        public Dictionary<OpDataElementType, List<OpDataElementSetType>> Heirarchy { get; set; }

        public List<OpDataElementTypeMapping> OpDataElementTypeMappings
        {
            get
            {
                return new List<OpDataElementTypeMapping>
                {
                    new OpDataElementTypeMapping(OpDataElementType.PRC_TBL_ROW, OpDataElementSetType.ECAP, OpDataElementType.WIP_DEAL, OpDataElementSetType.ECAP, OpTranslationType.OneDealPerProduct),
                    new OpDataElementTypeMapping(OpDataElementType.PRC_TBL_ROW, OpDataElementSetType.PROGRAM, OpDataElementType.WIP_DEAL, OpDataElementSetType.PROGRAM, OpTranslationType.OneDealPerRow),
                    new OpDataElementTypeMapping(OpDataElementType.PRC_TBL_ROW, OpDataElementSetType.VOL_TIER, OpDataElementType.WIP_DEAL, OpDataElementSetType.VOL_TIER, OpTranslationType.OneDealPerRow),
                    new OpDataElementTypeMapping(OpDataElementType.PRC_TBL_ROW, OpDataElementSetType.CAP_BAND, OpDataElementType.WIP_DEAL, OpDataElementSetType.CAP_BAND, OpTranslationType.OneDealPerRow)
                };
            }
            set {}
        }
    }
}