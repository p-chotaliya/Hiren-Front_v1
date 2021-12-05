import { Component, OnInit } from '@angular/core';
import {FormGroup, FormBuilder , Validators} from '@angular/forms';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Router} from '@angular/router';
import {AdminAuthService} from '../admin-auth.service';
import {environment} from '../../environments/environment.prod';
@Component({
  selector: 'app-change-user-pass',
  templateUrl: './change-user-pass.component.html',
  styleUrls: ['./change-user-pass.component.css']
})
export class ChangeUserPassComponent implements OnInit {
  username:string=localStorage.getItem('username');
  userToken = localStorage.getItem('userToken') ;
  submitButton = false;
  submitted = false;
  returnMessage: string;
  successMessage: string;
  changepassform: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private  http: HttpClient,
    private  router: Router
  ) { }

  ngOnInit(): void {
    this.changepassform = this.formBuilder.group({
      oldpassword: ['', Validators.required],
      newpassword: ['', Validators.required]
    });
  }

  onsubmit(Form){
    this.submitButton = true;
    this.submitted = true;
    if(this.changepassform.invalid){
      this.submitButton = false;
      return;
    }
    const body = {
      username: this.username,
      oldpassword: Form.value.oldpassword,
      newpassword: Form.value.newpassword
    };
    this.http.post<any>(`${environment.api_url}/changePassword`, body,{
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + this.userToken,
        }),
    }).subscribe(response => {
        // this.adminAuthService.isLoggin = true;
        this.submitButton = false;
        this.successMessage = response.message;
        setTimeout(() => {
          this.successMessage = '';
          this.router.navigate(['/login']);
          localStorage.removeItem('username');
          localStorage.removeItem('user_name');
          localStorage.removeItem('userToken');
          this.router.navigate(['/login']);
        }, 2000);
      },
      err => {
        //////console.log(err);
        this.submitButton = false;
        this.returnMessage = err.error.message;
        setTimeout(() => {
          this.returnMessage = '';
        }, 2000);
      }) ;
  }
}
