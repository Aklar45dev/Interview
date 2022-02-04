import firebase from 'firebase/app'
import 'firebase/storage'
import 'firebase/firestore'
import 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyBbuWcpNMzLbnrBaK1VpF0GxSQIdMfhUXk",
  authDomain: "simulationentretien-316f0.firebaseapp.com",
  projectId: "simulationentretien-316f0",
  storageBucket: "simulationentretien-316f0.appspot.com",
  messagingSenderId: "986385224926",
  appId: "1:986385224926:web:cf26759bfe86c7d4d65e4f"
};

  const db = firebase.firestore(firebase.initializeApp(firebaseConfig));
  const storage = firebase.storage()
  const firestore = firebase.firestore()

  export { storage, firestore, db, firebase as default }