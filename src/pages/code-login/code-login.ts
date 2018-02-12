import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import 'rxjs/add/operator/take';

@IonicPage()
@Component({
  selector: 'page-code-login',
  templateUrl: 'code-login.html',
})
export class CodeLoginPage {
  token:string = ''

  constructor(public navCtrl: NavController, public navParams: NavParams, private fbAuth: AngularFireAuth, private db: AngularFireDatabase, private toast: ToastController) {
  }

  ionViewDidLoad() {
  }

  login(){
    let uid = this.fbAuth.auth.currentUser.uid
    let codes = this.db.list('/Codes/').valueChanges()
    codes.take(1).subscribe(list => {
      // If the code given is in the list of codes, set the user to verified
      // and navigate to the main tabs page
      if(list.some(arr => arr === this.token)){
         this.db.object(`Users/${uid}/`).update({ verified: 'True'})
         this.navCtrl.setRoot("UsertabsPage")
      }
      else{
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
