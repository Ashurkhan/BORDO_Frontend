import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Header } from './components/Header';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { AdsList } from './components/AdsList';
import { AdDetails } from './components/AdDetails';
import { Profile } from './components/Profile';
import { Favorites } from './components/Favorites';
import { CreateAd } from './components/CreateAd';
import { EditAd } from './components/EditAd';
import { EmailVerificationResult } from './components/EmailVerificationResult';
import { OAuthCallback } from './components/OAuthCallback';
import { Footer } from './components/Footer';
import { ChatList } from './components/ChatList';
import { ChatRoom } from './components/ChatRoom';
import './styles/Footer.css';
import './styles/index.css';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Загрузка...</div>;
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

function AppContent() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/email-verification" element={<EmailVerificationResult />} />
        <Route path="/oauth2/callback" element={<OAuthCallback />} />
        <Route path="/" element={<AdsList />} />
        <Route path="/ads/create" element={<ProtectedRoute><CreateAd /></ProtectedRoute>} />
        <Route path="/ads/:id/edit" element={<ProtectedRoute><EditAd /></ProtectedRoute>} />
        <Route path="/ads/:id" element={<AdDetails />} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/favorites" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />
        <Route path="/chats" element={<ProtectedRoute><ChatList /></ProtectedRoute>} />
        <Route path="/chats/:chatId" element={<ProtectedRoute><ChatRoom /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <Footer />
    </>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
