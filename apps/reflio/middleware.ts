import { NextRequest, NextResponse } from 'next/server';

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
  //       if (password === 'pass') {
  //         return NextResponse.next();
  //       }
  //     }
  //     if (authType === 'Bearer') {
  //       if (authValue === 'token') {
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
