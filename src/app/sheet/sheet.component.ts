import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  HttpClient,
  HttpEvent,
  HttpEventType,
  HttpHeaders,
  HttpResponse,
} from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment.prod';
import { MatSelect } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { SheetdataDetailsDialogComponent } from '../sheetdata-details-dialog/sheetdata-details-dialog.component';
import { Clipboard } from '@angular/cdk/clipboard';

declare var $: any;

@Component({
  selector: 'app-sheet',
  templateUrl: './sheet.component.html',
  styleUrls: ['./sheet.component.css'],
})
export class SheetComponent implements OnInit {
  constructor(
    private formBuilder: FormBuilder,
    private httpClient: HttpClient,
    public router: Router,
    private _snackBar: MatSnackBar,
    public Dialog: MatDialog,
    private clipboard: Clipboard
  ) {}
  @ViewChild('fileinput1') myfileiput1: ElementRef;
  @ViewChild('fileinput2') myfileiput2: ElementRef;
  @ViewChild('fileinput3') myfileiput3: ElementRef;
  @ViewChild('selectDropdown1') selectDropdown1: MatSelect;
  @ViewChild('selectDropdown2') selectDropdown2: MatSelect;
  @ViewChild('selectDropdown3') selectDropdown3: MatSelect;
  @ViewChild('selectDate') selectDate: ElementRef;
  @ViewChild('selectCampaign') selectCampaign: ElementRef;
  // @ViewChild('stickyhead') tablestickyhead :ElementRef;
  tablehead = false;
  tableheadposition: any;
  errorMessage = '';
  sortlist = {
    Profit: true,
    Earning: true,
    Cost: true,
    ProfitPercent: true,
    Remark: true,
    ecpm: true,
  };
  sortlistAce = {
    Profit: false,
    Earning: false,
    Cost: false,
    ProfitPercent: false,
    Remark: false,
    ecpm: false,
  };
  sortlistDesc = {
    Profit: false,
    Earning: false,
    Cost: false,
    ProfitPercent: false,
    Remark: false,
    ecpm: false,
  };
  listcolor: any[];
  userFiles;
  uploadForm: FormGroup;
  uploadedFile: Array<3> = [null, null, null];
  DisableUploadButtom = false;
  data;
  aftercampaign_select_Data;
  afterdate_select_Data;
  tempreplica;
  Replicadata;
  date;
  campaignList;
  sheet1_Validation = false;
  remarkcheck = false;
  searchDate;
  searchCampaign;
  USD = 63;
  userToken = localStorage.getItem('userToken');
  sheet1 = 'select';
  sheet2 = 'select';
  sheet3 = 'select';
  url1;
  url2;
  url3;
  dateinput;
  campaigninput;
  sheet1input;
  selectedDate = '';
  selectedCampaign = '';
  edited_remark;
  tempcounter: number = 0;

  openDialog(item: any) {
    const dialogRef = this.Dialog.open(SheetdataDetailsDialogComponent, {
      data: {
        sheetdataDetail: item,
        alldata: this.Replicadata,
      },
    });
  }
  ngOnInit(): void {
    this.listcolor = [
      { title: 'red', checked: true, name: '0 and Below 0%' },
      { title: 'limegreen', checked: true, name: 'Above 100%' },
      { title: 'Yellow', checked: true, name: '81% to 100%' },
      { title: 'skyblue', checked: true, name: '51% to 80%' },
      { title: 'grey', checked: true, name: '1% to 50%' },
      { title: '#32CD32', checked: false, name: 'Infinity' },
      { title: 'NaN', checked: false, name: 'NaN' },
    ];
    this.getData();
    this.getCampaign();
    this.getFileName();
    this.uploadForm = this.formBuilder.group({
      uploadedsheet1: [''],
      uploadedsheet2: [''],
      uploadedsheet3: [''],
    });
    // this.changeFilter();
  }

  // ngAfterViewInit(): void{
  //   this.tableheadposition = this.tablestickyhead.nativeElement.offsetTop;
  //   console.log("tableheadposition",this.tableheadposition);
  // }
  // @HostListener('window:scroll',['$event'])
  // handleScroll(){
  //   const windowScroll = window.pageYOffset;
  //   console.log("windowScroll",windowScroll)
  //   if(windowScroll > this.tableheadposition){
  //     this.tablehead = true;
  //   } else {
  //     this.tablehead = false;
  //   }
  // }

  copyToClipboard(value) {
    this.clipboard.copy(value);
    this.openSnackBar_success('campaign name copied to clipboard');
  }
  changeFilter_on_pageload_first() {
    this.selectedDate = 'None';
    this.selectedCampaign = 'None';
    this.searchDate = 'None';
    this.searchCampaign = 'None';
  }

  openSnackBar() {
    this._snackBar.open(this.errorMessage, 'close', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['errorSnackbar'],
    });
  }
  openSnackBar_success(message) {
    this._snackBar.open(message, 'close', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['successSnackbar'],
    });
  }
  openSnackBar_error(message) {
    this._snackBar.open(message, 'close', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['errorSnackbar'],
    });
  }

  getFileName() {
    const username = localStorage.getItem('username');
    this.httpClient
      .get<any>(`${environment.api_url}/sheet/files/${username}`, {
        headers: new HttpHeaders({ Authorization: 'Bearer ' + this.userToken }),
      })
      .subscribe(
        (res) => {
          const tempFile = res.files;
          const temp = [];
          tempFile.forEach((item) => {
            const itempath = item.path.split('.');
            // ////console.log(itempath);
            if (itempath[itempath.length - 1] == 'csv') {
              temp.push(item);
            }
          });
          // ////console.log('temp', temp);
          this.userFiles = temp;
          ////console.log('this.userFiles', this.userFiles);
        },
        (err) => {
          ////console.log(err);
        }
      );
  }

  onselectsheet1(event) {
    this.sheet1_Validation = false;
    const path1 = event;
    let path2: string[];
    path2 = path1.split('\\');
    let fstring = '';
    for (let i = 0; i < path2.length; i++) {
      if (i != path2.length - 1) {
        fstring = fstring + path2[i] + '\\\\';
      } else {
        fstring = fstring + path2[i];
      }
    }
    this.sheet1 = fstring;
    if (this.sheet1 != 'select') {
      this.uploadForm.get('uploadedsheet1').setValue('');
      this.myfileiput1.nativeElement.value = '';
    }
    ////console.log(this.uploadForm.get('uploadedsheet1').value);
    ////console.log(this.sheet1);
  }
  onselectsheet2(event) {
    const path1 = event;
    let path2: string[];
    path2 = path1.split('\\');
    let fstring = '';
    for (let i = 0; i < path2.length; i++) {
      if (i != path2.length - 1) {
        fstring = fstring + path2[i] + '\\\\';
      } else {
        fstring = fstring + path2[i];
      }
    }
    this.sheet2 = fstring;
    if (this.sheet2 != 'select') {
      this.uploadForm.get('uploadedsheet2').setValue('');
      this.myfileiput2.nativeElement.value = '';
    }
    ////console.log(this.uploadForm.get('uploadedsheet2').value);
    ////console.log(this.sheet2);
  }
  onselectsheet3(event) {
    const path1 = event;
    let path2: string[];
    path2 = path1.split('\\');
    let fstring = '';
    for (let i = 0; i < path2.length; i++) {
      if (i != path2.length - 1) {
        fstring = fstring + path2[i] + '\\\\';
      } else {
        fstring = fstring + path2[i];
      }
    }
    this.sheet3 = fstring;
    if (this.sheet3 != 'select') {
      this.uploadForm.get('uploadedsheet3').setValue('');
      this.myfileiput3.nativeElement.value = '';
    }
    ////console.log(this.uploadForm.get('uploadedsheet3').value);
    ////console.log(this.sheet3);
  }

  onuploadsheet1(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      // //////console.log(file);
      this.uploadForm.get('uploadedsheet1').setValue(file);
    }
    if (this.uploadForm.get('uploadedsheet1').value != '') {
      this.sheet1 = 'select';
    }
    ////console.log(this.uploadForm.get('uploadedsheet1').value);
    ////console.log(this.sheet1);
  }
  onuploadsheet2(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      // //////console.log(file);
      this.uploadForm.get('uploadedsheet2').setValue(file);
    }
    if (this.uploadForm.get('uploadedsheet2').value != '') {
      this.sheet2 = 'select';
    }
    ////console.log(this.uploadForm.get('uploadedsheet2').value);
    ////console.log(this.sheet2);
  }
  onuploadsheet3(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      // //////console.log(file);
      this.uploadForm.get('uploadedsheet3').setValue(file);
    }
    if (this.uploadForm.get('uploadedsheet3').value != '') {
      this.sheet3 = 'select';
    }
    ////console.log(this.uploadForm.get('uploadedsheet3').value);
    ////console.log(this.sheet3);
  }

  costSort() {
    this.sortlist.Cost = false;
    this.sortlist.Profit = true;
    this.sortlist.ProfitPercent = true;
    this.sortlist.Earning = true;
    this.sortlist.Remark = true;
    this.sortlist.ecpm = true;
    if (this.sortlistDesc.Cost == false) {
      this.sortlistAce.Cost = false;
      this.sortlistDesc.Cost = true;
      this.sortlistAce.Profit = false;
      this.sortlistAce.ProfitPercent = false;
      this.sortlistAce.Earning = false;
      this.sortlistAce.Remark = false;
      this.sortlistAce.ecpm = false;
      this.sortlistDesc.Profit = false;
      this.sortlistDesc.ProfitPercent = false;
      this.sortlistDesc.Earning = false;
      this.sortlistDesc.Remark = false;
      this.sortlistDesc.ecpm = false;
      this.data.sort((a, b) => {
        return (b.cost as any) - a.cost;
      });
    } else {
      this.sortlistDesc.Cost = false;
      this.sortlistAce.Cost = true;
      this.data.sort((a, b) => {
        return (a.cost as any) - b.cost;
      });
    }
  }
  earningSort() {
    this.sortlist.Cost = true;
    this.sortlist.Profit = true;
    this.sortlist.ProfitPercent = true;
    this.sortlist.Earning = false;
    this.sortlist.Remark = true;
    this.sortlist.ecpm = true;
    if (this.sortlistDesc.Earning == false) {
      this.sortlistAce.Earning = false;
      this.sortlistDesc.Earning = true;
      this.sortlistAce.Profit = false;
      this.sortlistAce.ProfitPercent = false;
      this.sortlistAce.Cost = false;
      this.sortlistAce.Remark = false;
      this.sortlistAce.ecpm = false;
      this.sortlistDesc.Profit = false;
      this.sortlistDesc.ProfitPercent = false;
      this.sortlistDesc.Cost = false;
      this.sortlistDesc.Remark = false;
      this.sortlistDesc.ecpm = false;
      this.data.sort((a, b) => {
        return (b.Earning as any) - a.Earning;
      });
    } else {
      this.sortlistDesc.Earning = false;
      this.sortlistAce.Earning = true;
      this.data.sort((a, b) => {
        return (a.Earning as any) - b.Earning;
      });
    }
  }
  profitSort() {
    this.sortlist.Cost = true;
    this.sortlist.Profit = false;
    this.sortlist.ProfitPercent = true;
    this.sortlist.Earning = true;
    this.sortlist.Remark = true;
    this.sortlist.ecpm = true;
    if (this.sortlistDesc.Profit == false) {
      this.sortlistAce.Profit = false;
      this.sortlistDesc.Profit = true;
      this.sortlistAce.Cost = false;
      this.sortlistAce.ProfitPercent = false;
      this.sortlistAce.Earning = false;
      this.sortlistAce.Remark = false;
      this.sortlistAce.ecpm = false;
      this.sortlistDesc.Cost = false;
      this.sortlistDesc.ProfitPercent = false;
      this.sortlistDesc.Earning = false;
      this.sortlistDesc.Remark = false;
      this.sortlistDesc.ecpm = false;
      this.data.sort((a, b) => {
        return (b.Profit as any) - a.Profit;
      });
    } else {
      this.sortlistDesc.Profit = false;
      this.sortlistAce.Profit = true;
      this.data.sort((a, b) => {
        return (a.Profit as any) - b.Profit;
      });
    }
  }
  profitPercentSort() {
    this.sortlist.Cost = true;
    this.sortlist.Profit = true;
    this.sortlist.ProfitPercent = false;
    this.sortlist.Earning = true;
    this.sortlist.Remark = true;
    this.sortlist.ecpm = true;
    if (this.sortlistDesc.ProfitPercent == false) {
      this.sortlistAce.ProfitPercent = false;
      this.sortlistDesc.ProfitPercent = true;
      this.sortlistAce.Profit = false;
      this.sortlistAce.Cost = false;
      this.sortlistAce.Earning = false;
      this.sortlistAce.Remark = false;
      this.sortlistAce.ecpm = false;
      this.sortlistDesc.Profit = false;
      this.sortlistDesc.Cost = false;
      this.sortlistDesc.Earning = false;
      this.sortlistDesc.Remark = false;
      this.sortlistDesc.ecpm = false;
      this.data.sort((a, b) => {
        return (b.ProfitPercent as any) - a.ProfitPercent;
      });
    } else {
      this.sortlistDesc.ProfitPercent = false;
      this.sortlistAce.ProfitPercent = true;
      this.data.sort((a, b) => {
        return (a.ProfitPercent as any) - b.ProfitPercent;
      });
    }
  }
  remarkSort() {
    // console.log(this.data);
    this.sortlist.Cost = true;
    this.sortlist.Profit = true;
    this.sortlist.ProfitPercent = true;
    this.sortlist.Earning = true;
    this.sortlist.Remark = false;
    this.sortlist.ecpm = true;
    if (this.sortlistDesc.Remark == false) {
      this.sortlistAce.Remark = false;
      this.sortlistDesc.Remark = true;
      this.sortlistAce.Profit = false;
      this.sortlistAce.ProfitPercent = false;
      this.sortlistAce.Earning = false;
      this.sortlistAce.ecpm = false;
      this.sortlistAce.Cost = false;
      this.sortlistDesc.Profit = false;
      this.sortlistDesc.ProfitPercent = false;
      this.sortlistDesc.Earning = false;
      this.sortlistDesc.Cost = false;
      this.sortlistDesc.ecpm = false;
      this.data.sort((a, b) => {
        const fa = a.remark;
        const fb = b.remark;
        if (fa === null || fa == '') {
          return 1;
        } else if (fb === null || fb == '') {
          return -1;
        } else if (fa < fb) {
          return 1;
        } else if (fa > fb) {
          return -1;
        }
      });
      // this.data.sort((a,b)=>{return (a.remark===null)-(b.remark===null) || -(a.remark>b.remark)||+(a.remark<b.remark)})
    } else {
      this.sortlistDesc.Remark = false;
      this.sortlistAce.Remark = true;
      this.data.sort((a, b) => {
        const fa = a.remark;
        const fb = b.remark;
        if (fa === null || fa == '') {
          return 1;
        } else if (fb === null || fb == '') {
          return -1;
        } else if (fa < fb) {
          return -1;
        } else if (fa > fb) {
          return 1;
        }
      });
      // this.data.sort((a,b)=>{return (a.remark===null)-(b.remark===null) || +(a.remark>b.remark)||-(a.remark<b.remark)})
    }
  }
  ecpmSort() {
    this.sortlist.Cost = true;
    this.sortlist.Profit = true;
    this.sortlist.ProfitPercent = true;
    this.sortlist.Earning = true;
    this.sortlist.Remark = true;
    this.sortlist.ecpm = false;
    if (this.sortlistDesc.ecpm == false) {
      this.sortlistAce.Profit = false;
      this.sortlistDesc.Profit = false;
      this.sortlistAce.Cost = false;
      this.sortlistAce.ProfitPercent = false;
      this.sortlistAce.Earning = false;
      this.sortlistAce.Remark = false;
      this.sortlistAce.ecpm = false;
      this.sortlistDesc.Cost = false;
      this.sortlistDesc.ProfitPercent = false;
      this.sortlistDesc.Earning = false;
      this.sortlistDesc.Remark = false;
      this.sortlistDesc.ecpm = true;
      this.data.sort((a, b) => {
        return (b.Rpm as any) - a.Rpm;
      });
    } else {
      this.sortlistDesc.ecpm = false;
      this.sortlistAce.ecpm = true;
      this.data.sort((a, b) => {
        return (a.Rpm as any) - b.Rpm;
      });
    }
  }
  colorSort() {
    // console.log(this.sortlist)
    this.data = this.afterdate_select_Data;
    const color = [];
    this.listcolor.forEach((item) => {
      if (item.checked == true) {
        color.push(item.title);
      }
    });
    if (color.length == 7) {
      ////console.log('4');
      this.data = this.afterdate_select_Data;
    } else {
      const temp = [];
      this.data.forEach((item) => {
        if (color.includes(item.ProfitFlageColor)) {
          temp.push(item);
        }
      });
      // //console.log(temp);
      this.data = temp;
      this.checkallSortFilter();
      this.checkRemarkFilter();
    }
  }

  onUSDchange(event) {
    const username = localStorage.getItem('username');
    this.httpClient
      .get<any>(`${environment.api_url}/sheet/sheetdata/${username}`, {
        headers: new HttpHeaders({ Authorization: 'Bearer ' + this.userToken }),
      })
      .subscribe(
        (res) => {
          const Tdata = res.data.map((data) => {
            const costtemp = Number(data.cost) / this.USD;
            const Earningtemp = Number(data.A_cost) + Number(data.B_cost);
            const Profittemp = Earningtemp - costtemp;
            let ConversionsTemp;
            if (data.conversions !== null) {
              ConversionsTemp = data.conversions.replace(/,/, '');
            } else {
              ConversionsTemp = data.conversions;
            }
            let ProfitPercenttemp = (Profittemp * 100) / costtemp;
            let ProfitFlage = '';
            if (ProfitPercenttemp < 0) {
              ProfitFlage = 'red';
            } else if (ProfitPercenttemp >= 1 && ProfitPercenttemp <= 50) {
              ProfitFlage = 'grey';
            } else if (ProfitPercenttemp >= 51 && ProfitPercenttemp <= 80) {
              ProfitFlage = 'skyblue';
            } else if (ProfitPercenttemp >= 81 && ProfitPercenttemp <= 100) {
              ProfitFlage = 'Yellow';
            } else if (
              ProfitPercenttemp >= 100 &&
              ProfitPercenttemp < Infinity
            ) {
              ProfitFlage = 'limegreen';
            } else if (ProfitPercenttemp === Infinity) {
              ProfitFlage = '#32CD32';
              ProfitPercenttemp = 100000;
            } else if (ProfitFlage === '') {
              ProfitFlage = 'NaN';
              ProfitPercenttemp = 0;
            }
            const dates = data.date.split('-');
            const date1 = new Date(dates[0]);
            const date2 = new Date(dates[1]);
            // @ts-ignore
            const day = (date2 - date1) / (24 * 60 * 60 * 1000) + 1;
            // console.log(day);
            const tempdata = {
              campaign: data.campaign,
              country: data.country,
              conversions: Number(ConversionsTemp),
              cost_conv: Number(data.cost_conv),
              conv_rate: data.conv_rate,
              date: data.date,
              cost: costtemp.toFixed(3),
              A_cost: Number(data.A_cost),
              B_cost: Number(data.B_cost),
              remark: data.remark,
              Earning: Earningtemp.toFixed(3),
              Profit: Profittemp.toFixed(3),
              ProfitPercent: ProfitPercenttemp.toFixed(1),
              Rpm: Number(data.rpm).toFixed(3),
              ProfitFlageColor: ProfitFlage,
              PerDayProfit: (Profittemp / day).toFixed(3),
              Remark_editable: true,
            };
            return tempdata;
          });
          this.Replicadata = Tdata;
          const tempdata = [];
          this.Replicadata.forEach((item) => {
            if (item.campaign.includes(this.searchCampaign)) {
              tempdata.push(item);
            }
          });
          this.aftercampaign_select_Data = tempdata;
          const tempdata1 = [];
          this.aftercampaign_select_Data.forEach((item) => {
            if (item.date == this.searchDate) {
              tempdata1.push(item);
            }
          });
          this.afterdate_select_Data = tempdata1;
          this.checkallFilter();
          this.checkRemarkFilter();
        },
        (err) => {
          ////console.log(err);
        }
      );
  }

  Make_remark_Editable(item, remark) {
    // console.log('remark' + remark);
    this.edited_remark = remark;
    for (let i = 0; i < this.data.length; i++) {
      if (
        item.campaign == this.data[i].campaign &&
        item.date == this.data[i].date &&
        item.country == this.data[i].country
      ) {
        this.data[i].Remark_editable = false;
      }
    }
    console.log('Make_remark_Editable ', this.edited_remark);
  }

  change_remark(event) {
    console.log('change remark ', event.target.value);
    this.edited_remark = event.target.value;
  }
  focusin_remark(event) {
    console.log('focusin remark ', event.target.value);
    this.edited_remark = event.target.value;
  }
  focusout_remark(event, item) {
    // console.log('focusout');
    // console.log(event.target.value);
    // console.log('item',item)
    if (this.edited_remark !== null) {
      // console.log(this.edited_remark)
      this.update_remark(item);
    }
  }

  update_remark(item) {
    console.log('update remark');
    const body = {
      remark: this.edited_remark,
      username: localStorage.getItem('username'),
      campaign: item.campaign,
      country: item.country,
      date: item.date,
    };
    // console.log(body);
    this.httpClient
      .post<any>(`${environment.api_url}/sheet/changeRemark`, body, {
        headers: new HttpHeaders({ Authorization: 'Bearer ' + this.userToken }),
      })
      .subscribe(
        (res) => {
          // console.log(res);
          for (let i = 0; i < this.data.length; i++) {
            if (
              body.campaign == this.data[i].campaign &&
              body.date == this.data[i].date &&
              body.country == this.data[i].country
            ) {
              // console.log('this.data')
              // console.log(this.edited_remark)
              this.data[i].remark = this.edited_remark;
              this.data[i].Remark_editable = true;
            }
          }
          for (let j = 0; j < this.Replicadata.length; j++) {
            if (
              body.campaign == this.Replicadata[j].campaign &&
              body.date == this.Replicadata[j].date &&
              body.country == this.Replicadata[j].country
            ) {
              // console.log('this.Replicadat')
              // console.log(this.edited_remark)
              this.Replicadata[j].remark = this.edited_remark;
              this.Replicadata[j].Remark_editable = true;
            }
          }
          for (let k = 0; k < this.aftercampaign_select_Data.length; k++) {
            if (
              body.campaign == this.aftercampaign_select_Data[k].campaign &&
              body.date == this.aftercampaign_select_Data[k].date &&
              body.country == this.aftercampaign_select_Data[k].country
            ) {
              // console.log('this.after _camoaife')
              // console.log(this.edited_remark)
              this.aftercampaign_select_Data[k].remark = this.edited_remark;
              this.aftercampaign_select_Data[k].Remark_editable = true;
            }
          }
          for (let l = 0; l < this.afterdate_select_Data.length; l++) {
            if (
              body.campaign == this.afterdate_select_Data[l].campaign &&
              body.date == this.afterdate_select_Data[l].date &&
              body.country == this.afterdate_select_Data[l].country
            ) {
              // console.log('this.after date')
              // console.log(this.edited_remark)
              this.afterdate_select_Data[l].remark = this.edited_remark;
              this.afterdate_select_Data[l].Remark_editable = true;
            }
          }
          this.openSnackBar_success(res.message);
        },
        (err) => {
          console.log(err);
        }
      );
  }

  deleteData() {
    const username = localStorage.getItem('username');
    if (
      this.selectedDate == 'None' ||
      this.selectedCampaign == 'None' ||
      this.selectedDate == '' ||
      this.selectedCampaign == ''
    ) {
      this.openSnackBar_error('please select Campaign and Date');
    } else {
      const confirmation = confirm(
        'Are you Sure you want to DELETE selected data'
      );
      this.httpClient
        .delete<any>(
          `${environment.api_url}/sheet/deleteData/${username}/${this.selectedCampaign}/${this.selectedDate}`,
          {
            headers: new HttpHeaders({
              Authorization: 'Bearer ' + this.userToken,
            }),
          }
        )
        .subscribe(
          (res) => {
            // console.log(res.message);
            this.openSnackBar_success(res.message);
            this.getData();
            this.getCampaign();
          },
          (err) => {
            console.log(err);
          }
        );
    }
  }

  getRecentData() {
    const username = localStorage.getItem('username');
    const recentCampaign = this.data[0].campaign.split('-')[0].trim();
    const recentDate = this.data[0].date;
    this.selectedDate = recentDate;
    this.selectedCampaign = recentCampaign;
    // this.selectCampaign.nativeElement.value = recentCampaign;
    // this.selectDate.nativeElement.value = recentDate;
    this.searchDate = recentDate;
    this.searchCampaign = recentCampaign;
    let searchCampaignTemp = recentCampaign;
    this.httpClient
      .get<any>(
        `${environment.api_url}/sheet/getdateby/${username}/${searchCampaignTemp}`,
        {
          headers: new HttpHeaders({
            Authorization: 'Bearer ' + this.userToken,
          }),
        }
      )
      .subscribe(
        (res) => {
          // console.log(res.date)
          this.date = res.date;
          this.date.sort((a, b) => {
            const c = new Date(a.date.split('-')[1]);
            const d = new Date(b.date.split('-')[1]);
            return c < d ? 1 : -1;
          });
          // ////console.log(this.date);
        },
        (err) => {
          ////console.log(err);
        }
      );
    const tempdata = [];
    this.Replicadata.forEach((item) => {
      if (item.campaign.includes(recentCampaign)) {
        tempdata.push(item);
      }
    });
    this.aftercampaign_select_Data = tempdata;
    const tempdata1 = [];
    this.aftercampaign_select_Data.forEach((item) => {
      if (item.date == recentDate) {
        tempdata1.push(item);
      }
    });
    this.afterdate_select_Data = tempdata1;
    this.checkallFilter();
    this.checkRemarkFilter();
  }
  getData() {
    const username = localStorage.getItem('username');
    this.httpClient
      .get<any>(`${environment.api_url}/sheet/sheetdata/${username}`, {
        headers: new HttpHeaders({ Authorization: 'Bearer ' + this.userToken }),
      })
      .subscribe(
        (res) => {
          const Tdata = res.data.map((data) => {
            const costtemp = Number(data.cost) / this.USD;
            const Earningtemp = Number(data.A_cost) + Number(data.B_cost);
            const Profittemp = Earningtemp - costtemp;
            let ConversionsTemp;
            if (data.conversions !== null) {
              ConversionsTemp = data.conversions.replace(/,/, '');
            } else {
              ConversionsTemp = data.conversions;
            }
            let ProfitPercenttemp = (Profittemp * 100) / costtemp;
            let ProfitFlage = '';
            if (ProfitPercenttemp < 0) {
              ProfitFlage = 'red';
            } else if (ProfitPercenttemp > 0 && ProfitPercenttemp <= 50) {
              ProfitFlage = 'grey';
            } else if (ProfitPercenttemp > 50 && ProfitPercenttemp <= 80) {
              ProfitFlage = 'skyblue';
            } else if (ProfitPercenttemp > 80 && ProfitPercenttemp <= 100) {
              ProfitFlage = 'Yellow';
            } else if (
              ProfitPercenttemp > 100 &&
              ProfitPercenttemp < Infinity
            ) {
              ProfitFlage = 'limegreen';
            } else if (ProfitPercenttemp === Infinity) {
              ProfitFlage = '#32CD32';
              ProfitPercenttemp = 100000;
            } else if (ProfitFlage === '') {
              ProfitFlage = 'NaN';
              ProfitPercenttemp = 0;
            }
            const dates = data.date.split('-');
            const date1 = new Date(dates[0]);
            const date2 = new Date(dates[1]);
            // @ts-ignore
            const day = (date2 - date1) / (24 * 60 * 60 * 1000) + 1;
            // console.log(day);
            const tempdata = {
              campaign: data.campaign,
              country: data.country,
              conversions: Number(ConversionsTemp),
              cost_conv: Number(data.cost_conv),
              conv_rate: data.conv_rate,
              date: data.date,
              cost: costtemp.toFixed(3),
              A_cost: Number(data.A_cost),
              B_cost: Number(data.B_cost),
              remark: data.remark,
              Earning: Earningtemp.toFixed(3),
              Profit: Profittemp.toFixed(3),
              ProfitPercent: ProfitPercenttemp.toFixed(1),
              Rpm: Number(data.rpm).toFixed(3),
              ProfitFlageColor: ProfitFlage,
              PerDayProfit: (Profittemp / day).toFixed(3),
              Remark_editable: true,
            };
            return tempdata;
          });
          this.Replicadata = Tdata;
          const templist = ['#32CD32', 'NaN'];
          const new_data = [];
          Tdata.forEach((item) => {
            if (!templist.includes(item.ProfitFlageColor)) {
              new_data.push(item);
            }
          });
          this.tempreplica = new_data;
          this.data = new_data;

          if (this.tempcounter === 0) {
            this.changeFilter_on_pageload_first();
            this.tempcounter += 1;
          } else {
            this.getRecentData();
          }
          // if(this.tempcounter !== 0){
          //   this.getRecentData();
          // }
        },
        (err) => {
          ////console.log(err);
          this.DisableUploadButtom = false;
        }
      );
    this.sortlist = {
      Profit: true,
      Earning: true,
      Cost: true,
      ProfitPercent: true,
      Remark: true,
      ecpm: true,
    };
    this.sortlistAce = {
      Profit: false,
      Earning: false,
      Cost: false,
      ProfitPercent: false,
      Remark: false,
      ecpm: false,
    };
    this.sortlistDesc = {
      Profit: false,
      Earning: false,
      Cost: false,
      ProfitPercent: false,
      Remark: false,
      ecpm: false,
    };
  }
  getCampaign() {
    ////console.log();
    const username = localStorage.getItem('username');
    // this.httpClient.get<any>(`${environment.api_url}/sheet/getdate/${username}`, { headers: new HttpHeaders(
    //     { Authorization: 'Bearer ' + this.userToken },
    //   )}).subscribe(
    //   res => {
    //     this.date = res.data;
    //     ////console.log(this.date);
    //   }, err => {
    //     ////console.log(err);
    //   }
    // );
    this.httpClient
      .get<any>(`${environment.api_url}/sheet/sheetdata/${username}`, {
        headers: new HttpHeaders({ Authorization: 'Bearer ' + this.userToken }),
      })
      .subscribe(
        (res) => {
          const tempcampaign = [];
          res.data.forEach((item) => {
            if (!tempcampaign.includes(item.campaign.split('-')[0].trim())) {
              tempcampaign.push(item.campaign.split('-')[0].trim());
            }
          });
          this.campaignList = tempcampaign;
        },
        (err) => {
          ////console.log(err);
        }
      );
  }

  onChangeDate(event) {
    this.searchDate = event;
    const tempdata = [];
    this.aftercampaign_select_Data.forEach((item) => {
      if (item.date == event) {
        tempdata.push(item);
      }
    });
    this.data = tempdata;
    this.afterdate_select_Data = tempdata;
    this.checkallFilter();
  }

  onCampaignChange(event) {
    // this.tempcounter+=1;
    this.selectedDate = 'None';
    this.searchDate = 'None';
    this.searchCampaign = event;
    const username = localStorage.getItem('username');
    // this.searchCampaign)
    let searchCampaignTemp = this.searchCampaign;
    if (searchCampaignTemp == '') {
      searchCampaignTemp = 'P';
    }
    this.httpClient
      .get<any>(
        `${environment.api_url}/sheet/getdateby/${username}/${searchCampaignTemp}`,
        {
          headers: new HttpHeaders({
            Authorization: 'Bearer ' + this.userToken,
          }),
        }
      )
      .subscribe(
        (res) => {
          // console.log(res.date);
          this.date = res.date;
          this.date.sort((a, b) => {
            const c = new Date(a.date.split('-')[1]);
            const d = new Date(b.date.split('-')[1]);
            return c < d ? 1 : -1;
          });
        },
        (err) => {
          ////console.log(err);
        }
      );
    const tempdata = [];
    this.Replicadata.forEach((item) => {
      if (item.campaign.includes(event)) {
        tempdata.push(item);
      }
    });
    this.data = tempdata;
    this.aftercampaign_select_Data = tempdata;
  }
  checkallFilter() {
    // console.log(this.listcolor);
    // console.log(this.sortlist);
    this.colorSort();
  }
  checkallSortFilter() {
    // console.log(this.sortlist);
    if (this.sortlist.Profit == false) {
      if (this.sortlistAce.Profit == true) {
        this.data.sort((a, b) => {
          return (a.Profit as any) - b.Profit;
        });
      } else if (this.sortlistDesc.Profit == true) {
        this.data.sort((a, b) => {
          return (b.Profit as any) - a.Profit;
        });
      }
    } else if (this.sortlist.Earning == false) {
      if (this.sortlistAce.Earning == true) {
        this.data.sort((a, b) => {
          return (a.Earning as any) - b.Earning;
        });
      } else if (this.sortlistDesc.Earning == true) {
        this.data.sort((a, b) => {
          return (b.Earning as any) - a.Earning;
        });
      }
    } else if (this.sortlist.Cost == false) {
      if (this.sortlistAce.Cost == true) {
        this.data.sort((a, b) => {
          return (a.cost as any) - b.cost;
        });
      } else if (this.sortlistDesc.Cost == true) {
        this.data.sort((a, b) => {
          return (b.cost as any) - a.cost;
        });
      }
    } else if (this.sortlist.ProfitPercent == false) {
      if (this.sortlistAce.ProfitPercent == true) {
        this.data.sort((a, b) => {
          return (a.ProfitPercent as any) - b.ProfitPercent;
        });
      } else if (this.sortlistDesc.ProfitPercent == true) {
        this.data.sort((a, b) => {
          return (b.ProfitPercent as any) - a.ProfitPercent;
        });
      }
    } else if (this.sortlist.Remark == false) {
      if (this.sortlistAce.Remark == true) {
        this.data.sort((a, b) => {
          const fa = a.remark;
          const fb = b.remark;
          if (fa === null || fa == '') {
            return 1;
          } else if (fb === null || fb == '') {
            return -1;
          } else if (fa < fb) {
            return -1;
          } else if (fa > fb) {
            return 1;
          }
        });
      } else if (this.sortlistDesc.Remark == true) {
        this.data.sort((a, b) => {
          const fa = a.remark;
          const fb = b.remark;
          if (fa === null || fa == '') {
            return 1;
          } else if (fb === null || fb == '') {
            return -1;
          } else if (fa < fb) {
            return 1;
          } else if (fa > fb) {
            return -1;
          }
        });
      }
    } else if (this.sortlist.ecpm == false) {
      if (this.sortlistAce.ecpm == true) {
        this.data.sort((a, b) => {
          return (a.Rpm as any) - b.Rpm;
        });
      } else if (this.sortlistDesc.ecpm == true) {
        this.data.sort((a, b) => {
          return (b.Rpm as any) - a.Rpm;
        });
      }
    }
  }
  oncheckRemark() {
    // const tempreplica = this.data;
    // console.log(this.remarkcheck);
    if (this.remarkcheck) {
      const tdata = [];
      this.data = this.data.map((item) => {
        if (item.remark != null && item.remark != '') {
          tdata.push(item);
        }
      });
      this.data = tdata;
      ////console.log(this.data);
    } else {
      this.data = this.afterdate_select_Data;
      // for (let i=0 ; i<this.listcolor.length ; i++){
      //   if (this.listcolor[i].title == '#32CD32' || this.listcolor[i].title == 'NaN'){
      //     this.listcolor[i].checked = false;
      //     // console.log(this.listcolor[i]);
      //   }
      // }
      this.checkallFilter();
    }
  }
  checkRemarkFilter() {
    if (this.remarkcheck) {
      const tdata = [];
      this.data = this.data.map((item) => {
        if (item.remark != null && item.remark != '') {
          tdata.push(item);
        }
      });
      this.data = tdata;
    }
  }
  goToHome() {
    this.router.navigate(['/upload']);
  }

  onSubmit() {
    if (
      this.sheet1 == 'select' &&
      this.uploadForm.get('uploadedsheet1').value == ''
    ) {
      this.sheet1_Validation = true;
      return;
    }
    this.DisableUploadButtom = true;
    const username = localStorage.getItem('username');
    this.httpClient
      .delete<any>(`${environment.api_url}/sheet/deleteTempData/${username}`, {
        headers: new HttpHeaders({ Authorization: 'Bearer ' + this.userToken }),
      })
      .subscribe(
        (res) => {
          ////console.log('data deleted');
          let tempvar1;
          if (this.sheet1 != 'select') {
            ////console.log(this.sheet1);
            tempvar1 = {
              filepath: this.sheet1,
              username: username,
            };
            this.url1 = 'csv';
          } else {
            const formData1 = new FormData();
            formData1.append(
              'file',
              this.uploadForm.get('uploadedsheet1').value
            );
            formData1.append('username', username);
            this.url1 = 'uploadcsv';
            tempvar1 = formData1;
          }
          this.httpClient
            .post<any>(`${environment.api_url}/sheet/${this.url1}`, tempvar1, {
              headers: new HttpHeaders({
                Authorization: 'Bearer ' + this.userToken,
              }),
            })
            .subscribe(
              (res) => {
                //console.log(res.message);
                //console.log('sheet1 uploaded');
                //console.log('checking sheet 2');
                if (
                  this.sheet2 == 'select' &&
                  this.uploadForm.get('uploadedsheet2').value == ''
                ) {
                  // check and upload sheet3
                  //console.log('checking sheet 3');
                  if (
                    this.sheet3 == 'select' &&
                    this.uploadForm.get('uploadedsheet3').value == ''
                  ) {
                    // migrate data to main campaign
                    ////console.log('migrate data wait');
                    this.httpClient
                      .get<any>(
                        `${environment.api_url}/sheet/tempToMain/${username}`,
                        {
                          headers: new HttpHeaders({
                            Authorization: 'Bearer ' + this.userToken,
                          }),
                        }
                      )
                      .subscribe(
                        (res) => {
                          // final response
                          ////console.log('complete migrating data');
                          this.getCampaign();
                          this.getData();
                          this.myfileiput1.nativeElement.value = '';
                          this.myfileiput2.nativeElement.value = '';
                          this.myfileiput3.nativeElement.value = '';
                          this.uploadForm.get('uploadedsheet1').setValue('');
                          this.uploadForm.get('uploadedsheet2').setValue('');
                          this.uploadForm.get('uploadedsheet3').setValue('');
                          this.sheet1 = 'select';
                          this.sheet2 = 'select';
                          this.sheet3 = 'select';
                          this.selectDropdown1.value = '';
                          this.selectDropdown2.value = '';
                          this.selectDropdown3.value = '';
                          this.DisableUploadButtom = false;
                        },
                        (err) => {
                          ////console.log('error in migrating data to main campaign', err);
                          this.myfileiput1.nativeElement.value = '';
                          this.myfileiput2.nativeElement.value = '';
                          this.myfileiput3.nativeElement.value = '';
                          this.uploadForm.get('uploadedsheet1').setValue('');
                          this.uploadForm.get('uploadedsheet2').setValue('');
                          this.uploadForm.get('uploadedsheet3').setValue('');
                          this.sheet1 = 'select';
                          this.sheet2 = 'select';
                          this.sheet3 = 'select';
                          this.selectDropdown1.value = '';
                          this.selectDropdown2.value = '';
                          this.selectDropdown3.value = '';
                          this.DisableUploadButtom = false;
                        }
                      );
                  } else {
                    // upload sheet3
                    let tempvar3;
                    if (this.sheet3 != 'select') {
                      ////console.log(this.sheet3);
                      tempvar3 = {
                        filepath: this.sheet3,
                        username: username,
                      };
                      this.url3 = 'Bcost';
                    } else {
                      const formData3 = new FormData();
                      formData3.append(
                        'file',
                        this.uploadForm.get('uploadedsheet3').value
                      );
                      formData3.append('username', username);
                      this.url3 = 'uploadBcost';
                      tempvar3 = formData3;
                    }
                    this.httpClient
                      .post<any>(
                        `${environment.api_url}/sheet/${this.url3}`,
                        tempvar3,
                        {
                          headers: new HttpHeaders({
                            Authorization: 'Bearer ' + this.userToken,
                          }),
                        }
                      )
                      .subscribe(
                        (res) => {
                          ////console.log('upload sheet3 success');
                          // migrate data to main campiagn
                          this.httpClient
                            .get<any>(
                              `${environment.api_url}/sheet/tempToMain/${username}`,
                              {
                                headers: new HttpHeaders({
                                  Authorization: 'Bearer ' + this.userToken,
                                }),
                              }
                            )
                            .subscribe(
                              (res) => {
                                // final response
                                ////console.log('complete migrating data');
                                this.getCampaign();
                                this.getData();
                                this.myfileiput1.nativeElement.value = '';
                                this.myfileiput2.nativeElement.value = '';
                                this.myfileiput3.nativeElement.value = '';
                                this.uploadForm
                                  .get('uploadedsheet1')
                                  .setValue('');
                                this.uploadForm
                                  .get('uploadedsheet2')
                                  .setValue('');
                                this.uploadForm
                                  .get('uploadedsheet3')
                                  .setValue('');
                                this.sheet1 = 'select';
                                this.sheet2 = 'select';
                                this.sheet3 = 'select';
                                this.selectDropdown1.value = '';
                                this.selectDropdown2.value = '';
                                this.selectDropdown3.value = '';
                                this.DisableUploadButtom = false;
                              },
                              (err) => {
                                ////console.log('error in migrating data to main campaign', err);
                                this.DisableUploadButtom = false;
                              }
                            );
                        },
                        (err) => {
                          this.errorMessage = err.error.message;
                          this.openSnackBar();
                          this.myfileiput1.nativeElement.value = '';
                          this.myfileiput2.nativeElement.value = '';
                          this.myfileiput3.nativeElement.value = '';
                          this.uploadForm.get('uploadedsheet1').setValue('');
                          this.uploadForm.get('uploadedsheet2').setValue('');
                          this.uploadForm.get('uploadedsheet3').setValue('');
                          this.sheet1 = 'select';
                          this.sheet2 = 'select';
                          this.sheet3 = 'select';
                          this.selectDropdown1.value = '';
                          this.selectDropdown2.value = '';
                          this.selectDropdown3.value = '';
                          this.DisableUploadButtom = false;
                          setTimeout(() => {
                            this.errorMessage = '';
                          }, 2000);
                          ////console.log('error in uploading sheet3 ', err);
                        }
                      );
                  }
                } else {
                  // upload sheet2
                  let tempvar2;
                  if (this.sheet2 != 'select') {
                    ////console.log(this.sheet2);
                    tempvar2 = {
                      filepath: this.sheet2,
                      username: username,
                    };
                    this.url2 = 'Acost';
                  } else {
                    const formData2 = new FormData();
                    formData2.append(
                      'file',
                      this.uploadForm.get('uploadedsheet2').value
                    );
                    formData2.append('username', username);
                    this.url2 = 'uploadAcost';
                    tempvar2 = formData2;
                  }
                  this.httpClient
                    .post<any>(
                      `${environment.api_url}/sheet/${this.url2}`,
                      tempvar2,
                      {
                        headers: new HttpHeaders({
                          Authorization: 'Bearer ' + this.userToken,
                        }),
                      }
                    )
                    .subscribe(
                      (res) => {
                        ////console.log('sheet2 uploadeed success');
                        // chech for sheet3
                        if (
                          this.sheet3 == 'select' &&
                          this.uploadForm.get('uploadedsheet3').value == ''
                        ) {
                          // migrate data to main campaign
                          this.httpClient
                            .get<any>(
                              `${environment.api_url}/sheet/tempToMain/${username}`,
                              {
                                headers: new HttpHeaders({
                                  Authorization: 'Bearer ' + this.userToken,
                                }),
                              }
                            )
                            .subscribe(
                              (res) => {
                                // final response
                                ////console.log('complete migrating data');
                                this.getCampaign();
                                this.getData();
                                this.myfileiput1.nativeElement.value = '';
                                this.myfileiput2.nativeElement.value = '';
                                this.myfileiput3.nativeElement.value = '';
                                this.uploadForm
                                  .get('uploadedsheet1')
                                  .setValue('');
                                this.uploadForm
                                  .get('uploadedsheet2')
                                  .setValue('');
                                this.uploadForm
                                  .get('uploadedsheet3')
                                  .setValue('');
                                this.sheet1 = 'select';
                                this.sheet2 = 'select';
                                this.sheet3 = 'select';
                                this.selectDropdown1.value = '';
                                this.selectDropdown2.value = '';
                                this.selectDropdown3.value = '';
                                this.DisableUploadButtom = false;
                              },
                              (err) => {
                                ////console.log('error in migrating data to main campaign', err);
                                this.myfileiput1.nativeElement.value = '';
                                this.myfileiput2.nativeElement.value = '';
                                this.myfileiput3.nativeElement.value = '';
                                this.uploadForm
                                  .get('uploadedsheet1')
                                  .setValue('');
                                this.uploadForm
                                  .get('uploadedsheet2')
                                  .setValue('');
                                this.uploadForm
                                  .get('uploadedsheet3')
                                  .setValue('');
                                this.sheet1 = 'select';
                                this.sheet2 = 'select';
                                this.sheet3 = 'select';
                                this.selectDropdown1.value = '';
                                this.selectDropdown2.value = '';
                                this.selectDropdown3.value = '';
                                this.DisableUploadButtom = false;
                              }
                            );
                        } else {
                          let tempvar3;
                          if (this.sheet3 != 'select') {
                            ////console.log(this.sheet3);
                            tempvar3 = {
                              filepath: this.sheet3,
                              username: username,
                            };
                            this.url3 = 'Bcost';
                          } else {
                            const formData3 = new FormData();
                            formData3.append(
                              'file',
                              this.uploadForm.get('uploadedsheet3').value
                            );
                            formData3.append('username', username);
                            this.url3 = 'uploadBcost';
                            tempvar3 = formData3;
                          }
                          this.httpClient
                            .post<any>(
                              `${environment.api_url}/sheet/${this.url3}`,
                              tempvar3,
                              {
                                headers: new HttpHeaders({
                                  Authorization: 'Bearer ' + this.userToken,
                                }),
                              }
                            )
                            .subscribe(
                              (res) => {
                                // migrate data to main campiagn
                                this.httpClient
                                  .get<any>(
                                    `${environment.api_url}/sheet/tempToMain/${username}`,
                                    {
                                      headers: new HttpHeaders({
                                        Authorization:
                                          'Bearer ' + this.userToken,
                                      }),
                                    }
                                  )
                                  .subscribe(
                                    (res) => {
                                      // final response
                                      ////console.log('complete migrating data');
                                      this.getCampaign();
                                      this.getData();
                                      this.myfileiput1.nativeElement.value = '';
                                      this.myfileiput2.nativeElement.value = '';
                                      this.myfileiput3.nativeElement.value = '';
                                      this.uploadForm
                                        .get('uploadedsheet1')
                                        .setValue('');
                                      this.uploadForm
                                        .get('uploadedsheet2')
                                        .setValue('');
                                      this.uploadForm
                                        .get('uploadedsheet3')
                                        .setValue('');
                                      this.sheet1 = 'select';
                                      this.sheet2 = 'select';
                                      this.sheet3 = 'select';
                                      this.selectDropdown1.value = '';
                                      this.selectDropdown2.value = '';
                                      this.selectDropdown3.value = '';
                                      this.DisableUploadButtom = false;
                                    },
                                    (err) => {
                                      ////console.log('error in migrating data to main campaign', err);
                                      this.myfileiput1.nativeElement.value = '';
                                      this.myfileiput2.nativeElement.value = '';
                                      this.myfileiput3.nativeElement.value = '';
                                      this.uploadForm
                                        .get('uploadedsheet1')
                                        .setValue('');
                                      this.uploadForm
                                        .get('uploadedsheet2')
                                        .setValue('');
                                      this.uploadForm
                                        .get('uploadedsheet3')
                                        .setValue('');
                                      this.sheet1 = 'select';
                                      this.sheet2 = 'select';
                                      this.sheet3 = 'select';
                                      this.selectDropdown1.value = '';
                                      this.selectDropdown2.value = '';
                                      this.selectDropdown3.value = '';
                                      this.DisableUploadButtom = false;
                                    }
                                  );
                              },
                              (err) => {
                                this.errorMessage = err.error.message;
                                this.openSnackBar();
                                this.myfileiput1.nativeElement.value = '';
                                this.myfileiput2.nativeElement.value = '';
                                this.myfileiput3.nativeElement.value = '';
                                this.uploadForm
                                  .get('uploadedsheet1')
                                  .setValue('');
                                this.uploadForm
                                  .get('uploadedsheet2')
                                  .setValue('');
                                this.uploadForm
                                  .get('uploadedsheet3')
                                  .setValue('');
                                this.sheet1 = 'select';
                                this.sheet2 = 'select';
                                this.sheet3 = 'select';
                                this.selectDropdown1.value = '';
                                this.selectDropdown2.value = '';
                                this.selectDropdown3.value = '';
                                this.DisableUploadButtom = false;
                                setTimeout(() => {
                                  this.errorMessage = '';
                                }, 2000);
                                ////console.log('error in uploading sheet3 ', err);
                              }
                            );
                        }
                      },
                      (err) => {
                        this.errorMessage = err.error.message;
                        this.openSnackBar();
                        this.myfileiput1.nativeElement.value = '';
                        this.myfileiput2.nativeElement.value = '';
                        this.myfileiput3.nativeElement.value = '';
                        this.uploadForm.get('uploadedsheet1').setValue('');
                        this.uploadForm.get('uploadedsheet2').setValue('');
                        this.uploadForm.get('uploadedsheet3').setValue('');
                        this.sheet1 = 'select';
                        this.sheet2 = 'select';
                        this.sheet3 = 'select';
                        this.selectDropdown1.value = '';
                        this.selectDropdown2.value = '';
                        this.selectDropdown3.value = '';
                        this.DisableUploadButtom = false;
                        setTimeout(() => {
                          this.errorMessage = '';
                        }, 2000);
                        ////console.log('error in uploading sheet2', err);
                      }
                    );
                }
              },
              (err) => {
                this.errorMessage = err.error.message;
                this.openSnackBar();
                this.myfileiput1.nativeElement.value = '';
                this.myfileiput2.nativeElement.value = '';
                this.myfileiput3.nativeElement.value = '';
                this.uploadForm.get('uploadedsheet1').setValue('');
                this.uploadForm.get('uploadedsheet2').setValue('');
                this.uploadForm.get('uploadedsheet3').setValue('');
                this.sheet1 = 'select';
                this.sheet2 = 'select';
                this.sheet3 = 'select';
                this.selectDropdown1.value = '';
                this.selectDropdown2.value = '';
                this.selectDropdown3.value = '';
                this.DisableUploadButtom = false;
                setTimeout(() => {
                  this.errorMessage = '';
                }, 2000);
                ////console.log('error in adding campaig data to temp', err);
              }
            );
        },
        (err) => {
          ////console.log('error in deleting data', err);
          this.myfileiput1.nativeElement.value = '';
          this.myfileiput2.nativeElement.value = '';
          this.myfileiput3.nativeElement.value = '';
          this.uploadForm.get('uploadedsheet1').setValue('');
          this.uploadForm.get('uploadedsheet2').setValue('');
          this.uploadForm.get('uploadedsheet3').setValue('');
          this.sheet1 = 'select';
          this.sheet2 = 'select';
          this.sheet3 = 'select';
          this.selectDropdown1.value = '';
          this.selectDropdown2.value = '';
          this.selectDropdown3.value = '';
          this.DisableUploadButtom = false;
        }
      );
  }
}
