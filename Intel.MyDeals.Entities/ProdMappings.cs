using System;
using System.Collections.Generic;

namespace Intel.MyDeals.Entities
{
    [Serializable]
    public class ProdMappings : Dictionary<string, IEnumerable<ProdMapping>>
    {
    }
}
