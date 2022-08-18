import { CheckIcon, XIcon } from '@heroicons/react/solid';

export const PricingFeatures = ({ productName }) => {

  if(!productName) return false;

  const capitalizedName = productName.charAt(0).toUpperCase() + productName.slice(1);

  const features = {
    "Indie": [
      {
        text: '200 affiliates',
        type: 'eligible'
      },
      {
        text: '2 companies',
        type: 'eligible'
      },
      {
        text: '4 campaigns',
        type: 'eligible'
      },
      {
        text: 'Stripe auto sync',
        type: 'eligible'
      },
      {
        text: 'PayPal Mass Payouts',
        type: 'eligible'
      },
      {
        text: 'Live chat & email support',
        type: 'eligible'
      },
      {
        text: 'Invite team members',
        type: 'ineligible'
      }
    ],
    "Pro": [
      {
        text: '500 affiliates',
        type: 'eligible'
      },
      {
        text: '5 companies',
        type: 'eligible'
      },
      {
        text: '10 campaigns',
        type: 'eligible'
      },
      {
        text: '3 team members',
        type: 'eligible'
      },
      {
        text: 'Stripe auto sync',
        type: 'eligible'
      },
      {
        text: 'PayPal Mass Payouts',
        type: 'eligible'
      },
      {
        text: 'Live chat & email support',
        type: 'eligible'
      }
    ],
    "Team": [
      {
        text: '2000 affiliates',
        type: 'eligible'
      },
      {
        text: '10 companies',
        type: 'eligible'
      },
      {
        text: 'Unlimited campaigns',
        type: 'eligible'
      },
      {
        text: '20 team members',
        type: 'eligible'
      },
      {
        text: 'Stripe auto sync',
        type: 'eligible'
      },
      {
        text: 'PayPal Mass Payouts',
        type: 'eligible'
      },
      {
        text: 'Priority live chat & email support',
        type: 'eligible'
      }
    ]
  };

  return(
    <ul role="list" className="space-y-3">
      {
        features[capitalizedName].map((feature, index) => {
          return(
            <li key={index} className={`${feature.type === 'ineligible' && 'opacity-50'} flex space-x-2`}>
              {
                feature.type === 'eligible' ?
                  <CheckIcon className={`${capitalizedName === "Pro" ? 'text-white' : 'text-green-600'} h-6 w-6`}/>
                : <XIcon className={`${capitalizedName === "Pro" ? 'text-white' : 'text-gray-500'} h-6 w-6`}/>
              }
              <span className={`${capitalizedName === "Pro" ? 'text-white' : 'text-gray-500'} text-base`}>{feature.text}</span>
            </li>
          )
        })
      }
    </ul>
  )
};

export default PricingFeatures;