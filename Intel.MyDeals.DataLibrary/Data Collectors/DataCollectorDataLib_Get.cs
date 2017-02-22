using Intel.MyDeals.DataAccessLib;
using Intel.Opaque.Data;
using Intel.Opaque.DBAccess;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using Intel.MyDeals.DataAccessLib.StoredProcedures.MyDeals.dbo;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IDataLibrary;
using Intel.Opaque;
using Intel.Opaque.DataElement;
using Intel.Opaque.Tools;
using Procs = Intel.MyDeals.DataAccessLib.StoredProcedures.MyDeals;


namespace Intel.MyDeals.DataLibrary
{
    public partial class DataCollectorDataLib
    {

        #region Get By Ids

        public MyDealsData GetByIDs(OpDataElementType opDataElementType, IEnumerable<int> ids)
        {
            return GetByIDs(opDataElementType, ids, new List<OpDataElementType> { opDataElementType }, new List<string>());
        }

        public MyDealsData GetByIDs(OpDataElementType opDataElementType, IEnumerable<int> ids, List<OpDataElementType> includeTypes)
        {
            return GetByIDs(opDataElementType, ids, includeTypes, new List<string>());
        }

        public MyDealsData GetByIDs(OpDataElementType opDataElementType, IEnumerable<int> ids, List<OpDataElementType> includeTypes, IEnumerable<string> atrbs)
        {
            // Load Data Cycle: Point 3

            string strInc = "*";
            //string searchGroup = opDataElementType.ToString();

            if (includeTypes != null && includeTypes.Any())
            {
                strInc = String.Join(",", includeTypes.Select(OpDataElementTypeConverter.ToString).Distinct());
            }

            //// TODO change SP to match naming conventions
            //// --'CNTRCT, PRC_ST, PRCNG, WIP_DEAL, DEAL'
            strInc = strInc.Replace(OpDataElementType.Contract.ToString(), "CNTRCT");
            strInc = strInc.Replace(OpDataElementType.PricingStrategy.ToString(), "PRC_ST");
            strInc = strInc.Replace(OpDataElementType.PricingTable.ToString(), "PRCNG");
            strInc = strInc.Replace(OpDataElementType.WipDeals.ToString(), "WIP_DEAL");
            strInc = strInc.Replace(OpDataElementType.Deals.ToString(), "DEAL");

            //searchGroup = searchGroup.Replace(OpDataElementType.Contract.ToString(), "CNTRCT");
            //searchGroup = searchGroup.Replace(OpDataElementType.PricingStrategy.ToString(), "PRC_ST");
            //searchGroup = searchGroup.Replace(OpDataElementType.PricingTable.ToString(), "PRCNG");
            //searchGroup = searchGroup.Replace(OpDataElementType.WipDeals.ToString(), "WIP_DEAL");
            //searchGroup = searchGroup.Replace(OpDataElementType.Deals.ToString(), "DEAL");


            var cmd = new PR_MYDL_GET_OBJS_BY_SIDS() // PR_GET_OBJS_BY_KEYS in original case, new PR_GET_OBJS_BY_SIDS()
            {
                in_emp_wwid = 10548414, //applySecurity ? OpUserStack.MyOpUserToken.Usr.WWID : 0,
                //APPLY_SECURITY = applySecurity,
                in_obj_type = "CNTRCT",
                in_include_groups = strInc,
                //SRCH_GRP = searchGroup,
                in_obj_sids = new type_int_list(ids.ToArray())
            };

            //////string[] aAtrbs = atrbs as string[] ?? atrbs.ToArray();
            //////if (atrbs != null && aAtrbs.Any())
            //////{
            //////    cmd.DEAL_SIDS = new type_list(aAtrbs.ToArray());
            //////}
            //////cmd.CONTRACT_SIDS = new type_int_list(ids.ContainsKey(OpDataElementType.Contract.ToString()) ? ids[OpDataElementType.Contract.ToString()].ToArray() : new int[] { });
            //////cmd.STRATEGY_SIDS = new type_int_list(ids.ContainsKey(OpDataElementType.PricingStrategy.ToString()) ? ids[OpDataElementType.PricingStrategy.ToString()].ToArray() : new int[] { });
            //////cmd.PRICETABLE_SIDS = new type_int_list(ids.ContainsKey(OpDataElementType.PricingTable.ToString()) ? ids[OpDataElementType.PricingTable.ToString()].ToArray() : new int[] { });
            //////cmd.WIP_DEAL_SIDS = new type_int_list(ids.ContainsKey(OpDataElementType.WipDeals.ToString()) ? ids[OpDataElementType.WipDeals.ToString()].ToArray() : new int[] { });
            //////cmd.DEAL_SIDS = new type_int_list(ids.ContainsKey(OpDataElementType.Deals.ToString()) ? ids[OpDataElementType.Deals.ToString()].ToArray() : new int[] { });

            MyDealsData odcs;
            using (var rdr = DataAccess.ExecuteReader(cmd))
            {
                odcs = new DataCollectorDataLib().ReaderToDataCollectors(rdr, true);
            }

            // Add in the negative IDs now
            if (odcs == null) odcs = new MyDealsData(); // We might have to initialize other things in odcs

            foreach (int id in ids.Where(c => c < 0))
            {
                // We have a negative number, so stub in a new contract for that number...
                if (!odcs.ContainsKey(opDataElementType))
                {
                    odcs[opDataElementType] = new OpDataPacket<OpDataElementType>
                    {
                        PacketType = opDataElementType,
                        GroupID = id
                    };
                }

                // Populate this according to the template
                odcs[opDataElementType].Data[id] = GetDataCollectorFromTemplate(opDataElementType, id, 0);
            }

            return odcs;
        }

        #endregion

        public static OpDataCollector GetDataCollectorFromTemplate(OpDataElementType opDataElementType, int id, int parentId)
        {
            return GetOpDataElementUITemplate(opDataElementType).CopyToOpDataCollector(id, parentId);
        }

        public static OpDataElementUITemplate GetOpDataElementUITemplate(OpDataElementType opDataElementType)
        {
            OpDataElementUITemplates ourTemplates = DataCollections.GetOpDataElementUITemplates();
            string key = opDataElementType.ToString();

            // TODO need to be consistent on naming these !!!
            if (opDataElementType == OpDataElementType.PricingTable) key = "PRICING TABLE";
            if (opDataElementType == OpDataElementType.PricingStrategy) key = "PRICING STRAT";

            return ourTemplates.ContainsKey(key.ToUpper())
                ? ourTemplates[key.ToUpper()]
                : new OpDataElementUITemplate();
        }
    }
}
