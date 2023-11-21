import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Alert from '../components/elements/Alert';
import Header from '../components/layout/Header';

export default function Signup() {
  const router = useRouter();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const target = event.target as typeof event.target & {
      username: { value: string };
      email: { value: string };
      password: { value: string };
      isArtisan: { checked: boolean };
    };
    const username = target.username.value;
    const email = target.email.value;
    const password = target.password.value;
    const isArtisan = target.isArtisan.checked;

    if (!username || !email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setProcessing(true);

    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email, password, isArtisan }),
    });

    const data = await response.json();

    setProcessing(false);

    if (!response.ok) {
      setError(data.message || 'An error occurred. Please try again.');
      return;
    }
    
    if (response.ok) {
      // Handle success - Redirect or show success message
      if (isArtisan) {
          router.push(`/artisans/${data.id}`); // Redirect to artisan profile page
        } else {
        router.push('/'); // Redirect to homepage
      }
    } else {
      // Handle errors - Show error message
      setError(data.message || 'Something went wrong');
    }
  };

  return (
    <>
      <Head>
        <title>Signup - Handcrafted Haven</title>
        <meta name="description" content="Sign up to Handcrafted Haven." />
      </Head>
      {/* <Header title="Signup" /> */}
      
      {/* Content */}
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h1 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Create a Handcrafted Haven Account
        </h1>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
        {error && <Alert message={error} type="danger" />}

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-900">
              Username
            </label>
            <div className="mt-2">
              <input
                id="username"
                name="username"
                type="text"
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm p-4"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-900">
              Email address
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm p-4"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-900">
              Password
            </label>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm p-4"
              />
            </div>
          </div>

          <div className="flex items-center">
            <input
              id="isArtisan"
              name="isArtisan"
              type="checkbox"
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="isArtisan" className="ml-2 block text-sm text-gray-900">
              I want to be an artisan
            </label>
          </div>

          <div>
            <button
              type="submit"
              disabled={processing}
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-500 focus:ring-2 focus:ring-indigo-600"
            >
              {processing ? 'Creating account...' : 'Sign Up'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
