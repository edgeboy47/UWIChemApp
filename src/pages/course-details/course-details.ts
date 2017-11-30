import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams} from 'ionic-angular';
import {AngularFireDatabase} from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { ToastController } from 'ionic-angular';

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
  course={courseID:"",available:false, name:"",outline:"",credits:""};
  showButton=true;
  constructor(private fbAuth: AngularFireAuth, 
              public navCtrl: NavController, 
              public navParams: NavParams , 
              public db: AngularFireDatabase,
              public toasty: ToastController) {
    
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
      this.course.credits = data['Credits'];
    });
  }
  
  addCourse(){
    let id = this.course.courseID;
    let name = this.course.name;
    
    this.fbAuth.authState.subscribe(data=>{
      this.db.database.ref('/UserCourses/').child(data.uid).child(id).set(name);
      this.showButton = false;
      
      let toast = this.toasty.create({
        message: 'You added '+this.course.courseID+' to your courses!',
        duration: 1000,
        position: 'middle'
      });
    
      toast.present();
    });
  }

}
