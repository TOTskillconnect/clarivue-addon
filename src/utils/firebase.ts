// Firebase configuration and utilities for Clarivue Addon

import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  where,
  orderBy,
  limit 
} from 'firebase/firestore';
import { 
  getAuth, 
  signInAnonymously, 
  onAuthStateChanged,
  User 
} from 'firebase/auth';

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Types
export interface MeetingSession {
  id: string;
  platform: 'meet' | 'zoom' | 'teams';
  title: string;
  participants: string[];
  startTime: Date;
  endTime?: Date;
  questions: string[];
  cues: string[];
  suggestions: any[];
  userId: string;
}

export interface UserPreferences {
  userId: string;
  favoriteQuestions: string[];
  favoriteCues: string[];
  preferredCategories: string[];
  notificationSettings: {
    suggestions: boolean;
    reminders: boolean;
  };
}

// Authentication
export const signInUser = async (): Promise<User> => {
  try {
    const result = await signInAnonymously(auth);
    return result.user;
  } catch (error) {
    console.error('Error signing in:', error);
    throw error;
  }
};

export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};

export const onUserStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

// Meeting Sessions
export const createMeetingSession = async (session: Omit<MeetingSession, 'id'>): Promise<string> => {
  const user = getCurrentUser();
  if (!user) throw new Error('User not authenticated');

  const sessionRef = doc(collection(db, 'meetingSessions'));
  const sessionData = {
    ...session,
    id: sessionRef.id,
    userId: user.uid,
    createdAt: new Date()
  };

  await setDoc(sessionRef, sessionData);
  return sessionRef.id;
};

export const getMeetingSession = async (sessionId: string): Promise<MeetingSession | null> => {
  const sessionRef = doc(db, 'meetingSessions', sessionId);
  const sessionSnap = await getDoc(sessionRef);
  
  if (sessionSnap.exists()) {
    return sessionSnap.data() as MeetingSession;
  }
  return null;
};

export const getUserSessions = async (limitCount: number = 10): Promise<MeetingSession[]> => {
  const user = getCurrentUser();
  if (!user) throw new Error('User not authenticated');

  const sessionsRef = collection(db, 'meetingSessions');
  const q = query(
    sessionsRef,
    where('userId', '==', user.uid),
    orderBy('startTime', 'desc'),
    limit(limitCount)
  );

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => doc.data() as MeetingSession);
};

// User Preferences
export const saveUserPreferences = async (preferences: UserPreferences): Promise<void> => {
  const user = getCurrentUser();
  if (!user) throw new Error('User not authenticated');

  const userRef = doc(db, 'userPreferences', user.uid);
  await setDoc(userRef, {
    ...preferences,
    userId: user.uid,
    updatedAt: new Date()
  });
};

export const getUserPreferences = async (): Promise<UserPreferences | null> => {
  const user = getCurrentUser();
  if (!user) throw new Error('User not authenticated');

  const userRef = doc(db, 'userPreferences', user.uid);
  const userSnap = await getDoc(userRef);
  
  if (userSnap.exists()) {
    return userSnap.data() as UserPreferences;
  }
  return null;
};

// Questions and Cues
export const getQuestionsByCategory = async (category: string): Promise<any[]> => {
  const questionsRef = collection(db, 'questions');
  const q = query(
    questionsRef,
    where('category', '==', category),
    where('active', '==', true)
  );

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getCuesByCategory = async (category: string): Promise<any[]> => {
  const cuesRef = collection(db, 'cues');
  const q = query(
    cuesRef,
    where('category', '==', category),
    where('active', '==', true)
  );

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export default {
  app,
  db,
  auth,
  signInUser,
  getCurrentUser,
  onUserStateChange,
  createMeetingSession,
  getMeetingSession,
  getUserSessions,
  saveUserPreferences,
  getUserPreferences,
  getQuestionsByCategory,
  getCuesByCategory
}; 