import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { FCM } from '@ionic-native/fcm';
import { AngularFireDatabase } from 'angularfire2/database';
import { PlatformCheckProvider } from '../../providers/platform-check/platform-check';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  email:string = ''
  password:string = ''
  skip=false;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              private fcm: FCM, 
              private db: AngularFireDatabase, 
              private fbAuth: AngularFireAuth, 
              private toasty: ToastController,
              private pltCheck: PlatformCheckProvider) {
  }

  ionViewDidLoad() {
    this.fbAuth.authState.subscribe(data=>{
      if(data){
        this.skip=true;
      }
    })

    console.log('ionViewDidLoad LoginPage');
  }

  async login(){
    try{
      await this.fbAuth.auth.signInWithEmailAndPassword(this.email, this.password)
      if(!this.pltCheck.contains('core')) {
        this.fbAuth.authState.subscribe( user => {
          this.fcm.getToken().then( token => {
            this.db.object(`Users/${user.uid}`).update({ notificationToken: token })
          })
          this.fcm.onTokenRefresh().subscribe( token => {
            this.db.object(`Users/${user.uid}`).update({ notificationToken: token })
          })
        })
      }

      this.navCtrl.setRoot('UsertabsPage')
    }
    catch(err){
      let toast = this.toasty.create({
        message: "Invalid Email or Password",
        duration: 800,
        position: 'bottom',
        cssClass:"toast-success",
        showCloseButton:true,
      });
      
      toast.present();
      console.error(err)
    }
  }

  skipLogin(){
    this.navCtrl.setRoot('UsertabsPage')
  }

  createUser(){
    this.navCtrl.push('RegisterPage')
  }
}
