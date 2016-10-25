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
        /// <param name="CheckDcIDToo">When true, use the DcID and AltID in the comparison.  When false, assume those checks are done at the data collector level.</param>
        /// <returns>True if items match, else false.</returns>
        public static bool IsKeyMatch(this OpDataElementAtrb src,  OpDataElementAtrb other, bool CheckByPLIGuidPair)
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

            // If PLI, only check by guid pairs
            if (CheckByPLIGuidPair)
            {
                return (src.GuidHash() == other.GuidHash());
            }
            
            // If we have DC IDs, check them, else use alt ID.
            if(src.DcID <= 0 && other.DcID <= 0)
            {
                return (src.DcAltID == other.DcAltID);
            } 

            return (src.DcID == other.DcID);
        }

        /// <summary>
        /// Get the GUID from ExtraDimKeys from an OpDataElementAtrb
        /// </summary>
        /// <param name="ode">Valid OpDataElementAtrb</param>
        /// <param name="ATRB_CD">Guid To Get (PLI or AGR)</param>
        /// <param name="empty_is_blank">When true, treat Guid.Empty as a "not set" value (returning null), else return Guid.Empty value.</param>
        /// <returns>Guid or Null</returns>
        private static Guid? ParseGuid(OpDataElementAtrb ode, string ATRB_CD, bool empty_is_blank)
        {
            if (ode == null || ode.ExtraDimKey == null || ode.ExtraDimKey.Count == 0) { return null; }

            object ret;

            if (ode.ExtraDimKey.TryGetValue(ATRB_CD, out ret))
            {
                if (ret is Guid)
                {
                    if (empty_is_blank && (Guid)ret == Guid.Empty)
                    {
                        return null;
                    }
                    return (Guid)ret;
                }
            
                Guid gret;
                if (Guid.TryParse(String.Format("{0}", ret), out gret))
                {
                    if (empty_is_blank && gret == Guid.Empty)
                    {
                        return null;
                    }
                    return gret;
                }
            }
            return null;
        }

        /// <summary>
        /// Set the ExtraDimKey Guid value for an OpDataElementAtrb
        /// </summary>
        /// <param name="ode">Valid OpDataElementAtrb</param>
        /// <param name="ATRB_CD">Guid To Get (PLI or AGR)</param>
        /// <param name="set_value">Valid guid value to set.</param>
        /// <returns>True when value was set, False when value was cleared.</returns>
        private static bool SetExtraDimKeyGuid(OpDataElementAtrb ode, string ATRB_CD, Guid? set_value)
        {
            if (ode == null) { return false; }
            if (ode.ExtraDimKey == null) { ode.ExtraDimKey = new OpDimKeysStringObject(); }

            if (set_value == null)
            {
                if (ode.ExtraDimKey.ContainsKey(ATRB_CD))
                {
                    ode.ExtraDimKey.Remove(ATRB_CD);
                }
            }
            else
            {
                ode.ExtraDimKey[ATRB_CD] = (Guid)set_value;
                return true;
            }

            return false;
        }

        public static void SetAtrbValue(this OpDataElement de, object val, AttributeCollection attributeCollection)
        {
            // let's do a quick cheap test before calling the more expensive IsValueEqual... remember... NULL = ""
            if ((de.AtrbValue == null ? "" : de.AtrbValue.ToString()) == (val == null ? "" : val.ToString())) return;

            if (de.IsValueEqual(val, attributeCollection)) return;

            de.AtrbValue = val;
            de.State = OpDataElementState.Modified;
        }

        #region PLI_GUID
        /// <summary>
        /// Get the PLI Guid
        /// </summary>
        /// <param name="ode"></param>
        /// <returns>Valid Guid or NULL if value is not set.  Will return Guid.Empty if that is the set Guid Value</returns>
        public static Guid? PLI_GUID(this OpDataElementAtrb ode)
        {
            return ParseGuid(ode, AttributeCodes.PLI_GUID, false);
        }

        /// <summary>
        /// Get the PLI Guid
        /// </summary>
        /// <param name="ode"></param>
        /// <param name="empty_is_blank">When true, if value is set to Guid.Empty, return null as though it is not set.</param>
        /// <returns>Valid Guid or NULL if value is not set.  Guid.Empty returned based on empty_is_blank setting.</returns>
        public static Guid? PLI_GUID(this OpDataElementAtrb ode, bool empty_is_blank)
        {
            return ParseGuid(ode, AttributeCodes.PLI_GUID, empty_is_blank);
        }

        /// <summary>
        /// Set the PLI Guid
        /// </summary>
        /// <param name="ode"></param>
        /// <param name="set_value">Value to set.  When null, ExtraDimKey value will be deleted.</returns>
        /// <returns>True when value was set, False when value was cleared.</returns>
        public static bool PLI_GUID(this OpDataElementAtrb ode, Guid? set_value)
        {
            return SetExtraDimKeyGuid(ode, AttributeCodes.PLI_GUID, set_value);
        }

        /// <summary>
        /// Set the PLI Guid
        /// </summary>
        /// <param name="ode"></param>
        /// <param name="set_value">Value to set.  When null, empty (blank) or not a valid Guid string, ExtraDimKey value will be deleted.</returns>
        /// <returns>True when value was set, False when value was cleared.</returns>
        public static bool PLI_GUID(this OpDataElementAtrb ode, string set_value)
        {
            if (String.IsNullOrEmpty(set_value))
            {
                return SetExtraDimKeyGuid(ode, AttributeCodes.PLI_GUID, null);
            }

            Guid g;
            if (Guid.TryParse(set_value, out g))
            {
                return SetExtraDimKeyGuid(ode, AttributeCodes.PLI_GUID, g);
            }
            else
            {
                return SetExtraDimKeyGuid(ode, AttributeCodes.PLI_GUID, null);
            }
        }

        /// <summary>
        /// Get the PLI Guid as a string.
        /// </summary>
        /// <param name="ode"></param>
        /// <returns>String Guid or String.Empty.  Guid.Empty will return String.Empty.</returns>
        public static string PLI_GUID_STR(this OpDataElementAtrb ode)
        {
            return String.Format("{0}", ParseGuid(ode, AttributeCodes.PLI_GUID, true));
        }

        /// <summary>
        /// Get the PLI Guid as a string.
        /// </summary>
        /// <param name="ode"></param>
        /// <param name="empty_is_blank">When false, return Guid.Empty as a string value, else return it as String.Empty</param>
        /// <returns>String Guid or String.Empty.  Guid.Empty will return String.Empty.</returns>
        public static string PLI_GUID_STR(this OpDataElementAtrb ode, bool empty_is_blank)
        {
            return String.Format("{0}", ParseGuid(ode, AttributeCodes.PLI_GUID, empty_is_blank));
        }
        #endregion

        #region AGRMNT_GUID

        /// <summary>
        /// Get the AGRMNT Guid
        /// </summary>
        /// <param name="ode"></param>
        /// <returns>Valid Guid or NULL if value is not set.  Will return Guid.Empty if that is the set Guid Value</returns>
        public static Guid? AGRMNT_GUID(this OpDataElementAtrb ode)
        {
            return ParseGuid(ode, AttributeCodes.AGRMNT_GUID, false);
        }

        /// <summary>
        /// Get the AGRMNT Guid
        /// </summary>
        /// <param name="ode"></param>
        /// <param name="empty_is_blank">When true, if value is set to Guid.Empty, return null as though it is not set.</param>
        /// <returns>Valid Guid or NULL if value is not set.  Guid.Empty returned based on empty_is_blank setting.</returns>
        public static Guid? AGRMNT_GUID(this OpDataElementAtrb ode, bool empty_is_blank)
        {
            return ParseGuid(ode, AttributeCodes.AGRMNT_GUID, empty_is_blank);
        }

        /// <summary>
        /// Get the AGRMNT Guid as a string.
        /// </summary>
        /// <param name="ode"></param>
        /// <returns>String Guid or String.Empty.  Guid.Empty will return String.Empty.</returns>
        public static string AGRMNT_GUID_STR(this OpDataElementAtrb ode)
        {
            return String.Format("{0}", ParseGuid(ode, AttributeCodes.AGRMNT_GUID, true));
        }

        /// <summary>
        /// Get the AGRMNT Guid as a string.
        /// </summary>
        /// <param name="ode"></param>
        /// <param name="empty_is_blank">When false, return Guid.Empty as a string value, else return it as String.Empty</param>
        /// <returns>String Guid or String.Empty.  Guid.Empty will return String.Empty.</returns>
        public static string AGRMNT_GUID_STR(this OpDataElementAtrb ode, bool empty_is_blank)
        {
            return String.Format("{0}", ParseGuid(ode, AttributeCodes.AGRMNT_GUID, empty_is_blank));
        }

        /// <summary>
        /// Set the AGRMNT Guid
        /// </summary>
        /// <param name="ode"></param>
        /// <param name="set_value">Value to set.  When null, ExtraDimKey value will be deleted.</returns>
        /// <returns>True when value was set, False when value was cleared.</returns>
        public static bool AGRMNT_GUID(this OpDataElementAtrb ode, Guid? set_value)
        {
            return SetExtraDimKeyGuid(ode, AttributeCodes.AGRMNT_GUID, set_value);
        }

        /// <summary>
        /// Set the AGRMNT Guid
        /// </summary>
        /// <param name="ode"></param>
        /// <param name="set_value">Value to set.  When null, empty (blank) or not a valid Guid string, ExtraDimKey value will be deleted.</returns>
        /// <returns>True when value was set, False when value was cleared.</returns>
        public static bool AGRMNT_GUID(this OpDataElementAtrb ode, string set_value)
        {
            if (String.IsNullOrEmpty(set_value))
            {
                return SetExtraDimKeyGuid(ode, AttributeCodes.AGRMNT_GUID, null);
            }

            Guid g;
            if (Guid.TryParse(set_value, out g))
            {
                return SetExtraDimKeyGuid(ode, AttributeCodes.AGRMNT_GUID, g);
            }
            else
            {
                return SetExtraDimKeyGuid(ode, AttributeCodes.AGRMNT_GUID, null);
            }
        }
        #endregion

        /// <summary>
        /// A unique hash of PLI_GUID and AGRMNT_GUID, or blank if neither is set.
        /// </summary>
        public static string GuidHash(this OpDataElementAtrb ode)
        {
            if (ode == null || ode.ExtraDimKey == null || ode.ExtraDimKey.Count == 0) { return String.Empty; }

            object pg;
            object ag;

            bool found = ode.ExtraDimKey.TryGetValue(AttributeCodes.PLI_GUID, out pg);
            found |= ode.ExtraDimKey.TryGetValue(AttributeCodes.AGRMNT_GUID, out ag);

            if (found)
            {
                return String.Format("P:{0}/A:{1}", pg, ag);
            }

            return String.Empty;
        }

        /// <summary>
        /// Get first matching attribute
        /// </summary>
        public static OpDataElementAtrb GetAtrb(this List<OpDataElement> dc, string atrb_cd)
        {
            return dc.First(de => de.AtrbCd == atrb_cd);
        }

        /// <summary>
        /// Get first matching attribute
        /// </summary>
        public static OpDataElementAtrb GetAtrb(this List<OpDataElement> dc, int atrb_id)
        {
            return dc.First(de => de.AtrbID == atrb_id);
        }

        /// <summary>
        /// Get all matching attributes
        /// </summary>
        public static IEnumerable<OpDataElementAtrb> GetAtrbs(this List<OpDataElement> dc, string atrb_cd)
        {
            return dc.Where(de => de.AtrbCd == atrb_cd);
        }

        /// <summary>
        /// Get all matching attributes
        /// </summary>
        public static IEnumerable<OpDataElementAtrb> GetAtrbs(this List<OpDataElement> dc, int atrb_id)
        {
            return dc.Where(de => de.AtrbID == atrb_id);
        }

        /// <summary>
        /// Get the attribute associated with the current DataElement.
        /// This is the method that writes the AttributeCache value.
        /// </summary>
        /// <param name="ode"></param>
        /// <param name="source_data">Master Data List In which to seek attribute details.</param>
        /// <returns>Valid attribue or null when not found.</returns>
        public static MyDealsAttribute GetAttribute(this OpDataElementAtrb ode, AttributeCollection source_data)
        {
            if (ode == null || ode.AtrbID <= 0) { return null; }

            if (ode._AttributeCache != null) // Not checking type here is a moderatly big assumption, watch out...
            {
                return ode._AttributeCache as MyDealsAttribute;
            }

            if (source_data == null) { return null; }
            
            MyDealsAttribute atrb;
            if (source_data.TryGetValue(ode.AtrbID, out atrb))
            {
                ode._AttributeCache = atrb;
                return atrb;
            }
            return null;
        }


        /// <summary>
        /// Get AtrbValue strongly typed to the set DOT_NET_DATA_TYPE for the given attribute.
        /// </summary>
        /// <param name="ode"></param>
        /// <param name="source_data">Master data list to lookup extended attribute details.</param>
        /// <returns>AtrbValue converted to meta data driven type</returns>
        public static object AtrbValueTyped(this OpDataElementAtrb ode, AttributeCollection source_data)
        {
            return AtrbValueTyped(ode, source_data, false);
        }

        /// <summary>
        /// Get AtrbValue strongly typed to the set DOT_NET_DATA_TYPE for the given attribute.
        /// </summary>
        /// <param name="ode"></param>
        /// <param name="source_data">Master data list to lookup extended attribute details.</param>
        /// <param name="throwCastErrros">When true and type cannot be resolved, throw an error.</param>
        /// <returns>AtrbValue converted to meta data driven type</returns>
        public static object AtrbValueTyped(this OpDataElementAtrb ode, AttributeCollection source_data, bool throwCastErrros)
        {
            if (ode == null || ode.AtrbValue == null) { return null; }

            if (ode._AtrbValueTypedCache != null)
            {
                return ode._AtrbValueTypedCache;
            }
            
            var atrb = GetAttribute(ode, source_data);
            if (atrb == null) { return ode.AtrbValue; } // Not sure what to do here....

            ode._AtrbValueTypedCache = atrb.GetValueStronglyTyped(ode.AtrbValue, throwCastErrros);
            return ode._AtrbValueTypedCache;
        }

        /// <summary>
        /// Test to see if the passed value is equal to the current value.
        /// Comparison is done string to string.
        /// </summary>
        /// <param name="obj">Attribute with a value</param>
        /// <param name="test_value">Value to compare against.</param>
        /// <param name="errorIsFalse">When true, return false on error, else throw errors.</param>
        /// <returns>True if values are equal, else false.</returns>
        public static bool IsValueEqual(this OpDataElementAtrb obj, object test_value, AttributeCollection attributeCollection, bool errorIsFalse = true)
        {
            if(obj == null){ return false; }

            var oav = obj.AtrbValue;

            string val1  = string.Format("{0}", oav);
            string val2  = string.Format("{0}", test_value);

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
                    String.Format("{0}", atrb.GetValueStronglyTyped(oav, false))
                    ==
                    String.Format("{0}", atrb.GetValueStronglyTyped(test_value, false));
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
        /// <param name="test_value">Value to compare against.</param>
        /// <param name="errorIsFalse">When true, return false on error, else throw errors.</param>
        /// <returns>True if values are equal, else false.</returns>
        public static bool IsPrevValueEqual(this OpDataElement obj, object test_value, bool errorIsFalse, AttributeCollection attributeCollection)
        {
            if (obj == null) { return false; }

            var oav = obj.PrevAtrbValue;

            if (oav == null && test_value == null) { return true; } // Both are null, they are equal

            // We want ""==null, so this can't be here...
            // if(oav == null || test_value == null) { return false; } // One is null, the other is not, can't be equal

            var atrb = obj.GetAttribute(attributeCollection);

            try
            {
                return
                    String.Format("{0}", atrb.GetValueStronglyTyped(oav, true))
                    ==
                    String.Format("{0}", atrb.GetValueStronglyTyped(test_value, true));
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
        /// <returns>True if values are equal, else false.</returns>
        public static bool IsValueEqualPrev(this OpDataElement obj, bool errorIsFalse, AttributeCollection attributeCollection)
        {
            if (obj == null) { return false; }

            object test_value = obj.AtrbValue;
            var oav = obj.PrevAtrbValue;

            if (oav == null && test_value == null) { return true; } // Both are null, they are equal

            // We want ""==null, so this can't be here...
            // if(oav == null || test_value == null) { return false; } // One is null, the other is not, can't be equal

            var atrb = obj.GetAttribute(attributeCollection);

            try
            {
                return
                    String.Format("{0}", atrb.GetValueStronglyTyped(oav, true))
                    ==
                    String.Format("{0}", atrb.GetValueStronglyTyped(test_value, true));
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
        /// <returns>True if values are equal, else false.</returns>
        public static bool IsValueEqualOrig(this OpDataElement obj, bool errorIsFalse, AttributeCollection attributeCollection)
        {
            if (obj == null) { return false; }

            object test_value = obj.AtrbValue;
            var oav = obj.OrigAtrbValue;

            if (oav == null && test_value == null) { return true; } // Both are null, they are equal

            // We want ""==null, so this can't be here...
            // if(oav == null || test_value == null) { return false; } // One is null, the other is not, can't be equal

            var atrb = obj.GetAttribute(attributeCollection);

            try
            {
                return
                    String.Format("{0}", atrb.GetValueStronglyTyped(oav, true))
                    ==
                    String.Format("{0}", atrb.GetValueStronglyTyped(test_value, true));
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
        /// Get the Attribue Value as a specific type.
        /// Returns default(t) on error.
        /// </summary>
        /// <typeparam name="T">Target Type</typeparam>
        /// <param name="ode">Data Element with Value</param>
        /// <param name="source_data">Attribue master data collection.</param>
        /// <returns>Strong typed value or exception</returns>
        public static T AtrbValue<T>(this OpDataElementAtrb ode, AttributeCollection source_data)
        {
            return AtrbValue<T>(ode, default(T), false, source_data);
        }


        /// <summary>
        /// Get the Attribue Value as a specific type
        /// </summary>
        /// <typeparam name="T">Target Type</typeparam>
        /// <param name="ode">Data Element with Value</param>
        /// <param name="errorDefault">Value to return if the current value cannot be resolved and throwErrors is false.</param>
        /// <param name="throwCastErrors">When true, throw exceptions as opposed to returning default values.</param>
        /// <param name="source_data">Attribue master data collection.</param>
        /// <returns>Strong typed value or exception</returns>
        public static T AtrbValue<T>(this OpDataElementAtrb ode, T errorDefault, bool throwCastErrors, AttributeCollection source_data)
        {
            try
            {
                if (typeof(T) == typeof(string))
                {
                    return (T)((object)String.Format("{0}", ode.AtrbValue));
                }

                T ret = (T)ode.AtrbValueTyped(source_data, throwCastErrors);

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
        /// <param name="source_data">Master data list to lookup extended attribute details.</param>
        /// <returns>True if value conforms to MAX lenght specification for set attribute, false if value is longer than max length.</returns>
        public static bool IsInMaxLength(this OpDataElementAtrb ode, AttributeCollection source_data)
        {
            if (ode == null) { return true; } // Well, value not set is lenght = 0, so this is sort'a true...
            
            var atrb = GetAttribute(ode, source_data);
            if (atrb == null) { return false; } // Not sure what to do here...

            return atrb.IsLengthCheck(String.Format("{0}", ode.AtrbValue));
        }


        /// <summary>
        /// Is the attribute set values database save appropriate.  Checks:
        /// DataCollectorID (DEAL_SID) must be set.
        /// AtrbID (ATRB_SID) must be set.
        /// If state is deleted, no additional checks are done.
        /// Otherwise, makes sure value can convert to proper type and conforms to length test, and value is actually set.
        /// </summary>
        /// <param name="ode"></param>
        /// <param name="source_data">Master data list to lookup extended attribute details.</param>
        /// <returns>True if data value appear okay, else false.</returns>
        public static bool IsValid(this OpDataElementAtrb ode, AttributeCollection source_data)
        {
            if (ode == null) { return false; }

#if DEBUG
            string debug_details = String.Format("DcID: {0}, DcAltID: {1}, AtrbID: {2}, DimID: {3}, DimKeyString: {4}, ElementID: {5}, ExtraDimKeyString: {6}, State: {7}\nValue: \"{8}\"",
                ode.DcID,
                ode.DcAltID,
                ode.AtrbID,
                ode.DimID,
                ode.DimKeyString,
                ode.ElementID,
                ode.ExtraDimKeyString,
                ode.State,
                ode.AtrbValue
                );
                
#endif

            if (ode.AtrbID <= 0 || ode.DcID == 0) 
            { 
#if DEBUG
                System.Diagnostics.Debug.WriteLine(debug_details);
                System.Diagnostics.Debug.WriteLine("Invalid AtrbID or DcID. {0}", ode);
#endif
                return false; 
            }
            
            // If deleted, we don't care about the value....
            if (ode.State == OpDataElementState.Deleted) { return true; }

            // Value cannot be blanks...
            if (ode.AtrbValue == null || String.IsNullOrEmpty(String.Format("{0}", ode.AtrbValue).Trim())) 
            {
#if DEBUG
                System.Diagnostics.Debug.WriteLine(debug_details);
                System.Diagnostics.Debug.WriteLine("Attribute Value cannot be blank unless State is Deleted. {0}", ode);
#endif
                return false; 
            }

            
            if(AtrbValueTyped(ode, source_data) == null)
            {
#if DEBUG
                System.Diagnostics.Debug.WriteLine(debug_details);
                System.Diagnostics.Debug.WriteLine("Failed type conversion. {0}", ode);
#endif
                return false; 
            }

            if (!IsInMaxLength(ode, source_data))
            {
#if DEBUG
                System.Diagnostics.Debug.WriteLine(debug_details);
                System.Diagnostics.Debug.WriteLine("Failed length check. {0}", ode);
#endif
                return false;
            }

            return true;
        }


        /// <summary>
        /// Layer in all the prep changes on top of the deal
        /// </summary>
        /// <param name="data">Deal and/or Prep data</param>
        /// <returns>OpDataPacket contain merged data</returns>
        public static OpDataPacket<OpDataElementType> LayerPrepOnDealData(this MyDealsData data,bool bSetModified = false, bool secondaryOverridePrimary = true) // Name is as such since it omits actions and messages...
        {
            if (data == null) return null;

            if (!data.ContainsKey(OpDataElementType.Secondary) && !data.ContainsKey(OpDataElementType.Deals)) // Has to contain at least one of the two...
            {
                return null;
            }

            // If don't have both sets (i.e. I only have prep and no deal, just return it...)
            if (!data.ContainsKey(OpDataElementType.Secondary))
            {
                return data[OpDataElementType.Deals];
            }
            if (!data.ContainsKey(OpDataElementType.Deals))
            {
                return data[OpDataElementType.Secondary];
            }

            // would be nice to use the below, but need to test if it works
            // return data[OpDataElementType.Primary].LayerTargetOnSourceData(data[OpDataElementType.Secondary], bSetModified, secondaryOverridePrimary);
            
            OpDataPacket<OpDataElementType> prep = data[OpDataElementType.Secondary];
            OpDataPacket<OpDataElementType> deal = data[OpDataElementType.Deals];

            // Case 1: Have Deal record with no prep...
            // Case 2: Have Prep record with no deal...
            // Case 3: Have Prep record that updates deal data...
                // Case 3a: Deal has prep atrib already, update the value...
                // Case 3b: Deal does not have atrb record, add the atrib to the deal...


            // Before we start, we know we need to set the deal original values to the current values, do so...
            // It won't matter if we overwrite it later or not, and we want to avoid the expensive where clause,
            // so just do one pass and be done with it...
            foreach (var oded in deal.AllDataElements)
            {
                oded.OrigAtrbValue = oded.AtrbValue; // For each deal, always set the original value to the current value after download....
                oded.PrevAtrbValue = oded.AtrbValue; // For each deal, always set the original value to the current value after download....
            }

            // Case 1 is already covered, since weare returing the deal set

            foreach (var pdc in prep.Data.Values) // For each prep deal...
            {
                OpDataCollector dealCollector;
                if (!deal.Data.TryGetValue(pdc.DcID, out dealCollector)) // Case 2: Have prep deal with no deal data, so just add it...
                {
                    foreach (var odep in pdc.DataElements) // Since we didn't do this for prep deals before, do it here now...
                    {
                        odep.OrigAtrbValue = odep.AtrbValue;
                        odep.PrevAtrbValue = odep.AtrbValue;
                    }
                    deal.Data.Add(pdc);
                    continue;
                }

                // Case 3: We have both and need to merge attributes, whether that means overwriting or adding...
                foreach (var pa in pdc.DataElements) // For each prep attribute
                {
                    // Try to find the matching deal attribute
                    var matchingAtrb = dealCollector
                        .DataElements
                        .FirstOrDefault(de => de.IsKeyMatch(pa, false));

                    if (matchingAtrb == null)
                    {
                        // Case 3b: The attribute could not be found for the deal (i.e. new prep atrb record), add that atrb to thew deal...
                        pa.OrigAtrbValue = pa.AtrbValue; // Same note as above.
                        pa.PrevAtrbValue = pa.AtrbValue; // Same note as above.
                        dealCollector.DataElements.Add(pa);
                    }
                    else
                    {
                        // Case 3a: We have an atrb match, set the deal value = prep value
                        if (secondaryOverridePrimary)
                        {
                            matchingAtrb.AtrbValue = pa.AtrbValue;
                            if (!bSetModified) matchingAtrb.State = OpDataElementState.Unchanged;
                        }
                    }
                }
            }

            return deal;
        }

        public static OpDataPacket<OpDataElementType> LayerTargetOnSourceData(this OpDataPacket<OpDataElementType> sourcePacket, OpDataPacket<OpDataElementType> targetPacket, bool bSetModified = false, bool secondaryOverridePrimary = true) // Name is as such since it omits actions and messages...
        {
            //if (data == null) return null;

            // Case 1: Have sourcePacket record with no targetPacket...
            // Case 2: Have targetPacket record with no sourcePacket...
            // Case 3: Have targetPacket record that updates sourcePacket data...
            // Case 3a: sourcePacket has targetPacket atrib already, update the value...
            // Case 3b: sourcePacket does not have atrb record, add the atrib to the deal...


            // Before we start, we know we need to set the deal original values to the current values, do so...
            // It won't matter if we overwrite it later or not, and we want to avoid the expensive where clause,
            // so just do one pass and be done with it...
            foreach (var oded in sourcePacket.AllDataElements)
            {
                oded.OrigAtrbValue = oded.AtrbValue; // For each deal, always set the original value to the current value after download....
                oded.PrevAtrbValue = oded.AtrbValue; // For each deal, always set the original value to the current value after download....
            }

            // Case 1 is already covered, since weare returing the deal set

            foreach (OpDataCollector pdc in targetPacket.Data.Values) // For each target deal...
            {
                // Case 2: Have target with no source data, so just add it...
                OpDataCollector dealCollector;
                if (!sourcePacket.Data.TryGetValue(pdc.DcID, out dealCollector)) 
                {
                    foreach (var odep in pdc.DataElements) // Since we didn't do this for prep deals before, do it here now...
                    {
                        odep.OrigAtrbValue = odep.AtrbValue;
                        odep.PrevAtrbValue = odep.AtrbValue;
                    }
                    sourcePacket.Data.Add(pdc);
                    continue;
                }

                // Case 3: We have both and need to merge attributes, whether that means overwriting or adding...
                foreach (var pa in pdc.DataElements) // For each target attribute
                {
                    // Try to find the matching deal attribute
                    var matchingAtrb = dealCollector.DataElements.FirstOrDefault(de => de.IsKeyMatch(pa, false));
                    if (matchingAtrb == null)
                    {
                        // Case 3b: The attribute could not be found for the deal (i.e. new prep atrb record), add that atrb to thew deal...
                        pa.OrigAtrbValue = pa.AtrbValue; // Same note as above.
                        pa.PrevAtrbValue = pa.AtrbValue; // Same note as above.
                        dealCollector.DataElements.Add(pa);
                    }
                    else
                    {
                        // Case 3a: We have an atrb match, set the deal value = prep value
                        if (secondaryOverridePrimary)
                        {
                            matchingAtrb.AtrbValue = pa.AtrbValue;
                            if (pa.State != OpDataElementState.Unchanged) matchingAtrb.State = pa.State;
                            //if (!bSetModified) matchingAtrb.State = OpDataElementState.Unchanged;
                        }
                    }
                }
            }

            return sourcePacket;
        }

        public static OpDataCollector CopyToOpDataCollector(this List<OpDataElementUI> sourceData, int id, int parentId)
        {
            OpDataCollector odc = new OpDataCollector();

            odc.DcID = id;
            odc.DcAltID = parentId;
            odc.DataElements = new List<OpDataElement>();

            foreach (OpDataElementUI opDataElementUI in sourceData)
            {
                odc.DataElements.Add(opDataElementUI.CopyDataElement(id));
            }
            return odc;
        }

    }
}
