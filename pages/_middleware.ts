// pages/_middleware.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

export default async function middleware(req: NextApiRequest, res: NextApiResponse, next: Function) {
  const session = await getSession({ req });
  
  if (!session) {
    return res.redirect('/login');
  }
  
  if (session.user.role === 'user') {
    return res.redirect(`/user/${session.user.id}`)
  }

  if (session.user.role === 'artisan' && !(req.url || '').startsWith(`/artisans/${session.user.id}`)) {
    return res.redirect(`/artisans/${session.user.id}`)
  }

  if (session.user.role === 'admin' && !(req.url || '').startsWith('/admin')) {
    return res.redirect('/admin')
  }

  // If none of the conditions above are met, continue with the request
  next();
}