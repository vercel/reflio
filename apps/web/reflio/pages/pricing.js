import { useEffect, useState, useRef } from 'react';
import Pricing from '@/components/Pricing';
import { getActiveProductsWithPrices } from '@/utils/supabase-client';
import SEOMeta from '@/components/SEOMeta'; 
import LoadingDots from '@/components/ui/LoadingDots';

export default function Products() {

  const [products, setProducts] = useState(null);

  const getProducts = async () => {
    setProducts(await getActiveProductsWithPrices());
  };

  useEffect(() => {
    {
      products == null &&
      getProducts();
    }
  }, [products]);
  
  return(
    <>
      <SEOMeta 
        title="Pricing"
      />
      <div className="relative bg-gradient-to-b from-secondary to-secondary-2 py-24">
        <div className="wrapper">
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">Pricing</h1>
          </div>
          {
            products !== null ?
              <Pricing products={products}/>
            :
              <div className="flex items-center justify-center">
                <LoadingDots/>
              </div>
          }
        </div>
      </div>
    </>
  );

}