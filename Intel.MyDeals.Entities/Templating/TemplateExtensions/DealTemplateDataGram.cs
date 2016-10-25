using System;


namespace Intel.MyDeals.Entities
{
	
	public partial class DealTemplateDataGram 
    {
        public bool KeyedByDimension(int matrix_dim_key)
        {
            if (String.IsNullOrEmpty(DEAL_ATRB_MTX_HASH) || matrix_dim_key <= 0) { return false; }

            return
            (
                DEAL_ATRB_MTX_HASH.StartsWith(String.Format("{0}:", matrix_dim_key))
                ||
                DEAL_ATRB_MTX_HASH.Contains(String.Format("/{0}:", matrix_dim_key))
            );
        }
    }
}
