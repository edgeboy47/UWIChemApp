import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireAuth} from 'angularfire2/auth'
import { ToastService } from '../../providers/toast-service/toast-service';
import { AngularFireDatabase } from 'angularfire2/database';
import { FCM } from '@ionic-native/fcm';


@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {
  email:string = ''
  password:string = ''

  constructor(public navCtrl: NavController, public navParams: NavParams, private fcm: FCM, private fbAuth: AngularFireAuth, private db: AngularFireDatabase, private toast: ToastService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }

  async register(){
    try{
      if(this.email.length === 0 || this.password.length === 0) this.toast.show("Invalid Email or Password")
      else{
        await this.fbAuth.auth.createUserWithEmailAndPassword(this.email, this.password)
        
        this.fbAuth.authState.subscribe( user => {
          this.db.object(`Users/${user.uid}`).set({ email: this.email })
          .then( () => {
            this.fcm.getToken().then( token => {
              this.db.object(`Users/${user.uid}`).update({ notificationToken: token })
            })
            this.navCtrl.setRoot('UsertabsPage')
          })
        })
      }
    }
    catch(err){
      this.toast.show(err['message'])
      console.error(err)
    }
  }
}
