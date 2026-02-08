import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

console.log('🔥 Initializing Firebase with config:', {
  projectId: firebaseConfig.projectId,
  authDomain: firebaseConfig.authDomain
});

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

console.log('✅ Firestore initialized');

// High scores collection
const highscoresCollection = collection(db, 'highscores');

// Save score to Firestore
export const saveHighScoreToFirebase = async (name, score) => {
  try {
    console.log('💾 Saving to Firestore:', { name, score });
    
    await addDoc(highscoresCollection, {
      name: name.trim().substring(0, 20),
      score: Math.min(score, 999999999),
      date: new Date().toISOString(),
      timestamp: Date.now()
    });
    
    console.log('✅ Score saved successfully!');
    return true;
  } catch (error) {
    console.error('❌ Error saving score:', error);
    console.error('Error details:', error.message);
    return false;
  }
};

// Subscribe to scores (real-time)
export const subscribeToHighScores = (callback) => {
  console.log('👂 Setting up Firestore listener...');
  
  const scoresQuery = query(
    highscoresCollection,
    orderBy('score', 'desc')
  );
  
  const unsubscribe = onSnapshot(scoresQuery, (snapshot) => {
    console.log('📊 Firestore snapshot received, docs:', snapshot.size);
    
    const scores = [];
    snapshot.forEach((doc) => {
      scores.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    console.log('✅ Processed scores:', scores.length);
    callback(scores);
  }, (error) => {
    console.error('❌ Firestore listener error:', error);
    console.error('Error details:', error.message);
    callback([]);
  });
  
  return unsubscribe;
};

export { db };