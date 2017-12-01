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


//Subscribes users to a course topic when they add one to their course list, and unsubscribes them when they delete a course
exports.subscribeToCourse = functions.database.ref("UserCourses/{userID}/{courseCode}").onWrite( event => {
    // Gives the course name before the event was triggered
    const oldVal = event.data.previous.val()

    // Gives the course name after the event was triggered
    const newVal = event.data.current.val()

    const topic = String(event.params.courseCode).split(' ').join('')
    
    // If a new course is added
    if(oldVal === null && newVal != null) {
        admin.database().ref(`Users/${event.params.userID}/notificationToken`).on("value", currentVal => {
            admin.messaging().subscribeToTopic(currentVal.val(), topic).then( res => {
                console.log(`User: ${event.params.userID} successfully subscribed to topic: ${topic}`)
            })
        })
    }

    // If a course is deleted
    if(oldVal != null && newVal === null) {
        admin.database().ref(`Users/${event.params.userID}/notificationToken`).on("value", currentVal => {
            admin.messaging().unsubscribeFromTopic(currentVal.val(), topic).then( res => {
                console.log(`User: ${event.params.userID} successfully unsubscribed from topic: ${topic}`)
            })
        })
    }
})

// Subscribes new users to the global topic
exports.globalNotification = functions.database.ref("Users/{userID}").onUpdate( event => {
    const user = event.data.current.toJSON()

    if(user.hasOwnProperty("notificationToken")) {
        admin.messaging().subscribeToTopic(user.notificationToken, 'global').then( res => {
            console.log("User",user.email,"successfully subscribed to global topic:", res)
        })
        .catch( err => {
            console.error("Error subscribing user",user.email,"to global topic:",err)
        })
    }
    
})
