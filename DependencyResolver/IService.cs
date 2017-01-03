using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Intel.MyDeals.DependencyResolver
{
    public interface IService
    {
        void SetUp(IRegisterService registerComponent);
    }
}
