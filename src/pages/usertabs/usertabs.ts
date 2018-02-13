import { Component, OnDestroy } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {AngularFireDatabase} from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import 'rxjs/add/operator/take';

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
  NewsfeedPage:any="NewsfeedPage";

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
    this.userSub = this.fbAuth.authState.subscribe(data=>{
      if(data){
        //Checking if user is an admin, which will display the 'Admin Options' tab
        this.typeSub = this.db.object('/Users/'+data.uid+'/type/').valueChanges().take(1).subscribe(d2=>{
          if(d2=='Admin'){
            this.showAdmin = true;
          }else{
            this.showAdmin = false;
          }
        });
      }else{
        this.showAdmin = false;
      }
    });
  }

}
