import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
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
export class UserEditPage {

  user = {email:"",type:""};
  userID="";
  constructor(public alertCtrl:AlertController, public navCtrl: NavController, public navParams: NavParams, public db: AngularFireDatabase) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserEditPage');

    this.userID = this.navParams.get('userID');
    this.db.object("/Users/"+this.userID+"/").valueChanges().subscribe(data=>{
      this.user.email = data['email'];
      this.user.type = data['type'];
    });
  }

  save(){
    this.db.database.ref('/Users/').child(this.userID).child("type").set(this.user.type);
    let alert = this.alertCtrl.create({
      title: 'Changes Saved',
      buttons: [
        {
          text: 'OK',
        },
      ]
    });
    alert.present();
  }

  remove(){
    // let alert = this.alertCtrl.create({
    //   title: 'Are you sure?',
    //   buttons: [
    //     {
    //       text: 'Yes',
    //       handler: ()=>{
    //         this.db.object('/Users/'+this.userID+'/').remove();
    //         this.db.object('/UserCourses/'+this.userID+'/').remove();
    //         this.navCtrl.pop();
    //       }
    //     },
    //     {
    //       text: 'Cancel',
    //     },
    //   ]
    // });
    // alert.present();
  }
}
