import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';

// import config from './secrets.example';
import config from './secrets';

firebase.initializeApp(config);

export const provider = new firebase.auth.GoogleAuthProvider();
export const auth = firebase.auth();

export default firebase;
