using System.Linq;
using Intel.Opaque.Data;

namespace Intel.MyDeals.Entities
{
    public static class OpDataPacketExtensionMethods
    {
        public static bool IsValidForSave(this OpDataPacket<OpDataElementType> odp, AttributeCollection attributeCollection)
        {
            // If any element is not valid, it should fail.
            return odp != null && odp.AllDataElements.All(de => de.IsValid(attributeCollection));
        }

    }
}
