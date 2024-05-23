import TopBar from './Topbar';
// import { FaList } from "react-icons/fa";

function Pic() {
  return (
    // object-scale-down
    <img className="aspect-square " src="https://plus.unsplash.com/premium_photo-1666788168087-eff21b648ddd?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="photography" />
  )
}

// function Pic({ src, alt }: { src: string, alt: string }) {
//   return (
//     <img className="aspect-square" src={src} alt={alt} />
//   );
// }

// const images = [
//   { src: "https://plus.unsplash.com/premium_photo-1666788168087-eff21b648ddd?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", alt: "Photography 1" },
//   { src: "https://plus.unsplash.com/premium_photo-1666788168087-eff21b648ddd?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", alt: "Photography 2" },
//   { src: "https://plus.unsplash.com/premium_photo-1666788168087-eff21b648ddd?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", alt: "Photography 3" },
//   // Add more image objects as needed
// ];
function Photography() {

  const pics = new Array(60).fill(null);

  return (
    <>
      <div className="h-screen w-screen text-xs font-normal pt-10 relative">
        <TopBar />
        {/* <div className='border-y border-neutral-300 py-2 px-6 items-center'> 
        <FaList className='size-5 ml-auto'/>

        </div> */}
        <div className='hidden xl:w-1/3 xl:flex absolute  ml-1 h-max pt-12'>
          <div className='overflow-hidden aspect-square'>
            <img className="object-fill" src="https://plus.unsplash.com/premium_photo-1666788168087-eff21b648ddd?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="photography" />
          </div>
        </div>

        <div className="h-full w-screen xl:w-2/3 px-1 xl:ml-auto xl:pl-2">
          <div className='grid grid-cols-6 xl:grid-cols-8 3xl:grid-cols-10 gap-0.5 '>
            {pics.map((_, index) => (
              <Pic key={index} />
            ))}
          </div>
          <div className='h-1'>
          </div>

        </div>
      </div>
    </>
  );
}

export default Photography;