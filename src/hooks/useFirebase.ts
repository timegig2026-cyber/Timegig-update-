import React, { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  doc, 
  setDoc, 
  getDoc,
  deleteDoc,
  orderBy,
  serverTimestamp,
  where
} from 'firebase/firestore';
import { onAuthStateChanged, User } from 'firebase/auth';
import { db, auth } from '../lib/firebase';
import { MarketItem, ChatItem, MessageItem, NotificationItem, UserProfile, Settings } from '../types';

export const useFirebase = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const syncCollection = <T extends { id: string }>(
    collectionName: string, 
    setState: React.Dispatch<React.SetStateAction<T[]>>,
    orderField: string = 'timestamp'
  ) => {
    const q = query(collection(db, collectionName), orderBy(orderField, 'desc'));
    return onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
      setState(items);
    });
  };

  const addItem = async (collectionName: string, item: any) => {
    const { id, ...data } = item;
    return await addDoc(collection(db, collectionName), {
      ...data,
      timestamp: serverTimestamp()
    });
  };

  const updateItem = async (collectionName: string, id: string, data: any) => {
    const docRef = doc(db, collectionName, id);
    return await updateDoc(docRef, data);
  };

  const saveProfile = async (userId: string, profile: Partial<UserProfile>, settings: Settings) => {
    const docRef = doc(db, 'users', userId);
    return await setDoc(docRef, { ...profile, settings }, { merge: true });
  };

  const getProfile = async (userId: string) => {
    const docRef = doc(db, 'users', userId);
    const snap = await getDoc(docRef);
    return snap.exists() ? snap.data() : null;
  };

  const syncSubcollection = <T extends { id: string }>(
    parentCollection: string,
    parentId: string,
    subCollection: string,
    setState: React.Dispatch<React.SetStateAction<T[]>>,
    orderField: string = 'time'
  ) => {
    const q = query(collection(db, parentCollection, parentId, subCollection), orderBy(orderField, 'asc'));
    return onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
      setState(items);
    });
  };

  const addSubItem = async (parentCollection: string, parentId: string, subCollection: string, item: any) => {
    const { id, ...data } = item;
    return await addDoc(collection(db, parentCollection, parentId, subCollection), {
      ...data,
      time: serverTimestamp()
    });
  };

  const deleteItem = async (collectionName: string, id: string) => {
    const docRef = doc(db, collectionName, id);
    return await deleteDoc(docRef);
  };

  const deleteSubItem = async (parentCollection: string, parentId: string, subCollection: string, id: string) => {
    const docRef = doc(db, parentCollection, parentId, subCollection, id);
    return await deleteDoc(docRef);
  };

  return {
    user,
    loading,
    syncCollection,
    syncSubcollection,
    addItem,
    updateItem,
    addSubItem,
    deleteItem,
    deleteSubItem,
    saveProfile,
    getProfile
  };
};
