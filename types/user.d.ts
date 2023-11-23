// types/user.d.ts
export interface User {
  _id: string;
  username: string;
  email: string;
  password: string;
  roles: Array<'user' | 'artisan' | 'admin'>;
  profile: {
    name: string;
    bio: string;
    location: string;
    avatar: string;
  };
}
