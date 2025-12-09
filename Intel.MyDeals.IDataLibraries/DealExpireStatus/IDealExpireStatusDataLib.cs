using Intel.MyDeals.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Intel.MyDeals.IDataLibraries
{
    public interface IDealExpireStatusDataLib
    {
        List<InActvDeals> GetDealExpireStatus(int contractid);
    }
}
