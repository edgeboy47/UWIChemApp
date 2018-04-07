import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { FCM } from '@ionic-native/fcm';
import { AngularFireDatabase } from 'angularfire2/database';
import { PlatformCheckProvider } from '../../providers/platform-check/platform-check';
import { DatabaseProvider } from '../../providers/database/database';
import { AuthProvider } from '../../providers/auth/auth';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  // Bound to the email input field on the login screen
  email:string = ''
  // Bound to the password input field on the login screen
  password:string = ''
  // Flag used to test if a user is already logged in
  skip=false;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              private fcm: FCM, 
              private db: AngularFireDatabase, 
              private fbAuth: AngularFireAuth, 
              private toasty: ToastController,
              private pltCheck: PlatformCheckProvider,
              private dbProv: DatabaseProvider,
              private authProv: AuthProvider,
              private loader: LoadingController) {
  }

  ionViewDidLoad() {
    // If a user is already logged in and verified, skip the login page
    if(this.authProv.isLoggedIn()){
      this.dbProv.readObject(`/Users/${this.authProv.getUID()}/verified`).subscribe(val =>{
        if(val === 'True'){
          this.skip = true;
          this.navCtrl.setRoot('UsertabsPage');
        }
      })
    }
  }

  // The user login function
  async login(){
    try{
      // Signs the user into Firebase Authentication with the email and password they entered
      await this.fbAuth.auth.signInWithEmailAndPassword(this.email, this.password)

      // If the user agent is not a desktop browser
      if(!this.pltCheck.contains('core')) {
        // Retrieve user account information
        this.fbAuth.authState.subscribe( user => {
          // Retrieve the user's firebase cloud messaging notification token
          this.fcm.getToken().then( token => {
            // Add the token to the user's table in the firebase database
            this.db.object(`Users/${user.uid}`).update({ notificationToken: token })
          })
          // Whenever the user's notification token changes
          this.fcm.onTokenRefresh().subscribe( token => {
            // Update its value in the databsae
            this.db.object(`Users/${user.uid}`).update({ notificationToken: token })
          })
        })
      }

      let loading = this.loader.create({
        content: 'Loading...'
      });
      loading.present();

      // If the user has already given the token, go to the main tabs page
      // else go to the code entry page
      let uid = this.fbAuth.auth.currentUser.uid
      
      this.db.object(`Users/${uid}/verified`).valueChanges().take(1).subscribe( val => {
        if(val === "True") this.navCtrl.setRoot('UsertabsPage', {'loader': loading})
        else this.navCtrl.push('CodeLoginPage')
      })
    }
    catch(err){
      // Create a toast showing an error message if the login failed
      let toast = this.toasty.create({
        message: "Invalid Email or Password",
        duration: 1500,
        position: 'bottom',
        cssClass:"toast-success",
      });
      
      toast.present();
      console.error(err)
    }
  }

  // Navigate to the register page to create a new user account
  register(){
    this.navCtrl.push('RegisterPage')
  }
}
