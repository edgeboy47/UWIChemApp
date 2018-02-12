import { Component, OnDestroy } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController } from 'ionic-angular';
import {AngularFireDatabase} from 'angularfire2/database';

/**
 * Generated class for the UserEditPage page.
 * This class allows an admin to edit a user's information, or delete a user from the system by deleting it from Firebase
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

    //Getting the selected user's ID, as well as their email and account type:
    this.userID = this.navParams.get('userID');
    this.usersSub = this.db.object("/Users/"+this.userID+"/").snapshotChanges().subscribe(snapshot => {
      let data = snapshot.payload.toJSON()
      this.user.email = data['email'];
      this.user.type = data['type'];
    });
  }

  //Saving the changes made to Firebase:
  save(){
    this.db.database.ref('/Users/').child(this.userID).child("type").set(this.user.type);

    //Creating notification that the changes have been saved
    let toast = this.toasty.create({
      message: "Changes Saved",
      duration: 1000,
      position: 'bottom',
      showCloseButton: true,    //added to get around UI glitch
    });
    
    toast.present(); //Displaying notification of changes saved
  }

  //Removing a selected user from Firebase:
  remove(){
    //Asking admin if they are sure they wish to remove selected user, as well as creating an alert for deletion:
    let alert = this.alertCtrl.create({
      title: 'Are you sure?',
      buttons: [
        {
          text: 'Yes',
          handler: () => {
            //Deleting user:
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
    alert.present(); //Displaying notification of deletion
  }
}
