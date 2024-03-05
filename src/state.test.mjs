import { describe, it, expect, afterAll } from '@jest/globals';

import {
    addDoc, getDocs, deleteDoc, getCountFromServer,
    collection, doc,
    terminate,
    getDoc,
} from 'firebase/firestore';

import state, { db, storage, fetchUniqueInt, auth } from './state.mjs';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';

describe('Firestore security', () => {
    it('Allows requests to collection users iff logged in', async () => {
        const denyResponse = await getDoc(doc(db, 'users', 'K8bhUx2Hqv2LjfP4BsKy')).catch(error => error);
        expect(denyResponse.code).toStrictEqual('permission-denied');
        await signInWithEmailAndPassword(auth, 'mpeschel@gmail.com', 'password');
        await getDoc(doc(db, 'users', 'K8bhUx2Hqv2LjfP4BsKy'));
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
});

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
});

afterAll(() => {
    terminate(state.db);
})