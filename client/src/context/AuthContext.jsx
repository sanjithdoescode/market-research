import { createContext, useContext, useEffect, useState } from 'react';
import { auth, signInWithGoogle } from '../config/firebase.js';
import { onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth';
import { setTokenGetter } from '../api/analysisApi.js';

const AuthContext = createContext({
  user: null,
  loading: true,
  signInWithGoogle: () => Promise.resolve(),
  signOut: () => Promise.resolve()
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Register the token getter with the API client so it can automatically fetch ID tokens
    setTokenGetter(async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        try {
          return await currentUser.getIdToken();
        } catch (error) {
          console.error('Error fetching Firebase ID token:', error);
          return null;
        }
      }
      return null;
    });

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  async function handleSignInWithGoogle() {
    await signInWithGoogle();
  }

  async function handleSignOut() {
    await firebaseSignOut(auth);
  }

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle: handleSignInWithGoogle, signOut: handleSignOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
