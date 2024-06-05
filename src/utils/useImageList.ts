import { useEffect, useState } from 'react';
import axios from 'axios';

interface urllst {
  filename: string;
  id: string;
  requireSignedURLs: boolean;
  variants: string[];
  uploaded: string;
}

export function useImageList() {
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    axios.get('https://hangqicui.com/api/photography_image_list')
      .then((response) => {
        const urlist: urllst[] = response.data.result.images;
        const arry = urlist.flatMap((url) => url.variants);
        setImageUrls(arry);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, []);

  return { imageUrls, loading };
}