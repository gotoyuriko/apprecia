import { 
  AuthProvider, 
  UserProvider, 
  ArtworkProvider, 
  TourProvider, 
  CommentProvider, 
  LikeProvider 
} from '@/firebase/contexts';
import ErrorBoundary from '@/components/ErrorBoundary';
import '@/styles/globals.css';

export default function App({ Component, pageProps }) {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <UserProvider>
          <ArtworkProvider>
            <TourProvider>
              <CommentProvider>
                <LikeProvider>
                  <Component {...pageProps} />
                </LikeProvider>
              </CommentProvider>
            </TourProvider>
          </ArtworkProvider>
        </UserProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
