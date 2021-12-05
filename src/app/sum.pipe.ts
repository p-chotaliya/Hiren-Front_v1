import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sum'
})
export class SumPipe implements PipeTransform {

  transform(item: any [], attr: string): any {
    const sum =  item.reduce((a, b) => Number(a) + Number(b[attr]), 0);
    return sum.toFixed(3);
  }

}
