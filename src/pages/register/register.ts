import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireAuth} from 'angularfire2/auth'


@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {
  email:string = ''
  password:string = ''

  constructor(public navCtrl: NavController, public navParams: NavParams, private fbAuth: AngularFireAuth) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }

  async register(){
    try{
      if(this.email.length === 0 || this.password.length === 0) alert("Invalid email or password")
      else{
        await this.fbAuth.auth.createUserWithEmailAndPassword(this.email, this.password)
        this.navCtrl.push('UsertabsPage')
      }
    }
    catch(err){
      console.error(err)
    }
  }
}
