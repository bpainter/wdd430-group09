import Head from 'next/head';
import { useRouter } from 'next/router';

export default function Login() {
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
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
      // Handle success - Redirect or show success message
      router.push('/profile'); // Redirect to profile or other page
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
      <h1>Login</h1>
      <h1 className="text-xl font-bold">Login</h1>
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email:</label>
          <input type="email" id="email" name="email" required className="shadow border rounded py-2 px-3 text-grey-darker" />
        </div>
        <div className="mb-6">
          <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">Password:</label>
          <input type="password" id="password" name="password" required className="shadow border rounded py-2 px-3 text-grey-darker" />
        </div>
        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Log In</button>
      </form>
    </>
  );
}
