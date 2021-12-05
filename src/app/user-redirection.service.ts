import { Injectable } from '@angular/core';
import { CanActivate, Router} from '@angular/router';
import * as jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class UserRedirectionService implements CanActivate{

  constructor(
    private router:Router
  ) { }

  canActivate(): boolean{
    const userToken = localStorage.getItem('userToken');
    const  username = localStorage.getItem('username');
    // ////console.log("userToken" + userToken);
    // ////console.log("username" + username);
    if (userToken == null){
      return true;
    }else {
      const decodedToke = jwt_decode(userToken);
      const date = new Date(0);
      const exp_time_value = date.setUTCSeconds(decodedToke.exp);
      //////console.log(exp_time_value.valueOf());
      //////console.log(new Date().valueOf());

      if (exp_time_value.valueOf() > new Date().valueOf()) {
        this.router.navigate(['/upload']);
        return false ;
      } else {
        return true;
      }
    }
  }
}
