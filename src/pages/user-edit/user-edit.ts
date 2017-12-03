import { Component, OnDestroy } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController } from 'ionic-angular';
import {AngularFireDatabase} from 'angularfire2/database';

/**
 * Generated class for the UserEditPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-user-edit',
  templateUrl: 'user-edit.html',
})
export class UserEditPage implements OnDestroy{

  user = {email:"",type:""};
  userID="";
  usersSub;
  constructor(public alertCtrl:AlertController, 
              public navCtrl: NavController, 
              public navParams: NavParams,
              public db: AngularFireDatabase,
              public toasty: ToastController) {
  }

  ngOnDestroy(){
    if(this.usersSub)
      this.usersSub.unsubscribe();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserEditPage');

    this.userID = this.navParams.get('userID');
    this.usersSub = this.db.object("/Users/"+this.userID+"/").snapshotChanges().subscribe(snapshot => {
      let data = snapshot.payload.toJSON()
      this.user.email = data['email'];
      this.user.type = data['type'];
    });
  }

  save(){
    this.db.database.ref('/Users/').child(this.userID).child("type").set(this.user.type);

    let toast = this.toasty.create({
      message: "Changes Saved",
      duration: 1000,
      position: 'middle'
    });
    
    toast.present();
  }

  remove(){
    let alert = this.alertCtrl.create({
      title: 'Are you sure?',
      buttons: [
        {
          text: 'Yes',
          handler: () => {
            this.usersSub.unsubscribe()
            this.navCtrl.pop();
            this.db.object(`/Deletions/${this.userID}`).set({test: ''});
            this.db.object('/Users/'+this.userID+'/').remove();
            this.db.object('/UserCourses/'+this.userID+'/').remove();
          }
        },
        {
          text: 'Cancel',
        },
      ]
    });
    alert.present();
  }
}
