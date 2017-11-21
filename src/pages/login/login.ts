import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  email:string = ''
  password:string = ''

  constructor(public navCtrl: NavController, public navParams: NavParams, private fbAuth: AngularFireAuth) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  async login(){
    try{
      await this.fbAuth.auth.signInWithEmailAndPassword(this.email, this.password)
      this.navCtrl.push('UsertabsPage')
    }
    catch(err)
      {alert("Invalid email or password")
      console.error(err)
    }
  }

  createUser(){
    this.navCtrl.push('RegisterPage')
  }
}
