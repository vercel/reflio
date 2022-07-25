import { Logo } from './icons/Logo';
import Link from 'next/link';
import { useUser } from '../../../apps/reflio/utils/useUser';

export const SimpleNav = (props) => {
  const { signOut } = useUser();

  return(
    <nav className="py-5 flex justify-between items-center wrapper bg-transparent">
      <Link href="/">
        <a>
          <Logo className="h-10 w-auto mx-auto"/>
        </a>
      </Link>
      <a
        onClick={() => signOut()}
        href="#"
        className="underline text-lg"
      >
        Sign out
      </a>
    </nav>
  )
};

export default SimpleNav;