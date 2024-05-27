import Bunny from './Graphicses/normalCurvature';
import Shader from './Graphicses/shader0';

function Graphics() {
  const pics = [Bunny, Shader]
  return (
    <>
      <div className="h-full w-screen p-1">
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-0.5 '>
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