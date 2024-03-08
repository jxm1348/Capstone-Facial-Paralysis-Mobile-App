// I have no idea how to actually build for mobile.
// Try uncommenting the following line, maybe?
// import firebase from '@react-native-firebase/app';

import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import {
    getFirestore,
    getDocs, updateDoc,
    collection, query, doc,
    and, where, runTransaction,
} from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyA0cVD15lMtM9qYAedfKVvzDYQ6t0WizJs',
  authDomain: 'facial-analytics-f8b9e.firebaseapp.com',
  projectId: 'facial-analytics-f8b9e',
  storageBucket: 'facial-analytics-f8b9e.appspot.com',
  messagingSenderId: '1087200042336',
  appId: '1:1087200042336:web:c0c22a9037cd8b92f41205',
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);

// Create a second "App" and Auth to replace deprecated functionality.
// In Firebase, registration is either open for anyone, or you must do it through the admin sdk.
// It is not intended for the web/mobile client to be used by one user (say, a clinician)
//  to create the account of another user (say, a patient).
// One side effect is that the normal way of creating an account "createUserWithEmailAndPassword"
//  will overwrite the current login. So our clinician creates an patient account and is immediately
//  logged out and becomes the patient instead.
// To patch that bug, we create a second App instance which will be used to create the patient account.
// The main app will still be the clinician, and this second App is only used for creating accounts,
//  so it doesn't matter if its login gets overwritten.
// TODO: Do cloud functions with admin sdk to implement custom security rules for account creation/editing.
const accountCreationHackApp = initializeApp(firebaseConfig, 'spare');
export const accountCreationHackAuth = getAuth(accountCreationHackApp);

// Credit to "devnull69" of https://stackoverflow.com/users/1030974/devnull69
// Via https://stackoverflow.com/a/12300351/6286797
export function dataURItoBlob(dataURI) {
  // convert base64 to raw binary data held in a string
  // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
  const byteString = atob(dataURI.split(',')[1]);
  const mimeString = dataURI.split(',', 1)[0].split(':')[1].split(';')[0];

  // write the bytes of the string to an ArrayBuffer
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
  }

  return new Blob([ab], {type: mimeString});
}

export function getUnreadPatient(patient) {
    let total = 0;
    for (const key in patient.messages) {
        total += patient.messages[key].read ? 0 : 1;
    }
    return total;
}

const state = {
    demoIsDebug: true,

    app, db, storage, auth,

    workingMessage: { images: {} },

    clinicianUid: undefined,
};

function getUnreadCountMessages(messages) {
    let result = 0;
    for (const key in messages) {
        result += messages[key].read ? 0 : 1;
    }
    return result;
}

function getUnreadCountPatients(patients) {
    return patients.reduce((acc, patient) => acc + getUnreadCountMessages(patient.messages), 0);
}

export const fetchUniqueInt = async () => {
    const idCounterRef = doc(db, 'globals', 'uniqueInt');
    return await runTransaction(db, async transaction => {
        const idCounterDocument = await transaction.get(idCounterRef);
        const nextId = idCounterDocument.data().value;
        transaction.update(idCounterRef, {'value': nextId + 1});
        return nextId;
    });
}

export const fetchUnreadCount = async () => {
    const messagesSnapshot = await getDocs(query(
        collection(state.db, 'messages'),
        and(
            where('to', '==', auth.currentUser.uid),
            where('read', '==', false),
        )
    ));
    return messagesSnapshot.docs.length;
}

export const login = async (username, password) => {
    state.clinicianUid= {'Mark Peschel': 'gRnnZGMDUOOThH8Jdbfu'}[username];
    const email = {'Mark Peschel': 'mpeschel@gmail.com', 'Meredith Grey': 'mgrey@gmail.com'}[username];
    await signInWithEmailAndPassword(auth, email, 'password');
}

// This function is called in ClinicianPatientsScreen
// It returns a list of patients for the current user as well as the counts of their unread messages.
export const getPatientsIdsUnread = async () => {
    const usersSnapshot = await getDocs(collection(db, 'users'));
    const q = query(collection(db, 'messages'), where('to', '==', auth.currentUser.uid));
    const messagesSnapshot = await getDocs(q);
    const userCounts = {};
    for (const message of messagesSnapshot.docs.map(d => d.data())) {
        if (message.read) continue;
        if (userCounts[message.from] === undefined)
            userCounts[message.from] = 0;
        userCounts[message.from]++;
    }
    

    return usersSnapshot.docs.map(userDocument => {
        const user = userDocument.data();
        user.id = userDocument.id;
        user.unread = userCounts[userDocument.id] ?? 0;
        return user;
    });
};

export const setPatientRead = async (patient) => {
    const q = query(
        collection(db, 'messages'),
        and(where('from', '==', patient.uid), where('to', '==', auth.currentUser.uid)),
    );
    
    const messages = await getDocs(q);
    messages.docs.forEach(document => {
        if (document.data().read) return;
        updateDoc(doc(db, 'messages', document.id), {read: true});
    });
}

export default state;

