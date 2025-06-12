
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'searchFilter'
})
export class SearchFilterPipe implements PipeTransform {
    transform(items: any[], searchText: string,prop: string): any[] {
        if (!items) {
            return [];
        }
        if (!searchText) {
            return items;
        }
        searchText = searchText.toLowerCase();
        return items.filter(item => {
            if(item && !!item[prop]){
            return item[prop].toLowerCase().includes(searchText);
            } 

        });
    }
}
