import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'remarkFilter'
})
export class RemarkFilterPipe implements PipeTransform {

  transform(items: any[], searchText: string): unknown {
    if (!items){
      return [];
    }
    if (!searchText){
      return items;
    }
    return items.filter(folder => {
      return folder.toLowerCase().includes(searchText);
    });
  }

}
