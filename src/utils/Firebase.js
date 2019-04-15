import firebase from 'firebase/app';
// import 'firebase/database';
import 'firebase/auth';
import "firebase/firestore";

// import config from './secrets.example';
import config from './secrets';

export const  app = firebase.initializeApp(config);
export const  db = firebase.firestore(app);

export const auth = firebase.auth();
// export const provider = new firebase.auth.GoogleAuthProvider();
export const provider = new firebase.auth.GithubAuthProvider();

export default firebase;
