import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the NoticesModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-notices-modal',
  templateUrl: 'notices-modal.html',
})
export class NoticesModalPage {
  notice = {date:new Date().toString(), Title:"", Recipient:"",Message:""}
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
    
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad NoticesModalPage');
  }
  save(){
    console.log("Save button pressed..Notice title:" +this.notice.Title);
    this.viewCtrl.dismiss(this.notice);
  }

  cancel(){
    
    this.navCtrl.pop();
  }

  

}
