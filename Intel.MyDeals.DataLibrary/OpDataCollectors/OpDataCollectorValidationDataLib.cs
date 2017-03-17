using Intel.MyDeals.DataAccessLib;
using Intel.MyDeals.DataAccessLib.StoredProcedures.MyDeals.dbo;
using Intel.MyDeals.Entities;

namespace Intel.MyDeals.DataLibrary.OpDataCollectors
{
    public class OpDataCollectorValidationDataLib
    {

        /// <summary>
        /// Check object for duplicate title existing via DB call PR_MYDL_OBJ_DATA_VLD.  Contract level must be unique, Lower levels must be unique
        /// from within the contract only.
        /// </summary>
        /// <param name="currObj">Contract</param>
        /// <param name="dcId">ID of object</param>
        /// <param name="parentDcId">ID of parent object</param>
        /// <param name="title">Title to check if unique</param>
        /// <returns>True = There are duplicates, False = Good to use this title</returns>
        public bool IsDuplicateTitle(OpDataElementType currObj, int dcId, int parentDcId, string title)
        {
            int objTypeId = currObj.ToId();
            int parentTypeId = currObj.GetParent().ToId();

            using (var rdr = DataAccess.ExecuteReader(new PR_MYDL_OBJ_DATA_VLD
            {
                in_obj_type_sid = objTypeId,
                in_obj_sid = dcId,
                in_obj_nm = title,
                in_parnt_obj_type_sid = parentTypeId,
                in_parnt_obj_sid = parentDcId
            }))
            {
                if (rdr.HasRows) return true;
            }
            return false;
        }

    }
}
