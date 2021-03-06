/****************** Various Imports ********************/
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController,AlertController,ToastController } from 'ionic-angular';
import * as moment from 'moment';       //Moment used for formatting dates.
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
  event = {startTime: new Date().toISOString(), endTime: new Date().toISOString(), title: "", Notes:"", type: "", resource:""}

  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              private viewCtrl:ViewController, 
              private alertCtrl:AlertController,        //Various constructor declarations.
              public toasty: ToastController) {

    let preselectedDate = moment(this.navParams.get('selectedDay')).format();     //Get the selected day passed as a parameter from the calendar page.
    this.event.startTime = preselectedDate;
    this.event.endTime = preselectedDate;                                         //Set start and end time to that date that was retrieved.
  }

  ionViewDidLoad() {
  }


  /*
    This function captures the data entered by the user 
    and passes it back to the calendar page.
  */
  save(){
    if(this.event.title!=="" && this.event.type!=="" && this.event.Notes!==""){      //If Data is not empty then allow the event to be added.
      this.event.startTime = this.event.endTime;

      let toast = this.toasty.create({
        message: "Event Saved",
        duration: 1000,                   //Create Post that event was saved.
        position: 'bottom',
        showCloseButton: true
      });
      
      toast.present();                    //Present Toast

      this.viewCtrl.dismiss(this.event);  //Dismiss the modal and pass the details captured back to calling page.
    }
    else{                                 //Else, display corresponding error messages.
      let extraMessage = "Title";
      if(this.event.title)
        extraMessage = 'Type';
        if(this.event.type)
        extraMessage = 'Message';

      let alert = this.alertCtrl.create({
        title: extraMessage+' Required',
        buttons: ['OK']
      });
      alert.present();
    }
  }

  goBack(){
    this.navCtrl.pop();               //Allows user to go back to previous page.
  }

}
