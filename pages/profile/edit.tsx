import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { useSession, getSession } from 'next-auth/react';
import { ObjectId } from 'mongodb';
import mongoose from 'mongoose';
import connectToDatabase from '../../lib/mongodb';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/layout/Header';

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
  _id: string;
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
      console.log('User set', initialUser);
    }
  }, [sessionStatus, initialUser]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted');
  
    if (user) {
      // Create JSON object to send in the request
      const data = {
        _id: user._id,
        username: user.username || '',
        email: user.email || '',
        password: user.password || '',
        profile: {
          name: user.profile.name || '',
          bio: user.profile.bio || '',
          location: user.profile.location || '',
          avatar: 'https://avatars.githubusercontent.com/u/63383031',
        },
      };
  
      // If avatar is present, convert it to a data URL and add it to the data object
      if (avatar) {
        const reader = new FileReader();
        reader.onloadend = () => {
          data.profile.avatar = reader.result as string;
          sendRequest(data);
        };
        reader.readAsDataURL(avatar);
      } else {
        sendRequest(data);
      }
    }
  };

  const sendRequest = (data: any) => {
    // Send request to update user
    axios.put('/api/profiles/profiles', data)
      .then(response => {
        console.log('Axios Response', response);
        router.push('/profile')
      })
      .catch(error => console.error(error));
  };

  // Throws a 500 error
  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   console.log('Form submitted');
  
  //   // Create form data to send in the request
  //   const formData = new FormData();
  //   if (user) {
  //     formData.append('_id', user._id);
  //     formData.append('username', user.username || '');
  //     formData.append('email', user.email || '');
  //     formData.append('password', user.password || '');
  //     formData.append('profile', JSON.stringify({
  //       name: user.profile.name || '',
  //       bio: user.profile.bio || '',
  //       location: user.profile.location || '',
  //     }));
  //     if (avatar) formData.append('avatar', avatar);
  
  //     // Send request to update user
  //     axios.put(`/api/profiles/profiles?id=${user._id}`, formData, {
  //       headers: {
  //         'Content-Type': 'multipart/form-data'
  //       }
  //     })
  //     .then(response => {
  //       console.log('Axios Response', response);
  //       router.push('/profile')
  //     })
  //     .catch(error => console.error(error));
  //   }
  // };

  // let loadingStatus = 'loading';
  // if (loadingStatus === 'loading') return 'Loading session...';
  if (!user || !user.profile) return 'Loading user...';

  return (
    <>
      <Head>
        <title>Profile</title>
        <meta name="description" content={`Edit ${user?.username}'s Profile`} />
      </Head>

      <Header title={`Edit ${user?.username}'s Profile`}/>

      <form onSubmit={handleSubmit} className="mx-auto max-w-2xl px-4 py-4 sm:px-6 sm:py-12 lg:max-w-7xl lg:px-8">
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <div className="mt-1">
            <input
              type="text"
              name="name"
              id="name"
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2"
              value={user?.profile.name || ''}
              onChange={(e) => setUser({...user, profile: {...user.profile, name: e.target.value}})}
            />
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="location" className="block text-sm font-medium text-gray-700">
            Location
          </label>
          <div className="mt-1">
            <input
              type="text"
              name="location"
              id="location"
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2"
              value={user?.profile.location || ''}
              onChange={(e) => setUser({...user, profile: {...user.profile, location: e.target.value}})}
            />
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
            Bio
          </label>
          <div className="mt-1">
            <textarea
              name="bio"
              id="bio"
              rows={5}
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2"
              value={user?.profile.bio || ''   }
              onChange={(e) => setUser({...user, profile: {...user.profile, bio: e.target.value}})}
            />
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="avatar" className="block text-sm font-medium text-gray-700">
            Avatar
          </label>
          <div className="mt-1">
            <input
              type="file"
              name="avatar"
              id="avatar"
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2"
              onChange={(e) => setAvatar(e.target.files ? e.target.files[0] : null)}
            />
          </div>
        </div>

        <div className="flex justify-end space-x-4 mb-4">
          <Link href="/profile">
            <button
              type="button"
              className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
          </Link>
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Save
          </button>
        </div>
      </form>
    </>
  );
}
