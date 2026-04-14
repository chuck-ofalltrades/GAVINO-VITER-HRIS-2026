import React from "react";
import { FaIndent } from "react-icons/fa";
import { MdOutlineLogout, MdOutlineMailOutline } from "react-icons/md";
import { devNavUrl, urlDeveloper } from "../functions/functions-general";

const Header = () => {
  const [loading, setLoading] = React.useState(false);
  const [show, setShow] = React.useState(false);
  const isMobileOrTablet = window.matchMedia("(max-width:1027px)").matches;
  const [smallScreen, setSmallScreen] = React.useState(window.innerWidth);
  const ref = React.useRef(null);
  const link = `${devNavUrl}/${urlDeveloper}`;
  const menuRef = React.useRef(null);

  const roleIsDeveloper = true;
  const firstName = roleIsDeveloper ? "John" : "James";
  const lastName = roleIsDeveloper ? "Doe" : "Gun";
  const email = roleIsDeveloper ? "john@gmail.com" : "gun@gmail.com";
  const nickName = "JD";

  const handleShowNavigation = () => {};
  const handleLogout = () => {};

  return (
    <>
      <div className="print:hidden fixed z-[52] bg-white w-full flex justify-between items-center h-16 border-solid border-b-2 border-primary px-2">
        <div className="flex items-center lg:w-full lg:justify-normal relative z-10">
          <div className="group-hover:opacity-20 flex items-center lg:justify-start lg:min-h-[44px] lg:min-w-[170px] max-h-[44px] max-w-[170px] m-0.5">
            <button
              onClick={handleShowNavigation}
              className="py-4 pl-1 pr-4 text-gray-600 bg-white z-50 flex items-center rounded-br-sm focus:outline-0 cursor-pointer duration-200 ease-in"
            >
              <FaIndent />
            </button>

            <div className="pl-1">
              <img src={null} alt="" />
            </div>
          </div>
        </div>

        <div className="header__avatar pr-0 lg:pr-1" ref={ref}>
          <div
            className="flex items-center pr-2 px-1 gap-2 xl:py-2 lg:pl-4 group cursor-pointer"
          >
            <div
              className={`p-[1px] duration-[50ms] ease-out border-2 border-transparent hover:border-2 hover:border-primary hover:border-opacity-50 rounded-full ${
                show ? "!border-primary" : "!border-opacity-50"
              }`}
            >
              <div className="flex bg-primary rounded-full justify-center items-center min-w-[2rem] min-h-[2rem] max-w-[2rem] max-h-[2rem] text-white pt-0.5 uppercase">
                {nickName}
              </div>
            </div>
          </div>

          <div
            className={`dropdown ${
              show ? "active" : "inactive"
            } p-2 min-w-[250px] overflow-hidden rounded-md fixed right-4 drop-shadow-sm border border-gray-200 bg-white z-20 transition-all ease-in-out duration-200 transform -translate-x-1 block`}
            ref={menuRef}
          >
            <div className="text-xs p-1">
              <ul className="p-2">
                <li className="mb-0 font-bold capitalize text-sm">
                  {firstName} {lastName}
                </li>

                <li className="mb-0 pb-2 capitalize text-xs">Developer</li>

                <li className="pb-2 flex items-center gap-2 text-xs">
                  <MdOutlineMailOutline />
                  {email}
                </li>

                <button
                  onClick={handleLogout}
                  className="hover:text-primary flex items-center gap-2 pt-2 w-full"
                >
                  <MdOutlineLogout />
                  Logout
                </button>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;