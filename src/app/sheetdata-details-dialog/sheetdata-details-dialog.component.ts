import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  HttpClient,
  HttpEvent,
  HttpEventType,
  HttpHeaders,
  HttpResponse,
} from '@angular/common/http';
import { environment } from '../../environments/environment.prod';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-sheetdata-details-dialog',
  templateUrl: './sheetdata-details-dialog.component.html',
  styleUrls: ['./sheetdata-details-dialog.component.css'],
})
export class SheetdataDetailsDialogComponent implements OnInit {
  userToken = localStorage.getItem('userToken');
  campaign_data = [];
  displayedColumns = ['Date', 'Cost Conv', 'Profit per Day', 'Remark'];
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private httpClient: HttpClient,
    public dialogRef: MatDialogRef<SheetdataDetailsDialogComponent>
  ) {}

  ngOnInit(): void {
    this.campaign_details();
    console.log(this.campaign_data);
  }

  campaign_details() {
    this.data.alldata.forEach((item) => {
      if (
        item.campaign == this.data.sheetdataDetail.campaign &&
        item.country == this.data.sheetdataDetail.country
      ) {
        const dates = item.date.split('-');
        const date1: any = new Date(dates[0]);
        const date2: any = new Date(dates[1]);
        const day = (date2 - date1) / (24 * 60 * 60 * 1000) + 1;
        item['conversions_per_day'] = (item['conversions'] / day).toFixed(3);
        this.campaign_data.push(item);
      }
    });
    // console.log(this.campaign_data);
    this.campaign_data.sort((a, b) => {
      const c = new Date(a.date.split('-')[1]);
      const d = new Date(b.date.split('-')[1]);
      return c < d ? 1 : -1;
    });
  }

  closeDialog() {
    this.dialogRef.close({ event: 'Cancel' });
  }
}

// const dates = data.date.split('-');
// const date1 = new Date(dates[0]);
// const date2 = new Date(dates[1]);
// // @ts-ignore
// const day = (date2 - date1) / (24 * 60 * 60 * 1000) + 1;
