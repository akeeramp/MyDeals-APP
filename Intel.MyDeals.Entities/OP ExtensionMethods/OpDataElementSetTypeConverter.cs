using System.Collections.Generic;
using System.Linq;

namespace Intel.MyDeals.Entities
{
    public static class OpDataElementSetTypeConverter
    {

        /// <summary>
        /// Convert a value into a OpDataElementSetType
        /// </summary>
        /// <param name="strType">String representation of an OpDataElementSetType</param>
        /// <returns>Valid OpDataElementSetType or Unknown if not found.</returns>
        public static OpDataElementSetType FromString(object strType)
        {
            if (strType is OpDataElementSetType)
            {
                return (OpDataElementSetType)strType;
            }

            return OpDataElementSetTypeRepository.OpDestCollection.Items.FirstOrDefault(o => o.OpDeSetType.ToString() == $"{strType}" || o.Alias == $"{strType}")?.OpDeSetType ?? OpDataElementSetType.Unknown;
        }


        public static int ToId(this OpDataElementSetType opDataElementSetType)
        {
            return OpDataElementSetTypeRepository.OpDestCollection.Items.FirstOrDefault(o => o.OpDeSetType == opDataElementSetType)?.Id ?? 0;
        }

        public static string ToAlias(this OpDataElementSetType opDataElementSetType)
        {
            return OpDataElementSetTypeRepository.OpDestCollection.Items.FirstOrDefault(o => o.OpDeSetType == opDataElementSetType)?.Alias ?? "";
        }

        public static OpDataElementSetType IdToOpDataElementSetTypeString(this int packetId)
        {
            return OpDataElementSetTypeRepository.OpDestCollection.Items.FirstOrDefault(o => o.Id == packetId)?.OpDeSetType ?? OpDataElementSetType.Unknown;
        }

        public static int StringToId(string packetName)
        {
            return OpDataElementSetTypeRepository.OpDestCollection.Items.FirstOrDefault(o => o.OpDeSetType.ToString() == packetName)?.Id ?? 0;
        }

        public static OpDataElementType GetParent(this OpDataElementSetType opDataElementSetType)
        {
            return OpDataElementSetTypeRepository.OpDestCollection.Heirarchy.Where(o => o.Value.Contains(opDataElementSetType)).Select(o => o.Key).FirstOrDefault();
        }

        public static IEnumerable<OpDataElementSetType> GetChildrenSetTypes(this OpDataElementType opDataElementType)
        {
            return OpDataElementSetTypeRepository.OpDestCollection.Heirarchy.Where(o => o.Key == opDataElementType).Select(o => o.Value).FirstOrDefault();
        }

        public static OpDataElementSetType GetFirstChildSetType(this OpDataElementType opDataElementType)
        {
            return opDataElementType.GetChildrenSetTypes().FirstOrDefault();
        }

    }
}