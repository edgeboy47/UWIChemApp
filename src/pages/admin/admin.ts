import { Component, OnDestroy } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {AngularFireDatabase} from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
/**
 * Generated class for the AdminPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-admin',
  templateUrl: 'admin.html',
})
export class AdminPage implements OnDestroy{
  users=[];
  dUsers=[];
  showContent = false;
  usersSub;

  constructor(public db: AngularFireDatabase, 
              public navCtrl: NavController, 
              public navParams: NavParams,
              public auth:AngularFireAuth) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AdminPage');
    this.users = [];

    this.showContent = this.navParams.get('show');

    this.usersSub = this.db.object('/Users').valueChanges().subscribe(data=>{
      for(let key in data){
        let d = data[key];
        d['userID'] = key;
        this.users.push(d);
      }
      this.dUsers = this.users;
    });
  }

  ngOnDestroy(){
    if(this.usersSub)
      this.usersSub.unsubscribe();
  }

  getItems(ev: any) {
    this.dUsers = this.users;
    let val = ev.target.value;

    if (val && val.trim() != '') {
      this.dUsers = this.users.filter((item) => {
        return (item['email'].indexOf(val) > -1);
      })
    }
  }
  
  navigateToUserDetails(userID){
    this.navCtrl.push("UserEditPage",{userID});
  }

}
