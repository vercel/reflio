import Logo from '@/components/icons/Logo';
import Github from '@/components/icons/Github'; 

export const Footer = () => {
  return (
    <footer className="border-t-4 border-gray-200 text-center" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="wrapper py-14">
        <div>
          <div className="space-y-5">
            <Logo className="h-6 w-auto mx-auto"/>
            <p className="text-gray-500 text-base">
              Create a privacy-friendly referral program for your SaaS.
            </p>
          </div>
          <a className="mt-2 block underline text-gray-500" href="mailto:richie@reflio.com">Have a question? Get in touch</a>
        </div>
        <div className="mt-6">
          <p className="text-gray-500 text-sm">&copy; 2022 Reflio (McIlroy Limited).</p>
          <div className="flex items-center justify-center mt-2">
            <a href="https://github.com/Reflio-com/reflio" target="_blank">
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