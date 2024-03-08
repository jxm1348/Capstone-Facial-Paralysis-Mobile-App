import { initializeApp } from 'firebase/app';
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
export const auth = getAuth(app);

import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';

import mimeTypes from 'mime-types';

import {
    deleteDoc, getDocs, addDoc, setDoc,
    collection, doc,
    terminate,
} from 'firebase/firestore';

import firebaseAdmin from 'firebase-admin';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { getStorage } from 'firebase-admin/storage';

const serviceAccountKey = JSON.parse(await readFile(path.join('secrets', 'facial-analytics-f8b9e-firebase-adminsdk-r38z0-23a93810da.json')));

const adminApp = firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccountKey)
});
const adminAuth = firebaseAdmin.auth(adminApp);
const adminStorage = getStorage(adminApp);

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

// User permissions are handled with Discord-style roles.
// A user has a list of roles, where each role is a string.
// 'a' for admin, 'c' for clinician, 'p' for patient.
// Roles show up in the firebase/firestore database because that was convenient for me,
//  but actual authentication is handled by "custom claims",
//  which are handled by firebase/auth, down in the resetUsers() function.
const defaultUsers = {
    'gRnnZGMDUOOThH8Jdbfu': {roles: ['a', 'c'], clinicianUid: null, name:'Meredith Grey', email: "mgrey@gmail.com", thumbnail: placeholderThumbnail, latestMessage: null},
    'mSz5ZmtDK6KmqxK7NN5Q': {roles: ['c'], clinicianUid: null, name:'Cristina Yang', email: "cyang@gmail.com", thumbnail: placeholderThumbnail, latestMessage: null},
    'QSQIUuX0RHfOD2KStyks': {roles: ['c'], clinicianUid: null, name:'Teddy Altman', email: "taltman@gmail.com", thumbnail: placeholderThumbnail, latestMessage: null},
    'K8bhUx2Hqv2LjfP4BsKy': {roles: ['p'], clinicianUid: 'gRnnZGMDUOOThH8Jdbfu', name:'Mark Peschel', email: "mpeschel@gmail.com", thumbnail: 'https://avatars.githubusercontent.com/u/111475917?v=4', latestMessage: '2024-01-20'},
    '5NEvyWyAES1DVuuJ7BDZ': {roles: ['p'], clinicianUid: 'mSz5ZmtDK6KmqxK7NN5Q', name:'jxm', email: "jxm@gmail.com", thumbnail: 'https://avatars.githubusercontent.com/u/143039729?v=4', latestMessage: '2024-02-14'},
    'lSHYQROPdgk7kJTsZxJu': {roles: ['p'], clinicianUid: 'gRnnZGMDUOOThH8Jdbfu', name:'Josh Carson', email: "jcarson@gmail.com", thumbnail: 'https://avatars.githubusercontent.com/u/18175844?v=4', latestMessage: '2024-01-19'},
    'SMHTCPm51vgYphdkDVly': {roles: ['p'], clinicianUid: 'gRnnZGMDUOOThH8Jdbfu', name:'Owen Wilson', email: "owilson@gmail.com", thumbnail: placeholderThumbnail, latestMessage: null},
    'mI0cChVwn0AzBN0AhJXv': {roles: ['p'], clinicianUid: 'gRnnZGMDUOOThH8Jdbfu', name:'Robert Downey Junior', email: "rjunior@gmail.com", thumbnail: placeholderThumbnail, latestMessage: '2024-01-06'},
    'wfDM8ya0ModdQEP3RIsm': {roles: ['p'], clinicianUid: 'gRnnZGMDUOOThH8Jdbfu', name:'John doe', email: "jdoe@gmail.com", thumbnail: placeholderThumbnail, latestMessage: '2024-01-19'},
    'IneBpCxH8S4F0CVSo2fU': {roles: ['p'], clinicianUid: 'mSz5ZmtDK6KmqxK7NN5Q', name:'Denzel Washington', email: "dwashington@gmail.com", thumbnail: placeholderThumbnail, latestMessage: null},
    'tKcqk4A4VRq9ag94vAoY': {roles: ['p'], clinicianUid: null, name:'Ameila Earhart', email: "aearhart@gmail.com", thumbnail: placeholderThumbnail, latestMessage: null},
    'lJ1kxTskAKmdwhqlSXJq': {roles: ['p'], clinicianUid: null, name:'Brad Pitt', email: "bpitt@gmail.com", thumbnail: placeholderThumbnail, latestMessage: null},
}

const customClaimFields = ['roles']; // in resetUsers, customClaimFields is a list of the fields from defaultUsers to get added as "custom claims".

const defaultMessages = [
    // Begin conversation between Meredith Grey and Mark Peschel
    {date: new Date('Jan 20, 2024').getTime(), from: 'K8bhUx2Hqv2LjfP4BsKy', to: 'gRnnZGMDUOOThH8Jdbfu', read: false, message: '',
        messageVersion: 3,
        images: {
            'at-rest': 'at-rest-1.jpg',
            'eyebrows-up': 'eyebrows-up-1.jpg',
            'eyes-closed': 'eyes-closed-1.jpg',
            'nose-wrinkle': 'nose-wrinkle-1.jpg',
            'big-smile': 'big-smile-1.jpg',
            'lips-puckered': 'lips-puckered-1.jpg',
            'lower-teeth-bared': 'lower-teeth-bared-1.jpg',
        },
    },
    {date: new Date('Jan 19, 2024').getTime(), from: 'gRnnZGMDUOOThH8Jdbfu', to: 'K8bhUx2Hqv2LjfP4BsKy', read: true, message: 'How is the soreness we discussed doing?', images: []},
    {date: new Date('Jan 15, 2024').getTime(), from: 'K8bhUx2Hqv2LjfP4BsKy', to: 'gRnnZGMDUOOThH8Jdbfu', read: true, message: 'Test message without images.', images: []},
    {date: new Date('Jan 15, 2024').getTime(), from: 'K8bhUx2Hqv2LjfP4BsKy', to: 'Fake user who does not exist', read: false, message: 'Test message that should not be visible to any doctor.', images: []},
    {date: new Date('Jan 13, 2024').getTime(), from: 'K8bhUx2Hqv2LjfP4BsKy', to: 'gRnnZGMDUOOThH8Jdbfu', read: true, message: '',
        messageVersion: 3,
        images: {
            'at-rest': 'at-rest-0.png',
            'eyebrows-up': 'eyebrows-up-0.png',
            'eyes-closed': 'eyes-closed-0.png',
            'nose-wrinkle': 'nose-wrinkle-0.png',
            'big-smile': 'big-smile-0.png',
            'lips-puckered': 'lips-puckered-0.png',
            'lower-teeth-bared': 'lower-teeth-bared-0.png',
        },
    },
    {date:  new Date('Jan 6, 2024').getTime(), from: 'K8bhUx2Hqv2LjfP4BsKy', to: 'gRnnZGMDUOOThH8Jdbfu', read: true, message: '',
        messageVersion: 3,
        images: {
            'at-rest': 'at-rest-2.jpg',
            'eyebrows-up': 'eyebrows-up-2.jpg',
            'eyes-closed': 'eyes-closed-2.jpg',
            'nose-wrinkle': 'nose-wrinkle-2.jpg',
            'big-smile': 'big-smile-2.jpg',
            'lips-puckered': 'lips-puckered-2.jpg',
            'lower-teeth-bared': 'lower-teeth-bared-2.jpg',
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
        messageVersion: 3,
        images: {
            'at-rest': 'at-rest-1.jpg',
            'eyebrows-up': 'eyebrows-up-1.jpg',
            'eyes-closed': 'eyes-closed-1.jpg',
            'nose-wrinkle': 'nose-wrinkle-1.jpg',
            'big-smile': 'big-smile-1.jpg',
            'lips-puckered': 'lips-puckered-1.jpg',
            'lower-teeth-bared': 'lower-teeth-bared-1.jpg',
        },
    },
    {date: new Date('Feb 5, 2024').getTime(), from: '5NEvyWyAES1DVuuJ7BDZ', to: 'mSz5ZmtDK6KmqxK7NN5Q', read: true, message: '',
        messageVersion: 3,
        images: {
            'at-rest': 'at-rest-0.png',
            'eyebrows-up': 'eyebrows-up-0.png',
            'eyes-closed': 'eyes-closed-0.png',
            'nose-wrinkle': 'nose-wrinkle-0.png',
            'big-smile': 'big-smile-0.png',
            'lips-puckered': 'lips-puckered-0.png',
            'lower-teeth-bared': 'lower-teeth-bared-0.png',
        },
    },
    // End conversation Cristina Yang and jxm

    // Begin Conversation Meredith Grey and Josh Carson
    {date: new Date('Jan 19, 2024, 3:38 pm').getTime(), read: false, from: 'lSHYQROPdgk7kJTsZxJu', to: 'gRnnZGMDUOOThH8Jdbfu', message: 'And how are you, Mr. Wilson.',
        messageVersion: 3,
        images: {
            'at-rest': 'at-rest-1.jpg',
            'eyebrows-up': 'eyebrows-up-1.jpg',
            'eyes-closed': 'eyes-closed-1.jpg',
            'nose-wrinkle': 'nose-wrinkle-1.jpg',
            'big-smile': 'big-smile-1.jpg',
            'lips-puckered': 'lips-puckered-1.jpg',
            'lower-teeth-bared': 'lower-teeth-bared-1.jpg',
        },
    },
    {date: new Date('Jan 19, 2024, 3:17 pm').getTime(), read: false, from: 'lSHYQROPdgk7kJTsZxJu', to: 'gRnnZGMDUOOThH8Jdbfu', message: 'Sometimes, when it\'s late at night and the stars are out, I like to take my shoes and socks off and go for a stroll. The pavement was cold against my feet when I started. That passes with time. Our bodies have grown soft in our modern splendor, but they remember the old way of things with a little prompting. I\'m not saying things aren\'t better now. But they are different.',
        messageVersion: 3,
        images: {
            'at-rest': 'at-rest-0.png',
            'eyebrows-up': 'eyebrows-up-0.png',
            'eyes-closed': 'eyes-closed-0.png',
            'nose-wrinkle': 'nose-wrinkle-0.png',
            'big-smile': 'big-smile-0.png',
            'lips-puckered': 'lips-puckered-0.png',
            'lower-teeth-bared': 'lower-teeth-bared-0.png',
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
        const customClaim = Object.fromEntries(
            customClaimFields
                .map(fieldName => [fieldName, user[fieldName]])
                .filter(([key, value]) => value !== undefined)
        );
        
        console.log('Creating user with uid', uid, 'display name', user.name, 'with claim', customClaim);
        await adminAuth.createUser({
            uid,
            email: user.email,
            password: 'password',
            displayName: user.name,
        });
        
        // https://firebase.google.com/docs/auth/admin/custom-claims
        await adminAuth.setCustomUserClaims(uid, customClaim);
    }
}

// Copyright 2020 Google LLC
// via https://github.com/googleapis/nodejs-storage/blob/main/samples/listFiles.js
async function getPaths(dir) {
    const paths = [];
    for (const relativePath of await readdir(dir)) {
        const fullPath = path.join(dir, relativePath);
        const stats = await stat(fullPath);
        if (stats.isDirectory()) {
            paths.push(...await getPaths(fullPath))
        } else if (stats.isFile()) {
            paths.push(fullPath);
        }
    }
    return paths;
}

async function resetStorage() {
    // await deleteDir(ref(storage)); // Clean reset. Deletes all files to be reuploaded anew. Slow.
    
    const localRoot = path.join(process.cwd(), 'reset', 'mirror');
    const remoteRoot = adminStorage.bucket('facial-analytics-f8b9e.appspot.com');

    const localPathsArray = await getPaths(localRoot);
    const localPaths = Object.fromEntries(localPathsArray.map(p => [
        path.relative(localRoot, p), true
    ]));
    
    const [remoteFilesArray] = await remoteRoot.getFiles();
    const remotePaths = Object.fromEntries(remoteFilesArray.map(f => [f.name, true]));
    
    for (const remotePath in remotePaths) {
        if (localPaths[remotePath]) continue;
        
        if (remotePath.includes('thumbnails')) {
            // console.log('Considering remote thumbnail', remotePath);
            const parsedRemotePath = path.parse(remotePath);
            const originalImageName = parsedRemotePath.name.split('_')[0] + parsedRemotePath.ext;
            
            const up = path.dirname;
            const remoteOriginalImagePath = path.join(up(up(remotePath)), originalImageName);
            // console.log('Expected source is', remoteOriginalImagePath);
            if (localPaths[remoteOriginalImagePath]) continue;
            // console.log('Expected source does not exist');
        }
        
        console.log('Deleting', remotePath);
        await remoteRoot.file(remotePath).delete();
    }

    for (const localPath in localPaths) {
        if (!remotePaths[localPath]) {
            console.log('Uploading', localPath);
            await remoteRoot.upload(
                path.join(localRoot, localPath), {destination:localPath}
            );
        }
    }
}

// Credentials are now required for modifying tables.
// TODO: use service account or whatever for fixing tables instead.
await signInWithEmailAndPassword(auth, 'mgrey@gmail.com', 'password');

await Promise.all([
    ...Object.keys(tables).map(name => resetTable(name)),
    resetStorage(),
    // resetUsers(),
]);

// Closing the database connection is necessary so node.js doesn't hang after the reset function is done.
terminate(db);



