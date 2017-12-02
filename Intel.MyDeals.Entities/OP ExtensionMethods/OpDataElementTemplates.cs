using System;
using System.Collections.Generic;
using Intel.Opaque.Data;

namespace Intel.MyDeals.Entities
{
    [Serializable]
    public class OpDataElementTemplates : Dictionary<string, List<OpDataElement>>
    {
        public OpDataElementTemplates()
        {
        }

    }
}