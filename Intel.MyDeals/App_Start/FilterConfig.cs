using System.Web;
using System.Web.Mvc;

namespace Intel.MyDeals
{
    public class FilterConfig
    {
        public static void RegisterGlobalFilters(GlobalFilterCollection filters)
        {
            // TODO::TJE temporary checkin to debug 500 error
            //filters.Add(new HandleErrorAttribute());
        }
    }
}
