import * as _ from "underscore";

export class PTEUtil {
    static pivotData(PTR:any,curPT:any):any{
        if(this.isPivotable(curPT)){
            let result=[];
            //identify distinct DCID, bcz the merge will happen for each DCID and each DCID can have diff  NUM_OF_TIERS
            let distDCID=_.uniq(PTR,'DC_ID');
            _.each(distDCID,(item)=>{
               let num_tier= this.numOfPivot(item);
               for(let i=1;i<=num_tier;i++){
                let newValid={};
                let obj=JSON.parse(JSON.stringify(item));
                //setting the dimenstion values
                obj['STRT_VOL']=obj[`STRT_VOL_____10___${i}`];
                obj['TIER_NBR']=i;
                obj['RATE']=obj[`RATE_____10___${i}`];
                obj['END_VOL']=obj[`END_VOL_____10___${i}`];
                //setting the validMsg for error
                if(obj._behaviors && obj._behaviors.validMsg){
                    _.each(obj._behaviors.validMsg,(val,key) =>{
                        val=JSON.parse(val);
                        if(_.keys(val)[0]==i.toString()){
                            newValid[key]=_.values(val)[0];
                        }
                    });
                    obj._behaviors.validMsg=newValid;
                 }
                 result.push(obj);
               }
            });
            return result;
        }
        else{
            return PTR;
        }
      }
    static isPivotable(curPT:any):boolean{
      return curPT.OBJ_SET_TYPE_CD !='ECAP' ? true:false;
    }
    static numOfPivot(PTR:any):number{
     return parseInt(PTR.NUM_OF_TIERS);
    }
}