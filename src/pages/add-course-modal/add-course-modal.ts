import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController } from 'ionic-angular';

/**
 * Generated class for the AddCourseModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-course-modal',
  templateUrl: 'add-course-modal.html',
})
export class AddCourseModalPage {
  course = {courseID:"", Name:"", Available: false, Outline:"", Credits:0};

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public viewCtrl: ViewController,
              public alertCtrl: AlertController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddCourseModalPage');
  }

  goBack(){
    this.navCtrl.pop();
  }

  save(){
    if(this.course.Name!=="" && this.course.courseID!=="" && this.course.Outline!==""){
      this.viewCtrl.dismiss(this.course);
    }
    else{
      let extraMessage = "Title";
      if(this.course.Name){
        extraMessage = 'Course Code and Outline';
        if(this.course.courseID)
          extraMessage = 'Outline';
        else 
          extraMessage = 'Course Code';
      }


      let alert = this.alertCtrl.create({
        title: extraMessage+' Required',
        buttons: ['OK']
      });
      alert.present();
    }
  }
}
