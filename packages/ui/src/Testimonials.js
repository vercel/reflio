import Image from 'next/image';

export const Testimonials = (props) => {
  return(
    <div id="testimonials">
      <dl className="space-y-10 md:grid md:gap-y-20 md:space-y-0 md:grid-cols-2 md:gap-x-20">
        <div>
          <dt>
            <img className="w-14 md:w-16 h-auto rounded-full mb-3" src="/testimonials/maxwellcdavis.jpeg"/>
            <p className="text-xl md:text-2xl text-gray-700">Great stuff - a space that needs a cost effective product!</p>
          </dt>
          <dd className="mt-4 text-lg md:text-xl font-medium text-gray-500">@maxwellcdavis</dd>
        </div>
        <div>
          <dt>
            <img className="w-14 md:w-16 h-auto rounded-full mb-3" src="/testimonials/foliofed.jpeg"/>
            <p className="text-xl md:text-2xl text-gray-700">Reflio.com by @richiemcilroy is privacy conscious and doesn't break the bank. It's still in beta but I'm excited about it.</p>
          </dt>
          <dd className="mt-4 text-lg md:text-xl font-medium text-gray-500">@foliofed</dd>
        </div>
        <div>
          <dt>
            <img className="w-14 md:w-16 h-auto rounded-full mb-3" src="/testimonials/briansaetre.jpeg"/>
            <p className="text-xl md:text-2xl text-gray-700">Fun idea. I've been looking for an affordable service like this too. Wasn't impressed by the market's current offerings the last time I looked. Great domain name too!</p>
          </dt>
          <dd className="mt-4 text-lg md:text-xl font-medium text-gray-500">@BrianSaetre</dd>
        </div>
        <div>
          <dt>
            <img className="w-14 md:w-16 h-auto rounded-full mb-3" src="/testimonials/_thunk_.jpeg"/>
            <p className="text-xl md:text-2xl text-gray-700">Richie, I've just seen this thread on Reflio. Great idea and it looks mint!</p>
          </dt>
          <dd className="mt-4 text-lg md:text-xl font-medium text-gray-500">@_thunk_</dd>
        </div>
      </dl>
    </div>
  )
};

export default Testimonials;