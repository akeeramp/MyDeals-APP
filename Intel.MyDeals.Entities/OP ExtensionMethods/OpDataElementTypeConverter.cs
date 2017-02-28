using System.Collections.Generic;
using System.Linq;
using Intel.Opaque.Data;

namespace Intel.MyDeals.Entities
{

    public static class OpDataElementTypeConverter
    {
        // I know this violates the Opaque to DCS boundry, but hopefully by leaving this code here it will:
        // 1) Make it easier to keep the two lists in synch and 
        // 2) Provide a framework for other apps to do the same.
        // If needed, move to another namespace or assembly.
        //private static readonly Dictionary<string, OpDataElementType> Data = new Dictionary<string, OpDataElementType>
        //{
        //    { "DEAL", OpDataElementType.Deals},
        //    { "PREP", OpDataElementType.Secondary},
        //    { "PLI", OpDataElementType.Tertiary },
        //    { "GRP", OpDataElementType.Group},

        //    //{ "1", OpDataElementType.Contract},
        //    //{ "2", OpDataElementType.PricingStrategy},
        //    //{ "3", OpDataElementType.PricingTable},
        //    { "CNTRCT", OpDataElementType.Contract},
        //    { "PRC_ST", OpDataElementType.PricingStrategy},
        //    { "PRCNG", OpDataElementType.PricingTable},

        //    { "DRFT", OpDataElementType.WipDeals},

        //    { "ARCH", OpDataElementType.Archive},
        //    { "HIST", OpDataElementType.History},
        //    { "SNAP", OpDataElementType.Snapshot},
        //    { string.Empty, OpDataElementType.Unknown}
        //};


        private static readonly OpDataElementTypeCollection OpDetCollection = new OpDataElementTypeCollection(
            new List<OpDataElementTypeItem>
            {
                new OpDataElementTypeItem { Id = 1, OpDeType = OpDataElementType.Contract, Alias = "CNTRCT", Order = 10 },
                new OpDataElementTypeItem { Id = 2, OpDeType = OpDataElementType.PricingStrategy, Alias = "PRC_ST", Order = 20 },
                new OpDataElementTypeItem { Id = 3, OpDeType = OpDataElementType.PricingTable, Alias = "PRC_TBL", Order = 30 },
                new OpDataElementTypeItem { Id = 4, OpDeType = OpDataElementType.PricingTableRow, Alias = "PRC_TBL_ROW", Order = 40 },
                //new OpDataElementTypeItem { Id = 6, OpDeType = OpDataElementType.PricingTableRow, Alias = "PRCNG_ROW", Order = 50 },
                new OpDataElementTypeItem { Id = 5, OpDeType = OpDataElementType.WipDeals, Alias = "DRFT", Order = 50 },
                new OpDataElementTypeItem { Id = 6, OpDeType = OpDataElementType.Deals, Alias = "DEAL", Order = 60 }
            },
            new Dictionary<OpDataElementType, OpDataElementType>
            {
                [OpDataElementType.Contract] = OpDataElementType.PricingStrategy,
                [OpDataElementType.PricingStrategy] = OpDataElementType.PricingTable,
                [OpDataElementType.PricingTable] = OpDataElementType.PricingTableRow,
                [OpDataElementType.PricingTableRow] = OpDataElementType.WipDeals,
                [OpDataElementType.WipDeals] = OpDataElementType.Unknown,
                [OpDataElementType.Deals] = OpDataElementType.Unknown,
            }
        );

        /// <summary>
        /// Convert a value into a OpDataElementType
        /// </summary>
        /// <param name="strType">String representation of an OpDataElementType</param>
        /// <returns>Valid OpDataElementType or Unknown if not found.</returns>
        public static OpDataElementType FromString(object strType)
        {
            if (strType is OpDataElementType)
            {
                return (OpDataElementType)strType;
            }

            return OpDetCollection.Items.FirstOrDefault(o => o.OpDeType.ToString() == $"{strType}" || o.Alias == $"{strType}")?.OpDeType ?? OpDataElementType.Unknown;
        }


        public static int ToId(this OpDataElementType opDataElementType)
        {
            return OpDetCollection.Items.FirstOrDefault(o => o.OpDeType == opDataElementType)?.Id ?? 0;
        }

        public static string ToAlias(this OpDataElementType opDataElementType)
        {
            return OpDetCollection.Items.FirstOrDefault(o => o.OpDeType == opDataElementType)?.Alias ?? "";
        }

        public static OpDataElementType IdToString(this int packetId)
        {
            return OpDetCollection.Items.FirstOrDefault(o => o.Id == packetId)?.OpDeType ?? OpDataElementType.Unknown;
        }

        public static int StringToId(string packetName)
        {
            return OpDetCollection.Items.FirstOrDefault(o => o.OpDeType.ToString() == packetName)?.Id ?? 0;
        }

        public static OpDataElementType GetParent(this OpDataElementType opDataElementType)
        {
            return OpDetCollection.Heirarchy.Where(o => o.Value == opDataElementType).Select(o => o.Key).FirstOrDefault();
        }

        public static IEnumerable<OpDataElementType> GetChildren(this OpDataElementType opDataElementType)
        {
            return OpDetCollection.Heirarchy.Where(o => o.Key == opDataElementType).Select(o => o.Value);
        }

        public static OpDataElementType GetFirstChild(this OpDataElementType opDataElementType)
        {
            return opDataElementType.GetChildren().FirstOrDefault();
        }
    }
}
