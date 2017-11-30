const functions = require('firebase-functions');
const admin = require('firebase-admin')
admin.initializeApp(functions.config().firebase)
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

// Sends a notification to the specified device when a new node is created in the Notices object of the database
exports.notification = functions.database.ref("Notices/{noticeHead}").onCreate( event => {
    // const notice = event.data.current.val()
    var payload = {
        notification:{
            title: "testing cloud function",
            body: "with firebase"
        }
    };

    let token = "eSj3PFebN-Q:APA91bHz8ZzsfrZLIgh9rIWQ47gN2PaGjeJhaJfDbjBoxnJyxgVjVf_-V-EKIKoWRb3UOWQWQfQhI_sU42SlocQpHyOSp3Y3LvYQuLJpUyzkIoTcCJ7HpZEWdNgZ9ID1RL06HAfPIJ3j";

    admin.messaging().sendToDevice(token, payload).then( res => {
        console.log(res)
    }).catch( err => {
        console.error(err)
    })
})


exports.globalNotification = functions.database.ref("Users/{userID}").onUpdate( event => {
    const user = event.data.current.toJSON()

    if(user.hasOwnProperty("notificationToken")) {
        console.log('token:', user.notificationToken)
    }
    
})
// TODO: Create a global topic and subscribe users to global topic when they register an account
//       Subscribe users to a course topic when they add the course their course list