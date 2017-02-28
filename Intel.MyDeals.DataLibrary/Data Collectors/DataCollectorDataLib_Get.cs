using Intel.MyDeals.DataAccessLib;
using Intel.Opaque.Data;
using System.Collections.Generic;
using System.Linq;
using Intel.MyDeals.DataAccessLib.StoredProcedures.MyDeals.dbo;
using Intel.MyDeals.Entities;

namespace Intel.MyDeals.DataLibrary
{
    public partial class DataCollectorDataLib
    {

        #region Get By Ids

        /// <summary>
        /// Get an object tree from its user displayed ID
        /// </summary>
        /// <param name="opDataElementType">Top level of object tree that you expect to get.</param>
        /// <param name="ids">List of IDs to pull.</param>
        /// <returns></returns>
        public MyDealsData GetByIDs(OpDataElementType opDataElementType, IEnumerable<int> ids)
        {
            return GetByIDs(opDataElementType, ids, new List<OpDataElementType> { opDataElementType }, new List<string>());
        }


        /// <summary>
        /// Get an object tree from its user displayed ID
        /// </summary>
        /// <param name="opDataElementType">Top level of object tree that you expect to get.</param>
        /// <param name="ids">List of IDs to pull.</param>
        /// <param name="includeTypes">Which object types to include in the request.</param>
        /// <returns></returns>
        public MyDealsData GetByIDs(OpDataElementType opDataElementType, IEnumerable<int> ids, List<OpDataElementType> includeTypes)
        {
            return GetByIDs(opDataElementType, ids, includeTypes, new List<string>());
        }


        /// <summary>
        /// Get an object tree from its user displayed ID
        /// </summary>
        /// <param name="opDataElementType">Top level of object tree that you expect to get.</param>
        /// <param name="ids">List of IDs to pull.</param>
        /// <param name="includeTypes">Which object types to include in the request.</param>
        /// <param name="atrbs">Attributes that need to be brought in as well.</param>
        /// <returns></returns>
        public MyDealsData GetByIDs(OpDataElementType opDataElementType, IEnumerable<int> ids, List<OpDataElementType> includeTypes, IEnumerable<string> atrbs)
        {
            // Load Data Cycle: Point 3

            string strInc = "*";
            //string searchGroup = opDataElementType.ToString();

            if (includeTypes != null && includeTypes.Any())
            {
                strInc = string.Join(",", includeTypes.Select(OpDataElementTypeConverter.ToAlias).Distinct());
            }

            //// TODO change SP to match naming conventions - Change this over to objects imported definations
            //// --'CNTRCT, PRC_ST, PRC_TBL, PRC_TBL_ROW, WIP_DEAL, DEAL'
            strInc = strInc.Replace(OpDataElementType.Contract.ToString(), OpDataElementType.Contract.ToAlias());
            strInc = strInc.Replace(OpDataElementType.PricingStrategy.ToString(), OpDataElementType.PricingStrategy.ToAlias());
            strInc = strInc.Replace(OpDataElementType.PricingTable.ToString(), OpDataElementType.PricingTable.ToAlias());
            strInc = strInc.Replace(OpDataElementType.PricingTableRow.ToString(), OpDataElementType.PricingTableRow.ToAlias());
            strInc = strInc.Replace(OpDataElementType.WipDeals.ToString(), OpDataElementType.WipDeals.ToAlias());
            strInc = strInc.Replace(OpDataElementType.Deals.ToString(), OpDataElementType.Deals.ToAlias());

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


        /// <summary>
        /// Pull out a specific template from the templates collection and build a collector out of it.
        /// </summary>
        /// <param name="opDataElementType">Which object template do you need to pull.</param>
        /// <param name="id">The ID to tag to it.</param>
        /// <param name="parentId">The ParentId to tag to it as well.</param>
        /// <returns></returns>
        public static OpDataCollector GetDataCollectorFromTemplate(OpDataElementType opDataElementType, int id, int parentId)
        {
            return GetOpDataElementUITemplate(opDataElementType).CopyToOpDataCollector(id, parentId);
        }


        /// <summary>
        /// Pull out a specific template from the templates collection and build a UI template object out of it.
        /// </summary>
        /// <param name="opDataElementType">Which object template do you need to pull.</param>
        /// <returns></returns>
        public static OpDataElementUITemplate GetOpDataElementUITemplate(OpDataElementType opDataElementType)
        {
            OpDataElementUITemplates ourTemplates = DataCollections.GetOpDataElementUITemplates();
            string key = opDataElementType.ToString();

            // TODO need to be consistent on naming these !!!
            if (opDataElementType == OpDataElementType.PricingTable) key = "PRICING TABLE";
            if (opDataElementType == OpDataElementType.PricingTableRow) key = "PRICING TABLE ROW";
            if (opDataElementType == OpDataElementType.PricingStrategy) key = "PRICING STRAT";

            return ourTemplates.ContainsKey(key.ToUpper())
                ? ourTemplates[key.ToUpper()]
                : new OpDataElementUITemplate();
        }

    }
}
