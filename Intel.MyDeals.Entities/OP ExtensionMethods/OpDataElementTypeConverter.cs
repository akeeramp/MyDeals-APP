using System.Collections.Generic;
using System.Linq;
using Intel.Opaque.Data;
using Intel.Opaque.Tools;

namespace Intel.MyDeals.Entities
{

    public static class OpDataElementTypeConverter
    {
        // I know this violates the Opaque to DCS boundry, but hopefully by leaving this code here it will:
        // 1) Make it easier to keep the two lists in synch and 
        // 2) Provide a framework for other apps to do the same.
        // If needed, move to another namespace or assembly.
        private static readonly Dictionary<string, OpDataElementType> Data = new Dictionary<string, OpDataElementType>
        {
            { "DEAL", OpDataElementType.Deals},
            { "PREP", OpDataElementType.Secondary},
            { "PLI", OpDataElementType.Tertiary },
            { "GRP", OpDataElementType.Group},

            { "CNTRCT", OpDataElementType.Contract},
            { "PRC_ST", OpDataElementType.PricingStrategy},
            { "PRCNG", OpDataElementType.PricingTable},
            { "DRFT", OpDataElementType.WipDeals},

            { "ARCH", OpDataElementType.Archive},
            { "HIST", OpDataElementType.History},
            { "SNAP", OpDataElementType.Snapshot},
            { string.Empty, OpDataElementType.Unknown}
        };


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

            OpDataElementType ret;

            return Data.TryGetValue($"{strType}", out ret) ? ret : OpTypeConverter.ParseEnum(strType, OpDataElementType.Unknown);
        }

        /// <summary>
        /// Convert a OpDataElementType to a string of a known structure.
        /// </summary>
        /// <param name="en"></param>
        /// <returns></returns>
        public static string ToString(OpDataElementType en)
        {
            foreach (var itm in Data.Where(kvp => kvp.Value == en))
            {
                return itm.Key;
            }

            return string.Empty;
        }
    }
}
