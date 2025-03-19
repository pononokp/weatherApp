import { initializeApp, FirebaseApp } from 'firebase/app';
import { Firestore, getFirestore } from 'firebase/firestore';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
    doc,
    addDoc,
    setDoc,
    getDocs,
    deleteDoc,
    collection,
} from 'firebase/firestore';

@Injectable()
export class FirebaseService {
    private app: FirebaseApp;
    private firestore: Firestore;

    constructor(private configService: ConfigService) {
        const firebaseConfig = {
            apiKey: this.configService.get<string>('FIREBASE_API_KEY'),
            authDomain: this.configService.get<string>('FIREBASE_AUTH_DOMAIN'),
            databaseURL: this.configService.get<string>(
                'FIREBASE_DATABASE_URL'
            ),
            projectId: this.configService.get<string>('FIREBASE_PROJECT_ID'),
            storageBucket: this.configService.get<string>(
                'FIREBASE_STORAGE_BUCKET'
            ),
            messagingSenderId: this.configService.get<string>(
                'FIREBASE_MESSAGING_SENDER_ID'
            ),
            appId: this.configService.get<string>('FIREBASE_APP_ID'),
            measurementId: this.configService.get<string>(
                'FIREBASE_MEASUREMENT_ID'
            ),
        };

        // Initialize Firebase app and Firestore
        try {
            this.app = initializeApp(firebaseConfig);
            console.log('Firebase app initialized successfully.');
            this.firestore = getFirestore(this.app);
            console.log('Firebase Firestore initialized successfully.');
        } catch (error) {
            console.error('Firebase initialization failed:', error);
        }
    }

    async addData(collectionName: string, data: any) {
        try {
            const weatherCollection = collection(
                this.firestore,
                collectionName
            ); // Reference to the collection
            const docRef = await addDoc(weatherCollection, data); // Add document with auto-generated ID
            return { success: true, result: docRef.id };
        } catch (error) {
            console.error('Error adding document:', error);
            return { success: false };
        }
    }

    async getData(collectionName: string) {
        try {
            const weatherCollection = collection(
                this.firestore,
                collectionName
            );
            const snapshot = await getDocs(weatherCollection);

            // Check if there are no documents in the collection
            if (snapshot.empty) {
                console.log('No records found.');
                return { success: false, result: [] };
            }

            // Map over the snapshot to retrieve the data from each document
            const weatherRecords = snapshot.docs.map((doc) => ({
                id: doc.id, // Document ID
                data: doc.data(), // Document data
            }));

            // Return the result with success flag
            return { success: true, result: weatherRecords };
        } catch (error) {
            console.error('Failed to get data from Firestore:', error);
            return { success: false };
        }
    }

    async deleteData(collectionName: string, uniqueId: string) {
        try {
            const docRef = doc(this.firestore, collectionName, uniqueId);
            const result = await deleteDoc(docRef);
            return { success: true, result };
        } catch (error) {
            console.error('Failed to delete data from Firestore:', error);
            return { success: false };
        }
    }

    async updateData(collectionName: string, uniqueId: string, data: any) {
        try {
            const docRef = doc(this.firestore, collectionName, uniqueId);
            const result = await setDoc(docRef, data, { merge: true });
            return { success: true, result };
        } catch (error) {
            console.error('Failed to update data in Firestore:', error);
            return { success: false };
        }
    }
}
