import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

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

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UsertabsPage');
  }

}
