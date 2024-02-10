import { readFile, readdir } from 'node:fs/promises';
import mimeTypes from 'mime-types';
import path from 'node:path';

import {
    deleteDoc, getDocs, addDoc, setDoc,
    collection, doc,
    terminate,
} from 'firebase/firestore';

import { db, storage } from '../src/state.mjs';
import { deleteObject, getMetadata, list, listAll, ref, uploadBytes } from 'firebase/storage';

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

const defaultUsers = [
    {name:'Owen Wilson', thumbnail: placeholderThumbnail, latestMessage: null},
    {name:'Mark Peschel', thumbnail: placeholderThumbnail, latestMessage: '2024-01-20'},
    {name:'Gabriel Marx', thumbnail: placeholderThumbnail, latestMessage: '2024-01-06'},
    {name:'John doe', thumbnail: placeholderThumbnail, latestMessage: '2024-01-19'},
    {name:'Denzel W', thumbnail: placeholderThumbnail, latestMessage: null},
    {name:'Ameila Earhart', thumbnail: placeholderThumbnail, latestMessage: null},
    {name:'Brad Pitt', thumbnail: placeholderThumbnail, latestMessage: null},
];

const defaultMessages = [
    {date: new Date('Jan 20, 2024').getTime(), from: 'Mark Peschel', to: 'Jane doe', read: false, message: '', images: placeholderImages},
    {date: new Date('Jan 19, 2024').getTime(), from: 'Jane doe', to: 'Mark Peschel', read: true, message: 'How is the soreness we discussed doing?', images: []},
    {date: new Date('Jan 15, 2024').getTime(), from: 'Mark Peschel', to: 'Jane doe', read: true, message: 'Test message without images.', images: []},
    {date: new Date('Jan 15, 2024').getTime(), from: 'Mark Peschel', to: 'Fake user who does not eixst', read: false, message: 'Test message that should never be visible.', images: []},
    {date: new Date('Jan 13, 2024').getTime(), from: 'Mark Peschel', to: 'Jane doe', read: true, message: '', images: placeholderImages},
    {date:  new Date('Jan 6, 2024').getTime(), from: 'Mark Peschel', to: 'Jane doe', read: true, message: '', images: placeholderImages},
    {date: new Date('Dec 30, 2023').getTime(), from: 'Mark Peschel', to: 'Jane doe', read: true, message: '', images: placeholderImages},
    {date: new Date('Dec 23, 2023').getTime(), from: 'Mark Peschel', to: 'Jane doe', read: true, message: '', images: placeholderImages},
    {date: new Date('Dec 16, 2023').getTime(), from: 'Mark Peschel', to: 'Jane doe', read: true, message: '', images: placeholderImages},
    {date:  new Date('Jan 6, 2024').getTime(), from: 'Gabriel Marx', to: 'Jane doe', read: true, message: 'Hi.', images: placeholderImages},
    {date: new Date('Jan 19, 2024, 3:38 pm').getTime(), read: false, from: 'John doe', to: 'Jane doe', message: 'Please inore my last message. Was a mosquito bite.', images: placeholderImages},
    {date: new Date('Jan 19, 2024, 3:17 pm').getTime(), read: false, from: 'John doe', to: 'Jane doe', message: 'Strange swelling and itchy redness above my right eyebrow. Did you put in more botulin there last time? I hope it\s not an allergy. I just worry because I know allergies tend to get worse if every time you\'re exposed. That might juts be for bee stings, though.', images: placeholderImages},
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
// users, messages
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

await Promise.all([
    ...Object.keys(tables).map(name => resetTable(name)),
    resetStorage(),
]);

// Closing the database connection is necessary so node.js doesn't hang after the reset function is done.
terminate(db);
