import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController,AlertController } from 'ionic-angular';

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
  notice = {date:new Date().toISOString(), Title:"", Recipient:"",Message:""}
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, private alertCtrl:AlertController) {
    
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad NoticesModalPage');
  }
  save(){
    console.log("Save button pressed..Notice title:" +this.notice.Title);
    
    if(this.notice.Recipient!=="" && this.notice.Message!==""){
      this.viewCtrl.dismiss(this.notice);
    }
    else{
      let extraMessage = "Recipient";
      if(this.notice.Recipient)
        extraMessage = 'Message';


      let alert = this.alertCtrl.create({
        title: extraMessage+' Required',
        buttons: ['OK']
      });
      alert.present();
    }
  }

  cancel(){
    
    this.navCtrl.pop();
  }

  

}
