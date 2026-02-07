'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import {
    User as FirebaseUser,
    onAuthStateChanged,
    signInWithPopup,
    GoogleAuthProvider,
    signOut,
} from 'firebase/auth';
import { auth, db } from '@/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export type User = {
    uid: string;
    name: string;
    email: string;
    role: string;
};

type AuthContextType = {
    user: User | null;
    firebaseUser: FirebaseUser | null;
    loading: boolean;
    signInWithGoogle: () => Promise<void>;
    logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
    user: null,
    firebaseUser: null,
    loading: true,
    signInWithGoogle: async () => {},
    logout: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Lyssna på auth state changes från Firebase
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                // Användaren är inloggad
                setFirebaseUser(firebaseUser);

                // Hämta user profile från Firestore
                try {
                    const userDoc = await getDoc(
                        doc(db, 'userProfiles', firebaseUser.uid),
                    );

                    if (userDoc.exists()) {
                        const userData = userDoc.data();
                        setUser({
                            uid: firebaseUser.uid,
                            name:
                                userData.name ||
                                firebaseUser.displayName ||
                                'User',
                            email: firebaseUser.email || '',
                            role: userData.role || 'user',
                        });
                    } else {
                        // Skapa profil automatiskt för nya Google-användare
                        const newUserProfile = {
                            name: firebaseUser.displayName || 'User',
                            email: firebaseUser.email || '',
                            role: 'user',
                            createdAt: new Date().toISOString(),
                        };

                        await setDoc(
                            doc(db, 'userProfiles', firebaseUser.uid),
                            newUserProfile,
                        );

                        setUser({
                            uid: firebaseUser.uid,
                            name: firebaseUser.displayName || 'User',
                            email: firebaseUser.email || '',
                            role: 'user',
                        });
                    }
                } catch (error) {
                    console.error('Error fetching user profile:', error);
                    // Fallback
                    setUser({
                        uid: firebaseUser.uid,
                        name: firebaseUser.displayName || 'User',
                        email: firebaseUser.email || '',
                        role: 'user',
                    });
                }
            } else {
                // Användaren är utloggad
                setFirebaseUser(null);
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const signInWithGoogle = async () => {
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            // User state och profil uppdateras automatiskt via onAuthStateChanged
            console.log('Google Sign-In successful:', result.user.email);
        } catch (error: unknown) {
            console.error('Google Sign-In error:', error);
            if (
                error &&
                typeof error === 'object' &&
                'code' in error &&
                error.code === 'auth/popup-closed-by-user'
            ) {
                throw new Error('Inloggningen avbröts');
            }
            throw new Error('Kunde inte logga in med Google. Försök igen.');
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
            // User state uppdateras automatiskt via onAuthStateChanged
            console.log('Logout successful');
        } catch (error: unknown) {
            console.error('Logout error:', error);
            throw new Error('Kunde inte logga ut. Försök igen.');
        }
    };

    return (
        <AuthContext.Provider
            value={{ user, firebaseUser, loading, signInWithGoogle, logout }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
