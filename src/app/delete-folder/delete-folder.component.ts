import { Component, OnInit } from '@angular/core';
// import {environment} from '../../environments/environment.prod';
// import {HttpClient, HttpEvent, HttpEventType, HttpHeaders, HttpResponse} from '@angular/common/http';
// import {ActivatedRoute, Router} from '@angular/router';
// import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-delete-folder',
  templateUrl: './delete-folder.component.html',
  styleUrls: ['./delete-folder.component.css']
})
export class DeleteFolderComponent implements OnInit {

  constructor(
  ) { }
  // new_token;
  // folder_list;
  // username = localStorage.getItem('username');
  ngOnInit(): void {
    // this.getFolders();
  }
  // getFolders(){
  //   // this.tokenSaver();
  //   this.httpClient.get<any>(`${environment.api_url}/imagesaver/storetoken/${this.username}`).subscribe(
  //     res => {
  //       this.new_token = res.token;
  //       this.httpClient.post<any>( `http://localhost/MyimageSaver/listofFolder.php`, {username : this.username, token : this.new_token}, { responseType: 'json'}).subscribe(
  //         res => {
  //           const temp =[];
  //           res.forEach((value,index) => {
  //             if (index > 1){
  //               temp.push(value);
  //             }
  //           });
  //           this.folder_list=temp;
  //         }, err => {
  //           //console.log(err);
  //         }
  //       );
  //     }, err => {
  //       ////console.log(err);
  //     }
  //   );
  // }
  // errormessage(message:string){
  //   this._snackBar.open(message, 'close', {
  //     duration: 5000,
  //     horizontalPosition: 'center',
  //     verticalPosition : 'top',
  //     panelClass : ['errorSnackbar']
  //   });
  // }
  // successmessage(message:string){
  //   this._snackBar.open(message, 'close', {
  //     duration: 5000,
  //     horizontalPosition: 'center',
  //     verticalPosition : 'top',
  //     panelClass : ['successSnackbar']
  //   });
  // }
  //
  // deleteFolder(foldername: string){
  //   const confirmation = confirm('Are you sure you want to DELETE this folder')
  //   if (confirmation){
  //     this.httpClient.get<any>(`${environment.api_url}/imagesaver/storetoken/${this.username}`).subscribe(
  //       res => {
  //         this.new_token = res.token;
  //         this.httpClient.post<any>( `http://localhost/MyimageSaver/deleteFolder.php`, {username : this.username, token : this.new_token , folder_name:foldername}, { responseType: 'json'}).subscribe(
  //           res => {
  //             if(res.status == 200){
  //               this.successmessage(res.message);
  //             }else if(res.status == 400){
  //               this.errormessage(res.message);
  //             }
  //             this.getFolders()
  //           }, err => {
  //             //console.log(err);
  //           }
  //         );
  //       }, err => {
  //         ////console.log(err);
  //       }
  //     );
  //   }
  //
  // }
}
