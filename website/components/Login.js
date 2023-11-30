import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Header from '@/components/Header';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);


  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const loginData = { email, password };
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      if (response.ok) {
        // Login was successful
        // Redirect the user to the home page or the dashboard
        router.push('/'); // Use the router to navigate to the home page
      } else {
        // Handle login errors, display a message, etc.
        const data = await response.json();
        setError(data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      setError('An error occurred during login.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div><Header />
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4">Login</h2>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email:
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              className={`mt-1 p-2 w-full border rounded ${loading ? 'opacity-50' : ''}`}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password:
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              className={`mt-1 p-2 w-full border rounded ${loading ? 'opacity-50' : ''}`}
            />
          </div>

          <button
            type="submit"
            className={`bg-blue-500 text-white px-4 py-2 rounded ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'}`}
            disabled={loading}
          >
            {loading ? 'Logging In...' : 'Login'}
          </button>
        </form>

        <div className="mt-4 text-sm">
          <Link href="/forgot-password">
            <div className="text-blue-500 hover:underline">Forgot Password?</div>
          </Link>
        </div>
      </div>
    </div> </div>
  );
};

export default Login;
