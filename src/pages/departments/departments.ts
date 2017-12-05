//Darrion, Gideon, Ravish, Nathan, Krystel
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/* This page navigates to the Login page when a department is selected. */

@IonicPage()
@Component({
  selector: 'page-departments',
  templateUrl: 'departments.html',
})
export class DepartmentsPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DepartmentsPage');
  }

  navigateToLogin(){
    this.navCtrl.push("LoginPage");
  }

}
