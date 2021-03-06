import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import 'rxjs/add/operator/take';

@IonicPage()
@Component({
  selector: 'page-code-login',
  templateUrl: 'code-login.html',
})
export class CodeLoginPage {
  token: string = ''
  verified: boolean = false

  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              private fbAuth: AngularFireAuth, 
              private db: AngularFireDatabase, 
              private toast: ToastController,
              private loader: LoadingController) {
  }

  ionViewDidLoad() {
  }

  login(){
    let uid = this.fbAuth.auth.currentUser.uid
    let codes = this.db.object('/Codes/').valueChanges()
    codes.take(1).subscribe(list => {
      // If the code given is in the list of codes, set the user to verified, set the user's account type
      // and navigate to the main tabs page
      for(let prop in list){
        if(this.token === list[prop]){
          this.db.object(`Users/${uid}`).update({type: prop, verified: "True"})
          this.verified = true
          
          let loading = this.loader.create({
            content: 'Loading...'
          });
          loading.present();

          this.navCtrl.setRoot("UsertabsPage", {'loader': loading});
        }
      }
      
      if(!this.verified){
        this.toast.create({
          message: "Invalid Code",
          duration: 1500,
          position: 'bottom',
          cssClass: 'toast-success'
        }).present()
      }
    })
  }
}
