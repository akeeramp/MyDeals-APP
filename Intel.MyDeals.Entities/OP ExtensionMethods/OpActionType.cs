using System.Runtime.Serialization;

namespace Intel.MyDeals.Entities
{
    [DataContract]
    public enum OpActionType
    {
        [EnumMember]
        Save = 1000,
        [EnumMember]
        SyncDeal = 2000,
        [EnumMember]
        Action = 3000
    }
}
