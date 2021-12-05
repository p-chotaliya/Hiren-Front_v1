import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {environment} from '../../environments/environment.prod';
import {HttpClient, HttpEvent, HttpEventType, HttpHeaders, HttpResponse} from '@angular/common/http';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-folder-details',
  templateUrl: './folder-details.component.html',
  styleUrls: ['./folder-details.component.css']
})
export class FolderDetailsComponent implements OnInit {

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public httpClient: HttpClient,
    public _snackBar: MatSnackBar
  ) {
    this.getFolderDetails();
  }
  foldername: string;
  urlvalue;
  filevalue;
  filevalue2;
  username = localStorage.getItem('username');
  fileList: any;
   php_api = localStorage.getItem('php_api');
  // php_api = environment.php_api_url;
  ngOnInit(): void {

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

  }
  getFolderDetails(){
    this.route.params.subscribe((params) => {
      //console.log(params);
      this.foldername = params.foldername;
      // this.httpClient.get<any>(`${environment.api_url}/imagesaver/folderAuth/${this.username}/${this.foldername}`).subscribe(
      //   res=>{
      //     //console.log(res)
      //     if(res.code == 200){
      //       this.httpClient.get<any>(`${environment.api_url}/imagesaver/storetoken/${this.username}`).subscribe(
      //         res => {
      //           const new_token = res.token;
      //           this.httpClient.post<any>( `${environment.php_api_url}/listofFile.php`, {username : this.username, token : new_token, folder_name: this.foldername}, { responseType: 'json'}).subscribe(
      //             res => {
      //               const files = []
      //               res.forEach(item => {
      //                 const file_name = item.split('/')[2];
      //                 const filedata = {
      //                   filename: file_name,
      //                   filepath: item
      //                 }
      //                 files.push(filedata);
      //               })
      //               this.fileList = files;
      //             }, err => {
      //               //console.log(err);
      //             }
      //           );
      //         }, err => {
      //           // //console.log(err);
      //         }
      //       );
      //     }
      //   },
      //   err=>{
      //       alert("You did not have Access to this folder");
      //       this.router.navigateByUrl('/RefreshComponent', { skipLocationChange: true }).then(() => {
      //         this.router.navigate(['/imagesaver']);
      //       });
      //
      //   }
      // );
      this.httpClient.get<any>(`${environment.api_url}/imagesaver/storetoken/${this.username}`).subscribe(
              res => {
                const new_token = res.token;
                this.httpClient.post<any>( `${this.php_api}/listofFile.php`, {username : this.username, token : new_token, folder_name: this.foldername}, { responseType: 'json'}).subscribe(
                  res => {
                    const files = []
                    res.forEach(item => {
                      const file_name = item.split('/')[2];
                      const filedata = {
                        filename: file_name,
                        filepath: item
                      }
                      files.push(filedata);
                    })
                    this.fileList = files;
                  }, err => {
                    //console.log(err);
                  }
                );
              }, err => {
                // //console.log(err);
              }
            );
    });
  }
  deleteImage(filepath: string){
    const confimation = confirm('Are you sure you want to DELETE this Image');
    if(confimation){
      this.httpClient.get<any>(`${environment.api_url}/imagesaver/storetoken/${this.username}`).subscribe(
        res => {
          const new_token = res.token;
          this.httpClient.post<any>( `${this.php_api}/deleteFile.php`, {username : this.username, token : new_token, file_path: filepath}, { responseType: 'json'}).subscribe(
            res => {
              if(res.status == 200) {
                this.successmessage(res.message)
              }else if(res.status ==400) {
                this.errormessage(res.message)
              }
              this.getFolderDetails();
            }, err => {
              //console.log(err);
            }
          );
        }, err => {
          // //console.log(err);
        }
      );
    }

  }

  addfile(){
    this.httpClient.get<any>(`${environment.api_url}/imagesaver/storetoken/${this.username}`).subscribe(
      res => {
        const new_token = res.token;
        this.httpClient.post<any>( `${this.php_api}/downloadImage.php`, {
          username : this.username,
          token : new_token,
          url: this.urlvalue,
          file_name: this.filevalue,
          additional_file_name: this.filevalue2,
          folder_name: this.foldername}, { responseType: 'json'}).subscribe(
          res => {
            //console.log(res)
            if(res.status ==200){
              this.successmessage(res.message);
            }else if (res.status == 400){
              this.errormessage(res.message);
            }
            this.urlvalue='';
            this.filevalue='';
            this.filevalue2='';
            this.getFolderDetails();
          }, err => {
            //console.log(err);
          }
        );
      }, err => {
        // //console.log(err);
      }
    );
  }
}
