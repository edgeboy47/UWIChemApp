import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireAuth} from 'angularfire2/auth'
import { ToastService } from '../../providers/toast-service/toast-service';


@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {
  email:string = ''
  password:string = ''

  constructor(public navCtrl: NavController, public navParams: NavParams, private fbAuth: AngularFireAuth, private toast: ToastService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }

  async register(){
    try{
      if(this.email.length === 0 || this.password.length === 0) this.toast.show("Invalid Email or Password")
      else{
        await this.fbAuth.auth.createUserWithEmailAndPassword(this.email, this.password)
        this.navCtrl.push('UsertabsPage')
      }
    }
    catch(err){
      this.toast.show("Invalid Email or Password")
      console.error(err)
    }
  }
}
