import { useSEO } from '@/hooks/useSEO';
import { seoConfig } from '@/lib/seoConfig';
import { supabase } from '@/lib/supabase';
import { CheckCircle2 } from 'lucide-react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  let token;
  useEffect(() => {
    const authToken = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      token = session?.access_token;
    }

    authToken();
  }, [])

  useSEO({
    title: seoConfig.home.title,
    description: seoConfig.home.description,
    keywords: seoConfig.home.keywords,
    canonical: seoConfig.home.canonical,
    image: '/og-home.jpg'
  });

  return (
    <>
      <div className="min-h-screen bg-white text-black flex flex-col items-center w-screen">
        <header className="w-full flex justify-end-safe items-end py-6 gap-4 px-46">
          {/* <div className="flex items-center space-x-2">
          <h1 className="text-3xl font-bold">WEALTHNOMIC</h1>
          <img src="./logo-black.png" alt="Wealthnomic Bear Logo" className="w-[79px] h-[43px]" />
        </div> */}
          <div className='flex gap-18'>
            <button
              className="text-lg font-medium underline"
            >
              About Us
            </button>
            {token ? (<button
              className="text-lg font-medium underline"
              onClick={() => { navigate('/login'); }}
            >
              Login <CheckCircle2 />
            </button>) : <button
              className="text-lg font-medium underline"
              onClick={() => { navigate('/login'); }}
            >
              Login
            </button>}
            {/* <button
              className="text-lg font-medium underline"
              onClick={() => { navigate('/login'); }}
            >
              Login
            </button> */}
          </div>
        </header>

        <main className="flex-grow flex flex-col items-center justify-center pt-16 pb-24 relative w-full">
          <div className="flex flex-col justify-center items-center space-x-2 py-3 rounded-full w-4/5 max-w-lg mb-20 relative">
            <div className='flex flex-col justify-center items-center'>
              <img src="./logo-black.png" alt="Wealthnomic Bear Logo" className="w-[213px] h-[115px]" />
              <h1 className="text-8xl font-bold text-[#303030]">WEALTHNOMIC</h1>
            </div>
            <div>
              <span className="text-2xl text-[#808080]">Made with love for all investors and traders</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-46 mt-36 mx-auto">
            <div className="flex flex-col items-center text-center">
              <img src="./fundamental.png" alt="Fundamental Logo" className='w-[74px] h-[74px] font-light' />
              <span className="mt-2 text-lg font-medium">Fundamental</span>
            </div>
            <div className="flex flex-col items-center text-center cursor-pointer" onClick={() => { navigate('/option-trading'); }}>
              <img src="./options.png" alt="Options Logo" className='w-[74px] h-[74px] font-light' />
              <span className="mt-2 text-lg font-medium">Options</span>
            </div>
            <div className="flex flex-col items-center text-center cursor-pointer" onClick={() => { navigate('/stock-screener') }}>
              <img src="./technical.png" alt="Technicals Logo" className='w-[74px] h-[74px] font-light' />
              <span className="mt-2 text-lg font-medium">Technicals</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <img src="./indian-market.png" alt="Indian Markets Logo" className='w-[74px] h-[74px] font-light' />
              <span className="mt-2 text-lg font-medium">Indian Markets</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <img src="./global-market.png" alt="Global Markets Logo" className='w-[74px] h-[74px] font-light' />
              <span className="mt-2 text-lg font-medium">Global Markets</span>
            </div>
            <div className="flex flex-col items-center text-center cursor-pointer" onClick={() => { navigate('/charts') }}>
              <img src="./bullish.png" alt="Bullish Logo" className='w-[74px] h-[74px] font-light' />
              <span className="mt-2 text-lg font-medium">Technical Analysis</span>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Home;