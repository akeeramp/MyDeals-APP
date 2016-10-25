using System.Web.Routing;

namespace Intel.MyDeals.App
{
    public class ErrorControllerContent
    {
        public string CurrentController { get; set; } 
        public string CurrentAction { get; set; }
        public RequestContext RequestContext { get; set; }
    }
}
