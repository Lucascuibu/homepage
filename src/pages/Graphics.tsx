import cloud from '../Graphicses/normalCurvature';
import Shader from '../Graphicses/shader0';
import Bunny from '../Graphicses/Bunny';

function Graphics() {
  const pics = [Bunny, cloud, Shader]
  return (
    <>
      <div className="h-full w-screen p-1">
        {/* {sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4} */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-0.5 *:border *:border-black *:aspect-square'>
          {pics.map((PicComponent, index) => (
            <PicComponent key={index} />
          ))}
        </div>
        <div className='h-1'>
        </div>

      </div>
    </>
  );
}

export default Graphics;