import { useEffect, useState, useRef } from 'react';
import Pricing from '@/components/Pricing';
import { getActiveProductsWithPrices } from '@/utils/supabase-client';
import SEOMeta from '@/components/SEOMeta'; 

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
      <div className="relative bg-gradient-to-b from-primary-2 to-primary py-24">
        <div className="wrapper">
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold">Pricing</h1>
          </div>
          {
            products !== null &&
            <Pricing products={products}/>
          }
        </div>
      </div>
    </>
  );

}