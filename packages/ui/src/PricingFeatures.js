import { CheckIcon, XIcon } from '@heroicons/react/solid';

export const PricingParams = () => {
  return({
    "free": {
      "companies": 1,
      "campaigns": 1,
      "affiliates": 100
    },
    "indie": {
      "companies": 2,
      "campaigns": 4,
      "affiliates": 100
    },
    "pro": {
      "companies": 3,
      "campaigns": 6,
      "affiliates": 500
    },
    "team": {
      "companies": 10,
      "campaigns": 30,
      "affiliates": 2000
    }
  })
}

export const PricingFeatures = ({ productName, normal }) => {

  if(!productName) return false;

  const capitalizedName = productName.charAt(0).toUpperCase() + productName.slice(1);

  const plans = PricingParams();

  const features = {
    "Free": [
      {
        text: `${plans?.free?.affiliates} ${plans?.free?.affiliates > 1 ? 'affiliates' : 'affiliate'}`,
        type: 'eligible'
      },
      {
        text: `${plans?.free?.companies} ${plans?.free?.companies > 1 ? 'companies' : 'company'}`,
        type: 'eligible'
      },
      {
        text: `${plans?.free?.campaigns} ${plans?.free?.campaigns > 1 ? 'campaigns' : 'campaign'}`,
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
    "Indie": [
      {
        text: `${plans?.indie?.affiliates} ${plans?.indie?.affiliates > 1 ? 'affiliates' : 'affiliate'}`,
        type: 'eligible'
      },
      {
        text: `${plans?.indie?.companies} ${plans?.indie?.companies > 1 ? 'companies' : 'company'}`,
        type: 'eligible'
      },
      {
        text: `${plans?.indie?.campaigns} ${plans?.indie?.campaigns > 1 ? 'campaigns' : 'campaign'}`,
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
        text: `${plans?.pro?.affiliates} ${plans?.pro?.affiliates > 1 ? 'affiliates' : 'affiliate'}`,
        type: 'eligible'
      },
      {
        text: `${plans?.pro?.companies} ${plans?.pro?.companies > 1 ? 'companies' : 'company'}`,
        type: 'eligible'
      },
      {
        text: `${plans?.pro?.campaigns} ${plans?.pro?.campaigns > 1 ? 'campaigns' : 'campaign'}`,
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
        text: `${plans?.team?.affiliates} ${plans?.team?.affiliates > 1 ? 'affiliates' : 'affiliate'}`,
        type: 'eligible'
      },
      {
        text: `${plans?.team?.companies} ${plans?.team?.companies > 1 ? 'companies' : 'company'}`,
        type: 'eligible'
      },
      {
        text: `${plans?.team?.campaigns} ${plans?.team?.campaigns > 1 ? 'campaigns' : 'campaign'}`,
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
                  <CheckIcon className={`${capitalizedName === "Pro" && !normal ? 'text-white' : 'text-green-600'} h-6 w-6`}/>
                : <XIcon className={`${capitalizedName === "Pro" && !normal ? 'text-white' : 'text-gray-500'} h-6 w-6`}/>
              }
              <span className={`${capitalizedName === "Pro" && !normal ? 'text-white' : 'text-gray-500'} text-base`}>{feature.text}</span>
            </li>
          )
        })
      }
    </ul>
  )
};

export default PricingFeatures;