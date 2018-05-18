using System.Web;
using System.Web.Mvc;

namespace Intel.MyDeals
{
    public class FilterConfig
    {
        public static void RegisterGlobalFilters(GlobalFilterCollection filters)
        { 
            filters.Add(new HandleErrorAttribute());
        }
    }
}
