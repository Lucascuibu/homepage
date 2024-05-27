import { useEffect, useState } from 'react';
import axios from 'axios';
import { useInView } from 'react-intersection-observer';

const contain_flag = true;

function Pic({ src, alt, onClick }: { src: string, alt: string, onClick: () => void }) {
  return (
    <img onClick={onClick}
      className={`aspect-square w-full h-full relative cursor-pointer  mx-auto ${contain_flag ? "object-contain" : "object-cover"}`}
      src={src}
      alt={alt}
    />
  );
}

interface urllst {
  filename: string;
  id: string;
  requireSignedURLs: boolean;
  variants: string[];
  uploaded: string;
}

function Photography() {
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [visibleUrls, setVisibleUrls] = useState<string[]>([]);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [displayindex, setDisplayIndex] = useState<number>(0);
  const { ref, inView } = useInView({
    threshold: 1,
    triggerOnce: false,
  });

  useEffect(() => {
    axios.get('https://hangqicui.com/api/photography_image_list')
      .then((response) => {
        const urlist: urllst[] = response.data.result.images;
        const arry = urlist.flatMap((url) => url.variants);
        setImageUrls(arry);
        setVisibleUrls(arry.slice(0, 10));
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {

    if (inView && !loading && imageUrls.length > visibleUrls.length) {
      setLoading(true); // Start loading before the async operation to prevent re-triggering
      const nextPage = page + 1;
      const newUrls = imageUrls.slice(visibleUrls.length, visibleUrls.length + 10); // Only load the next 10 images
      setVisibleUrls(prevUrls => [...prevUrls, ...newUrls]); // Append new images to the existing visible images
      setPage(nextPage);
      setTimeout(() => setLoading(false), 500); // Ensure loading is reset after some time
    }
  }, [inView, loading, page, imageUrls, visibleUrls]);


  return (
    <>
      <div className='hidden xl:w-1/3 xl:flex fixed ml-1 my-auto pt-12 '>
        <div className='aspect-square justify-center mx-auto border-0'>
          <img
            className={`aspect-square w-full h-full relative cursor-pointer  mx-auto ${contain_flag ? "object-contain" : "object-cover"}`}
            src={visibleUrls[displayindex]}
            alt={`Photography ${displayindex + 1}`}
          />
        </div>
      </div>

      <div className="w-screen xl:w-2/3 px-1 xl:ml-auto xl:pl-2 pt-3">
        <div className='grid grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-0.5 *:overflow-clip'>
          {visibleUrls.map((url, index) => (
            url ? <Pic key={index} src={url} alt={`Photography ${index + 1}`} onClick={() => setDisplayIndex(index)} />
              : <div key={index} className="aspect-square bg-gray-200"></div>
          ))}
        </div>
      </div>
      <div className='w-screen' ref={ref}></div>

    </>
  );
}

export default Photography;