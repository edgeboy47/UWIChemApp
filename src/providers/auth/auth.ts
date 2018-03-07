import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import 'rxjs/add/operator/take';
import { Observable } from 'rxjs/Observable'

@Injectable()
export class AuthProvider {
  user: Observable<any>

  constructor(private auth: AngularFireAuth) {
    this.init()
  }

  init(){
    console.log("AuthProvider did load " + new Date().toLocaleTimeString())    
    if(this.isLoggedIn()){
      this.user = this.auth.authState
    }
  }

  getUID(){
    if(this.isLoggedIn())
      return this.auth.auth.currentUser.uid
    return null
  }

  isLoggedIn(){
    return this.auth.auth.currentUser != null
  }

  loginWithEmailAndPassword(email:string, pass:string){

  }

  logout(){

  }
}
