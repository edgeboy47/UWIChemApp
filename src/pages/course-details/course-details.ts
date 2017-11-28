import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams ,AlertController} from 'ionic-angular';
import {AngularFireDatabase} from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';


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
  showButton=true;
  constructor(private alertCtrl: AlertController, private fbAuth: AngularFireAuth, public navCtrl: NavController, public navParams: NavParams , public db: AngularFireDatabase) {
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CourseDetailsPage');
    this.course.courseID = this.navParams.get('courseID');

    this.fbAuth.authState.subscribe(data=>{
      this.db.object('/UserCourses/'+data.uid+'/'+this.course.courseID).valueChanges().subscribe(data=>{
        if(data!=null)this.showButton = false;
      })
    });
   


    this.db.object('/Courses/'+this.course.courseID).valueChanges().subscribe(data=>{
      this.course.name = data['Name'];
      this.course.outline = data['Outline'];
      this.course.available = data['Available'];
    });
  }
  
  addCourse(){
    let id = this.course.courseID;
    let name = this.course.name;
    
    this.fbAuth.authState.subscribe(data=>{
      this.db.database.ref('/UserCourses/').child(data.uid).child(id).set(name);
      this.showButton = false;

      let alert = this.alertCtrl.create({
        title: 'Courses Added',
        message: 'You added '+this.course.courseID+' to your courses!',
        buttons: [
          {
            text: 'OK',
          },
        ]
      });
      alert.present();
    });
  }

}
