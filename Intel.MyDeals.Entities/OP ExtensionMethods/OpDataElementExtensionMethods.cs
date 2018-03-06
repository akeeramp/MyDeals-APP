using System;
using System.Collections.Generic;
using System.Linq;
using Intel.Opaque;
using Intel.Opaque.Data;

namespace Intel.MyDeals.Entities
{
    public static class OpDataElementExtensionMethods
    {
        /// <summary>
        /// See if the UQ constraint items for an element match each other.
        /// </summary>
        /// <param name="src">Source element.</param>
        /// <param name="other">Compare element.</param>
        /// <returns>True if items match, else false.</returns>
        public static bool IsKeyMatch(this OpDataElementAtrb src,  OpDataElementAtrb other)
        {
            if (other == null || src == null) { return false; }

            // Attributes must match
            if(src.AtrbID != other.AtrbID)
            {
                return false;
            }
            
            // And hashes must match
            if (!(
                (src.DimID == other.DimID && src.DimID > 0 && other.DimID > 0)
                ||
                (src.DimKey.HashPairs == other.DimKey.HashPairs)
                ))
            {
                return false;
            }

            // If we have DC IDs, check them, else use alt ID.
            if(src.DcID <= 0 && other.DcID <= 0)
            {
                return (src.DcParentID == other.DcParentID); // Was return (src.DcAltID == other.DcAltID);
            } 

            return (src.DcID == other.DcID);
        }


        public static void SetAtrbValue(this OpDataElement de, object val, AttributeCollection attributeCollection)
        {
            // let's do a quick cheap test before calling the more expensive IsValueEqual... remember... NULL = ""
            if ((de.AtrbValue?.ToString() ?? "") == (val?.ToString() ?? "")) return;

            if (de.IsValueEqual(val, attributeCollection)) return;

            de.AtrbValue = val;
            de.State = OpDataElementState.Modified;
        }


        /// <summary>
        /// Get first matching attribute
        /// </summary>
        public static OpDataElementAtrb GetAtrb(this List<OpDataElement> dc, string atrbCd)
        {
            return dc.First(de => de.AtrbCd == atrbCd);
        }

        /// <summary>
        /// Get first matching attribute
        /// </summary>
        public static OpDataElementAtrb GetAtrb(this List<OpDataElement> dc, int atrbId)
        {
            return dc.First(de => de.AtrbID == atrbId);
        }

        /// <summary>
        /// Get all matching attributes
        /// </summary>
        public static IEnumerable<OpDataElementAtrb> GetAtrbs(this List<OpDataElement> dc, string atrbCd)
        {
            return dc.Where(de => de.AtrbCd == atrbCd);
        }

        /// <summary>
        /// Get all matching attributes
        /// </summary>
        public static IEnumerable<OpDataElementAtrb> GetAtrbs(this List<OpDataElement> dc, int atrbId)
        {
            return dc.Where(de => de.AtrbID == atrbId);
        }

        /// <summary>
        /// Get the attribute associated with the current DataElement.
        /// This is the method that writes the AttributeCache value.
        /// </summary>
        /// <param name="ode"></param>
        /// <param name="sourceData">Master Data List In which to seek attribute details.</param>
        /// <returns>Valid attribue or null when not found.</returns>
        public static MyDealsAttribute GetAttribute(this OpDataElementAtrb ode, AttributeCollection sourceData)
        {
            if (ode == null || ode.AtrbID <= 0) { return null; }

            if (ode._AttributeCache != null) // Not checking type here is a moderatly big assumption, watch out...
            {
                return ode._AttributeCache as MyDealsAttribute;
            }

            if (sourceData == null) { return null; }
            
            MyDealsAttribute atrb;
            if (!sourceData.TryGetValue(ode.AtrbID, out atrb)) return null;
            ode._AttributeCache = atrb;
            return atrb;
        }


        /// <summary>
        /// Get AtrbValue strongly typed to the set DOT_NET_DATA_TYPE for the given attribute.
        /// </summary>
        /// <param name="ode"></param>
        /// <param name="sourceData">Master data list to lookup extended attribute details.</param>
        /// <returns>AtrbValue converted to meta data driven type</returns>
        public static object AtrbValueTyped(this OpDataElementAtrb ode, AttributeCollection sourceData)
        {
            return AtrbValueTyped(ode, sourceData, false);
        }

        /// <summary>
        /// Get AtrbValue strongly typed to the set DOT_NET_DATA_TYPE for the given attribute.
        /// </summary>
        /// <param name="ode"></param>
        /// <param name="sourceData">Master data list to lookup extended attribute details.</param>
        /// <param name="throwCastErrros">When true and type cannot be resolved, throw an error.</param>
        /// <returns>AtrbValue converted to meta data driven type</returns>
        public static object AtrbValueTyped(this OpDataElementAtrb ode, AttributeCollection sourceData, bool throwCastErrros)
        {
            if (ode?.AtrbValue == null) { return null; }

            if (ode._AtrbValueTypedCache != null)
            {
                return ode._AtrbValueTypedCache;
            }
            
            var atrb = GetAttribute(ode, sourceData);
            if (atrb == null) { return ode.AtrbValue; } // Not sure what to do here....

            ode._AtrbValueTypedCache = atrb.GetValueStronglyTyped(ode.AtrbValue, throwCastErrros);
            return ode._AtrbValueTypedCache;
        }

        /// <summary>
        /// Test to see if the passed value is equal to the current value.
        /// Comparison is done string to string.
        /// </summary>
        /// <param name="obj">Attribute with a value</param>
        /// <param name="testValue">Value to compare against.</param>
        /// <param name="attributeCollection"></param>
        /// <param name="errorIsFalse">When true, return false on error, else throw errors.</param>
        /// <returns>True if values are equal, else false.</returns>
        public static bool IsValueEqual(this OpDataElementAtrb obj, object testValue, AttributeCollection attributeCollection, bool errorIsFalse = true)
        {
            if(obj == null){ return false; }

            var oav = obj.AtrbValue;

            string val1  = $"{oav}";
            string val2  = $"{testValue}";

            bool isnulloremptyval1 = string.IsNullOrEmpty(val1);
            bool isnulloremptyval2 = string.IsNullOrEmpty(val2);

            if (isnulloremptyval1 && isnulloremptyval2) { return true; } // Both are null, they are equal
            if (isnulloremptyval1 || isnulloremptyval2) { return false; } // One is null, the other is not, can't be equal
            if (val1 == val2) { return true; } // When both string are equal no need to convert and compare, they are not equal

            // We want ""==null, so this can't be here...
            // if(oav == null || test_value == null) { return false; } // One is null, the other is not, can't be equal

            var atrb = obj.GetAttribute(attributeCollection);

            try
            {
                return
                    $"{atrb.GetValueStronglyTyped(oav, false)}"
                    ==
                    $"{atrb.GetValueStronglyTyped(testValue, false)}";
            } 
            catch (Exception ex)
            {
#if DEBUG
                OpLogPerf.Log(ex);
#endif
                if(!errorIsFalse)
                {
                    throw;
                }
            }

            return false;
        }

        /// <summary>
        /// Test to see if the passed value is equal to the previous value.
        /// Comparison is done string to string.
        /// </summary>
        /// <param name="obj">Attribute with a previous value</param>
        /// <param name="testValue">Value to compare against.</param>
        /// <param name="errorIsFalse">When true, return false on error, else throw errors.</param>
        /// <param name="attributeCollection"></param>
        /// <returns>True if values are equal, else false.</returns>
        public static bool IsPrevValueEqual(this OpDataElement obj, object testValue, bool errorIsFalse, AttributeCollection attributeCollection)
        {
            if (obj == null) { return false; }

            var oav = obj.PrevAtrbValue;

            if (oav == null && testValue == null) { return true; } // Both are null, they are equal

            // We want ""==null, so this can't be here...
            // if(oav == null || test_value == null) { return false; } // One is null, the other is not, can't be equal

            var atrb = obj.GetAttribute(attributeCollection);

            try
            {
                return
                    $"{atrb.GetValueStronglyTyped(oav, true)}"
                    ==
                    $"{atrb.GetValueStronglyTyped(testValue, true)}";
            }
            catch (Exception ex)
            {
#if DEBUG
                OpLogPerf.Log(ex);
#endif
                if (!errorIsFalse)
                {
                    throw;
                }
            }

            return false;
        }

        /// <summary>
        /// Test to see if the current atrb value is equal to the previous value.
        /// Comparison is done string to string.
        /// </summary>
        /// <param name="obj">Attribute with a value</param>
        /// <param name="errorIsFalse">When true, return false on error, else throw errors.</param>
        /// <param name="attributeCollection"></param>
        /// <returns>True if values are equal, else false.</returns>
        public static bool IsValueEqualPrev(this OpDataElement obj, bool errorIsFalse, AttributeCollection attributeCollection)
        {
            if (obj == null) { return false; }

            object testValue = obj.AtrbValue;
            var oav = obj.PrevAtrbValue;

            if (oav == null && testValue == null) { return true; } // Both are null, they are equal

            // We want ""==null, so this can't be here...
            // if(oav == null || test_value == null) { return false; } // One is null, the other is not, can't be equal

            var atrb = obj.GetAttribute(attributeCollection);

            try
            {
                return
                    $"{atrb.GetValueStronglyTyped(oav, true)}"
                    ==
                    $"{atrb.GetValueStronglyTyped(testValue, true)}";
            }
            catch (Exception ex)
            {
#if DEBUG
                OpLogPerf.Log(ex);
#endif
                if (!errorIsFalse)
                {
                    throw;
                }
            }

            return false;
        }

        /// <summary>
        /// Test to see if the current atrb value is equal to the previous value.
        /// Comparison is done string to string.
        /// </summary>
        /// <param name="obj">Attribute with a value</param>
        /// <param name="errorIsFalse">When true, return false on error, else throw errors.</param>
        /// <param name="attributeCollection"></param>
        /// <returns>True if values are equal, else false.</returns>
        public static bool IsValueEqualOrig(this OpDataElement obj, bool errorIsFalse, AttributeCollection attributeCollection)
        {
            if (obj == null) { return false; }

            object testValue = obj.AtrbValue;
            var oav = obj.OrigAtrbValue;

            if (oav == null && testValue == null) { return true; } // Both are null, they are equal

            // We want ""==null, so this can't be here...
            // if(oav == null || test_value == null) { return false; } // One is null, the other is not, can't be equal

            var atrb = obj.GetAttribute(attributeCollection);

            try
            {
                return
                    $"{atrb.GetValueStronglyTyped(oav, true)}"
                    ==
                    $"{atrb.GetValueStronglyTyped(testValue, true)}";
            }
            catch (Exception ex)
            {
#if DEBUG
                OpLogPerf.Log(ex);
#endif
                if (!errorIsFalse)
                {
                    throw;
                }
            }

            return false;
        }


        public static bool IsValueIncreasedFromOrig(this IOpDataElement obj, AttributeCollection attributeCollection)
        {
            if (obj == null) { return false; }

            object testValue = obj.AtrbValue;
            var oav = obj.OrigAtrbValue;

            if (oav == null || testValue == null)
            {
                return false;
            }

            var atrb = ((OpDataElement)obj).GetAttribute(attributeCollection);

            try
            {
                switch (atrb.DATA_TYPE_CD)
                {
                    case "MONEY":
                    case "INT":
                        return float.Parse(atrb.GetValueStronglyTyped(testValue, false).ToString()) > float.Parse(atrb.GetValueStronglyTyped(oav, false).ToString());
                    case "DATE":
                    case "DATETIME":
                        return (DateTime)atrb.GetValueStronglyTyped(testValue, false) > (DateTime)atrb.GetValueStronglyTyped(oav, false);
                    case "VARCHAR":
                    case "BIT":
                        return false;
                }
            }
            catch (Exception ex)
            {
#if DEBUG
                OpLogPerf.Log(ex);
#endif
            }

            return false;
        }


        public static bool IsValueDecreasedFromOrig(this IOpDataElement obj, AttributeCollection attributeCollection)
        {
            if (obj == null) { return false; }

            object testValue = obj.AtrbValue;
            var oav = obj.OrigAtrbValue;

            if (oav == null || testValue == null)
            {
                return false;
            }

            var atrb = ((OpDataElement)obj).GetAttribute(attributeCollection);

            try
            {
                switch (atrb.DATA_TYPE_CD)
                {
                    case "MONEY":
                    case "INT":
                        return float.Parse(atrb.GetValueStronglyTyped(testValue, false).ToString()) < float.Parse(atrb.GetValueStronglyTyped(oav, false).ToString());
                    case "DATE":
                    case "DATETIME":
                        return (DateTime)atrb.GetValueStronglyTyped(testValue, false) < (DateTime)atrb.GetValueStronglyTyped(oav, false);
                    case "VARCHAR":
                    case "BIT":
                        return false;
                }
            }
            catch (Exception ex)
            {
#if DEBUG
                OpLogPerf.Log(ex);
#endif
            }

            return false;
        }


        /// <summary>
        /// Get the Attribue Value as a specific type.
        /// Returns default(t) on error.
        /// </summary>
        /// <typeparam name="T">Target Type</typeparam>
        /// <param name="ode">Data Element with Value</param>
        /// <param name="sourceData">Attribue master data collection.</param>
        /// <returns>Strong typed value or exception</returns>
        public static T AtrbValue<T>(this OpDataElementAtrb ode, AttributeCollection sourceData)
        {
            return AtrbValue<T>(ode, default(T), false, sourceData);
        }


        /// <summary>
        /// Get the Attribue Value as a specific type
        /// </summary>
        /// <typeparam name="T">Target Type</typeparam>
        /// <param name="ode">Data Element with Value</param>
        /// <param name="errorDefault">Value to return if the current value cannot be resolved and throwErrors is false.</param>
        /// <param name="throwCastErrors">When true, throw exceptions as opposed to returning default values.</param>
        /// <param name="sourceData">Attribue master data collection.</param>
        /// <returns>Strong typed value or exception</returns>
        public static T AtrbValue<T>(this OpDataElementAtrb ode, T errorDefault, bool throwCastErrors, AttributeCollection sourceData)
        {
            try
            {
                if (typeof(T) == typeof(string))
                {
                    return (T)((object) $"{ode.AtrbValue}");
                }

                T ret = (T)ode.AtrbValueTyped(sourceData, throwCastErrors);

                if (ret == null)
                {
                    return errorDefault;
                }

                return ret;
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
            }
            return errorDefault;
        }

       

        /// <summary>
        /// See if set attribute value conforms to attribute metadata length specification
        /// </summary>
        /// <param name="ode"></param>
        /// <param name="sourceData">Master data list to lookup extended attribute details.</param>
        /// <returns>True if value conforms to MAX lenght specification for set attribute, false if value is longer than max length.</returns>
        public static bool IsInMaxLength(this OpDataElementAtrb ode, AttributeCollection sourceData)
        {
            if (ode == null) { return true; } // Well, value not set is lenght = 0, so this is sort'a true...
            
            var atrb = GetAttribute(ode, sourceData);
            if (atrb == null) { return false; } // Not sure what to do here...

            return atrb.IsLengthCheck($"{ode.AtrbValue}");
        }


        /// <summary>
        /// Is the attribute set values database save appropriate.  Checks:
        /// DataCollectorID (DEAL_SID) must be set.
        /// AtrbID (ATRB_SID) must be set.
        /// If state is deleted, no additional checks are done.
        /// Otherwise, makes sure value can convert to proper type and conforms to length test, and value is actually set.
        /// </summary>
        /// <param name="ode"></param>
        /// <param name="sourceData">Master data list to lookup extended attribute details.</param>
        /// <returns>True if data value appear okay, else false.</returns>
        public static bool IsValid(this OpDataElementAtrb ode, AttributeCollection sourceData)
        {
            if (ode == null) { return false; }

#if DEBUG
            string debugDetails = $"DcID: {ode.DcID}, DcParentSID: {ode.DcParentID}, DcType: {ode.DcType}, DcParentType: {ode.DcParentType}, AtrbID: {ode.AtrbID}, DimID: {ode.DimID}, DimKeyString: {ode.DimKeyString}, ElementID: {ode.ElementID}, ExtraDimKeyString: {ode.ExtraDimKeyString}, State: {ode.State}\nValue: \"{ode.AtrbValue}\"";
                
#endif

            if (ode.AtrbID <= 0 || ode.DcID == 0) 
            { 
#if DEBUG
                System.Diagnostics.Debug.WriteLine(debugDetails);
                System.Diagnostics.Debug.WriteLine($"Invalid AtrbID or DcID. {ode}");
#endif
                return false; 
            }
            
            // If deleted, we don't care about the value....
            if (ode.State == OpDataElementState.Deleted) { return true; }

            // Value cannot be blanks...
            if (ode.AtrbValue == null || string.IsNullOrEmpty($"{ode.AtrbValue}".Trim())) 
            {
#if DEBUG
                System.Diagnostics.Debug.WriteLine(debugDetails);
                System.Diagnostics.Debug.WriteLine($"Attribute Value cannot be blank unless State is Deleted. {ode}");
#endif
                return false; 
            }

            
            if(AtrbValueTyped(ode, sourceData) == null)
            {
#if DEBUG
                System.Diagnostics.Debug.WriteLine(debugDetails);
                System.Diagnostics.Debug.WriteLine($"Failed type conversion. {ode}");
#endif
                return false; 
            }

            if (!IsInMaxLength(ode, sourceData))
            {
#if DEBUG
                System.Diagnostics.Debug.WriteLine(debugDetails);
                System.Diagnostics.Debug.WriteLine($"Failed length check. {ode}");
#endif
                return false;
            }

            return true;
        }



        public static OpDataCollector CopyToOpDataCollector(this List<OpDataElement> sourceData, int id, int parentId)
        {
            OpDataCollector odc = new OpDataCollector
            {
                DcID = id,
                DcParentID = parentId,
                DataElements = new List<OpDataElement>()
            };

            foreach (OpDataElement opDataElement in sourceData)
            {
                odc.DataElements.Add(opDataElement.CopyDataElement(id));
            }

            return odc;
        }

    }
}
