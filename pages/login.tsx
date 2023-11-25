import Head from 'next/head';
import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useEffect } from 'react';
import { signIn, getSession, useSession } from 'next-auth/react';

export default function Login() {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  /* Redirect to their appropariate if the user is already signed in and they try
     to access the login page */
  useEffect(() => {
    console.log("Is logged in?", session); // Log the session object to the console

    if (session && session.user && session.user.roles) {
      if (session.user.roles.includes('admin')) {
        router.push('/admin');
      } else if (session.user.roles.includes('artisan')) {
        router.push(`/artisan/${session.user.id}`);
      } else {
        router.push('/profile');
      }
    }
  }, [session, router]);

  /**
   * Handles the form submission for the login page.
   * 
   * @param event - The form submission event.
   */
  const handleLoginSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    const target = event.target as typeof event.target & {
      email: { value: string };
      password: { value: string };
    };
    const email = target.email.value;
    const password = target.password.value;

    console.log('Submitting login form...'); // Log the start of the form submission
    console.log("event.targets", email + ' ' + password);

    // Use the signIn function from NextAuth to create a session
    await signIn('credentials', {
      email,
      password,
      redirect: false, // Prevent NextAuth from automatically redirecting
    });

    // Check if a session exists
    const session = await getSession();
    if (session) {
      // Redirect to the profile page after successful login
      if (session.user.roles.includes('admin')) {
        console.log('Redirect to admin', session.user.roles);
        router.push('/admin');
      } else if (session.user.roles.includes('artisan')) {
        console.log('Redirect to artisan', session.user.roles);
        router.push(`/artisan/${session.user.id}`);
      } else {
        console.log('Redirect to user', session.user.roles);
        router.push('/profile');
      }
      console.log('Login successful', session); // Log the successful login
    } else {
      // Handle errors - Show error message
      setError('Login failed');
      setLoading(false);
      console.log('Login failed'); // Log the failed login
    }

    // OLD CODE - NOT WORKING
    // Use the signIn function from NextAuth to create a session
    // const result = await signIn('credentials', {
    //   email,
    //   password,
    // });

    // console.log('Login result:', result); // Log the result of the login attempt

    // if (result && !result.ok) {
    //   // Handle errors - Show error message
    //   setError(result.error || 'Login failed');
    //   setLoading(false);
    // } else {
    //   console.log('Login successful'); // Log the successful login
    //   router.push('/profile'); // Redirect to the profile page after successful login
    // }
  };

  return (
    <>
      <Head>
        <title>Login - Handcrafted Haven</title>
        <meta name="description" content="Log in to Handcrafted Haven." />
      </Head>
      
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h1 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Log in to your account
        </h1>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
        <form onSubmit={handleLoginSubmit} className="space-y-6">
          {error && <div className="error">{error}</div>}
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
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm font-medium text-gray-900">
                Password
              </label>
              {/* You can link to your password recovery page */}
              <div className="text-sm">
                <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                  Forgot password?
                </a>
              </div>
            </div>
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

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-500 focus:ring-2 focus:ring-indigo-600"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Log in'}
            </button>
          </div>
        </form>

        <div className="mt-10 text-center text-sm text-gray-500">
          Not a signed up?{' '}
          <Link href="/signup" className="font-medium text-indigo-600 hover:text-indigo-500">
            Create an Account
          </Link>
        </div>
      </div>
    </>
  );
}
