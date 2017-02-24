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
                            ["DC_ID"] = 1123,
                            ["DC_PARENT_ID"] = null,
                            ["START_DT"] = new DateTime(2016,6,6),
                            ["OBJ_SET_TYPE_CD"] = "All"
                        },
                        new OpDataCollectorFlattenedItem
                        {
                            ["DC_ID"] = 4156,
                            ["DC_PARENT_ID"] = null,
                            ["START_DT"] = new DateTime(2016,6,6),
                            ["OBJ_SET_TYPE_CD"] = "All"
                        },
                        new OpDataCollectorFlattenedItem
                        {
                            ["DC_ID"] = -101,
                            ["DC_PARENT_ID"] = null,
                            ["START_DT"] = new DateTime(2016,6,6),
                            ["OBJ_SET_TYPE_CD"] = "All"
                        }
                    },
                    [OpDataElementType.PricingStrategy] = new OpDataCollectorFlattenedList
                    {
                        new OpDataCollectorFlattenedItem
                        {
                            ["DC_ID"] = 789,
                            ["DC_PARENT_ID"] = null,
                            ["TITLE"] = "Strategy 1"
                        },
                        new OpDataCollectorFlattenedItem
                        {
                            ["DC_ID"] = 1011,
                            ["DC_PARENT_ID"] = null,
                            ["TITLE"] = "Strategy 2"
                        },
                        new OpDataCollectorFlattenedItem
                        {
                            ["DC_ID"] = -201,
                            ["DC_PARENT_ID"] = null,
                            ["TITLE"] = "Strategy 2"
                        }
                    }
                }
            };



        }
    }
}
