import { Logo } from '@/components/Icons/Logo';
import { Github } from '@/components/Icons/Github'; 

export const Footer = () => {
  return (
    <footer className="border-t-4 border-gray-200 text-center" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="wrapper py-14">
        <div>
          <div className="space-y-5 mb-3">
            <Logo className="h-6 w-auto mx-auto"/>
            <p className="text-gray-500 text-base">
              Create a privacy-friendly affiliate program for your SaaS in minutes, from $0 month.
            </p>
          </div>
          <div>
            <ul className="sm:flex sm:space-x-4 sm:justify-center">
              <li><a className="mt-2 underline text-gray-500" href="/terms">Terms</a></li>
              <li><a className="mt-2 underline text-gray-500" href="https://reflio.canny.io/" target="_blank" rel=" noreferrer">Roadmap</a></li>
              <li><a className="mt-2 underline text-gray-500" href="https://reflio.canny.io/feature-requests" target="_blank" rel=" noreferrer">Feedback</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-6">
          <p className="text-gray-500 text-sm">&copy; 2022 Reflio (McIlroy Limited).</p>
          <div className="flex items-center justify-center mt-2">
            <a href="https://github.com/Reflio-com/reflio" target="_blank" rel="noreferrer">
              <Github className="h-5 w-auto"/>
            </a>
            {/* <a href="/terms" className="hover:underline text-xs mx-1 text-gray-500 hover:text-gray-400">Terms</a> */}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;