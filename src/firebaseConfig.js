import firebase from 'firebase'

const config = {
        apiKey: "AIzaSyDeVM8xfRJe3MNjpMEtXcrM8k9AsNbTWqk",
        authDomain: "fssupport-8e6a3.firebaseapp.com",
        databaseURL: "https://fssupport-8e6a3.firebaseio.com",
        projectId: "fssupport-8e6a3",
        storageBucket: "fssupport-8e6a3.appspot.com",
        messagingSenderId: "234421932312",
        appId: "1:234421932312:web:f0ecbac3dd6344ac560e6d",
        measurementId: "G-JMC1QJQ5CQ"
      };
  export const app = !firebase.apps.length ? firebase.initializeApp(config) : firebase.app();