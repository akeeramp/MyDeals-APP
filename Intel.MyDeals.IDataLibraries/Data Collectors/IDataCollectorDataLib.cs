using System;
using System.Collections.Generic;
using Intel.MyDeals.Entities;
using Intel.Opaque.Data;

namespace Intel.MyDeals.IDataLibrary
{
    public partial interface IDataCollectorDataLib
    {
        TemplateWrapper GetTemplateData();
        MyDealsData GetByIDs(OpDataElementType opDataElementType, IEnumerable<int> ids);
        MyDealsData GetByIDs(OpDataElementType opDataElementType, IEnumerable<int> ids, List<OpDataElementType> includeTypes);
        MyDealsData GetByIDs(OpDataElementType opDataElementType, IEnumerable<int> ids, List<OpDataElementType> includeTypes, IEnumerable<string> atrbs);
    }
}