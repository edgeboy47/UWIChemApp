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
  // Bound to the email input field on the login screen  
  email:string = ''  
  // Bound to the password input field on the login screen  
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

  // Function to create a new user account
  async register(){
    try{
      // Input field checks
      if(this.email.length === 0 || this.password.length === 0){
        let toast = this.toasty.create({
          message: "Invalid Email or Password",
          duration: 1000,
          position: 'bottom',
          cssClass:"toast-success",
          showCloseButton:true,
        });
        toast.present();
      }else{
        // Create the account with Firebase Authentication
        await this.fbAuth.auth.createUserWithEmailAndPassword(this.email, this.password)
        
        // Retrieve the user information
        this.fbAuth.authState.subscribe( user => {
          // Add the user to the Firebase database
          this.db.object(`Users/${user.uid}`).set({ email: this.email, type: "Student" })
          .then( () => {
            // If the user agent is not a desktop browser
            if(!this.pltCheck.contains('core')) {
              // Retrieve the user's firebase cloud messaging notification token
              this.fcm.getToken().then( token => {
                // Add the token to the user's entry in the firebae database
                this.db.object(`Users/${user.uid}`).update({ notificationToken: token })
              })
            }
            // Navigate to the usertabs page
            this.navCtrl.setRoot('UsertabsPage')
          })
        })
      }
    }
    catch(err){
      // Create a toast showing any error messages
      let toast = this.toasty.create({
        message: err['message'],
        duration: 1000,
        position: 'bottom',
        cssClass:"toast-success",
        showCloseButton:true,
      });
      
      toast.present();
      console.error(err)
    }
  }
}
