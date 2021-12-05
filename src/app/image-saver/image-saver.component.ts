import { Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {HttpClient, HttpEvent, HttpEventType, HttpHeaders, HttpResponse} from '@angular/common/http';
import {Router, ActivatedRoute} from '@angular/router';
import {environment} from '../../environments/environment.prod';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-image-saver',
  templateUrl: './image-saver.component.html',
  styleUrls: ['./image-saver.component.css']
})
export class ImageSaverComponent implements OnInit{

  constructor(
    private httpClient: HttpClient,
    public router: Router,
    public route: ActivatedRoute,
    public _snackBar: MatSnackBar
  ) {
  }
  folder_name;
  username = localStorage.getItem('username');
  userToken = localStorage.getItem('userToken');
  new_token;
  folder_list: string[] = [];
  search_folder;
   php_api = localStorage.getItem('php_api');
  //php_api = environment.php_api_url;
  ngOnInit(): void {
    // this.getFolders();
    this.getFolders();
  }

  getFolders(){
    // this.tokenSaver();
    this.httpClient.get<any>(`${environment.api_url}/imagesaver/storetoken/${this.username}`).subscribe(
      res => {
        this.new_token = res.token;
        this.httpClient.post<any>( `${this.php_api}/listofFolder.php`, {username : this.username, token : this.new_token}, { responseType: 'json'}).subscribe(
          res => {
              // console.log(res);
              res.forEach((value) => {
                if(value !== '.' && value !== '..') {
                  this.folder_list.push(value);
                }
              });
          }, err => {
            // console.log(err);
          }
        );
      }, err => {
        // console.log(err);
      }
    );
  }
  errormessage(message: string){
    this._snackBar.open(message, 'close', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition : 'top',
      panelClass : ['errorSnackbar']
    });
  }
  successmessage(message:string){
    this._snackBar.open(message, 'close', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition : 'top',
      panelClass : ['successSnackbar']
    });
  }
  folderDetails(event){
    this.folder_name = event;
    const foldername = event;
    if(foldername == undefined){
      this.router.navigate(['/imagesaver'], {relativeTo: this.route });
    }else {
      this.router.navigate(['/imagesaver/folder', foldername], {relativeTo: this.route});
    }
  }
  goaddFolder(){
    this.router.navigate(['/imagesaver/addfolder'], {relativeTo: this.route });
  }
  godeleteFolder(){
    // this.router.navigate(['/imagesaver/deletefolder'], {relativeTo: this.route });
    if(this.folder_name != undefined){
      const confirmation = confirm('Are you sure you want to DELETE this Folder');
      if(confirmation){
        this.httpClient.get<any>(`${environment.api_url}/imagesaver/storetoken/${this.username}`).subscribe(
          res => {
            this.new_token = res.token;
            this.httpClient.post<any>( `${this.php_api}/deleteFolder.php`, {username : this.username, token : this.new_token , folder_name:this.folder_name}, { responseType: 'json'}).subscribe(
              res => {
                if (res.status == 200){
                  this.successmessage(res.message);
                }else if(res.status == 400){
                  this.errormessage(res.message);
                }
                this.router.navigateByUrl('/RefreshComponent', { skipLocationChange: true }).then(() => {
                  this.router.navigate(['/imagesaver']);
                });
                this.getFolders()
              }, err => {
                //console.log(err);
              }
            );
          }, err => {
            ////console.log(err);
          }
        );
      }
    }
  }

  goHome(){
    this.router.navigate(['/upload']);
  }
}
