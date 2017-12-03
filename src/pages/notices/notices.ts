import { Component, OnDestroy } from '@angular/core';
import { IonicPage, ModalController ,NavController, NavParams, AlertController } from 'ionic-angular';
import {AngularFireAuth} from 'angularfire2/auth';
import {AngularFireDatabase } from 'angularfire2/database';
import * as moment from 'moment';
/**
 * Generated class for the NoticesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-notices',
  templateUrl: 'notices.html',
})
export class NoticesPage implements OnDestroy{
  noticeSource= [];
  noticeID;
  showButtons = false;
  notices:any=[];

  noticeSub;
  typeSub;
  userCoursesSubscription;
  userSubscription;
  courseSubscription;

  courses:any = [];
  c:any ;

  user;

  constructor(private fbAuth: AngularFireAuth, public db: AngularFireDatabase, public modalCtrl:ModalController, public navCtrl: NavController, public navParams: NavParams, public alertCtrl:AlertController) {
  }


  ngOnDestroy(){
    if(this.noticeSub)
      this.noticeSub.unsubscribe();
    if(this.typeSub)
      this.typeSub.unsubscribe();
    if(this.userCoursesSubscription)
      this.userCoursesSubscription.unsubscribe();
    if(this.userSubscription)
      this.userSubscription.unsubscribe();
    if(this.courseSubscription)
      this.courseSubscription.unsubscribe();
  }



  ionViewDidLoad() {
    console.log('ionViewDidLoad NoticesPage');
    this.courseSubscription = this.db.list('/Courses/').valueChanges().subscribe(()=>{
      this.noticeSub= this.db.object('/Events/').valueChanges().subscribe(events=>{
        this.userSubscription = this.fbAuth.authState.subscribe(user=>{
          if(user){
            this.typeSub = this.db.object('/Users/'+user.uid+'/type/').valueChanges().subscribe(d2=>{
              if(d2=='Teacher' || d2=='Admin'){
                this.showButtons = true;
              }
            });
            this.user = user;
            this.userCoursesSubscription = this.db.object('/UserCourses/'+user.uid).valueChanges().subscribe(usercourses=>{
              this.courses = [];
              this.noticeSource = [];
              this.notices = [];
              for(let key in usercourses){
                this.db.database.ref('/Courses/'+key+'/').once('value',(existance)=>{
                  if(existance.exists()){
                    let course = {courseID:key,Name:usercourses[key]};
                    this.courses.push(course);
                      
                    let courseNotices = events[key];
                    for(let notice in courseNotices){
                      let d = courseNotices[notice];
                      let note = { Type: "", date:"", Notes:"", CourseID:"",id:""};
                      note.Type=d['Type']; 
                      note.date=d['date'];
                      note.Notes=d['Notes'];  
                      note.CourseID=key; 
                      note.id=notice;
                      this.notices.push(note);
                    }
                  }else
                    this.db.object('/UserCourses/'+user.uid+'/'+key).remove();
                });         
              }
              this.noticeSource = this.notices;
            });
          }
        });
      });
    });
  }

  removeNotice(notice){
    this.notices = this.noticeSource;
    this.notices.splice(this.notices.indexOf(notice),1);
    this.db.object('/Events/'+notice.CourseID+'/'+notice.id).remove();

    this.noticeSource = [];
    setTimeout(()=>{
      this.noticeSource = this.notices;
    });
  }

  onNoticeSelected(notice){
    let date = moment(notice.date).format('LLLL');

    if(this.showButtons){
      let alert = this.alertCtrl.create({
        title: ''+notice.Type,
        subTitle: 'Due Date: '+date,
        message: 'Message: '+notice.Notes,
        buttons: [
          {
            text: 'OK',
          },
          {
            text: 'Remove',
            handler: ()=>{
              this.removeNotice(notice);
            }
          }
        ]
      });
      alert.present();
    }else{
      let alert = this.alertCtrl.create({
        title: ''+notice.Type,
        subTitle: 'Due Date: '+date,
        message: 'Message: '+notice.Notes,
        buttons: [
          {
            text: 'OK',
          },
        ]
      });
      alert.present();
    }
  }
}