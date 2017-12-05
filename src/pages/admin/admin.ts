//Darrion, Gideon, Ravish, Nathan, Krystel

//This page is only used by the admin.

import { Component, OnDestroy } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {AngularFireDatabase} from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';


@IonicPage()
@Component({
  selector: 'page-admin',
  templateUrl: 'admin.html',
})
export class AdminPage implements OnDestroy{
  users=[];//An array that will be used to contain the users read from the firebase database.
  dUsers=[];//An array that will be used to contain the users read from the firebase database.
  showContent = false; //A flag that is set based on the type of user.
  usersSub;// A varibale used to subcribe to the users section in the firebase.

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
      this.users = []
      for(let key in data){
        let d = data[key];
        d['userID'] = key;
        this.users.push(d);
      }//The for loop, reads users from the data retrieved from the firebase database and stores it in an array called users.
      this.dUsers = this.users; // The data stored in the users array is copied into another array called dUsers.
    });
  }

  ngOnDestroy(){
    if(this.usersSub)
      this.usersSub.unsubscribe();
  }
  /*ngOnDestroy is excuted when the user exits the admin page and executes an instruction to unsubcribe from the subscription made in the 
  ionViewDidLoad.*/

  getItems(ev: any) {
    this.dUsers = this.users;
    let val = ev.target.value;

    if (val && val.trim() != '') {
      this.dUsers = this.users.filter((item) => {
        return (item['email'].toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }
  /*getItems is a function used to display all the users of the app by email address. If a email is selected, the user
  will be navigated to navigateToUserDetails page where the admin may changes the type of of the user selected or remove them altogether.*/
  
  navigateToUserDetails(userID){
    this.navCtrl.push("UserEditPage",{userID});
  }

}
