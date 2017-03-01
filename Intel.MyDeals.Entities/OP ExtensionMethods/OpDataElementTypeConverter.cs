using System.Collections.Generic;
using System.Linq;

namespace Intel.MyDeals.Entities
{
    public static class OpDataElementTypeConverter
    {

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

            return OpDataElementTypeRepository.OpDetCollection.Items.FirstOrDefault(o => o.OpDeType.ToString() == $"{strType}" || o.Alias == $"{strType}")?.OpDeType ?? OpDataElementType.Unknown;
        }


        public static int ToId(this OpDataElementType opDataElementType)
        {
            return OpDataElementTypeRepository.OpDetCollection.Items.FirstOrDefault(o => o.OpDeType == opDataElementType)?.Id ?? 0;
        }

        public static string ToAlias(this OpDataElementType opDataElementType)
        {
            return OpDataElementTypeRepository.OpDetCollection.Items.FirstOrDefault(o => o.OpDeType == opDataElementType)?.Alias ?? "";
        }

        public static OpDataElementType IdToString(this int packetId)
        {
            return OpDataElementTypeRepository.OpDetCollection.Items.FirstOrDefault(o => o.Id == packetId)?.OpDeType ?? OpDataElementType.Unknown;
        }

        public static int StringToId(string packetName)
        {
            return OpDataElementTypeRepository.OpDetCollection.Items.FirstOrDefault(o => o.OpDeType.ToString() == packetName)?.Id ?? 0;
        }

        public static OpDataElementType GetParent(this OpDataElementType opDataElementType)
        {
            return OpDataElementTypeRepository.OpDetCollection.Heirarchy.Where(o => o.Value == opDataElementType).Select(o => o.Key).FirstOrDefault();
        }

        public static IEnumerable<OpDataElementType> GetChildren(this OpDataElementType opDataElementType)
        {
            return OpDataElementTypeRepository.OpDetCollection.Heirarchy.Where(o => o.Key == opDataElementType).Select(o => o.Value);
        }

        public static OpDataElementType GetFirstChild(this OpDataElementType opDataElementType)
        {
            return opDataElementType.GetChildren().FirstOrDefault();
        }

    }
}
