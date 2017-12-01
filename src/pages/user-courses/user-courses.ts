import { Component, OnDestroy } from '@angular/core';
import { IonicPage, NavController, AlertController, NavParams } from 'ionic-angular';
import {AngularFireDatabase} from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { ToastController } from 'ionic-angular';

/**
 * Generated class for the UserCoursesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-user-courses',
  templateUrl: 'user-courses.html',
})
export class UserCoursesPage implements OnDestroy{
  courses:any = [];
  userCoursesSubscription;
  userSubscription;
  user;

  constructor(public fbAuth: AngularFireAuth, 
              public navCtrl: NavController, 
              public navParams: NavParams, 
              public db: AngularFireDatabase,
              public toasty: ToastController,
              public alerty: AlertController) {
    
  }

  ngOnDestroy(){
    if(this.userCoursesSubscription)
      this.userCoursesSubscription.unsubscribe();
    if(this.userSubscription)
      this.userSubscription.unsubscribe();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserCoursesPage');
    this.userSubscription = this.fbAuth.authState.subscribe(data=>{
      if(data){
        this.user = data;
        this.userCoursesSubscription = this.db.object('/UserCourses/'+data.uid).valueChanges().subscribe(data=>{
          this.courses = [];
          for(let key in data){
            let course = {courseID:key,Name:data[key]};
            this.courses.push(course);
          }
        });
      }
    });
  }

  navigateToCalendar(courseID:string){
    this.navCtrl.push('CalendarPage',{courseID});
  }

  removeCourse(courseID:string){
    let toast;

    if(this.user){
      this.db.object('/UserCourses/'+this.user.uid+'/'+courseID+'/').remove()

      toast = this.toasty.create({
        message: "Removed "+courseID,
        duration: 1000,
        position: 'middle'
      });

    }else{
      toast = this.toasty.create({
        message: "Remove Failed!"+courseID,
        duration: 1000,
        position: 'middle'
      });
    }
  
    toast.present();
  }

  logOut(){
    let alert = this.alerty.create({
      title: 'Log Out',
      message: 'Are You Sure you want to Log Out?',
      buttons: [
        {
          text: 'Cancel',
        },
        {
          text: 'Yes',
          handler: ()=>{
            this.realLogOut();
          }
        }
      ]
    });

    alert.present(); 
  }

  realLogOut(){
    return this.fbAuth.auth.signOut().then(()=>{
      console.log("it worked");
      this.navCtrl.setRoot("DepartmentsPage");
    })
  }
}
