import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'campaignTruncate'
})
export class CampaignTruncatePipe implements PipeTransform {

  transform(value: string, limit: number): string {
    if(value === null){
      return value
    }
    return value.length < limit ? value : value.slice(0,limit)+ '...';
  }

}
