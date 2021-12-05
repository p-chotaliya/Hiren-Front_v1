import { Component, OnInit } from '@angular/core';
import {HttpClient, HttpEvent, HttpEventType, HttpHeaders, HttpResponse} from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';
import {environment} from '../../environments/environment.prod';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-folder',
  templateUrl: './add-folder.component.html',
  styleUrls: ['./add-folder.component.css']
})
export class AddFolderComponent implements OnInit {

  constructor(
    private httpClient: HttpClient,
    public router: Router,
    public route: ActivatedRoute,
    public _snackBar : MatSnackBar
  ) { }
  foldervalue;
  new_token;
  response_message;
  username = localStorage.getItem('username');
  php_api = localStorage.getItem('php_api');
  // php_api = environment.php_api_url;
  // php_token = localStorage.getItem('php_token');
  ngOnInit(): void {
  }

  addfolder(folder_value: string){
    const folder_name_value = folder_value
    this.httpClient.get<any>(`${environment.api_url}/imagesaver/storetoken/${this.username}`).subscribe(
      res => {
        this.new_token = res.token;
        //console.log(this.new_token)
        this.httpClient.post<any>( `${this.php_api}/createFolder.php`, {folder_name: folder_name_value, username : this.username, token : this.new_token}, {responseType: 'json'}).subscribe(
          res => {
            if(res.status == 400){
              this.errormessage(res.message);
            }else if(res.status == 200){
              this.successmessage(res.message);
            }
          }, err => {
            //console.log(err);
          }
        );
      }, err => {
        ////console.log(err);
      }
    );
  }

  errormessage(message:string){
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
    setTimeout(() => {
      this.router.navigateByUrl('/RefreshComponent', { skipLocationChange: true }).then(() => {
        this.router.navigate(['/imagesaver']);
      });
    },1000);

  }
}
