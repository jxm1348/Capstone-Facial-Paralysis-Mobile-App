// I have no idea how to actually build for mobile.
// Try uncommenting the following line, maybe?
// import firebase from '@react-native-firebase/app';

import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAvOsIabWRaKNBWKwLsYCY5PHlCN_lWwY0",
  authDomain: "facial-analytics-f8b9e.firebaseapp.com",
  projectId: "facial-analytics-f8b9e",
  storageBucket: "facial-analytics-f8b9e.appspot.com",
  messagingSenderId: "1087200042336",
  appId: "1:1087200042336:web:c0c22a9037cd8b92f41205"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const debug = true;
const SERVER_URL = !debug ? 'https://test.fa.mpeschel10.com' : 'http://localhost:3000';

const placeholderImages = [
    'https://mpeschel10.github.io/fa/test/face-f-at-rest.png',
    'https://mpeschel10.github.io/fa/test/face-f-eyebrows-up.png',
    'https://mpeschel10.github.io/fa/test/face-f-eyes-closed.png',
    'https://mpeschel10.github.io/fa/test/face-f-nose-wrinkle.png',
    'https://mpeschel10.github.io/fa/test/face-f-big-smile.png',
    'https://mpeschel10.github.io/fa/test/face-f-lips-puckered.png',
    'https://mpeschel10.github.io/fa/test/face-f-lower-teeth-bared.png',
]

const placeholderThumbnail = 'https://mpeschel10.github.io/fa/test/face-f-at-rest.png';

function split(string, separator, limit) {
    // In the official string.split, setting the limit means discarding elements to shorten the array.
    // So you can't just "split on the first equals sign", you split on all the equals signs, then discard the rest of the string.
    // Bizarre...

    // For this function, limit is the number of separators consumed.
    // If limit is two, the result array will have 3 elements.
    const firstPart = string.split(separator, limit);
    const firstPartSize = firstPart.reduce((prev, current) => prev + current.length, 0) + limit * separator.length;
    return firstPart.concat([string.slice(firstPartSize)]);
}

function parseSetCookie(setCookie) {
    const [cookieKey, cookieSetter] = split(setCookie, "=", 1);
    const [cookieValue] = cookieSetter.split(";", 1);
    return [cookieKey, cookieValue];
}

const state = {
    demoIsDebug: true,
    demoPatients: [
        {name:'Owen Wilson', thumbnail: placeholderThumbnail, messages: [
        ], latestMessage: null},
        {name:'Mark Peschel', thumbnail: placeholderThumbnail, messages: [
            {date: "Jan 20, 2024", read: false, deepRead: false, message: '', images: placeholderImages},
            {date: "Jan 13, 2024", read: true, deepRead: true, message: '', images: placeholderImages},
            {date: "Jan 6, 2024", read: true, deepRead: true, message: '', images: placeholderImages},
            {date: "Dec 30, 2023", read: true, deepRead: true, message: '', images: placeholderImages},
            {date: "Dec 23, 2023", read: true, deepRead: true, message: '', images: placeholderImages},
            {date: "Dec 16, 2023", read: true, deepRead: true, message: '', images: placeholderImages},
        ], latestMessage: '2024-01-20'},
        {name:'Gabriel Marx', thumbnail: placeholderThumbnail, messages: [
            {date: "Jan 6, 2024", read: true, deepRead: true, message: 'Hi.', images: placeholderImages},
        ], latestMessage: '2024-01-06'},
        {name:'John Doe', thumbnail: placeholderThumbnail, messages: [
            {date: "Jan 19, 2024, 3:38 pm", read: false, deepRead: false, message: 'Please inore my last message. Was a mosquito bite.', images: placeholderImages},
            {date: "Jan 19, 2024, 3:17 pm", read: false, deepRead: false, message: 'Strange swelling and itchy redness above my right eyebrow. Did you put in more botulin there last time? I hope it\s not an allergy. I just worry because I know allergies tend to get worse if every time you\'re exposed. That might juts be for bee stings, though.', images: placeholderImages},
        ], latestMessage: '2024-01-19'},
        {name:'Denzel W', thumbnail: placeholderThumbnail, messages: [
        ], latestMessage: null},
        {name:'Ameila Earhart', thumbnail: placeholderThumbnail, messages: [
        ], latestMessage: null},
        {name:'Brad Pitt', thumbnail: placeholderThumbnail, messages: [
        ], latestMessage: null},
      ],
    demoGetUnreadPatient(patient) {
        let total = 0;
        for (const {read} of patient.messages) {
            total += read ? 0 : 1;
        }
        return total;
    },

    patient:{
        workingPhotoSet:[null, null, null, null, null, null, null, ],
        photoSets:[
            ["imageAddress", "imageAddress", "imageAddress", "imageAddress", "imageAddress", "imageAddress", "imageAddress", ],
            ["imageAddress", "imageAddress", "imageAddress", "imageAddress", "imageAddress", "imageAddress", "imageAddress", ],
            ["imageAddress", "imageAddress", "imageAddress", "imageAddress", "imageAddress", "imageAddress", "imageAddress", ],
        ]
    },

    db,

    loginCookie: ['cookieKey', 'cookieValue'],

    credentials: {username: null, password: null},
    async login(username, password) {}, // Empty method body so type hints work in vscode
    async fetchUnreadCount() {},

    async addDoc(collectionName, doc) {},
    async getDocs(collectionName) {}
};

export function init() {
    state.demoGetUnreadTotal = () => state.demoPatients.reduce(
        (acc, patient) => acc + state.demoGetUnreadPatient(patient), 0
    );
    
    state.demoGetPatientByName = name => {
        return state.demoPatients.find(patient => patient.name === name);
    }
    
    state.login = async (username, password) => {
        console.log("Trying to log in");
        state.credentials = {username, password};
        const credentials = btoa(`${username}:${password}`);
        const result = await fetch(SERVER_URL + '/api/login.json', {
                method: 'POST',
                headers: {
                    'Authorization': `Basic ${credentials}`,
                }
        });
        const setCookie = await result.json();
        state.loginCookie = parseSetCookie(setCookie);
    };

    state.fetchUnreadCount = async () => {
        await new Promise(resolve => {
            setTimeout(resolve, 3000);
        });
        return 3;
    }

    state.addDoc = async (collectionName, doc) => {
        try {
            const docRef = await addDoc(collection(state.db, collectionName), doc);
            console.log("Document written with ID: ", docRef.id);
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    };

    state.getDocs = collectionName => getDocs(collection(state.db, collectionName));

    // state.forEach = async (collectionName, callback) => {
    //     const querySnapshot = await state.getDocs(collectionName);
    //     querySnapshot.forEach(callback);
    // };
}

init();
export default state;

