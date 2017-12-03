import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController,AlertController,ToastController } from 'ionic-angular';
import * as moment from 'moment';
/**
 * Generated class for the EventModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-event-modal',
  templateUrl: 'event-modal.html',
})
export class EventModalPage {
  event = {startTime: new Date().toISOString(), endTime: new Date().toISOString(), title: "", type: "", resource:""}

  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              private viewCtrl:ViewController, 
              private alertCtrl:AlertController,
              public toasty: ToastController) {
    let preselectedDate = moment(this.navParams.get('selectedDay')).format();
    this.event.startTime = preselectedDate;
    this.event.endTime = preselectedDate;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EventModalPage');
  }

  save(){
    console.log(this.event.title)
    if(this.event.title!=="" && this.event.type!==""){
      this.event.startTime = this.event.endTime;

      let toast = this.toasty.create({
        message: "Event Saved",
        duration: 1000,
        position: 'middle'
      });
      
      toast.present();

      this.viewCtrl.dismiss(this.event);
    }
    else{
      let extraMessage = "Title";
      if(this.event.title)
        extraMessage = 'Type';


      let alert = this.alertCtrl.create({
        title: extraMessage+' Required',
        buttons: ['OK']
      });
      alert.present();
    }
  }

  goBack(){
    this.navCtrl.pop();
  }

}
