import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { AngularFireAuth} from 'angularfire2/auth'
import { AngularFireDatabase } from 'angularfire2/database';
import { FCM } from '@ionic-native/fcm';
import { PlatformCheckProvider } from '../../providers/platform-check/platform-check';


@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {
  email:string = ''
  password:string = ''

  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              private fcm: FCM, 
              private fbAuth: AngularFireAuth, 
              private db: AngularFireDatabase, 
              private toasty: ToastController,
              private pltCheck: PlatformCheckProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }

  async register(){
    try{
      if(this.email.length === 0 || this.password.length === 0){
        let toast = this.toasty.create({
          message: "Invalid Email or Password",
          duration: 800,
          position: 'bottom',
          cssClass:"toast-success",
          showCloseButton:true,
        });
        toast.present();
      }else{
        await this.fbAuth.auth.createUserWithEmailAndPassword(this.email, this.password)
        
        this.fbAuth.authState.subscribe( user => {
          this.db.object(`Users/${user.uid}`).set({ email: this.email, type: "Student" })
          .then( () => {
            if(!this.pltCheck.contains('core')) {
              this.fcm.getToken().then( token => {
                this.db.object(`Users/${user.uid}`).update({ notificationToken: token })
              })
            }
            this.navCtrl.setRoot('UsertabsPage')
          })
        })
      }
    }
    catch(err){
      let toast = this.toasty.create({
        message: err['message'],
        duration: 800,
        position: 'bottom',
        cssClass:"toast-success",
        showCloseButton:true,
      });
      
      toast.present();
      console.error(err)
    }
  }
}
