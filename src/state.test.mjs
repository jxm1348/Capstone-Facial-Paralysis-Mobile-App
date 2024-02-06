import { describe, it, expect, afterAll } from '@jest/globals';

import {
    addDoc, getDocs, deleteDoc, getCountFromServer,
    collection, doc,
    terminate,
} from 'firebase/firestore';

import state, { db, storage, fetchUniqueInt } from './state.mjs';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

describe('Firebase', () => {
    const testDoc = {name: 'fewljwkfeewflkjfds'};
    it('Is sane', () => {
        expect(true).toStrictEqual(true);
    });

    it('Can save a document to the test collection', async () => {
        await addDoc(collection(db, 'test'), testDoc);
        expect(
            (await getCountFromServer(collection(db, 'test'))).data().count
        ).toBeGreaterThan(0);
    });

    it('Can read a saved document', async () => {
        const querySnapshot = await getDocs(collection(db, 'test'));
        querySnapshot.forEach(document => expect(document.data()).toStrictEqual(testDoc));
        // You can also use document.id for stuff
    });

    it('Can delete all docs in the test collection', async () => {
        const querySnapshot = await getDocs(collection(db, 'test'));
        const promises = querySnapshot.docs.map(document => deleteDoc(
            doc(db, 'test', document.id)
        ));
        await Promise.all(promises);

        expect(
            (await getCountFromServer(collection(db, 'test')))
                .data().count
        ).toStrictEqual(0);
    });
});

describe('Google Cloud Storage', () => {
    it('Can upload a file', async () => {
        const file = new Blob(['Specious correlations'], {type:'text/plain'});
        const uploadRef = ref(storage, "test_files/test.txt");
        const snapshot = await uploadBytes(uploadRef, file, {
            contentType: 'text/plain',
        });
        // console.log("Upload success! Snapshot: ", snapshot);
        
        const newRef = ref(storage, 'test_files/test.txt');
        const downloadUrl = await getDownloadURL(newRef);
        // console.log("Download url = ", downloadUrl);
        // Note: You cannot download using fetch or getBlob due to CORS.
        // Image display should still work, though.
    });
})

describe('State get sequential ID', () => {
    it('Produces three distinct numbers', async () => {
        const ids = await Promise.all([fetchUniqueInt(), fetchUniqueInt(), fetchUniqueInt()]);
        expect(ids[0]).not.toBeUndefined();
        expect(ids[1]).not.toBeUndefined();
        expect(ids[2]).not.toBeUndefined();

        expect(ids[0]).not.toStrictEqual(ids[1]);
        expect(ids[1]).not.toStrictEqual(ids[2]);
        expect(ids[0]).not.toStrictEqual(ids[2]);
    });
})

afterAll(() => {
    terminate(state.db);
})