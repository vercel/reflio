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
      <div>
        {
          products !== null &&
          <Pricing products={products}/>
        }
      </div>
    </>
  );

}