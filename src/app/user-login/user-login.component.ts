import { Component, OnInit } from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {UserAuthService} from '../user-auth.service';
import {environment} from '../../environments/environment.prod';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css']
})
export class UserLoginComponent implements OnInit {
  userForm: FormGroup;
  returnMessage: string;
  submitted = false;
  submitButton: boolean = false;
  constructor(
    private formBuilder: FormBuilder,
    private  http: HttpClient,
    private  router: Router,
    private userAuthService: UserAuthService
  ) { }

  ngOnInit(): void {
    this.userForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onsubmit(Form){
    this.submitButton = true;
    this.submitted =true;
    if(this.userForm.invalid){
      this.submitButton = false;
      return;
    }
    const body = {
      username: Form.value.username,
      password: Form.value.password
    };

    this.http.post<any>(`${environment.api_url}/login`, body).subscribe(response => {
        // this.userAuthService.isUserLoggin = true;
        this.submitButton = false;
        localStorage.setItem('username', response.username);
        localStorage.setItem('user_name', response.name);
        localStorage.setItem('userToken', response.token);
        //////console.log(response.token)
        this.router.navigate(['/upload']);
      },
      err => {
        this.submitButton = false;
        this.returnMessage = err.error.message;
        setTimeout(() =>{
          this.returnMessage = '';
        }, 2000)
        //////console.log(err);
      }) ;
  }

  redirectadmin(){
    this.router.navigate(['/admin/login']);
  }
}
