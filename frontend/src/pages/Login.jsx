import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { toast } from 'sonner';
import axios from 'axios';
import { Mail, Lock, User } from 'lucide-react';
import { assets } from '../assets/assets.js';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      toast.success('Login successful!');
      navigate('/feed');
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-8">
      <div className="max-w-sm w-full">
        <div className="bg-white border border-gray-200 rounded-lg p-6 pt-8 mb-4">
          <div className="flex justify-center mb-10">
            <img src={assets.dark_logo} alt='teleport social network' className='h-10'/>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded bg-slate-50 focus:outline-none focus:border-primary-pink placeholder:text-gray-400"
                placeholder="Email"
              />
            </div>

            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded bg-slate-50 focus:outline-none focus:border-primary-pink placeholder:text-gray-400"
                placeholder="Password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-10 flex justify-center items-center bg-primary-pink/90 text-white rounded font-semibold hover:bg-primary-pink transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm mt-4"
            >
              {loading ? <ButtonLoader/> : 'Log In'}
            </button>
          </form>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg px-6 py-4 text-center">
          <p className="text-sm text-gray-900">
            Don't have an account?{' '}
            <Link to="/signup" className="text-primary-pink/90 font-medium hover:text-primary-pink">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

