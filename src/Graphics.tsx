
import TopBar from './Topbar';
import Bunny from './Graphicses/normalCurvature';
import Shader from './Graphicses/shader0';

function Graphics() {
  const pics = [Bunny, Shader]
  return (
    <>
      <div className="h-screen w-screen text-xs font-normal pt-10 ">
        <TopBar />
        <div className="h-full w-screen p-1">
          <div className='grid grid-cols-2 xl:grid-cols-3 gap-0.5 '>
            {pics.map((PicComponent, index) => (
              <PicComponent key={index} />
            ))}
          </div>
          <div className='h-1'>
          </div>

        </div>
      </div>
    </>
  );
}

export default Graphics;