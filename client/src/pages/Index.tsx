import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  return (
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
          <button
            className="text-lg font-medium underline"
            onClick={() => { navigate('/login'); }}
          >
            Login
          </button>
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
          <div className="flex flex-col items-center text-center cursor-pointer" onClick={() => { navigate('/dashboard'); }}>
            <img src="./options.png" alt="Options Logo" className='w-[74px] h-[74px] font-light' />
            <span className="mt-2 text-lg font-medium">Options</span>
          </div>
          <div className="flex flex-col items-center text-center">
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
        </div>
      </main>
    </div>
  );
};

export default Home;