import {
  Component,
  ElementRef,
  OnChanges,
  OnInit,
  SimpleChanges,
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
import { ClipboardService } from 'ngx-clipboard';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css'],
})
export class FileUploadComponent implements OnInit {
  @ViewChild('fileinput') myfileiput: ElementRef;
  env_api_url: string = environment.api_url;
  uploadmessage: string;
  othermessage: string;
  uploadForm: FormGroup;
  fileData: Array<object>;
  progress: number;
  fileDisable = false;
  deleteloader = false;
  uploadbutton = true;
  userToken = localStorage.getItem('userToken');
  user_name = localStorage.getItem('user_name');
  constructor(
    private formBuilder: FormBuilder,
    private httpClient: HttpClient,
    private _clipboardService: ClipboardService,
    public router: Router
  ) {}

  ngOnInit() {
    this.getuserfileData();
    this.uploadForm = this.formBuilder.group({
      uploadedFile: [''],
    });
    this.getPhpApiAddress();
  }
  getPhpApiAddress() {
    const username = localStorage.getItem('username');
    this.httpClient
      .get<any>(`${environment.api_url}/imagesaver/phpapi/${username}`)
      .subscribe(
        (res) => {
          localStorage.setItem('php_api', res.php_api);
        },
        (err) => {
          console.log(err);
        }
      );
  }
  onFileSelect(event) {
    if (event.target.files.length > 0) {
      this.uploadbutton = false;
      const file = event.target.files[0];
      // //////console.log(file);
      this.uploadForm.get('uploadedFile').setValue(file);
    }
  }

  onSubmit(Form) {
    const username = localStorage.getItem('username');
    const formData = new FormData();
    formData.append('file', this.uploadForm.get('uploadedFile').value);
    formData.append('username', username);
    //////console.log(formData);
    this.httpClient
      .post<any>(`${environment.api_url}/upload`, formData, {
        reportProgress: true,
        observe: 'events',
        headers: new HttpHeaders({ Authorization: 'Bearer ' + this.userToken }),
      })
      .subscribe(
        (event: HttpEvent<any>) => {
          switch (event.type) {
            case HttpEventType.Sent:
              //////console.log('Request has been made!');
              this.fileDisable = true;
              this.uploadbutton = true;
              break;
            case HttpEventType.ResponseHeader:
              //////console.log('Response header has been received!');
              break;
            case HttpEventType.UploadProgress:
              this.uploadmessage = 'Uploading';
              this.progress =
                Math.round((event.loaded / event.total) * 100) - 2;
              //////console.log(`Uploaded!% ${this.progress} preccent`);
              break;
            case HttpEventType.Response:
              //////console.log('User successfully created!', event.body);
              this.progress = 100;
              this.fileDisable = false;
              this.uploadmessage = 'File is uploaded';
              this.myfileiput.nativeElement.value = '';
              setTimeout(() => {
                this.progress = 0;
                this.uploadmessage = '';
              }, 1500);
              this.httpClient
                .get<any>(
                  `${environment.api_url}/user/uploadedFile/${username}`,
                  {
                    headers: new HttpHeaders({
                      Authorization: 'Bearer ' + this.userToken,
                    }),
                  }
                )
                .subscribe(
                  (res) => {
                    this.fileData = res.result;
                  },
                  (err) => {
                    //////console.log(err);
                    this.othermessage = err.error.message;
                    setTimeout(() => {
                      this.othermessage = '';
                    }, 2000);
                  }
                );
          }
        },
        (err) => {
          //////console.log(err);
          this.othermessage = err.error.message;
          setTimeout(() => {
            this.othermessage = '';
          }, 2000);
        }
      );
  }

  getuserfileData() {
    const Username = localStorage.getItem('username');
    this.httpClient
      .get<any>(`${environment.api_url}/user/uploadedFile/${Username}`, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + this.userToken,
        }),
      })
      .subscribe(
        (res) => {
          this.fileData = res.result;
        },
        (err) => {
          //////console.log(err);
        }
      );
  }

  deletefile(fileid: string) {
    const Username = localStorage.getItem('username');
    const confirmation = confirm('Are you sure you want to DELETE this file');
    if (confirmation) {
      this.deleteloader = true;
      this.httpClient
        .get<any>(`${environment.api_url}/delete/file/${fileid}`, {
          headers: new HttpHeaders({
            Authorization: 'Bearer ' + this.userToken,
          }),
        })
        .subscribe(
          (res) => {
            this.othermessage = res.message;
            setTimeout(() => {
              this.othermessage = '';
            }, 2000);
            this.deleteloader = false;
            setTimeout(() => {
              this.uploadmessage = '';
            }, 2000);
            this.httpClient
              .get<any>(
                `${environment.api_url}/user/uploadedFile/${Username}`,
                {
                  headers: new HttpHeaders({
                    Authorization: 'Bearer ' + this.userToken,
                  }),
                }
              )
              .subscribe(
                (res) => {
                  this.fileData = res.result;
                },
                (err) => {
                  //////console.log(err);
                }
              );
            // const fileindex = this.fileData.map((result) => {
            //   return result.id;
            // }).indexOf(res.fileid);
            // this.fileData.splice(fileindex,1);
          },
          (err) => {
            //////console.log(err);
          }
        );
    }
  }

  // copy link function
  callservicetocopy(filelink) {
    this._clipboardService.copyFromContent(filelink);
  }

  logout() {
    localStorage.removeItem('username');
    localStorage.removeItem('userToken');
    this.router.navigate(['/login']);
  }
  changepassword() {
    this.router.navigate(['changePassword']);
  }

  goToMergeSheet() {
    this.router.navigate(['sheet']);
  }

  goToNewMergeSheet() {
    this.router.navigate(['newsheet']);
  }
  imagesaver() {
    this.router.navigate(['imagesaver']);
  }
}
