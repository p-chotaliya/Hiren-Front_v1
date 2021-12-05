import { Component, OnInit } from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {AdminAuthService} from '../admin-auth.service';
import {environment} from '../../environments/environment.prod';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent implements OnInit {
  submitButton = false;
  returnMessage: string;
  adminForm: FormGroup;
  submitted = false;
  constructor(
    private formBuilder: FormBuilder,
    private  http: HttpClient,
    private  router: Router,
  ) { }

  ngOnInit(): void {
    this.adminForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onsubmit(Form){
    this.submitButton = true;
    this.submitted = true;
    if (this.adminForm.invalid){
      this.submitButton = false;
      return;
    }
    const body = {
      username: Form.value.username,
      password: Form.value.password
    };

    this.http.post<any>(`${environment.api_url}/admin/login`, body).subscribe(response => {
      // this.adminAuthService.isLoggin = true;
      this.submitButton = false;
      localStorage.setItem('adminname', response.username);
      localStorage.setItem('adminToken', response.token);
      // ////console.log(response.token);
      this.router.navigate(['/admin/adduser']);
    },
      err => {
      // ////console.log(err);
        this.submitButton = false;
        this.returnMessage = err.error.message;
        setTimeout(() => {
          this.returnMessage = '';
        }, 2000);
      }) ;
  }

  home(){
    this.router.navigate(['/login']);
  }

}
