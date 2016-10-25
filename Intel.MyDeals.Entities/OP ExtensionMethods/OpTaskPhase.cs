using System.Runtime.Serialization;

namespace Intel.MyDeals.Entities
{
    [DataContract]
    public enum OpTaskPhase
    {
        [EnumMember]
        PreTask = 100,
        [EnumMember]
        PerformTask = 200,
        [EnumMember]
        PostTask = 300
    }
}
