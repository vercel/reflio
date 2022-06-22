export default function PricingSnippet() {
  return(
    <div id="pricing" className="bg-gradient-to-b from-primary to-primary-2 py-24 lg:py-32">
      <div className="max-w-6xl mx-auto">
        <div className="sm:flex sm:flex-col sm:align-center text-center mb-5">
          <div className="mb-12 text-white">
            <h2 className="text-4xl tracking-tight font-extrabold lg:text-5xl relative z-10 text-center mb-2">
              Pricing
            </h2>
            <p className="mt-4 font-light text-lg sm:text-2xl relative z-10">No hidden fees. No complicated plans.</p>
          </div>
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="w-full bg-gradient-to-b from-secondary to-secondary-2 border-4 border-secondary-2 shadow-xl rounded-xl p-8 text-left tracking-tight text-white">
              <h3 className="text-3xl mb-2 font-bold">PRO ($14/month)</h3>
              <p className="text-lg mb-2">Perfect for establised web apps and production environments.</p>
              <ul className="fancy-list mb-6">
                <li className="text-xl font-semibold">Unlimited submissions</li>
                <li className="text-xl font-semibold">Unlimited companies</li>
                <li className="text-xl font-semibold">Custom embed styling</li>
                <li className="text-xl font-semibold">Remove Reflio companying</li>
                <li className="text-xl font-semibold">Automatically collect user console errors</li>
              </ul>
              <a
                href="/pricing"
                className="inline-block border-4 border-secondary rounded-xl bg-white hover:bg-secondary hover:text-white hover:border-white text-gray-900 text-lg px-6 font-semibold py-3 transition-all"
              >
                Get Started
              </a>
            </div>
            <div className="w-full bg-white border-4 border-gray-200 shadow-xl rounded-xl p-8 text-left tracking-tight">
              <h3 className="text-3xl mb-2 font-bold">Free</h3>
              <p className="text-lg text-gray-600 mb-2">100% free to setup and start collecting submissions. Suitable for indie makers and smaller companies.</p>
              <ul className="fancy-list mb-6">
                <li className="text-xl font-semibold">15 free submissions</li>
                <li className="text-xl font-semibold">1 free company</li>
              </ul>
              <a
                href="/#intro"
                className="inline-block border-4 border-gray-400 rounded-xl bg-gray-300 hover:bg-gray-400 text-lg px-6 font-semibold py-3 transition-all"
              >
                Get Started
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}