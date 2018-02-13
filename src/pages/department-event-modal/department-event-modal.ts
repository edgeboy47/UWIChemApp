import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController,AlertController,ToastController } from 'ionic-angular';
import * as moment from 'moment';       //Moment used for formatting dates.

/**
 * Generated class for the DepartmentEventModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-department-event-modal',
  templateUrl: 'department-event-modal.html',
})
export class DepartmentEventModalPage {

  event = {startTime: new Date().toISOString(), endTime: new Date().toISOString(), title: "", type: ""}
  
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
    console.log('ionViewDidLoad DepartmentEventModalPage');
  }

  /*
    This function captures the data entered by the user 
    and passes it back to the calendar page.
  */
  save(){
    console.log(this.event.title)
    if(this.event.title!=="" && this.event.type!==""){      //If Data is not empty then allow the event to be added.
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
