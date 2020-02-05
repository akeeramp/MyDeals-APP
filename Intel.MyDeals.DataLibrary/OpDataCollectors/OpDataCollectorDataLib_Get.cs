using Intel.MyDeals.DataAccessLib;
using Intel.Opaque.Data;
using System.Collections.Generic;
using System.Linq;
using Intel.MyDeals.DataAccessLib.StoredProcedures.MyDeals.dbo;
using Intel.MyDeals.Entities;
using System.Data;

namespace Intel.MyDeals.DataLibrary
{
    public partial class OpDataCollectorDataLib
    {
        /// <summary>
        /// Get an object tree from its user displayed ID
        /// </summary>
        /// <param name="opDataElementType">Top level of object tree that you expect to get.</param>
        /// <param name="ids">List of IDs to pull.</param>
        /// <param name="includeTypes">Which object types to include in the request.</param>
        /// <param name="includeSecondaryTypes"></param>
        /// <param name="atrbs">Attributes that need to be brought in as well.</param>
        /// <returns></returns>
        public MyDealsData GetByIDs(OpDataElementType opDataElementType, IEnumerable<int> ids, List<OpDataElementType> includeTypes, IEnumerable<int> atrbs)
        {
            // Load Data Cycle: Point 3

            string strInc = "*";
            //string searchGroup = opDataElementType.ToString();

            if (includeTypes != null && includeTypes.Any())
            {
                strInc = string.Join(",", includeTypes.Select(OpDataElementTypeConverter.ToAlias).Distinct());
            }

            var cmd = new PR_MYDL_GET_OBJS_BY_SIDS
            {
                in_emp_wwid = OpUserStack.MyOpUserToken.Usr.WWID,
                in_obj_type = opDataElementType.ToAlias(),
                in_include_groups = strInc,
                in_obj_sids = new type_int_list(ids.ToArray()),
                in_atrbs_list = new type_int_list(atrbs.ToArray())
            };


            MyDealsData odcs;
            using (var rdr = DataAccess.ExecuteReader(cmd))
            {
                odcs = new OpDataCollectorDataLib().ReaderToDataCollectors(rdr, true);
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

            foreach (OpDataElementType oType in includeTypes)
            {
                if (!odcs.ContainsKey(oType)) odcs[oType] = new OpDataPacket<OpDataElementType> { PacketType = oType };
            }

            return odcs;
        }


        /// <summary>
        /// Pull out a specific template from the templates collection and build a collector out of it.
        /// </summary>
        /// <param name="opDataElementType">Which object template do you need to pull.</param>
        /// <param name="id">The ID to tag to it.</param>
        /// <param name="parentId">The ParentId to tag to it as well.</param>
        /// <returns></returns>
        public static OpDataCollector GetDataCollectorFromTemplate(OpDataElementType opDataElementType, int id, int parentId)
        {
            return GetOpDataElementUiTemplate(opDataElementType).CopyToOpDataCollector(id, parentId);
        }


        /// <summary>
        /// Pull out a specific template from the templates collection and build a UI template object out of it.
        /// </summary>
        /// <param name="opDataElementType">Which object template do you need to pull.</param>
        /// <returns></returns>
        public static OpDataElementAtrbTemplate GetOpDataElementUiTemplate(OpDataElementType opDataElementType)
        {
            OpDataElementAtrbTemplates ourTemplates = DataCollections.GetOpDataElementUiTemplates();
            string key = opDataElementType.ToString();

            return ourTemplates.ContainsKey(key)
                ? ourTemplates[key]
                : new OpDataElementAtrbTemplate();
        }

    }
}
