import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function Login() {
  const router = useRouter();

  /**
   * Handles the form submission for the login page.
   * 
   * @param event - The form submission event.
   */
  const handleLoginSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const target = event.target as typeof event.target & {
      email: { value: string };
      password: { value: string };
    };
    const email = target.email.value;
    const password = target.password.value;

    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      // Store the token in localStorage
      localStorage.setItem('token', data.token);

      // Redirect to artisan profile or other page
      if (data.role === 'artisan') {
        router.push(`/artisans/${data._id}`); // Redirect to artisan's profile
      } else {
        router.push('/'); // Redirect to home or other page for non-artisan users
      }
    } else {
      // Handle errors - Show error message
      alert(data.message || 'Something went wrong');
    }
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
            >
              Log in
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
