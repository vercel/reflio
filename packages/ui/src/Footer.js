import { Logo } from '@/components/Icons/Logo';
import { Github } from '@/components/Icons/Github'; 

export const Footer = () => {
  return (
    <footer className="py-12 bg-gray-200">
      <div className="wrapper">
        <div className="grid gap-y-10 gap-x-2 text-gray-500 sm:grid-cols-2 md:grid-cols-4">
          <div className="link-group">
            <nav>
              <ul className="flex flex-col gap-4 text-sm font-medium">
                <li>
                  <span className="font-bold block">Product</span>
                </li>
                <li>
                  <a
                    
                    href="https://senja.io/p/senja"
                    target="_blank"
                  >
                    Leave a testimonial
                  </a>
                </li>
                <li>
                  <a
                    
                    href="https://senja.io/p/senja/testimonials"
                    target="_blank"
                  >
                    Our Wall Of Love 💜
                  </a>
                </li>
                <li>
                  <a  href="/testimonial-widgets/">
                    Testimonial Widgets
                  </a>
                </li>
                <li>
                  <a
                    
                    href="https://senja.io/collect-testimonials"
                    target="_blank"
                  >
                    Collect testimonials
                  </a>
                </li>
                <li>
                  <a  href="/manage-testimonials">
                    Manage Testimonials
                  </a>
                </li>
              </ul>
            </nav>
          </div>
          <div className="link-group">
            <nav>
              <ul className="flex flex-col gap-4 text-sm font-medium">
                <li>
                  <span className="font-bold block">Development</span>
                </li>
                <li>
                  <a
                    
                    href="https://feedback.senja.io/feature-requests"
                    target="_blank"
                  >
                    Feedback
                  </a>
                </li>
                <li>
                  <a
                    
                    href="https://feedback.senja.io/"
                    target="_blank"
                  >
                    Roadmap
                  </a>
                </li>
                <li>
                  <a
                    
                    href="https://feedback.senja.io/changelog"
                    target="_blank"
                  >
                    Changelog
                  </a>
                </li>
              </ul>
            </nav>
          </div>
          <div className="link-group">
            <nav>
              <ul className="flex flex-col gap-4 text-sm font-medium">
                <li>
                  <span className="font-bold block">Senja for</span>
                </li>
                <li>
                  <a  href="/">
                    SaaS
                  </a>
                </li>
                <li>
                  <a  href="/freelancer-testimonials">
                    Freelancers
                  </a>
                </li>
                <li>
                  <a  href="/use-cases/more-demos">
                    Booking more demos
                  </a>
                </li>
                <li>
                  <a  href="/use-cases/increase-sign-ups">
                    Increasing sign ups
                  </a>
                </li>
                <li>
                  <a  href="/use-cases/close-more-sales">
                    Closing more sales
                  </a>
                </li>
                <li>
                  <a  href="/use-cases/increase-checkouts">
                    Increasing checkouts
                  </a>
                </li>
                <li>
                  <a
                    
                    href="/use-cases/get-more-job-applicants"
                  >
                    Getting more job applicants
                  </a>
                </li>
                <li>
                  <a  href="/use-cases/get-more-visitors">
                    Getting more visitors
                  </a>
                </li>
                <li>
                  <a  href="/use-cases/activate-more-sign-ups">
                    Activating more signups
                  </a>
                </li>
              </ul>
            </nav>
          </div>
          <div className="link-group">
            <nav>
              <ul className="flex flex-col gap-4 text-sm font-medium">
                <li>
                  <span className="font-bold block">Compare</span>
                </li>
                <li>
                  <a  href="/testimonial-to-alternative">
                    Testimonial.to alternative
                  </a>
                </li>
                <li>
                  <span className="font-bold block">Resources</span>
                </li>
                <li>
                  <a
                    
                    href="https://senja.io/landing-page-course"
                  >
                    Course: Build a landing page
                  </a>
                </li>
                <li>
                  <a  href="/blog">
                    Blog
                  </a>
                </li>
                <li>
                  <a  href="/blog/how-to-collect-testimonials">
                    How makers collect testimonials
                  </a>
                </li>
                <li>
                  <a
                    
                    href="/blog/testimonial-collection-software"
                  >
                    Testimonial collection software
                  </a>
                </li>
                <li>
                  <a
                    
                    href="https://senja.io/blog/saas-testimonials"
                  >
                    SaaS testimonials
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;