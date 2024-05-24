import { useEffect, useState } from 'react';
import TopBar from './Topbar';
import axios from 'axios';

function Pic({ src, alt }: { src: string, alt: string }) {
  return (
    <img className="aspect-square" src={src} alt={alt} />
  );
}

function Photography() {
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  useEffect(() => {
    axios.get('https://my-cloudflare-worker.chqyy4.workers.dev/')
      .then((response) => {
        const url = response.data.result.images[0].variants[0];
        const arry = new Array(30).fill(url);
        setImageUrls(arry);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <div className="h-screen w-screen text-xs font-normal pt-10 relative">
      <TopBar />
      <div className='hidden xl:w-1/3 xl:flex absolute ml-1 h-max pt-12'>
        <div className='overflow-hidden aspect-square'>
          <img className="object-fill" src="https://plus.unsplash.com/premium_photo-1666788168087-eff21b648ddd?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="photography" />
        </div>
      </div>

      <div className="h-full w-screen xl:w-2/3 px-1 xl:ml-auto xl:pl-2">
        <div className='grid grid-cols-5 xl:grid-cols-6 gap-0.5'>
          {imageUrls.map((url, index) => (
            url ? <Pic key={index} src={url} alt={`Photography ${index + 1}`} /> : <div key={index} className="aspect-square bg-gray-200"></div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Photography;