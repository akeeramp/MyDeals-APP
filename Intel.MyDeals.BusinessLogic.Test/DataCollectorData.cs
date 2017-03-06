using System;
using System.Collections.Generic;
using Intel.MyDeals.Entities;

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
                            [AttributeCodes.DC_ID] = 1123,
                            [AttributeCodes.DC_PARENT_ID] = null,
                            [AttributeCodes.START_DT] = new DateTime(2016,6,6),
                            [AttributeCodes.OBJ_SET_TYPE_CD] = "All"
                        },
                        new OpDataCollectorFlattenedItem
                        {
                            [AttributeCodes.DC_ID] = 4156,
                            [AttributeCodes.DC_PARENT_ID] = null,
                            [AttributeCodes.START_DT] = new DateTime(2016,6,6),
                            [AttributeCodes.OBJ_SET_TYPE_CD] = "All"
                        },
                        new OpDataCollectorFlattenedItem
                        {
                            [AttributeCodes.DC_ID] = -101,
                            [AttributeCodes.DC_PARENT_ID] = null,
                            [AttributeCodes.START_DT] = new DateTime(2016,6,6),
                            [AttributeCodes.OBJ_SET_TYPE_CD] = "All"
                        }
                    },
                    [OpDataElementType.PricingStrategy] = new OpDataCollectorFlattenedList
                    {
                        new OpDataCollectorFlattenedItem
                        {
                            [AttributeCodes.DC_ID] = 789,
                            [AttributeCodes.DC_PARENT_ID] = null,
                            [AttributeCodes.TITLE] = "Strategy 1"
                        },
                        new OpDataCollectorFlattenedItem
                        {
                            [AttributeCodes.DC_ID] = 1011,
                            [AttributeCodes.DC_PARENT_ID] = null,
                            [AttributeCodes.TITLE] = "Strategy 2"
                        },
                        new OpDataCollectorFlattenedItem
                        {
                            [AttributeCodes.DC_ID] = -201,
                            [AttributeCodes.DC_PARENT_ID] = null,
                            [AttributeCodes.TITLE] = "Strategy 2"
                        }
                    }
                }
            };



        }
    }
}
