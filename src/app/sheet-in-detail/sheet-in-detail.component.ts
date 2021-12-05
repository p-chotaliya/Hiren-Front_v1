import { Component, OnInit } from '@angular/core';
// import { ActivatedRoute, Router} from '@angular/router';
// import {map} from 'rxjs/operators';
// import {HttpClient, HttpEvent, HttpEventType, HttpHeaders, HttpResponse} from '@angular/common/http';
// import {environment} from '../../environments/environment.prod';
// import  {Location} from '@angular/common';

@Component({
  selector: 'app-sheet-in-detail',
  templateUrl: './sheet-in-detail.component.html',
  styleUrls: ['./sheet-in-detail.component.css']
})
export class SheetInDetailComponent implements OnInit {
  // campaignData: any;
  // submitRemark = false;
  // newRemark: string;
  // successMessage: string;
  // userToken = localStorage.getItem('userToken');
  constructor(
  ) {
  }

  ngOnInit(): void {
    // this.route.paramMap.pipe(map(() => {
    //   window.history.state;
    // })).subscribe(data => {
    //   this.campaign = data['item'];
    // });
    // this.campaignData = window.history.state.data;
    // if (typeof(this.campaignData) == 'undefined'){
    //   this.backToSheet();
    // }
    ////console.log(this.campaignData);
  }

  // backToSheet(){
  //   this._location.back();
  // }
  // remarkchange(event){
  //   this.newRemark = event.target.value;
  //   ////console.log(this.newRemark);
  // }
  //
  // changeRemark(){
  //
  //   this.submitRemark = true;
  //   const body = {
  //     remark : this.newRemark,
  //     username : localStorage.getItem('username'),
  //     campaign : this.campaignData.campaign,
  //     country : this.campaignData.country,
  //     date : this.campaignData.date
  //   };
  //   ////console.log(body);
  //   this.httpClient.post<any>(`${environment.api_url}/sheet/changeRemark`, body, { headers: new HttpHeaders(
  //       { Authorization: 'Bearer ' + this.userToken },
  //     )}).subscribe(
  //     res => {
  //       this.successMessage = res.message;
  //       ////console.log(this.successMessage);
  //       setTimeout(() => {
  //         this.successMessage = '';
  //       }, 2000);
  //       this.submitRemark = false;
  //     }, err => {
  //       ////console.log(err);
  //       this.submitRemark = false;
  //     }
  //   );
  // }
}
