using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Intel.MyDeals.Entities;

namespace Intel.MyDeals.IDataLibrary
{
    public interface ITimelineDataLib
    {
        List<Timeline> GetTimelineDetails(int id);
        
    }
}
