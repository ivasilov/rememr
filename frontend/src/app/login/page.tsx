'use client';

import { Input } from '@/src/components/ui/input';
import { createClient } from '@/src/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [view, setView] = useState('sign-in');
  const router = useRouter();
  const supabase = createClient();

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${location.origin}/auth/callback`,
      },
    });
    setView('check-email');
  };

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await supabase.auth.signInWithPassword({
      email,
      password,
    });
    router.push('/');
    router.refresh();
  };

  return (
    <div className="flex h-screen flex-row justify-center py-12">
      <div className="flex w-full flex-1 flex-col justify-center gap-2 px-8 sm:max-w-md">
        {view === 'check-email' ? (
          <p className="text-foreground text-center">
            Check <span className="font-bold">{email}</span> to continue signing up
          </p>
        ) : (
          <form
            className="text-foreground flex w-full flex-1 flex-col justify-center gap-2"
            onSubmit={view === 'sign-in' ? handleSignIn : handleSignUp}
          >
            <label className="text-md" htmlFor="email">
              Email
            </label>
            <Input name="email" onChange={e => setEmail(e.target.value)} value={email} placeholder="you@example.com" />
            <label className="text-md" htmlFor="password">
              Password
            </label>
            <Input
              type="password"
              name="password"
              onChange={e => setPassword(e.target.value)}
              value={password}
              placeholder="••••••••"
            />
            {view === 'sign-in' && (
              <>
                <button className="mb-6 rounded bg-green-700 px-4 py-2 text-white">Sign In</button>
                <p className="text-center text-sm">
                  Don&apos;t have an account?
                  <button className="ml-1 underline" onClick={() => setView('sign-up')}>
                    Sign Up Now
                  </button>
                </p>
              </>
            )}
            {view === 'sign-up' && (
              <>
                <button className="mb-6 rounded bg-green-700 px-4 py-2 text-white">Sign Up</button>
                <p className="text-center text-sm">
                  Already have an account?
                  <button className="ml-1 underline" onClick={() => setView('sign-in')}>
                    Sign In Now
                  </button>
                </p>
              </>
            )}
          </form>
        )}
      </div>
    </div>
  );
}

// import { useRouter } from 'next/router';
// import { ReactElement, useEffect, useRef } from 'react';
// import useFetch from 'use-http';
// import { Button, FormGroup, Input } from '../components';
// import { useCurrentUserQuery } from '../models';

// export default function SignInPage() {
//   const router = useRouter();
//   let emailInput = useRef<HTMLInputElement>(null);
//   let passwordInput = useRef<HTMLInputElement>(null);
//   const { loading, error, post, response } = useFetch('/login', {
//     cachePolicy: 'no-cache',
//   } as any);

//   const { data } = useCurrentUserQuery();

//   useEffect(() => {
//     if (data && data.currentUser) {
//       router.push('/bookmarks', '/bookmarks');
//     }
//   }, [router, data]);

//   const submit = (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     if (emailInput.current && passwordInput.current) {
//       post({ email: emailInput.current.value, password: passwordInput.current.value });
//     }
//     return false;
//   };

//   if (response.ok) {
//     if (response.data.accessToken) {
//       localStorage.setItem('accessToken', response.data.accessToken);
//       window.location.reload();
//     }
//   }

//   return (

//       <div className="sm:mx-auto sm:w-full sm:max-w-md">
//         <img
//           className="mx-auto h-12 w-auto"
//           src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
//           alt="Your Company"
//         />
//         <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">Sign in to your account</h2>
//       </div>

//       <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
//         <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
//           <form className="space-y-6" onSubmit={e => submit(e)}>
//             <FormGroup htmlFor="email" label="Email address">
//               <Input id="email" name="email" type="email" autoComplete="email" required ref={emailInput} />
//             </FormGroup>
//             <FormGroup htmlFor="password" label="Password">
//               <Input
//                 id="password"
//                 name="password"
//                 type="password"
//                 autoComplete="current-password"
//                 required
//                 ref={passwordInput}
//               />
//             </FormGroup>

//             {/* <div className="flex items-center justify-between">
//               <div className="flex items-center">
//                 <input
//                   id="remember-me"
//                   name="remember-me"
//                   type="checkbox"
//                   className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
//                 />
//                 <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
//                   Remember me
//                 </label>
//               </div>

//               <div className="text-sm">
//                 <a href="#" className="font-medium text-primary-600 hover:text-primary-500">
//                   Forgot your password?
//                 </a>
//               </div>
//             </div> */}

//             <div>
//               <Button intent="primary" type="submit" text="Sign in" size="medium" className="w-full" />
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }

// // This is used to override the default layout.
// SignInPage.getLayout = (page: ReactElement) => {
//   return page;
// };
