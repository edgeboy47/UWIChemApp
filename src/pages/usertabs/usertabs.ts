import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {AngularFireDatabase} from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
/**
 * Generated class for the UsertabsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-usertabs',
  templateUrl: 'usertabs.html',
})
export class UsertabsPage {

  UserCoursesPage:any="UserCoursesPage";
  AllCoursesPage:any="AllCoursesPage";
  NoticesPage:any="NoticesPage";
  AdminPage:any="AdminPage";

  showAdmin:boolean = false;

  constructor(private fbAuth: AngularFireAuth, public db: AngularFireDatabase, public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UsertabsPage');
    this.fbAuth.authState.subscribe(data=>{
      this.db.object('/Users/'+data.uid+'/type/').valueChanges().subscribe(d2=>{
        if(d2=='Admin'){
          this.showAdmin = true;
        }
      });
    });
  }

}
