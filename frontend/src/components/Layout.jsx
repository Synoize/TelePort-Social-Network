import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Home, Search, Compass, User } from 'lucide-react';
import { assets } from '../assets/assets.js';

const Header = () => {
  const { user, PLATFORM_URL } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');
  const navigate = useNavigate();

  const navItems = [
    { path: '/feed', icon: Home, label: 'Feed' },
    { path: '/explore', icon: Compass, label: 'Explore' },
    { path: '/search', icon: Search, label: 'Search' },
  ];

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/feed">
            <img src={assets.dark_logo} alt='teleport social network' className='h-10' />
          </Link>

          {/* Desktop Navigation */}
          <div className='flex gap-4'>
            <div className="hidden md:flex items-center gap-4">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${isActive(item.path)
                      ? 'text-primary-pink'
                      : 'text-gray-700'
                      }`}
                  >
                    <Icon className={`w-4 h-4`} />
                    <p className='text-sm'>{item.label}</p>
                  </Link>
                );
              })}
            </div>
            <button onClick={() => { navigate(`/profile/${user?._id}`) }} className="flex-shrink-0">
              <img
                src={
                  user.profilePhoto
                    ? `${PLATFORM_URL}${user.profilePhoto}`
                    : `https://ui-avatars.com/api/?name=${user.username}&background=random`
                }
                alt={user.username}
                className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
              />
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};

const Footer = () => {
  const location = useLocation();
  const { user } = useAuth();
  console.log(user);
  

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  const navItems = [
    { path: '/feed', icon: Home, label: 'Feed' },
    { path: '/explore', icon: Compass, label: 'Explore' },
    { path: '/search', icon: Search, label: 'Search' },
    { path: `/profile/${user?._id}`, icon: User, label: 'Profile' },
  ];

  return (
    <footer className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="flex justify-around items-center h-14">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center flex-1 h-full ${isActive(item.path) ? 'text-primary-pink' : 'text-gray-700'
                }`}
            >
              <Icon className={`w-6 h-6`} />
            </Link>
          );
        })}
      </div>
    </footer>
  );
};

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Header />
      <main className="flex-1 overflow-y-auto bg-[#fafafa]">
        <div className="h-full">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
export { Header, Footer };

