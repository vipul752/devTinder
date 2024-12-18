import { Outlet } from "react-router-dom";
import NavBar from "./NavBar";

const Body = () => {
  return (
    <div className="overflow-y-hidden">
      <NavBar />
      <Outlet />
    </div>
  );
};

export default Body;
