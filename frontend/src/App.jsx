import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { useAuth } from './context/AuthContext.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import Feed from './pages/Feed.jsx';
import Profile from './pages/Profile.jsx';
import EditProfile from './pages/EditProfile.jsx';
import Explore from './pages/Explore.jsx';
import Search from './pages/Search.jsx';
import Layout from './components/Layout.jsx';
import ContentLoader from './components/ContentLoader.jsx';
import ViewPosts from './pages/ViewPosts.jsx';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <ContentLoader/>
      </div>
    );
  }
  return user ? children : <Navigate to="/login" />;
};

function AppRoutes() {
  const { user } = useAuth();

  return (
    <>
      <Routes>
        <Route
          path="/login"
          element={user ? <Navigate to="/feed" /> : <Login />}
        />
        <Route
          path="/signup"
          element={user ? <Navigate to="/feed" /> : <Signup />}
        />
        <Route
          path="/feed"
          element={
            <PrivateRoute>
              <Layout>
                <Feed />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/profile/:userId"
          element={
            <PrivateRoute>
              <Layout>
                <Profile />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/edit-profile"
          element={
            <PrivateRoute>
              <Layout>
                <EditProfile />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/explore"
          element={
            <PrivateRoute>
              <Layout>
                <Explore />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/search"
          element={
            <PrivateRoute>
              <Layout>
                <Search />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/posts/:id"
          element={
            <PrivateRoute>
              <Layout>
                <ViewPosts />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route path="/" element={<Navigate to={user ? '/feed' : '/login'} />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50">
        <AppRoutes />
        <Toaster position="bottom-left" richColors />
      </div>
    </Router>
  );
}

export default App;

