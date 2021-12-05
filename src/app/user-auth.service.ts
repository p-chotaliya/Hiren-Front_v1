import { Injectable } from '@angular/core';
import {Router, CanActivate} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import * as jwt_decode from 'jwt-decode';
import {environment} from '../environments/environment.prod';
import {HttpHeaders} from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class UserAuthService  implements CanActivate{
  // isUserLoggin: boolean = false;

  constructor(
    private router: Router,
    private httpClient: HttpClient
  )
   { }

  canActivate(): boolean{
    // if(this.isUserLoggin){
    //   return true;
    // }else{
    //   this.router.navigate(['/login'])
    //   return false;
    // }

    const Token = localStorage.getItem('userToken');
    //////console.log(Token)
    if(Token == null){
      this.router.navigate(['/login']);
      return false;
    }else {
      const decodedToke = jwt_decode(Token);
      const date = new Date(0);
      const exp_time_value = date.setUTCSeconds(decodedToke.exp);
      //////console.log(exp_time_value.valueOf());
      //////console.log(new Date().valueOf());

      if (exp_time_value.valueOf() > new Date().valueOf()) {
        return true;
      } else {
        this.router.navigate(['/login']);
        return false;
      }
    }
  }
}
