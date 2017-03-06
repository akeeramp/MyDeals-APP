using System;
using System.Collections.Generic;
using Intel.MyDeals.Entities;
using Intel.Opaque.Data;

namespace Intel.MyDeals.IDataLibrary
{
    public partial interface IOpDataCollectorDataLib
    {
        TemplateWrapper GetTemplateData();
        MyDealsData GetByIDs(OpDataElementType opDataElementType, IEnumerable<int> ids, List<OpDataElementType> includeTypes, IEnumerable<string> atrbs);
    }
}