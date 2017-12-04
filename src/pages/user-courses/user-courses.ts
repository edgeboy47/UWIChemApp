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
  courseSubscription;
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
    if(this.courseSubscription)
      this.courseSubscription.unsubscribe();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserCoursesPage');
    this.courseSubscription = this.db.list('/Courses/').valueChanges().subscribe(()=>{
      this.loadUserCourses();
    });
  }

  loadUserCourses(){
    this.userSubscription = this.fbAuth.authState.subscribe(data1=>{
      if(data1){
        this.user = data1;
        this.userCoursesSubscription = this.db.object('/UserCourses/'+data1.uid).valueChanges().subscribe(data=>{
          this.courses = [];
          for(let key in data){
            this.db.database.ref('/Courses/'+key+'/').once('value',(existance)=>{
              if(existance.exists()){
                let course = {courseID:key,Name:data[key]};
                this.courses.push(course);
              }else
                this.db.object('/UserCourses/'+data1.uid+'/'+key).remove();
            });         
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
        duration: 800,
        position: 'bottom',
        showCloseButton: true
      });

    }else{
      toast = this.toasty.create({
        message: "Remove Failed!"+courseID,
        duration: 800,
        position: 'bottom',
        showCloseButton: true
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
