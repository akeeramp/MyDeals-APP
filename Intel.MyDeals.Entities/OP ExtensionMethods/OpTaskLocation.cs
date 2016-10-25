using System.Runtime.Serialization;

namespace Intel.MyDeals.Entities
{
    [DataContract]
    public enum OpTaskLocation
    {
        [EnumMember]
        Rules = 100,
        [EnumMember]
        ServiceCall = 200,
        [EnumMember]
        Db = 300
    }
}
