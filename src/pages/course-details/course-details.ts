import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {AngularFireDatabase} from 'angularfire2/database';

/**
 * Generated class for the CourseDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-course-details',
  templateUrl: 'course-details.html',
})
export class CourseDetailsPage {
  course={courseID:"",available:false, name:"",outline:""};

  constructor(public navCtrl: NavController, public navParams: NavParams , public db: AngularFireDatabase) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CourseDetailsPage');
    this.course.courseID = this.navParams.get('courseID');
    this.db.object('/Courses/'+this.course.courseID).valueChanges().subscribe(data=>{
      this.course.name = data['Name'];
      this.course.outline = data['Outline'];
      this.course.available = data['Available'];
    });
  }

}
