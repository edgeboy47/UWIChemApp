//Darrion, Gideon, Ravish, Nathan, Krystel
import { Component, OnDestroy } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
/* This page navigates to the Login page when a department is selected. */

@IonicPage()
@Component({
  selector: 'page-departments',
  templateUrl: 'departments.html',
})
export class DepartmentsPage implements OnDestroy{

  val = "";
  authSub;
  verSub;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private db: AngularFireDatabase, 
              private fbAuth: AngularFireAuth,
              public alertCtrl: AlertController) {
  }

  ngOnDestroy(){
    if(this.authSub)
      this.authSub.unsubscribe();
    if(this.verSub)
      this.verSub.unsubscribe();
    
  }

  ionViewDidLoad() {
  }

  navigateToLogin(){
    this.authSub = this.fbAuth.authState.subscribe(data=>{
      if(data){
        this.verSub = this.db.object(`Users/${data.uid}/verified`).valueChanges().take(1).subscribe(val => {
          if(val === 'True'){
            this.navCtrl.setRoot('UsertabsPage');
          }else{
            this.navCtrl.push('CodeLoginPage');
          }
        })
      }else{
        this.navCtrl.push("LoginPage"); 
      }
    })
  }

  showError(){
    let alert = this.alertCtrl.create({
      title:'Not expanded yet',
      message:'Database not expanded to facilitate this department yet!',
      buttons:[
        {
          text:'Ok',
        },
      ],
    });
    alert.present();
  }
}
