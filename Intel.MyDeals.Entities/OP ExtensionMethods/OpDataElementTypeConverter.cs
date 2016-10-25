using System;
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
        private static Dictionary<string, OpDataElementType> _data = new Dictionary<string, OpDataElementType>
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
            { String.Empty, OpDataElementType.Unknown}
        };


        /// <summary>
        /// Convert a value into a OpDataElementType
        /// </summary>
        /// <param name="str_type">String representation of an OpDataElementType</param>
        /// <returns>Valid OpDataElementType or Unknown if not found.</returns>
        public static OpDataElementType FromString(object str_type)
        {
            if (str_type != null && str_type is OpDataElementType)
            {
                return (OpDataElementType)str_type;
            }

            OpDataElementType ret;

            if (_data.TryGetValue(String.Format("{0}", str_type), out ret))
            {
                return ret;
            }

            return OpTypeConverter.ParseEnum<OpDataElementType>(str_type, OpDataElementType.Unknown);
        }

        /// <summary>
        /// Convert a OpDataElementType to a string of a known structure.
        /// </summary>
        /// <param name="en"></param>
        /// <returns></returns>
        public static string ToString(OpDataElementType en)
        {
            foreach (var itm in _data.Where(kvp => kvp.Value == en))
            {
                return itm.Key;
            }

            return String.Empty;
        }
    }
}
