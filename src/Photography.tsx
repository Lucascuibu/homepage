import { useEffect, useState } from 'react';
import axios from 'axios';


const contain_flag = true;
// const view_mode_flag = false;
function Pic({ src, alt }: { src: string, alt: string }) {
  return (
    <img
      className={`aspect-square mx-auto ${contain_flag ? "object-contain" : "object-cover"}`}
      src={src}
      alt={alt}
    />
  );
}
interface urllst {
  filename: string
  id: string
  requireSignedURLs: boolean
  variants: string[]
  uploaded: string
}


function Photography() {
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  useEffect(() => {
    axios.get('https://hangqicui.com/api/photography_image_list')
      .then((response) => {
        const urlist: urllst[] = response.data.result.images;
        const arry = urlist.flatMap((url) => url.variants)
        setImageUrls(arry);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <>
      <div className='hidden xl:w-1/3 xl:flex absolute ml-1 h-max pt-12'>
        <div className='aspect-square justify-center mx-auto'>
          <Pic src={imageUrls[0]} alt="photography" />
        </div>
      </div>

      <div className="h-full w-screen xl:w-2/3 px-1 xl:ml-auto xl:pl-2">
        <div className='grid grid-cols-5 xl:grid-cols-6 gap-0.5'>
          {imageUrls.map((url, index) => (
            url ? <Pic key={index} src={url} alt={`Photography ${index + 1}`} /> : <div key={index} className="aspect-square bg-gray-200"></div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Photography;