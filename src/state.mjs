// I have no idea how to actually build for mobile.
// Try uncommenting the following line, maybe?
// import firebase from '@react-native-firebase/app';

import { initializeApp } from "firebase/app";
import {
    getFirestore,
    getDocs, updateDoc,
    collection, query, doc,
    and, where,
} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA0cVD15lMtM9qYAedfKVvzDYQ6t0WizJs",
  authDomain: "facial-analytics-f8b9e.firebaseapp.com",
  projectId: "facial-analytics-f8b9e",
  storageBucket: "facial-analytics-f8b9e.appspot.com",
  messagingSenderId: "1087200042336",
  appId: "1:1087200042336:web:c0c22a9037cd8b92f41205"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export function getUnreadPatient(patient) {
    let total = 0;
    for (const key in patient.messages) {
        total += patient.messages[key].read ? 0 : 1;
    }
    return total;
}


const state = {
    demoIsDebug: true,
    patient:{
        workingPhotoSet:[null, null, null, null, null, null, null, ],
        photoSets:[
            ["imageAddress", "imageAddress", "imageAddress", "imageAddress", "imageAddress", "imageAddress", "imageAddress", ],
            ["imageAddress", "imageAddress", "imageAddress", "imageAddress", "imageAddress", "imageAddress", "imageAddress", ],
            ["imageAddress", "imageAddress", "imageAddress", "imageAddress", "imageAddress", "imageAddress", "imageAddress", ],
        ]
    },

    app, db,

    loginCookie: ['cookieKey', 'cookieValue'],

    credentials: {username: null, password: null},
    async login(username, password) {}, // Empty method body so type hints work in vscode
    username: 'Jane doe',
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

export const fetchUnreadCount = async () => {
    const messagesSnapshot = await getDocs(query(
        collection(state.db, 'messages'),
        and(
            where('to', '==', state.username),
            where('read', '==', false),
        )
    ));
    console.log("Got unread count ", messagesSnapshot.docs.length);
    return messagesSnapshot.docs.length;
}

export function init() {
    state.login = async (username, password) => {
        console.log("Trying to log in");
        state.credentials = {username, password};
        state.username = username;
    };
}

export const getPatientsIdsUnread = async () => {
    const usersSnapshot = await getDocs(collection(db, 'users'));
    const q = query(collection(db, 'messages'), where('to', '==', 'Jane doe'));
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
        user.unread = userCounts[user.name] ?? 0;
        return user;
    });
};

export const setPatientRead = async (patient) => {
    const q = query(
        collection(db, 'messages'),
        and(where('from', '==', patient.name), where('to', '==', 'Jane doe')),
    );
    
    const messages = await getDocs(q);
    messages.docs.forEach(document => {
        if (document.data().read) return;
        updateDoc(doc(db, 'messages', document.id), {read: true});
    });
}

init();
export default state;

