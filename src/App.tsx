import _ from "lodash";
import TopBar from './Topbar';
import { Outlet } from "react-router-dom";


function App() {
  return (
    <>
      <div className="min-h-screen w-screen text-xs font-normal pt-10  bg-background text-foreground">
        <TopBar />
        <Outlet />
      </div>
     
    </>
  );
}

export default App;