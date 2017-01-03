using Intel.MyDeals.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Intel.MyDeals.IBusinessLogic
{
    public interface ICacheLib
    {
        bool ClearCache();

        IEnumerable<CacheItem> CheckCache();

        bool ClearCache(string fieldName);

        bool LoadCache();

        bool LoadCache(string fieldName);

        object ViewCache(string fieldName);
    }
}
