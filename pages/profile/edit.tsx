import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { useSession, getSession } from 'next-auth/react';
import { ObjectId } from 'mongodb';
import connectToDatabase from '../../lib/mongodb';

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  const db = await connectToDatabase();
  const usersCollection = db.collection('users');
  const user = await usersCollection.findOne({ _id: new ObjectId(session.user.id) });
  
  if (!user) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      user: JSON.parse(JSON.stringify(user)),
    },
  };
}

interface UserProfile {
  name: string;
  bio: string;
  location: string;
  avatar: string;
}

interface User {
  username: string;
  email: string;
  password: string;
  profile: UserProfile;
}

interface EditProfileProps {
  user: User;
}

export default function EditProfile({ user: initialUser }: EditProfileProps) {
  const [user, setUser] = useState<User | null>(null);
  const [avatar, setAvatar] = useState<File | null>(null);
  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession();

  useEffect(() => {
    if (sessionStatus === 'authenticated') {
      setUser(initialUser);
    }
  }, [sessionStatus, initialUser]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Create form data to send in the request
    const formData = new FormData();
    if (user) {
      formData.append('username', user.username || '');
      formData.append('email', user.email || '');
      formData.append('password', user.password || '');
      formData.append('name', user.profile.name || '');
      formData.append('bio', user.profile.bio || '');
      formData.append('location', user.profile.location || '');
      if (avatar) formData.append('avatar', avatar);
    }

    // Send request to update user
    axios.put('/api/user', formData)
      .then(response => router.push('/profile'))
      .catch(error => console.error(error));
  };

  if (status === 'loading') return 'Loading session...';
  if (!user || !user.profile) return 'Loading user...';



  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Name
        </label>
        <div className="mt-1">
          <input
            type="text"
            name="name"
            id="name"
            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
            value={user?.profile.name || ''}
            onChange={(e) => setUser({...user, profile: {...user.profile, name: e.target.value}})}
          />
        </div>
      </div>

      <div>
        <label htmlFor="location" className="block text-sm font-medium text-gray-700">
          Location
        </label>
        <div className="mt-1">
          <input
            type="text"
            name="location"
            id="location"
            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
            value={user?.profile.location || ''}
            onChange={(e) => setUser({...user, profile: {...user.profile, location: e.target.value}})}
          />
        </div>
      </div>

      <div>
        <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
          Bio
        </label>
        <div className="mt-1">
          <textarea
            name="bio"
            id="bio"
            rows={3}
            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md"
            value={user?.profile.bio || ''   }
            onChange={(e) => setUser({...user, profile: {...user.profile, bio: e.target.value}})}
          />
        </div>
      </div>

      <div>
        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Save
        </button>
      </div>
    </form>
  );
}
