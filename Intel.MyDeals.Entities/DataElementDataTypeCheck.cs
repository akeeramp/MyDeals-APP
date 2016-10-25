using System;
using Intel.MyDeals.Entities;
using Intel.Opaque.Data;

namespace Intel.MyDeals.Entities
{

    /*
    TODO:
    Take in an OpDataElementAtrb and DcsAttribute
        - Check is data type value
        - Length valid.
        - Cast if needed.
        - Write validation message as needed.
        - Log erorrs to message queue as needed.
        - 
    */


    public class DataElementDataTypeCheck
    {

        public TypeCheckResult CheckDataElement(MyDealsAttribute atrb, OpDataElementAtrb item)
        {
            throw new Exception("TODO: Brad, do this...");

            //TypeCheckResult ret = new TypeCheckResult();

            //if(atrb == null || item == null)
            //{
            //    ret.Errors = "Attribute or Data Item was null and test cannot be perform, test aborted.";
            //    ret.Passed = true; // ??? not sure what to return here...
            //    return ret;
            //}


            //return ret;
        }

        /// <summary>
        /// Class used to return several details when checking a given value against a
        /// specific type.
        /// </summary>
        public class TypeCheckResult
        {
            /// <summary>
            /// Is the tested value of the specified type?
            /// </summary>
            public bool Passed { set; get; }

            /// <summary>
            /// Type tested against
            /// </summary>
            public Type SetType { set; get; }

            /// <summary>
            /// Error messages raised in testing
            /// </summary>
            public string Errors { set; get; }

            /// <summary>
            /// Source value passed in to be tested
            /// </summary>
            public object InputValue { set; get; }

            /// <summary>
            /// Value after conversion and possible formatting to target type
            /// </summary>
            public object SetValue { set; get; }

            /// <summary>
            /// If there is a set value, return it, else Input value
            /// </summary>
            public object Value
            {
                get
                {
                    return SetValue == null
                        ? InputValue
                        : SetValue;
                }
            }

            /// <summary>
            /// Was a set value set that was differnt than the input value?
            /// </summary>
            public bool Updated
            {
                get
                {
                    return SetValue != null && SetValue != InputValue;
                }
            }

            public TypeCheckResult()
                : this(null, false)
            { }

            public TypeCheckResult(object inputValue, bool unknownResult)
            {
                Passed = unknownResult;
                SetType = null;
                InputValue = inputValue;
                SetValue = null;
                Errors = String.Empty;
            }

            /// <summary>
            /// To aid in bool comparison, return the passed value when comparing this object to a boolean
            /// </summary>
            public static implicit operator bool(TypeCheckResult obj)
            {
                if (obj == null) { return false; }
                return obj.Passed;
            }


            // To aid in debugging
            public override string ToString()
            {
                return String.Format("{0} as {1} for \"{2}\".",
                    Passed ? "PASSED" : "FAILED",
                    SetType == null ? "Unknown" : SetType.Name,
                    Value
                    );
            }
        }

#if false
        /// <summary>
        /// Of data being passed, ensure types are correct and length of strings is in alingment.
        /// </summary>
        /// <param name="dealDataSet"></param>
        /// <param name="msgQueue"></param>
        /// <returns></returns>
        private bool CheckAttributeDataTypeAndLength(IEnumerable<OpDataElementAtrb> data, ref MsgQueue msgQueue)
        {
            if (msgQueue == null) { msgQueue = new MsgQueue(); }

            // Has no data attribues, so nothing to check...
            if (data == null || data.Count() == 0) { return true; }
            
            bool ret = true;

            //DealAtrbFactMstr.PreInit();

            // TODO: Test this for optimization and thread safety...

            foreach (OpDataElementAtrb odea in data)
            {
                int max_len = 0;

                var tst = DealAtrbFactMstr.CheckType(atrb_id, new TypeCheckResult(val, true));
                if (!tst)
                {
                    // TODO: Maybe be an error type and set ret = false?
                    msgQueue.WriteMessage(Msg.MessageType.Warning,
                        "Unable to convert [{0}] value \"{1}\" to expected data type [{2}]. Additional Details: {3}",
                        DealAtrbFactMstr.GetName(atrb_id),
                        val,
                        tst.SetType == null ? "UNKNOWN" : tst.SetType.Name,
                        tst.Errors
                        );
                }
                else
                {
                    // Reset the formatted based on CheckType
                    if (tst.Updated)
                    {
                        if (tst.SetType == typeof(DateTime) || tst.SetType == typeof(DateTime?))
                        {
                            val = String.Format("{0:" + EN.CULTURE.DATABASE_DATETIME_PATTERN + "}", tst.Value);

                            // If it has no fractions of seconds, and is exactly midnight, remove the hours/minutes/seconds.
                            // The dot check is to ensure a value like 2013-01-01 00:00:00.1234 is preserved since it is not exactly midnight.
                            if (!val.Contains("."))
                            {
                                val = val.Replace(" 00:00:00", "");
                            }
                            dr.ATRB_VAL = val;

                        }
                        if (tst.SetType == typeof(Boolean) || tst.SetType == typeof(Boolean?))
                        {
                            if (tst.Value == null || tst.Value == DBNull.Value)
                            {
                                dr.ATRB_VAL = null;
                            }
                            else
                            {
                                dr.ATRB_VAL = val = ((bool)tst.Value) ? "1" : "0";
                            }
                        }
                        else
                        {
                            dr.ATRB_VAL = val = String.Format("{0}", tst.Value);
                        }
                    }
                }

                // After we have set the value, check he size
                if (!DealAtrbFactMstr.CheckSize(atrb_id, val, out max_len))
                {
                    // TODO: Maybe be an error type and set ret = false?
                    msgQueue.WriteMessage(Msg.MessageType.Warning,
                        "[{0}] value has a text length of {1}, which exceeds expected maximum length of {2}.",
                        DealAtrbFactMstr.GetName(atrb_id),
                        val.Length,
                        max_len
                        );
                }

            }

            return ret;
        }



        public static TypeCheckResult CheckType(DcsAttribute atrb_id, TypeCheckResult res)
        {
            // Type matchign atrb_id DataType
            Type atrb_type;

            if (!TypeDict.TryGetValue(atrb_id, out atrb_type))
            {
                res.Errors = "Unable to find type for specified attribute.";
                //res.Passed = unknown_return; // We don't have a type to check against, assume okay
                return res;
            }
            else
            {
                res.SetType = atrb_type;
            }

            if (atrb_type == typeof(String))
            {
                // We will assume string data needs no chnages, just return
                res.Passed = true;
                return res;
            }

            // If the input value is already of said type, just return it.
            if (res.InputValue != null)
            {
                if (atrb_type == res.InputValue.GetType() || atrb_type == Tools.GetGenericUnderlyingType(res.InputValue.GetType()))
                {
                    // Types already match, we are okay
                    res.Passed = true;
                    return res;
                }
            }

            // All other tests are basically assuming the pased value was a string.
            string str_value = String.Format("{0}", res.InputValue).Trim();

            if (String.IsNullOrEmpty(str_value))
            {
                res.Errors = "Value was blank so conversion to target type was aborted.";
                //res.Passed = unknown_return; // We don't have a type to check against, assume okay
                return res;
            }

            // TODO: Custom converters go here, like for boolean...
            if (atrb_type == typeof(bool))
            {
                bool? b_check = Tools.StringToNullableBool(str_value);
                res.Passed = (b_check != null);
                if (b_check == null)
                {
                    res.Errors = "Unable to convert value to boolean.";
                    res.SetValue = null;
                }
                else
                {
                    res.SetValue = (bool)b_check;
                }
                return res;
            }
            else if (atrb_type == typeof(int))
            {
                // Settings of the InputValues here annoys me since we are corupting the data...
                res.InputValue = str_value.Replace(",", ""); // Replace thousands seperators
            }
            else if (atrb_type == typeof(double))
            {
                // Settings of the InputValues here annoys me since we are corupting the data...
                res.InputValue = str_value
                    .Replace(",", "") // Thousands seperators
                    .Replace("$", "");  // Currency symbol (add more as needed)
            }

            try
            {
                // Try the actual conversion, handle the "cannot convert" exceptions.
                res.SetValue = Convert.ChangeType(res.InputValue, atrb_type);
            }
            catch (InvalidCastException ex)
            {
                res.Errors = ex.Message;
                res.Passed = false;
                return res;
            }
            catch (FormatException ex)
            {
                res.Errors = ex.Message;
                res.Passed = false;
                return res;
            }
            catch (OverflowException ex)
            {
                res.Errors = ex.Message;
                res.Passed = false;
                return res;
            }

            // If the result was null, we can't honestly say if it passed or failed, return unknown.
            if (res.SetValue == null)
            {
                res.Errors = "Value conversion returned null.";
                //res.Passed = unknown_return;
                return res;
            }
            else
            {
                res.Passed = true;
                return res;
            }
        }

        public static bool CheckSize(int atrb_id, string value, out int max_len)
        {
            max_len = INFINITE_MAX_LEN;
            if (String.IsNullOrEmpty(value))
            {
                // Value is not set, it must be smaller than max length...
                return true;
            }

            if (SizeDict.TryGetValue(atrb_id, out max_len))
            {
                // Thsi should never happen, there is a check when we populate the dictionary
                // to prevent this from being stored, but my paranoia is getting the best of me...
                if (max_len <= INFINITE_MAX_LEN) { return true; }

                return (value.Length <= max_len);
            }

            // Value does not have a max length limit since it was not in the SizeDict
            return true;
        }



        
    }
#endif
    }
}
