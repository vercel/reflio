import Logo from '@/components/icons/Logo';

export default function Footer() {
  return (
    <footer aria-labelledby="footer-heading">
      <div className="wrapper wrapper-max py-8">
        <div className="mt-6 text-center">
          <p className="text-gray-500 text-sm">&copy; 2022 Reflio (McIlroy Limited). All rights reserved.</p>
          <div className="flex items-center justify-center mt-2">
            <a href="/privacy" className="hover:underline text-xs mx-1 text-gray-500 hover:text-gray-400">Privacy</a>
            <a href="/terms" className="hover:underline text-xs mx-1 text-gray-500 hover:text-gray-400">Terms</a>
            <a href="/changelog" className="hover:underline text-xs mx-1 text-gray-500 hover:text-gray-400">Changelog</a>
          </div>
        </div>
      </div>
    </footer>
  );
}