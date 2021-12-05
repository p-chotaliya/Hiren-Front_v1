import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import * as jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AdminAuthService implements CanActivate {
  // isLoggin: boolean = false;
  constructor(private router: Router) {}

  canActivate(): boolean {
    // if(this.isLoggin){
    //   return true;
    // }else{
    //   this.router.navigate(['/admin/login'])
    //   return false;
    // }
    const Token = localStorage.getItem('adminToken');
    //////console.log(Token)
    if (Token == null) {
      this.router.navigate(['/admin/login']);
      return false;
    } else {
      const decodedToke = jwt_decode(Token);
      const date = new Date(0);
      const exp_time_value = date.setUTCSeconds(decodedToke.exp);
      //////console.log(exp_time_value.valueOf());
      //////console.log(new Date().valueOf());
      if (exp_time_value.valueOf() > new Date().valueOf()) {
        return true;
      } else {
        this.router.navigate(['/admin/login']);
        return false;
      }
    }
  }
}
