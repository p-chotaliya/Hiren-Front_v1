import { Component, OnInit } from '@angular/core';
import {FormGroup, FormBuilder , Validators} from '@angular/forms';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Router} from '@angular/router';
import {environment} from '../../environments/environment.prod';

@Component({
  selector: 'app-admin-adduser',
  templateUrl: './admin-adduser.component.html',
  styleUrls: ['./admin-adduser.component.css']
})
export class AdminAdduserComponent implements OnInit {
  submitButton = false;
  submitted = false;
  adminToken = localStorage.getItem('adminToken');
  adminname = localStorage.getItem('adminname');
  adduser: FormGroup;
  message: string;
  successmessage:string;
  constructor(
    private formBuilder: FormBuilder,
    private  http: HttpClient,
    private  router: Router,
  ) { }

  ngOnInit(): void {
    this.adduser = this.formBuilder.group({
      name: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }
  onsubmit(Form){
    this.submitButton = true;
    this.submitted = true;
    if (this.adduser.invalid){
      this.submitButton = false;
      return;
    }
    const body = {
      name: Form.value.name,
      username: Form.value.username,
      password: Form.value.password
    };

    this.http.post<any>(`${environment.api_url}/admin/adduser`, body, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + this.adminToken,
        }),
    }).subscribe(response => {
      this.submitButton = false;
      const username = response.username;
      this.successmessage = 'user is created with username ' + username;
      this.http.get<any>(`${environment.api_url}/imagesaver/storphpapi/${username}`).subscribe(
        res => {
          this.successmessage = 'php api stored';
          setTimeout(() => {
            this.successmessage = ''
          }, 2000);
        },
          err => {
            this.message = err.error.message;
            this.submitButton = false;
            setTimeout(() => {
              this.message = '';
            }, 2000);
          });
      },
      err => {
      this.message = err.error.message;
      this.submitButton = false;
      setTimeout(() => {
          this.message = '';
        }, 2000);
      //////console.log(err);
      }) ;
  }

  logout(){
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminname');
    this.router.navigate(['/admin/login'])
  }

}
