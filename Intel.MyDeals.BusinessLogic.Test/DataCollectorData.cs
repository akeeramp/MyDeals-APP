using System;
using System.Collections.Generic;
using Intel.MyDeals.Entities;
using Intel.Opaque.Data;

namespace Intel.MyDeals.BusinessLogic.Test
{
    public static class DataCollectorData
    {
        public static Dictionary<string, OpDataCollectorFlattenedDictList> OpDcFlatDictData { get; set; }

        public static void PopulateData()
        {
            OpDcFlatDictData = new Dictionary<string, OpDataCollectorFlattenedDictList>
            {
                ["test1"] = new OpDataCollectorFlattenedDictList
                {
                    [OpDataElementType.Contract] = new OpDataCollectorFlattenedList
                    {
                        new OpDataCollectorFlattenedItem
                        {
                            ["dc_id"] = 1123,
                            ["dc_parent_id"] = null,
                            ["START_DT"] = new DateTime(2016,6,6),
                            ["OBJSET_TYPE"] = "Contract 1"
                        },
                        new OpDataCollectorFlattenedItem
                        {
                            ["dc_id"] = 4156,
                            ["dc_parent_id"] = null,
                            ["START_DT"] = new DateTime(2016,6,6),
                            ["OBJSET_TYPE"] = "Contract 2"
                        },
                        new OpDataCollectorFlattenedItem
                        {
                            ["dc_id"] = -101,
                            ["dc_parent_id"] = null,
                            ["START_DT"] = new DateTime(2016,6,6),
                            ["OBJSET_TYPE"] = "Contract 2"
                        }
                    },
                    [OpDataElementType.PricingStrategy] = new OpDataCollectorFlattenedList
                    {
                        new OpDataCollectorFlattenedItem
                        {
                            ["dc_id"] = 789,
                            ["dc_parent_id"] = 1123,
                            ["TITLE"] = "Strategy 1"
                        },
                        new OpDataCollectorFlattenedItem
                        {
                            ["dc_id"] = 1011,
                            ["dc_parent_id"] = 4156,
                            ["TITLE"] = "Strategy 2"
                        },
                        new OpDataCollectorFlattenedItem
                        {
                            ["dc_id"] = -201,
                            ["dc_parent_id"] = -101,
                            ["TITLE"] = "Strategy 2"
                        }
                    }
                }
            };



        }
    }
}
