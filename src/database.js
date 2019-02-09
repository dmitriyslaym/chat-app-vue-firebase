const config = {
  apiKey: 'AIzaSyDeQSrnOySw3Ws-PT1Isq_8-FeIS2B-PZw',
  authDomain: 'vue-chat-room-11def.firebaseapp.com',
  databaseURL: 'https://vue-chat-room-11def.firebaseio.com',
  projectId: 'vue-chat-room-11def',
  storageBucket: 'vue-chat-room-11def.appspot.com',
  messagingSenderId: '249927196895'
}

window.firebase.initializeApp(config)
const database = window.firebase.database()

export const getDBRef = (documentName) => {
  return database.ref(documentName)
}
