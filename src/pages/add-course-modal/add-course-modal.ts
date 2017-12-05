import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController, ToastController } from 'ionic-angular';

/**
 * Generated class for the AddCourseModalPage page.
 * This class sends a notication that a course has been created, or that data was missing in attempting to create a course..
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-course-modal',
  templateUrl: 'add-course-modal.html',
})
export class AddCourseModalPage {
  //Course object with specified attributes
  course = {courseID:"", Name:"", Available: false, Outline:"", Credits:0};

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public viewCtrl: ViewController,
              public alertCtrl: AlertController,
              public toasty:ToastController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddCourseModalPage');
  }

  goBack(){
    this.navCtrl.pop();
  }

  //Function for sending notification that a course has been added
  save(){
    //Checking if the course chosen exists
    if(this.course.Name!=="" && this.course.courseID!=="" && this.course.Outline!==""){
      //Create notification that the course has been added:
      let toast = this.toasty.create({
        message: "Course Added",
        duration: 1000,
        showCloseButton: true,
        position: 'bottom'
      });

      //Display notification:
      toast.present();


      this.viewCtrl.dismiss(this.course);
    }

    //If the chosen course is invalid
    else{
      //Determining which course data is missing:
      let extraMessage = "Title";
      if(this.course.Name){
        extraMessage = 'Course Code and Outline';
        if(this.course.courseID)
          extraMessage = 'Outline';
        else 
          extraMessage = 'Course Code';
      }

      //Create alert for missing course data
      let alert = this.alertCtrl.create({
        title: extraMessage+' Required',
        buttons: ['OK']
      });
      //Display alert:
      alert.present();
    }
  }
}
