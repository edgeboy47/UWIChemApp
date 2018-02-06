import { Component, OnDestroy } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {AngularFireDatabase} from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
/**
 * Generated class for the UsertabsPage page.
 * Class to display tabs at the bottom of the screen for navigation through "User Courses", "All Courses", "Notices" and "Admin Options"
 * 
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-usertabs',
  templateUrl: 'usertabs.html',
})
export class UsertabsPage implements OnDestroy{

  //Creating strings with name of each page the tab corresponds to
  UserCoursesPage:any="UserCoursesPage";
  AllCoursesPage:any="AllCoursesPage";
  NoticesPage:any="NoticesPage";
  AdminPage:any="AdminPage";
  DegreesPage:any="DegreesPage";

  showAdmin:boolean = false;

  typeSub;
  userSub;

  constructor(private fbAuth: AngularFireAuth, public db: AngularFireDatabase, public navCtrl: NavController, public navParams: NavParams) {
  }

  ngOnDestroy(){
    if(this.userSub)
      this.userSub.unsubscribe();
    if(this.typeSub)
      this.typeSub.unsubscribe();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UsertabsPage');
    this.userSub = this.fbAuth.authState.subscribe(data=>{
      if(data){
        //Checking if user is an admin, which will display the 'Admin Options' tab
        this.typeSub = this.db.object('/Users/'+data.uid+'/type/').valueChanges().subscribe(d2=>{
          if(d2=='Admin'){
            this.showAdmin = true;
          }
        });
      }
    });
  }

}
