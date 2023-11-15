import Head from 'next/head';
import { useRouter } from 'next/router';

export default function Signup() {
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const target = event.target as typeof event.target & {
      username: { value: string };
      email: { value: string };
      password: { value: string };
    };
    const username = target.username.value;
    const email = target.email.value;
    const password = target.password.value;

    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      // Handle success - Redirect or show success message
      router.push('/login'); // Redirect to login page
    } else {
      // Handle errors - Show error message
      alert(data.message || 'Something went wrong');
    }
  };

  return (
    <>
      <Head>
        <title>Signup - Handcrafted Haven</title>
        <meta name="description" content="Sign up to Handcrafted Haven." />
      </Head>
      <h1 className="text-xl font-bold">Sign Up</h1>
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="mb-4">
          <label htmlFor="username" className="block text-gray-700 text-sm font-bold mb-2">Username:</label>
          <input type="text" id="username" name="username" required className="shadow border rounded py-2 px-3 text-grey-darker" />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email:</label>
          <input type="email" id="email" name="email" required className="shadow border rounded py-2 px-3 text-grey-darker" />
        </div>
        <div className="mb-6">
          <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">Password:</label>
          <input type="password" id="password" name="password" required className="shadow border rounded py-2 px-3 text-grey-darker" />
        </div>
        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Sign Up</button>
      </form>
    </>
  );
}
