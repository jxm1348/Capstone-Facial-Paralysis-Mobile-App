import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyA0cVD15lMtM9qYAedfKVvzDYQ6t0WizJs',
  authDomain: 'facial-analytics-f8b9e.firebaseapp.com',
  projectId: 'facial-analytics-f8b9e',
  storageBucket: 'facial-analytics-f8b9e.appspot.com',
  messagingSenderId: '1087200042336',
  appId: '1:1087200042336:web:c0c22a9037cd8b92f41205',
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);

import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

import mimeTypes from 'mime-types';

import {
    deleteDoc, getDocs, addDoc, setDoc,
    collection, doc,
    terminate,
} from 'firebase/firestore';
import { deleteObject, list, listAll, ref, uploadBytes } from 'firebase/storage';

import firebaseAdmin from 'firebase-admin';
import { signInWithEmailAndPassword } from 'firebase/auth';

const serviceAccountKey = JSON.parse(await readFile(path.join('secrets', 'facial-analytics-f8b9e-firebase-adminsdk-r38z0-23a93810da.json')));

const adminApp = firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccountKey)
});
const adminAuth = firebaseAdmin.auth(adminApp);

const placeholderThumbnail = 'https://mpeschel10.github.io/fa/test/face-f-at-rest.png';
const placeholderImages = [
    'https://mpeschel10.github.io/fa/test/face-f-at-rest.png',
    'https://mpeschel10.github.io/fa/test/face-f-eyebrows-up.png',
    'https://mpeschel10.github.io/fa/test/face-f-eyes-closed.png',
    'https://mpeschel10.github.io/fa/test/face-f-nose-wrinkle.png',
    'https://mpeschel10.github.io/fa/test/face-f-big-smile.png',
    'https://mpeschel10.github.io/fa/test/face-f-lips-puckered.png',
    'https://mpeschel10.github.io/fa/test/face-f-lower-teeth-bared.png',
]

async function deleteCollection(collectionName) {
    const querySnapshot = await getDocs(collection(db, collectionName));
    const deletePromises = querySnapshot.docs.map(document => deleteDoc(
        doc(db, collectionName, document.id)
    ));
    await Promise.all(deletePromises);
}

const defaultUsers = {
    'gRnnZGMDUOOThH8Jdbfu': {clinicianUid: null, name:'Meredith Grey', email: "mgrey@gmail.com", thumbnail: placeholderThumbnail, latestMessage: null},
    'mSz5ZmtDK6KmqxK7NN5Q': {clinicianUid: null, name:'Cristina Yang', email: "cyang@gmail.com", thumbnail: placeholderThumbnail, latestMessage: null},
    'QSQIUuX0RHfOD2KStyks': {clinicianUid: null, name:'Teddy Altman', email: "taltman@gmail.com", thumbnail: placeholderThumbnail, latestMessage: null},
    'K8bhUx2Hqv2LjfP4BsKy': {clinicianUid: 'gRnnZGMDUOOThH8Jdbfu', name:'Mark Peschel', email: "mpeschel@gmail.com", thumbnail: 'https://avatars.githubusercontent.com/u/111475917?v=4', latestMessage: '2024-01-20'},
    '5NEvyWyAES1DVuuJ7BDZ': {clinicianUid: 'mSz5ZmtDK6KmqxK7NN5Q', name:'jxm', email: "jxm@gmail.com", thumbnail: 'https://avatars.githubusercontent.com/u/143039729?v=4', latestMessage: '2024-02-14'},
    'lSHYQROPdgk7kJTsZxJu': {clinicianUid: 'gRnnZGMDUOOThH8Jdbfu', name:'Josh Carson', email: "jcarson@gmail.com", thumbnail: 'https://avatars.githubusercontent.com/u/18175844?v=4', latestMessage: '2024-01-19'},
    'SMHTCPm51vgYphdkDVly': {clinicianUid: 'gRnnZGMDUOOThH8Jdbfu', name:'Owen Wilson', email: "owilson@gmail.com", thumbnail: placeholderThumbnail, latestMessage: null},
    'mI0cChVwn0AzBN0AhJXv': {clinicianUid: 'gRnnZGMDUOOThH8Jdbfu', name:'Robert Downey Junior', email: "rjunior@gmail.com", thumbnail: placeholderThumbnail, latestMessage: '2024-01-06'},
    'wfDM8ya0ModdQEP3RIsm': {clinicianUid: 'gRnnZGMDUOOThH8Jdbfu', name:'John doe', email: "jdoe@gmail.com", thumbnail: placeholderThumbnail, latestMessage: '2024-01-19'},
    'IneBpCxH8S4F0CVSo2fU': {clinicianUid: 'mSz5ZmtDK6KmqxK7NN5Q', name:'Denzel Washington', email: "dwashington@gmail.com", thumbnail: placeholderThumbnail, latestMessage: null},
    'tKcqk4A4VRq9ag94vAoY': {clinicianUid: null, name:'Ameila Earhart', email: "aearhart@gmail.com", thumbnail: placeholderThumbnail, latestMessage: null},
    'lJ1kxTskAKmdwhqlSXJq': {clinicianUid: null, name:'Brad Pitt', email: "bpitt@gmail.com", thumbnail: placeholderThumbnail, latestMessage: null},
}

const defaultMessages = [
    // Begin conversation between Meredith Grey and Mark Peschel
    {date: new Date('Jan 20, 2024').getTime(), from: 'K8bhUx2Hqv2LjfP4BsKy', to: 'gRnnZGMDUOOThH8Jdbfu', read: false, message: '',
        images: {
            'at-rest': 'https://firebasestorage.googleapis.com/v0/b/facial-analytics-f8b9e.appspot.com/o/images%2FMark%20Peschel%2Fat-rest-1.jpg?alt=media&token=c9ed41db-6e2f-4e2f-9f05-4cdfd5170da9',
            'eyebrows-up': 'https://firebasestorage.googleapis.com/v0/b/facial-analytics-f8b9e.appspot.com/o/images%2FMark%20Peschel%2Feyebrows-up-1.jpg?alt=media&token=25635b83-323c-4599-8a6c-b212b56604fe',
            'eyes-closed': 'https://firebasestorage.googleapis.com/v0/b/facial-analytics-f8b9e.appspot.com/o/images%2FMark%20Peschel%2Feyes-closed-1.jpg?alt=media&token=a03f1528-2e30-4d8e-9b6e-b6b4872b1f76',
            'nose-wrinkle': 'https://firebasestorage.googleapis.com/v0/b/facial-analytics-f8b9e.appspot.com/o/images%2FMark%20Peschel%2Fnose-wrinkle-1.jpg?alt=media&token=152e4724-4bd0-4128-bd7d-4a86329e4f52',
            'big-smile': 'https://firebasestorage.googleapis.com/v0/b/facial-analytics-f8b9e.appspot.com/o/images%2FMark%20Peschel%2Fbig-smile-1.jpg?alt=media&token=65e5a179-4b1d-454e-afef-5b8d9fd9923f',
            'lips-puckered': 'https://firebasestorage.googleapis.com/v0/b/facial-analytics-f8b9e.appspot.com/o/images%2FMark%20Peschel%2Flips-puckered-1.jpg?alt=media&token=1420e538-4f0c-403a-b8df-587a755b9d40',
            'lower-teeth-bared': 'https://firebasestorage.googleapis.com/v0/b/facial-analytics-f8b9e.appspot.com/o/images%2FMark%20Peschel%2Flower-teeth-bared-1.jpg?alt=media&token=576dbd7b-504b-43d6-bd5b-6654c425661e',
        },
    },
    {date: new Date('Jan 19, 2024').getTime(), from: 'gRnnZGMDUOOThH8Jdbfu', to: 'K8bhUx2Hqv2LjfP4BsKy', read: true, message: 'How is the soreness we discussed doing?', images: []},
    {date: new Date('Jan 15, 2024').getTime(), from: 'K8bhUx2Hqv2LjfP4BsKy', to: 'gRnnZGMDUOOThH8Jdbfu', read: true, message: 'Test message without images.', images: []},
    {date: new Date('Jan 15, 2024').getTime(), from: 'K8bhUx2Hqv2LjfP4BsKy', to: 'Fake user who does not exist', read: false, message: 'Test message that should not be visible to any doctor.', images: []},
    {date: new Date('Jan 13, 2024').getTime(), from: 'K8bhUx2Hqv2LjfP4BsKy', to: 'gRnnZGMDUOOThH8Jdbfu', read: true, message: '',
        images: {
            'at-rest': 'https://firebasestorage.googleapis.com/v0/b/facial-analytics-f8b9e.appspot.com/o/images%2FMark%20Peschel%2Fat-rest-0.png?alt=media&token=a7ce37e6-7434-4646-94f8-c57144e30dd1',
            'eyebrows-up': 'https://firebasestorage.googleapis.com/v0/b/facial-analytics-f8b9e.appspot.com/o/images%2FMark%20Peschel%2Feyebrows-up-0.png?alt=media&token=60674b52-28e3-4976-b848-cc7ff787db85',
            'eyes-closed': 'https://firebasestorage.googleapis.com/v0/b/facial-analytics-f8b9e.appspot.com/o/images%2FMark%20Peschel%2Feyes-closed-0.png?alt=media&token=229ca6f6-805a-4ffa-889e-98fed4282639',
            'nose-wrinkle': 'https://firebasestorage.googleapis.com/v0/b/facial-analytics-f8b9e.appspot.com/o/images%2FMark%20Peschel%2Fnose-wrinkle-0.png?alt=media&token=2df347ac-80d7-4940-94a8-e1e49e05d03a',
            'big-smile': 'https://firebasestorage.googleapis.com/v0/b/facial-analytics-f8b9e.appspot.com/o/images%2FMark%20Peschel%2Fbig-smile-0.png?alt=media&token=6218902c-785b-4916-8944-75ee869188d4',
            'lips-puckered': 'https://firebasestorage.googleapis.com/v0/b/facial-analytics-f8b9e.appspot.com/o/images%2FMark%20Peschel%2Flips-puckered-0.png?alt=media&token=9cfd7e43-8f3c-477f-8dd4-9ecd935c1b59',
            'lower-teeth-bared': 'https://firebasestorage.googleapis.com/v0/b/facial-analytics-f8b9e.appspot.com/o/images%2FMark%20Peschel%2Flower-teeth-bared-0.png?alt=media&token=ceb36fe0-84c6-4d7f-9ce7-c2bcc8f5869a',
        },
    },
    {date:  new Date('Jan 6, 2024').getTime(), from: 'K8bhUx2Hqv2LjfP4BsKy', to: 'gRnnZGMDUOOThH8Jdbfu', read: true, message: '',
        images: {
            'at-rest': 'https://firebasestorage.googleapis.com/v0/b/facial-analytics-f8b9e.appspot.com/o/images%2FMark%20Peschel%2Fat-rest-2.jpg?alt=media&token=273dd6df-59ba-4687-be36-bf2e797d2eff',
            'eyebrows-up': 'https://firebasestorage.googleapis.com/v0/b/facial-analytics-f8b9e.appspot.com/o/images%2FMark%20Peschel%2Feyebrows-up-2.jpg?alt=media&token=632ac8fd-3bbb-477f-91c9-692315839571',
            'eyes-closed': 'https://firebasestorage.googleapis.com/v0/b/facial-analytics-f8b9e.appspot.com/o/images%2FMark%20Peschel%2Feyes-closed-2.jpg?alt=media&token=3e070723-5970-4088-ae2a-92808d826272',
            'nose-wrinkle': 'https://firebasestorage.googleapis.com/v0/b/facial-analytics-f8b9e.appspot.com/o/images%2FMark%20Peschel%2Fnose-wrinkle-2.jpg?alt=media&token=6a004dc9-6c1e-4f50-814a-a27cd63c52a9',
            'big-smile': 'https://firebasestorage.googleapis.com/v0/b/facial-analytics-f8b9e.appspot.com/o/images%2FMark%20Peschel%2Fbig-smile-2.jpg?alt=media&token=762c9ff2-869f-4553-b74f-1da69d99395c',
            'lips-puckered': 'https://firebasestorage.googleapis.com/v0/b/facial-analytics-f8b9e.appspot.com/o/images%2FMark%20Peschel%2Flips-puckered-2.jpg?alt=media&token=b65bb18e-a9fa-443a-9059-d571c1ac7a72',
            'lower-teeth-bared': 'https://firebasestorage.googleapis.com/v0/b/facial-analytics-f8b9e.appspot.com/o/images%2FMark%20Peschel%2Flower-teeth-bared-2.jpg?alt=media&token=9261a32f-08cd-46dd-9cbf-0fff14802cc4',
        },
    },
    {date: new Date('Dec 30, 2023').getTime(), from: 'K8bhUx2Hqv2LjfP4BsKy', to: 'gRnnZGMDUOOThH8Jdbfu', read: true, message: '',
        images: placeholderImages,
    },
    {date: new Date('Dec 23, 2023').getTime(), from: 'K8bhUx2Hqv2LjfP4BsKy', to: 'gRnnZGMDUOOThH8Jdbfu', read: true, message: '', images: placeholderImages},
    {date: new Date('Dec 16, 2023').getTime(), from: 'K8bhUx2Hqv2LjfP4BsKy', to: 'gRnnZGMDUOOThH8Jdbfu', read: true, message: '', images: placeholderImages},
    // End conversation Meredith Grey and Mark Peschel

    // Begin conversation Cristina Yang and jxm
    {date: new Date('Feb 14, 2024').getTime(), from: '5NEvyWyAES1DVuuJ7BDZ', to: 'mSz5ZmtDK6KmqxK7NN5Q', read: true, message: '',
        images: {
            'at-rest': 'https://firebasestorage.googleapis.com/v0/b/facial-analytics-f8b9e.appspot.com/o/images%2FJoshua%20Miranda%2Fat-rest-1.jpg?alt=media&token=d76d8fec-7ea0-4b54-81e7-6b525dc15928',
            'eyebrows-up': 'https://firebasestorage.googleapis.com/v0/b/facial-analytics-f8b9e.appspot.com/o/images%2FJoshua%20Miranda%2Feyebrows-up-1.jpg?alt=media&token=f4fbd32f-dadb-4d3d-9024-e0a212cf57b9',
            'eyes-closed': 'https://firebasestorage.googleapis.com/v0/b/facial-analytics-f8b9e.appspot.com/o/images%2FJoshua%20Miranda%2Feyes-closed-1.jpg?alt=media&token=ed34f52f-c4c7-4e7e-8b50-60509b4ca978',
            'nose-wrinkle': 'https://firebasestorage.googleapis.com/v0/b/facial-analytics-f8b9e.appspot.com/o/images%2FJoshua%20Miranda%2Fnose-wrinkle-1.jpg?alt=media&token=c4dd53f7-d16e-46d6-8acc-5fad7581aeae',
            'big-smile': 'https://firebasestorage.googleapis.com/v0/b/facial-analytics-f8b9e.appspot.com/o/images%2FJoshua%20Miranda%2Fbig-smile-1.jpg?alt=media&token=afe31e47-b261-499d-a8de-12d0ff95fdd6',
            'lips-puckered': 'https://firebasestorage.googleapis.com/v0/b/facial-analytics-f8b9e.appspot.com/o/images%2FJoshua%20Miranda%2Flips-puckered-1.jpg?alt=media&token=6ee3816e-8442-4098-93ac-124f780195c8',
            'lower-teeth-bared': 'https://firebasestorage.googleapis.com/v0/b/facial-analytics-f8b9e.appspot.com/o/images%2FJoshua%20Miranda%2Flower-teeth-bared-1.jpg?alt=media&token=13627070-be7c-4271-832a-1115dabcf734',
        },
    },
    {date: new Date('Feb 5, 2024').getTime(), from: '5NEvyWyAES1DVuuJ7BDZ', to: 'mSz5ZmtDK6KmqxK7NN5Q', read: true, message: '',
        images: {
            'at-rest': 'https://firebasestorage.googleapis.com/v0/b/facial-analytics-f8b9e.appspot.com/o/images%2FJoshua%20Miranda%2Fat-rest-0.png?alt=media&token=d23b7f40-20fc-4698-9df7-fcecfab1d6b6',
            'eyebrows-up': 'https://firebasestorage.googleapis.com/v0/b/facial-analytics-f8b9e.appspot.com/o/images%2FJoshua%20Miranda%2Feyebrows-up-0.png?alt=media&token=9a3289c0-bd51-4375-9d65-aa215c6c3539',
            'eyes-closed': 'https://firebasestorage.googleapis.com/v0/b/facial-analytics-f8b9e.appspot.com/o/images%2FJoshua%20Miranda%2Feyes-closed-0.png?alt=media&token=5ca827b5-e2be-4f9c-948e-f3dc05c24ed5',
            'nose-wrinkle': 'https://firebasestorage.googleapis.com/v0/b/facial-analytics-f8b9e.appspot.com/o/images%2FJoshua%20Miranda%2Fnose-wrinkle-0.png?alt=media&token=af62bdcf-4090-44aa-a10a-614d6c61fd3e',
            'big-smile': 'https://firebasestorage.googleapis.com/v0/b/facial-analytics-f8b9e.appspot.com/o/images%2FJoshua%20Miranda%2Fbig-smile-0.png?alt=media&token=10b90833-cf68-4e22-9f90-156a39e0c8f9',
            'lips-puckered': 'https://firebasestorage.googleapis.com/v0/b/facial-analytics-f8b9e.appspot.com/o/images%2FJoshua%20Miranda%2Flips-puckered-0.png?alt=media&token=901b8ff9-1438-44c2-b8ea-97ec30b8ec6c',
            'lower-teeth-bared': 'https://firebasestorage.googleapis.com/v0/b/facial-analytics-f8b9e.appspot.com/o/images%2FJoshua%20Miranda%2Flower-teeth-bared-0.png?alt=media&token=db8f2c31-ddf8-435b-9f55-23445b86ca59',
        },
    },
    // End conversation Cristina Yang and jxm

    // Begin Conversation Meredith Grey and Josh Carson
    {date: new Date('Jan 19, 2024, 3:38 pm').getTime(), read: false, from: 'lSHYQROPdgk7kJTsZxJu', to: 'gRnnZGMDUOOThH8Jdbfu', message: 'And how are you, Mr. Wilson.',
        images: {
            'at-rest': 'https://firebasestorage.googleapis.com/v0/b/facial-analytics-f8b9e.appspot.com/o/images%2FJoshua%20Carson%2Fat-rest-1.jpg?alt=media&token=98a9311e-6552-432f-8d08-8af64758ab5c',
            'eyebrows-up': 'https://firebasestorage.googleapis.com/v0/b/facial-analytics-f8b9e.appspot.com/o/images%2FJoshua%20Carson%2Feyebrows-up-1.jpg?alt=media&token=59d4ac10-7435-40e6-b044-944c3d6492b9',
            'eyes-closed': 'https://firebasestorage.googleapis.com/v0/b/facial-analytics-f8b9e.appspot.com/o/images%2FJoshua%20Carson%2Feyes-closed-1.jpg?alt=media&token=7ac37d21-a6f7-4e43-b00c-4cf582e5503f',
            'nose-wrinkle': 'https://firebasestorage.googleapis.com/v0/b/facial-analytics-f8b9e.appspot.com/o/images%2FJoshua%20Carson%2Flips-puckered-1.jpg?alt=media&token=d288a668-cc4f-4c45-a280-e2e11a3ff912',
            'big-smile': 'https://firebasestorage.googleapis.com/v0/b/facial-analytics-f8b9e.appspot.com/o/images%2FJoshua%20Carson%2Fbig-smile-1.jpg?alt=media&token=5c053bbe-7f4f-40b5-824d-b35f09b9cbed',
            'lips-puckered': 'https://firebasestorage.googleapis.com/v0/b/facial-analytics-f8b9e.appspot.com/o/images%2FJoshua%20Carson%2Fnose-wrinkle-1.jpg?alt=media&token=bac59922-e470-48dc-a4e6-09441eb6c8d7',
            'lower-teeth-bared': 'https://firebasestorage.googleapis.com/v0/b/facial-analytics-f8b9e.appspot.com/o/images%2FJoshua%20Carson%2Flower-teeth-bared-1.jpg?alt=media&token=28e19707-8edd-4194-86eb-ebba7f63c150',
        },
    },
    {date: new Date('Jan 19, 2024, 3:17 pm').getTime(), read: false, from: 'lSHYQROPdgk7kJTsZxJu', to: 'gRnnZGMDUOOThH8Jdbfu', message: 'Sometimes, when it\'s late at night and the stars are out, I like to take my shoes and socks off and go for a stroll. The pavement was cold against my feet when I started. That passes with time. Our bodies have grown soft in our modern splendor, but they remember the old way of things with a little prompting. I\'m not saying things aren\'t better now. But they are different.',
        images: {
            'at-rest': 'https://firebasestorage.googleapis.com/v0/b/facial-analytics-f8b9e.appspot.com/o/images%2FJoshua%20Carson%2Fat-rest-0.png?alt=media&token=bf697fda-bc48-468e-9e68-cbb0f4c04142',
            'eyebrows-up': 'https://firebasestorage.googleapis.com/v0/b/facial-analytics-f8b9e.appspot.com/o/images%2FJoshua%20Carson%2Feyebrows-up-0.png?alt=media&token=626b0b7e-75d5-4b8f-a5ce-de9656cec0fb',
            'eyes-closed': 'https://firebasestorage.googleapis.com/v0/b/facial-analytics-f8b9e.appspot.com/o/images%2FJoshua%20Carson%2Feyes-closed-0.png?alt=media&token=f04d657a-58a0-44c2-add7-cea6e71e20d7',
            'nose-wrinkle': 'https://firebasestorage.googleapis.com/v0/b/facial-analytics-f8b9e.appspot.com/o/images%2FJoshua%20Carson%2Fnose-wrinkle-0.png?alt=media&token=2478fd7c-d34e-4d18-8e44-494e88a95a12',
            'big-smile': 'https://firebasestorage.googleapis.com/v0/b/facial-analytics-f8b9e.appspot.com/o/images%2FJoshua%20Carson%2Fbig-smile-0.png?alt=media&token=27225299-ebba-4de6-b318-a09f34ac9d1f',
            'lips-puckered': 'https://firebasestorage.googleapis.com/v0/b/facial-analytics-f8b9e.appspot.com/o/images%2FJoshua%20Carson%2Flips-puckered-0.png?alt=media&token=79c6377e-c431-4d68-8533-3035dc9acc06',
            'lower-teeth-bared': 'https://firebasestorage.googleapis.com/v0/b/facial-analytics-f8b9e.appspot.com/o/images%2FJoshua%20Carson%2Flower-teeth-bared-0.png?alt=media&token=8b5b2c0a-5f36-470c-b46c-d665b19dea84',
        },
    },
    // End conversation Meredith Grey and Josh Carson
];

const defaultGlobals = {
    uniqueInt: {value: 0},
};

const tables = {
    users: defaultUsers,
    messages: defaultMessages,
    globals: defaultGlobals,
};

// Deletes everything and then re-uploads a test dataset.
// Valid collections at this time are:
// users, messages, globals
async function resetTable(name) {
    const table = tables[name];
    console.debug(`Deleting collection ${name}.`);
    await deleteCollection(name);

    console.log('Inserting', Object.keys(table).length, 'records into collection', name);
    if (table.map) {
        await Promise.all(
            table.map(entry => addDoc(collection(db, name), entry))
        );
    } else {
        await Promise.all(
            Object.entries(table).map(([key, value]) =>
                setDoc(doc(db, name, key), value)
            )
        );
    }
}

async function deleteDir(dirRef) {
    let page = {nextPageToken: undefined};
    do {
        page = await list(dirRef, {maxResults: 100, pageToken: page.nextPageToken});
        console.log("Deleting storage items: ", page.items.map(itemRef => itemRef._location.path_));
        const promises = [
            ...page.items.map(itemRef => deleteObject(itemRef)),
            ...page.prefixes.map(prefixRef => deleteDir(prefixRef)),
        ];
        await Promise.all(promises);
    } while (page.nextPageToken);
}

async function uploadPath(sourcePath, destPath) {
    const sourceContent = await readFile(sourcePath);
    const sourceBlob = new Blob([sourceContent]);
    const contentType = mimeTypes.lookup(sourcePath);
    return await uploadBytes(destPath, sourceBlob, {contentType});
}

function direntToPath(dirent) {
    return path.join(dirent.path, dirent.name);
}

function refToName(ref) {
    const parts = ref._location.path_.split("/");
    return parts[parts.length - 1];
}

async function syncDir(sourceDir, destDir) {
    // listAll supposedly may cause problems if there are many files up there.
    // Mot worth addressing yet.
    const pathsDownHere = await readdir(sourceDir, {withFileTypes: true});
    const pathsUpThere = await listAll(destDir);
    const goodNames = Object.fromEntries(pathsDownHere.map(item => [item.name, true]));
    const itemsUploaded = {};
    
    // Steps: 1. Delete all things from destDir not in sourceDir.
    for (const itemUpThere of pathsUpThere.items) {
        const nameUpThere = refToName(itemUpThere);
        if (!goodNames[nameUpThere]) {
            console.log('Delete file  ', nameUpThere);
            await deleteObject(itemUpThere);
        } else {
            itemsUploaded[nameUpThere] = true;
        }
    }
    
    for (const prefixUpThere of pathsUpThere.prefixes) {
        const nameUpThere = refToName(prefixUpThere);
        if (!goodNames[nameUpThere]) {
            console.log('Delete folder', nameUpThere);
            await deleteDir(prefixUpThere);
        }
    }
    
    // 2. Upload all things in sourceDir not already in destDir.
    for (const item of pathsDownHere) {
        if (itemsUploaded[item.name]) {
            console.log('Skip   file  ', item.name);
            continue;
        }
        if (item.isDirectory()) {
            console.log('Enter  folder', item.name);
            await syncDir(direntToPath(item), ref(destDir, item.name));
            continue;
        }
        console.log('Upload file  ', item.name);
        await uploadPath(direntToPath(item), ref(destDir, item.name));
    }
    return;
}

async function resetStorage() {
    // await deleteDir(ref(storage)); // Clean reset. Deletes all files to be reuploaded anew. Slow.
    await syncDir(path.join(process.cwd(), 'reset', 'mirror'), ref(storage));
}

async function rateLimit(ms) {
    ms = ms ?? 600
    await new Promise(resolve => setTimeout(resolve, ms));
}

async function deleteUsers() {
    while (true) {
        const { users } = await adminAuth.listUsers(1000);
        if (users.length === 0) return;
        console.log('Deleting users', users.map(user => user.email));
        await adminAuth.deleteUsers(users.map(user => user.uid));
        await rateLimit(1000);
    }
}

async function resetUsers() {
    await deleteUsers();
    for (const [uid, user] of Object.entries(defaultUsers)) {
        console.log('Creating user with uid', uid, 'display name', user.name);
        await adminAuth.createUser({
            uid,
            email: user.email,
            password: 'password',
            displayName: user.name,
        });
    }
}

// Credentials are now required for modifying tables.
// TODO: use service account or whatever for fixing tables instead.
// await resetUsers();
await signInWithEmailAndPassword(auth, 'mpeschel@gmail.com', 'password');

await Promise.all([
    ...Object.keys(tables).map(name => resetTable(name)),
    resetStorage(),
]);

// Closing the database connection is necessary so node.js doesn't hang after the reset function is done.
terminate(db);
