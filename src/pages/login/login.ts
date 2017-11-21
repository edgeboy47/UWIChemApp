import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { ToastService } from '../../providers/toast-service/toast-service';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  email:string = ''
  password:string = ''

  constructor(public navCtrl: NavController, public navParams: NavParams, private fbAuth: AngularFireAuth, private toast: ToastService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  async login(){
    try{
      await this.fbAuth.auth.signInWithEmailAndPassword(this.email, this.password)
      this.navCtrl.push('UsertabsPage')
    }
    catch(err){
      this.toast.show("Invalid Email or Password")
      console.error(err)
    }
  }

  createUser(){
    this.navCtrl.push('RegisterPage')
  }
}
