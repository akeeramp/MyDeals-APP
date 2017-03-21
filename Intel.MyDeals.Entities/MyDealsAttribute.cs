using Intel.Opaque.Tools;
using System;

namespace Intel.MyDeals.Entities
{
    public partial class MyDealsAttribute : IEquatable<MyDealsAttribute>
    {
        public Type GetDataType()
        {
            return Type.GetType(DOT_NET_DATA_TYPE);
        }

        public override string ToString()
        {
            return $"{DIM_CD}:{ATRB_COL_NM} = {DIM_SID}:{ATRB_SID}";
        }

        /// <summary>
        /// The expected ATRB column name for this attribute.
        /// </summary>
        public string GetTargetColumn()
        {
            switch(TGT_COL_TYPE)
            {
                case "INT": return "ATRB_VAL_INT";
                case "DATETIME": return "ATRB_VAL_DTM";
                case "MONEY": return "ATRB_VAL_MONEY";
                default :
                {
                    if(ATRB_MAX_LEN <= 0 || ATRB_MAX_LEN > 255) // WARNING: Hard coded INT... :-(
                        {
                            return "ATRB_VAL_CHAR_MAX";
                        }
                    return "ATRB_VAL_CHAR";
                }
            }
        }

        public string[] GetPivotTables()
        {
            return PIVOT_MSK <= 0 ? new string[] { } : null;

            //return DcsAttributeHelper.ATTRIBUTE_PIVOT_MASK_MAP
            //    .Where(kvp => (kvp.Key & this.PVT_MSK) == kvp.Key)
            //    .Select(kvp => kvp.Value)
            //    .ToArray();
        }

        public string GetFormatMask()
        {
            return FRMT_MSK;
        }

        public bool Equals(MyDealsAttribute other)
        {
            return ATRB_SID == other?.ATRB_SID;
        }
        public override int GetHashCode()
        {
            return ATRB_SID;
        }

        public bool IsLengthCheck(string value)
        {
            // Warning: hard coded max len, again... :-(
            if (ATRB_MAX_LEN <= 0 || ATRB_MAX_LEN > 255) { return true; }
            return ((value ?? "").Length <= ATRB_MAX_LEN);
        }

        public object GetValueStronglyTyped(object value)
        {
            return GetValueStronglyTyped(value, false);
        }
        public object GetValueStronglyTyped(object value, bool throwCastErrors)
        {
            if (value == null) { return null; }

            var ty = Type.GetType(DOT_NET_DATA_TYPE, false);
            if (ty == null)
            {
                if (throwCastErrors)
                {
                    throw new ArgumentException($"Unable to find valid type for \"{DOT_NET_DATA_TYPE}\" in which to convert passed value ({value}).");
                }
                return value; // Not sure what to do here....
            }

            // Some of these type checks may be overkill, like string, but I was hoping it would help
            // improve performance...  And it allowed us to do things like say a String.Empty is not a valid value
            if (ty == typeof(String))
            {
                string strRet = $"{value}";
                if (String.IsNullOrEmpty(strRet)) // String.Empty = Not Set value
                {
                    return null;
                }
                return strRet;
            }
            else if (ty == typeof(Boolean))
            {
                if (value is Boolean)
                {
                    return (Boolean)value;
                }

                if (throwCastErrors)
                {
                    bool? ret = OpTypeConverter.StringToNullableBool(value);
                    if (ret == null)
                    {
                        throw new InvalidCastException($"Unable to convert \"{value}\" to a viable bool value.");
                    }
                    else
                    {
                        return (bool)ret;
                    }
                }
                else
                {
                    return OpTypeConverter.StringToNullableBool(value);
                }
            }
            else if (ty == typeof(DateTime))
            {
                DateTime minDate = OpaqueConst.SQL_MIN_DATE;
                bool isError = false;

                if (value is DateTime)
                {
                    if ((DateTime)value >= minDate)
                    {
                        return (DateTime)value;
                    }
                    isError = true;
                }

                if (!isError)
                {
                    DateTime dt;
                    if (DateTime.TryParse($"{value}", out dt))
                    {
                        if (dt >= minDate)
                        {
                            return dt;
                        }
                    }
                }

                if (throwCastErrors)
                {
                    throw new InvalidCastException($"Unable to convert \"{value}\" to a viable SQL-viable DateTime value.");
                }
                else
                {
                    return null;
                }
            }
            else if (ty == typeof(Guid))
            {
                if (value is Guid)
                {
                    return (Guid)value;
                }

                Guid g;
                if (Guid.TryParse($"{value}", out g))
                {
                    return g;
                }

                if (throwCastErrors)
                {
                    throw new InvalidCastException($"Unable to convert \"{value}\" to a viable Guid value.");
                }
                else
                {
                    return null;
                }
            }
            else if (ty == typeof(double))
            {
                if (value is double)
                {
                    return (double)value;
                }

                double db;
                if (double.TryParse($"{value}",out db))
                {
                    return db;
                }

                if (throwCastErrors)
                {
                   throw new InvalidCastException($"Unable to convert \"{value}\" to a viable double value.");
                }
                else
                {
                    return null;
                }
            }
            else if (ty == typeof(int))
            {
                if (value is int)
                {
                    return (int)value;
                }

                int i;
                if (int.TryParse($"{value}", out i))
                {
                    return i;
                }

                if (throwCastErrors)
                {
                    throw new InvalidCastException($"Unable to convert \"{value}\" to a viable Int32 value.");
                }
                else
                {
                    return null;
                }
            }
            else
            {
                try
                {
                    return Convert.ChangeType(value, ty, null);
                }
                catch (Exception ex)
                {
                    if (throwCastErrors)
                    {
                        throw;
                    }
#if DEBUG
                    System.Diagnostics.Debug.WriteLine(ex);
#endif
                    return null;
                }
            }
        }

    }
}
