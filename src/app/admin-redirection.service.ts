import { Injectable } from '@angular/core';
import {Router, CanActivate} from '@angular/router';
import * as jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AdminRedirectionService implements CanActivate{

  constructor(
    private router: Router,
  ) {
  }

  canActivate(): boolean{
    const adminToken = localStorage.getItem('adminToken');
    const  adminname = localStorage.getItem('adminname');
    if (adminToken == null){
      return true;
    }else {
      const decodedToke = jwt_decode(adminToken);
      const date = new Date(0);
      const exp_time_value = date.setUTCSeconds(decodedToke.exp);
      //////console.log(exp_time_value.valueOf());
      //////console.log(new Date().valueOf());

      if (exp_time_value.valueOf() > new Date().valueOf()) {
        this.router.navigate(['/admin/adduser']);
        return false ;
      } else {
        return true;
      }
    }
  }

}
