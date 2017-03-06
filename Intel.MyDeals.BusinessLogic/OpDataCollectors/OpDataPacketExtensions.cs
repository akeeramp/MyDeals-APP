using System.Collections.Generic;
using Intel.MyDeals.Entities;
using Intel.Opaque.Data;

namespace Intel.MyDeals.BusinessLogic
{
    public static class OpDataPacketExtensions
    {

        public static Dictionary<int, string> GetProductMapping(this OpDataPacket<OpDataElementType> packet)
        {
            Dictionary<int, string> prdMaps = new Dictionary<int, string>();
            // TODO need to revisit once product structure is defined
            //if (dealIds == null || !dealIds.Any()) dealIds = packet.AllDataCollectors.Select(d => d.DcAltID).ToList();
            //List<DcsDealProduct> prds = new ProductDataLib().GetDealPrds(dealIds.ToArray());
            //foreach (DcsDealProduct prd in prds)
            //{
            //    prdMaps[prd.PRD_MBR_SID] = prd.DisplayName;
            //}
            return prdMaps;
        }




    }
}
