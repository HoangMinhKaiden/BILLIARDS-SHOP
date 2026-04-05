import React, { createContext, useContext, useEffect, useState } from 'react';
import { User as FirebaseUser, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot, collection, getDocs, addDoc, deleteDoc } from 'firebase/firestore';
import { auth, db, signInWithGoogle, logout } from '../firebase';
import { PRODUCTS, ARTICLES } from '../constants';

interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  role: 'admin' | 'user';
  createdAt: string;
}

interface FirebaseContextType {
  user: FirebaseUser | null;
  profile: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
  cartCount: number;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);

export const FirebaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    let cartUnsubscribe: (() => void) | null = null;

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (cartUnsubscribe) {
        cartUnsubscribe();
        cartUnsubscribe = null;
      }

      if (currentUser) {
        try {
          // Fetch or create user profile
          const userDocRef = doc(db, 'users', currentUser.uid);
          console.log("Checking for user profile in Firestore for UID:", currentUser.uid);
          const userDoc = await getDoc(userDocRef);

          if (!userDoc.exists()) {
            console.log("No profile found, creating new profile for:", currentUser.email);
            const newProfile: UserProfile = {
              uid: currentUser.uid,
              email: currentUser.email || '',
              displayName: currentUser.displayName || '',
              photoURL: currentUser.photoURL || '',
              role: currentUser.email === 'minhpnhgcd220355@fpt.edu.vn' ? 'admin' : 'user',
              createdAt: new Date().toISOString(),
            };
            await setDoc(userDocRef, newProfile);
            console.log("Profile created successfully.");
            setProfile(newProfile);
          } else {
            console.log("Profile found:", userDoc.data());
            setProfile(userDoc.data() as UserProfile);
          }

          // Initialize data if admin
          if (currentUser.email === 'minhpnhgcd220355@fpt.edu.vn') {
            const initData = async () => {
              try {
                const productsSnap = await getDocs(collection(db, 'products'));
                if (productsSnap.empty) {
                  for (const p of PRODUCTS) {
                    await addDoc(collection(db, 'products'), p);
                  }
                }

                const articlesSnap = await getDocs(collection(db, 'articles'));
                // Check if articles need update (e.g., missing 'content' field or count mismatch)
                const needsUpdate = articlesSnap.empty || 
                                   articlesSnap.docs.length !== ARTICLES.length ||
                                   articlesSnap.docs.some(doc => !doc.data().content);
                
                if (needsUpdate) {
                  // For simplicity in this demo, if update is needed, we clear and re-add
                  // In a real app, you'd update existing docs
                  if (!articlesSnap.empty) {
                    for (const doc of articlesSnap.docs) {
                      await deleteDoc(doc.ref);
                    }
                  }
                  for (const a of ARTICLES) {
                    await addDoc(collection(db, 'articles'), a);
                  }
                }
              } catch (error) {
                console.error("Initialization error:", error);
              }
            };
            initData();
          }

          // Listen to cart changes
          cartUnsubscribe = onSnapshot(collection(db, 'users', currentUser.uid, 'cart'), (snapshot) => {
            const count = snapshot.docs.reduce((sum, doc) => sum + (doc.data().quantity || 0), 0);
            setCartCount(count);
          });
        } catch (error) {
          console.error("Error fetching profile:", error);
        }
      } else {
        setProfile(null);
        setCartCount(0);
      }
      setLoading(false);
    });

    return () => {
      unsubscribe();
      if (cartUnsubscribe) cartUnsubscribe();
    };
  }, []);

  const signIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Sign in error:', error);
    }
  };

  const signOutUser = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const value = {
    user,
    profile,
    loading,
    isAdmin: profile?.role === 'admin',
    cartCount,
    signIn,
    signOut: signOutUser,
  };

  return (
    <FirebaseContext.Provider value={value}>
      {loading ? (
        <div className="fixed inset-0 bg-background flex items-center justify-center z-[9999]">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            <span className="text-[10px] uppercase tracking-[0.3em] text-on-surface-variant animate-pulse">Khởi tạo hệ thống...</span>
          </div>
        </div>
      ) : (
        children
      )}
    </FirebaseContext.Provider>
  );
};

export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
};
