import { NextRequest, NextResponse } from 'next/server';

const VERCEL_BYPASS_TOKEN = process.env.VERCEL_BYPASS_TOKEN;
const VERCEL_BYPASS_PASSWORD = process.env.VERCEL_BYPASS_PASSWORD;

if (!VERCEL_BYPASS_TOKEN || !VERCEL_BYPASS_PASSWORD)
  throw new Error('Vercel bypass token or password is not defined in env.');

export const config = {
  matcher: ['/(.*)']
};

export function middleware(req: NextRequest) {
  return NextResponse.next();
  // const url = req.nextUrl;
  // try {
  //   const auth = req.headers.get('authorization');
  //   if (auth) {
  //     const [authType, authValue] = auth.split(' ');
  //     if (authType === 'Basic') {
  //       const password = atob(authValue).split(':')[1];
  //       if (password && password === VERCEL_BYPASS_PASSWORD) {
  //         return NextResponse.next();
  //       }
  //     }
  //     if (authType === 'Bearer') {
  //       if (authValue && authValue === VERCEL_BYPASS_TOKEN) {
  //         return NextResponse.next();
  //       }
  //     }
  //   }
  // } catch (e) {
  //   console.error(e);
  // }
  // url.pathname = '/api/auth';
  // return NextResponse.rewrite(url);
}
