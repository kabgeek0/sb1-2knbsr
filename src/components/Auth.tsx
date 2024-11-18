import React, { useState } from 'react';
import { auth, googleProvider } from '../firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut
} from 'firebase/auth';
import { LogIn, LogOut, Mail, User, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Check for redirect result on component mount
  React.useEffect(() => {
    getRedirectResult(auth).then((result) => {
      if (result) {
        toast.success('Signed in with Google successfully!');
        setAuthError(null);
      }
    }).catch((error) => {
      handleAuthError(error);
    });
  }, []);

  const handleAuthError = (error: any) => {
    setIsLoading(false);
    let errorMessage = 'An error occurred during authentication.';

    if (error.code === 'auth/unauthorized-domain') {
      errorMessage = 'This domain is not authorized for authentication. Please contact support.';
    } else if (error.code === 'auth/popup-blocked') {
      errorMessage = 'Popup was blocked by your browser. Please allow popups or try another sign-in method.';
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = 'Please enter a valid email address.';
    } else if (error.code === 'auth/wrong-password') {
      errorMessage = 'Incorrect password. Please try again.';
    } else if (error.code === 'auth/user-not-found') {
      errorMessage = 'No account found with this email. Please sign up first.';
    } else if (error.code === 'auth/too-many-requests') {
      errorMessage = 'Too many failed attempts. Please try again later.';
    }

    setAuthError(errorMessage);
    toast.error(errorMessage);
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setAuthError(null);

    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
        toast.success('Account created successfully!');
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        toast.success('Signed in successfully!');
      }
      setEmail('');
      setPassword('');
    } catch (error: any) {
      handleAuthError(error);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setAuthError(null);

    try {
      // For development environment, prefer email/password auth
      if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        toast.error('Google Sign-in is not available in development. Please use email/password.');
        setIsLoading(false);
        return;
      }

      // First try popup
      await signInWithPopup(auth, googleProvider);
      toast.success('Signed in with Google successfully!');
    } catch (error: any) {
      if (error.code === 'auth/popup-blocked') {
        try {
          // If popup is blocked, fall back to redirect
          toast.loading('Redirecting to Google sign-in...', {
            duration: 2000
          });
          await signInWithRedirect(auth, googleProvider);
        } catch (redirectError: any) {
          handleAuthError(redirectError);
        }
      } else {
        handleAuthError(error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    setIsLoading(true);
    setAuthError(null);
    try {
      await signOut(auth);
      toast.success('Signed out successfully!');
    } catch (error: any) {
      handleAuthError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card p-6 max-w-md mx-auto">
      {authError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-red-700">{authError}</div>
        </div>
      )}

      {auth.currentUser ? (
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
            <User className="w-5 h-5 text-blue-500" />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">
                Signed in as
              </p>
              <p className="text-sm text-gray-600">
                {auth.currentUser.email}
              </p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            disabled={isLoading}
            className="btn-primary w-full bg-red-500 hover:bg-red-600 disabled:opacity-50"
          >
            <LogOut className="w-4 h-4" />
            {isLoading ? 'Signing out...' : 'Sign Out'}
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">
              {isSignUp ? 'Create Account' : 'Sign In'}
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {isSignUp
                ? 'Create a new account to get started'
                : 'Sign in to your account to continue'}
            </p>
          </div>

          <form onSubmit={handleEmailAuth} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field mt-1"
                placeholder="Enter your email"
                disabled={isLoading}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field mt-1"
                placeholder="Enter your password"
                disabled={isLoading}
                required
              />
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="btn-primary w-full disabled:opacity-50"
            >
              <Mail className="w-4 h-4" />
              {isLoading 
                ? (isSignUp ? 'Creating Account...' : 'Signing In...') 
                : (isSignUp ? 'Sign Up' : 'Sign In')} with Email
            </button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          <button
            onClick={handleGoogleSignIn}
            disabled={isLoading || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'}
            className="btn-primary w-full bg-white !text-gray-900 border border-gray-300 hover:bg-gray-50 disabled:opacity-50"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            {isLoading ? 'Signing in...' : 'Sign in with Google'}
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              disabled={isLoading}
              className="text-sm text-blue-600 hover:text-blue-500 disabled:opacity-50"
            >
              {isSignUp
                ? 'Already have an account? Sign in'
                : "Don't have an account? Sign up"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Auth;