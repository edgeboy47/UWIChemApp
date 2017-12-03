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
  noticeSub2;
  userSub;
  typeSub;

  courses:any = [];
  c:any ;

  userCoursesSubscription;
  userSubscription;
  courseSubscription;
  user;

  constructor(private fbAuth: AngularFireAuth, public db: AngularFireDatabase, public modalCtrl:ModalController, public navCtrl: NavController, public navParams: NavParams, public alertCtrl:AlertController) {
  }


  ngOnDestroy(){
    if(this.noticeSub)
      this.noticeSub.unsubscribe();
    if(this.noticeSub2)
      this.noticeSub2.unsubscribe();
    if(this.typeSub)
      this.typeSub.unsubscribe();
    if(this.userSub)
      this.userSub.unsubscribe();
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
        this.noticeSub= this.db.object('/Events/').valueChanges().subscribe(data=>{
              
          if(data){
            this.notices = [];
            for(let key in data){
              let valid= false;
              this.courses.forEach(element => {
                if (element.courseID==key){
                  valid =true;
                  return;
                }
              });
              if(valid){
                this.noticeSub2= this.db.object('/Events/'+key).valueChanges().subscribe(data2=>{
                  
                  if(data2){
                    for(let key2 in data2){
                      let d = data2[key2];
                      let note = { Type: "", date:"", Notes:"", CourseID:"",id:""};
                    
                      note.Type=d['Type']; 
                      note.date=d['date'];
                      note.Notes=d['Notes'];  
                      note.CourseID=key; 
                      note.id=key2;
                      this.notices.push(note);
                    }
                  }
                });
              }
            }  
            this.noticeSource = this.notices; 
          }
         });//noticesubscription

      });//usersubscription
    });//courseSubscription


    
    
  
 

     // this.noticeSource = this.notices;
     /* setTimeout(()=>{
        this.noticeSource = this.notices;
      });*/
    //});*/

    this.userSub = this.fbAuth.authState.subscribe(data=>{
      this.typeSub = this.db.object('/Users/'+data.uid+'/type/').valueChanges().subscribe(d2=>{
        if(d2=='Teacher' || d2=='Admin'){
          this.showButtons = true;
        }
      });
    });
  }

 /* onViewTitleChanged(title){
    this.viewTitle = title;
  }*/

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

/*this.fbAuth.authState.subscribe(data=>{
      this.db.object('/Notices/'+data.uid).valueChanges().subscribe(data=>{
        this.notices= [];
        for(let key in data){
          let notice = {noticeID:key,Message:data[key]};// figure out your own way to store from the database.
          this.notices.push(notice);
        }
      });
    });*/
/*  navigateToCalendar(noticeID:string){
    this.navCtrl.push('CalendarPage',{noticeID});
  }

  removeNotice(noticeID:string){
    this.fbAuth.authState.subscribe(data=>{
      this.db.object('/UserNotices/'+data.uid+'/'+noticeID+'/').remove()
    });
  }


  addNotice(){
     this.alertCtrl.create({
      title:"Add a notice",
      inputs:[
        {
          name:'To',
          placeholder:'Recipient'
        },
        {
          name:'Message',
          placeholder:'Message'
        },
        {
          name:'Date',
          placeholder:'Date'
        }
      ],
      buttons:[
        {
          text:'Submit',
          role:'submit',
          handler:data=>{
            console.log(data.To+" "+ data.Date+ " "+ data.Message)
            this.temp = data.To+" "+ data.Date+ " "+ data.Message
            this.notices.push(this.temp)
          }
        },
        {
          text:'Cancel',
          role:'cancel',
          handler:data=>{
              console.log("Cancel button clicked..")
          }
        }

      ]
     }).present()
  } */