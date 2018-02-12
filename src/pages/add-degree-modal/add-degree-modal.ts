import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController, ToastController  } from 'ionic-angular';

/**
 * Generated class for the AddDegreeModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-degree-modal',
  templateUrl: 'add-degree-modal.html',
})
export class AddDegreeModalPage {

  degree = {Name:"",CourseCount:0};

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public viewCtrl: ViewController,
              public alertCtrl: AlertController,
              public toasty:ToastController) {
  }

  ionViewDidLoad() {
  }

  goBack(){
    this.navCtrl.pop();
  }

  save(){
    //Checking if the course chosen exists
    if(this.degree.Name!==""){
      //Create notification that the course has been added:
      let toast = this.toasty.create({
        message: "Degree Added",
        duration: 1000,
        showCloseButton: true,
        position: 'bottom'
      });

      //Display notification:
      toast.present();


      this.viewCtrl.dismiss(this.degree);
    }

    //If the chosen course is invalid
    else{
      //Determining which course data is missing:

      //Create alert for missing course data
      let alert = this.alertCtrl.create({
        title: 'Name Required',
        buttons: ['OK']
      });
      //Display alert:
      alert.present();
    }
  }

}
