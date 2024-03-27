import { Platform } from 'react-native';

// I have no idea how to actually build for mobile.
// Try uncommenting the following line, maybe?
// import firebase from '@react-native-firebase/app';

import * as Notifications from 'expo-notifications'; // Documented https://docs.expo.dev/versions/latest/sdk/notifications/
import * as Device from 'expo-device';

import { initializeApp, getApp, getApps } from 'firebase/app';
import { deleteObject, getStorage, list, ref, uploadBytes } from 'firebase/storage';
import { getAuth, signInWithEmailAndPassword, initializeAuth, } from 'firebase/auth';
import {
    getFirestore,
    getDocs, updateDoc,
    collection, query, doc,
    and, where, runTransaction, getDoc,
} from 'firebase/firestore';
import authConfig from './stateAuthConfig';
import { easProjectId } from './constants';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyA0cVD15lMtM9qYAedfKVvzDYQ6t0WizJs',
  authDomain: 'facial-analytics-f8b9e.firebaseapp.com',
  projectId: 'facial-analytics-f8b9e',
  storageBucket: 'facial-analytics-f8b9e.appspot.com',
  messagingSenderId: '1087200042336',
  appId: '1:1087200042336:web:c0c22a9037cd8b92f41205',
};

const uninitialized = getApps().length === 0;
export const app = uninitialized ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app);
export const storage = getStorage(app, 'gs://facial-analytics-f8b9e.appspot.com');
export const profilesStorage = getStorage(app, 'gs://facial-analytics-f8b9e');
export const auth = uninitialized ?  initializeAuth(app, authConfig) : getAuth();

// Credit to "devnull69" of https://stackoverflow.com/users/1030974/devnull69
// Via https://stackoverflow.com/a/12300351/6286797
function dataURIToBlob(dataURI) {
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

// Credit to "Fiston Emmanuel" of https://stackoverflow.com/users/12431576/fiston-emmanuel
// Via https://stackoverflow.com/a/75421175/6286797
const addressURIToBlob = async (uri) => {
    // console.log("Launching new XMLHttpRequest to resolve uri", uri);
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        // console.log("Resolving on", xhr.response); // THIS LINE IS VERY BAD and causes crashes when app is compiled since xhr.response is like 10 MB
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", uri, true);
      xhr.send(null);
    //   console.log("xhr sent");
    });
  
    return blob;
};

export async function URIToBlob(URI) {
    // console.log("Considering URI that starts with", URI.slice(0, 60));
    if (URI.startsWith("data")) {
        return dataURIToBlob(URI);
    } else {
        return await addressURIToBlob(URI);
    }
}
  
export function URIToExtension(uri) {
    if (uri.startsWith('data:image/png;') || uri.endsWith('.png')) {
        return 'png';
    } else if (uri.startsWith('data:image/jpg;') || uri.endsWith('.jpg')) {
        return 'jpg';
    } else {
        return uri.split('.').pop();
    }
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

    // This variable is used to pass images from the PatientCameraScreen to the PatientUploadScreen.
    workingMessage: { images: {} },

    // These variables are set during login.
    // They do not update dynamically, so there may be issues if the user is logged in and then their clinicianUid changes.
    // idTokenResult.claims.roles is an array of strings.
    // If roles.includes('a'), user is admin. 'c' for clinician, 'p' for patient.
    idTokenResult: undefined,
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

const notificationTag = '98a474800c61 ';

const registerPushToken = async (pushToken) => {
    const idToken = await auth.currentUser.getIdToken();
    const params = new URLSearchParams({token: idToken});
    
    const result = await fetch('https://fa.mpeschel10.com/notifications.json?' + params, {
      method: 'PUT',
      body: JSON.stringify(pushToken),
    });

    console.log(notificationTag, 'Push notifications result status: ', result.status);
    console.log(notificationTag, 'Push notifications result body: ', await result.text());
}

const registerNotificationsServer = async () => {
    console.log(notificationTag, 'Start of registerNotificationsServer');
    if (Platform.OS === 'android') {
        console.log(notificationTag, 'Platform android');
        Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }
    console.log(notificationTag, 'After platform android');

    const permissionsQuietResult = await Notifications.getPermissionsAsync();
    if (permissionsQuietResult.status !== 'granted') {
        const permissionsAskResult = await Notifications.requestPermissionsAsync();
        console.log(notificationTag, 'Ask result is', JSON.stringify(permissionsAskResult));
        if (permissionsAskResult.status !== 'granted') return;
        // Should do something to remember the choice so we don't pester the user every time they log in
    }
    console.log(notificationTag, 'After getPermiissionasync, quetresult is ', JSON.stringify(permissionsQuietResult));
    
    let tokenResult = undefined;
    try {
        tokenResult = await Notifications.getDevicePushTokenAsync();
    } catch (error) {
        console.error(notificationTag, 'Error on getDevicePushTokenAsync', error);
        throw error;
    }
    
    console.log(notificationTag, 'Registering pushToken', tokenResult.data);
    await registerPushToken(tokenResult.data);
}

const registerNotificationsLocal = () => {
    Notifications.setNotificationHandler({
        handleNotification: () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        }),
    });
    console.log(notificationTag, "Have set notifications handler");
}

export const login = async (email, password) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const idTokenResult = await userCredential.user.getIdTokenResult();
    const userData = await getDoc(doc(db, 'users', auth.currentUser.uid))
        .then(document => document.data());
    
    state.idTokenResult = idTokenResult;
    state.clinicianUid = userData.clinicianUid;
    if (Device.isDevice) {
        registerNotificationsLocal();
        registerNotificationsServer();
    }
}

export async function tryDeleteOldProfilePictures(dir, currentName) {
    const { items } = await list(ref(profilesStorage, dir));
    for (const reference of items) {
        if (reference.name !== currentName) {
            console.log("Deleting old profile picture", reference.name);
            deleteObject(reference);
        }
    }
}

export const saveProfilePicture = async (uid, uri) => {
    // console.log("Saving uri", uri);
    const imageExtension = URIToExtension(uri);
    // console.log("Got extension", imageExtension);
    const uriBlob = await URIToBlob(uri);
    const newName = `profile.${imageExtension}`;
    await uploadBytes(
      ref(profilesStorage, `profiles/${uid}/${newName}`),
      uriBlob
    );

    tryDeleteOldProfilePictures(`profiles/${uid}`, newName);
    return `profile_180x180.${imageExtension}`;
}

export const setPatientRead = async (patientUid) => {
    const q = query(
        collection(db, 'messages'),
        and(where('from', '==', patientUid), where('to', '==', auth.currentUser.uid)),
    );
    
    const messages = await getDocs(q);
    messages.docs.forEach(document => {
        if (document.data().read) return;
        // console.log("Updating doc:", document.id);
        updateDoc(doc(db, 'messages', document.id), {read: true});
    });
}

export default state;

