import React, {useEffect, useState} from "react";
import Dropdown from "components/dropdown";
import { FiAlignJustify } from "react-icons/fi";
import {Link, useNavigate} from "react-router-dom";
import navbarimage from "assets/img/layout/Navbar.png";
import { BsArrowBarUp } from "react-icons/bs";
import { FiSearch } from "react-icons/fi";
import { RiMoonFill, RiSunFill } from "react-icons/ri";
import {
  IoMdNotificationsOutline,
  IoMdInformationCircleOutline,
} from "react-icons/io";
import avatar from "assets/img/avatars/avatar4.png";
import axios from "axios";
import bmti from "../../../views/student/login/images/2.jpg";
import {MdFormatListBulleted, MdOutlineCheckBox, MdOutlineNavigateNext, MdSend} from "react-icons/md";
import ApiCall from "../../../config";


const Navbar = (props) => {
  const navigate = useNavigate()
  const { onOpenSidenav, brandText } = props;
  const [darkmode, setDarkmode] = React.useState(false);
  const [user, setUser] = useState({})
  useEffect(() => {
    const token = localStorage.getItem('authToken');

    sendData(token).then(r =>console.log("d") ).catch(e=>navigate("/student/login"))
  }, []);

  const sendData = async (token) => {
    if(token==null){
      navigate("/student/login")
    }
    try {
      const dataStudent = await ApiCall('/api/v1/student/account/'+token, "GET");
      setUser(dataStudent.data)
      if(dataStudent.error){

        navigate("/student/login")
      }
    } catch (error) {
      navigate("/student/login")
      console.error('Error fetching student data or posting to server:', error);
    }
  };

  return (
    <nav className="sticky top-0 z-40 flex flex-row flex-wrap items-center justify-between rounded-xl bg-white/5 shadow-sm items-center p-4 pt-0 backdrop-blur-2xl dark:bg-[#0b14374d]">
      <div className="ml-[6px]">

        <p className="shrink text-[30px] capitalize text-navy-700 dark:text-white">
          <Link
              to="/student"
              className="font-bold capitalize hover:text-navy-700 dark:hover:text-white"
          >
            {/*<img*/}
            {/*    style={{borderRadius:"50%"}}*/}
            {/*    className=" sm:w-20  xs:w-10 w-24" // Adjust width for different screen sizes*/}
            {/*    src={bmti}*/}
            {/*    alt="tailus stats and login components"*/}
            {/*/>*/}
          </Link>
        </p>

      </div>



      <Dropdown
          button={
            <p className="cursor-pointer flex items-center border-2 p-[4px] rounded-xl">
              <MdFormatListBulleted className="h-4 w-4 text-gray-600 dark:text-white"/>
              <p className={" text-gray-600 dark:text-white"}>Foydalanuvchi menusi</p>
            </p>
          }
          animation="origin-[65%_0%] md:origin-top transition-all duration-300 ease-in-out"
          children={
            <div className="flex w-[200px] h-[160px] flex-col gap-3 rounded-[20px] bg-white p-4 shadow-xl shadow-shadow-500 dark:!bg-navy-700 dark:text-white dark:shadow-none sm:w-[200px]">

              <Link to={"/student/user"} className="cursor-pointer hover:!bg-gray-50 text-[14px]  font-medium dark:text-white w-full sm:w-auto border-b-2">
                Mening profilim
              </Link>

              <Link to={"/student/appeals"} className="cursor-pointer hover:!bg-gray-50 text-[14px]  font-medium dark:text-white w-full sm:w-auto border-b-2">
                Mening Arizalarim
              </Link>
              <Link to={"/student/debt"} className=" cursor-pointer hover:!bg-gray-50 text-[14px]  font-medium dark:text-white w-full  border-b-2 sm:w-auto">
                Fandan qarzdorlik
              </Link>

              <p  onClick={()=>{
                navigate("/student/login")
                localStorage.clear()
              }} className="  text-[14px] cursor-pointer hover:!bg-gray-50 font-medium dark:text-white w-full sm:w-auto border-b-2">
                Tizimdan chiqish
              </p>


            </div>
          }
          classNames={"py-2 top-10 w-max"}
      />













      <div className="relative mt-[10px] flex h-[50px] w-[255px] flex-grow items-center justify-around gap-2 rounded-full bg-white px-2  shadow-xl shadow-shadow-500 dark:!bg-navy-800 dark:shadow-none md:w-[255px] md:flex-grow-0 md:gap-1 xl:w-[205px] xl:gap-2">

        <span
            className="flex cursor-pointer text-xl text-gray-600 dark:text-white xl:hidden"
            onClick={onOpenSidenav}
        >
          <FiAlignJustify className="h-5 w-5"/>
        </span>
        {/* start Notification */}
        <Dropdown
            button={
              <p className="cursor-pointer">
                <IoMdNotificationsOutline className="h-4 w-4 text-gray-600 dark:text-white"/>
              </p>
            }
            animation="origin-[65%_0%] md:origin-top-right transition-all duration-300 ease-in-out"
            children={
              <div
                  className="flex w-[360px] h-[100px] flex-col gap-3 rounded-[20px] bg-white p-4 shadow-xl shadow-shadow-500 dark:!bg-navy-700 dark:text-white dark:shadow-none sm:w-[460px]">
                {/*<div className="flex items-center justify-between">*/}
                {/*  <p className="text-base font-bold text-navy-700 dark:text-white">*/}
                {/*    Notification*/}
                {/*  </p>*/}
                {/*  <p className="text-sm font-bold text-navy-700 dark:text-white">*/}
                {/*    Barchasi*/}
                {/*  </p>*/}
                {/*</div>*/}
                Sizda yangi xabarlar yo'q

                {/*<button className="flex w-full items-center">*/}
                {/*  <div className="flex h-full w-[85px] items-center justify-center rounded-xl bg-gradient-to-b from-brandLinear to-brand-500 py-4 text-2xl text-white">*/}
                {/*    <BsArrowBarUp />*/}
                {/*  </div>*/}
                {/*  <div className="ml-2 flex h-full w-full flex-col justify-center rounded-lg px-1 text-sm">*/}
                {/*    <p className="mb-1 text-left text-base font-bold text-gray-900 dark:text-white">*/}
                {/*      New Update: Horizon UI Dashboard PRO*/}
                {/*    </p>*/}
                {/*    <p className="font-base text-left text-xs text-gray-900 dark:text-white">*/}
              {/*      A new update for your downloaded item is available!*/}
              {/*    </p>*/}
              {/*  </div>*/}
              {/*</button>*/}

              {/*<button className="flex w-full items-center">*/}
              {/*  <div className="flex h-full w-[85px] items-center justify-center rounded-xl bg-gradient-to-b from-brandLinear to-brand-500 py-4 text-2xl text-white">*/}
              {/*    <BsArrowBarUp />*/}
              {/*  </div>*/}
              {/*  <div className="ml-2 flex h-full w-full flex-col justify-center rounded-lg px-1 text-sm">*/}
              {/*    <p className="mb-1 text-left text-base font-bold text-gray-900 dark:text-white">*/}
              {/*      New Update: Horizon UI Dashboard PRO*/}
              {/*    </p>*/}
              {/*    <p className="font-base text-left text-xs text-gray-900 dark:text-white">*/}
              {/*      A new update for your downloaded item is available!*/}
              {/*    </p>*/}
              {/*  </div>*/}
              {/*</button>*/}
            </div>
          }
          classNames={"py-2 top-4 -left-[230px] md:-left-[440px] w-max"}
        />
        {/* start Horizon PRO */}
        <Dropdown
          button={
            <p className="cursor-pointer">
              <IoMdInformationCircleOutline className="h-4 w-4 text-gray-600 dark:text-white" />
            </p>
          }
          children={
            <div className="flex w-[350px] flex-col gap-2 rounded-[20px] bg-white p-4 shadow-xl shadow-shadow-500 dark:!bg-navy-700 dark:text-white dark:shadow-none">
              <div
                style={{

                  backgroundRepeat: "no-repeat",
                  backgroundSize: "cover",
                }}
                className="mb-2 aspect-video w-full rounded-lg"
              />

              {/*<a*/}
              {/*  target="blank"*/}
              {/*  href="https://horizon-ui.com/pro?ref=live-free-tailwind-react"*/}
              {/*  className="px-full linear flex cursor-pointer items-center justify-center rounded-xl bg-brand-500 py-[11px] font-bold text-white transition duration-200 hover:bg-brand-600 hover:text-white active:bg-brand-700 dark:bg-brand-400 dark:hover:bg-brand-300 dark:active:bg-brand-200"*/}
              {/*>*/}
              {/*  Buy Horizon UI PRO*/}
              {/*</a>*/}
              {/*<a*/}
              {/*  target="blank"*/}
              {/*  href="https://horizon-ui.com/docs-tailwind/docs/react/installation?ref=live-free-tailwind-react"*/}
              {/*  className="px-full linear flex cursor-pointer items-center justify-center rounded-xl border py-[11px] font-bold text-navy-700 transition duration-200 hover:bg-gray-200 hover:text-navy-700 dark:!border-white/10 dark:text-white dark:hover:bg-white/20 dark:hover:text-white dark:active:bg-white/10"*/}
              {/*>*/}
              {/*  See Documentation*/}
              {/*</a>*/}
              {/*<a*/}
              {/*  target="blank"*/}
              {/*  href="https://horizon-ui.com/?ref=live-free-tailwind-react"*/}
              {/*  className="hover:bg-black px-full linear flex cursor-pointer items-center justify-center rounded-xl py-[11px] font-bold text-navy-700 transition duration-200 hover:text-navy-700 dark:text-white dark:hover:text-white"*/}
              {/*>*/}
              {/*  Try Horizon Free*/}
              {/*</a>*/}
            </div>
          }
          classNames={"py-2 top-6 -left-[250px] md:-left-[330px] w-max"}
          animation="origin-[75%_0%] md:origin-top-right transition-all duration-300 ease-in-out"
        />
        <div
          className="cursor-pointer text-gray-600"
          onClick={() => {
            if (darkmode) {
              document.body.classList.remove("dark");
              setDarkmode(false);
            } else {
              document.body.classList.add("dark");
              setDarkmode(true);
            }
          }}
        >
          {darkmode ? (
            <RiSunFill className="h-4 w-4 text-gray-600 dark:text-white" />
          ) : (
            <RiMoonFill className="h-4 w-4 text-gray-600 dark:text-white" />
          )}
        </div>
        {/* Profile & Dropdown */}
        <Dropdown
          button={
            <img
              className="h-10 w-10 rounded-full"
              src={user?.image}
              alt="${user?.first_name} ${user?.second_name}"
            />
          }
          children={
            <div className="flex w-56 flex-col justify-start rounded-[20px] bg-white bg-cover bg-no-repeat shadow-xl shadow-shadow-500 dark:!bg-navy-700 dark:text-white dark:shadow-none">
              <div className="p-4">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold text-navy-700 dark:text-white">
                    {user?.first_name} {user?.second_name}
                  </p>{" "}
                </div>
              </div>
              <div className="h-px w-full bg-gray-200 dark:bg-white/20 " />

              <div className="flex flex-col p-4">
                <a
                  href=" "
                  className="text-sm text-gray-800 dark:text-white hover:dark:text-white"
                >
                  Profil sozlamalari
                </a>
                {/*<a*/}
                {/*  href=" "*/}
                {/*  className="mt-3 text-sm text-gray-800 dark:text-white hover:dark:text-white"*/}
                {/*>*/}
                {/*  Newsletter Settings*/}
                {/*</a>*/}
                <a
                  href=" "
                  className="mt-3 text-sm font-medium text-red-500 hover:text-red-500 transition duration-150 ease-out hover:ease-in"
                  onClick={()=>{
                    navigate("/student/login")
                    localStorage.clear()
                  }}
                >
                  Tizimdan chiqish
                </a>
              </div>
            </div>
          }
          classNames={"py-2 top-8 -left-[180px] w-max"}
        />
      </div>
    </nav>
  );
};

export default Navbar;
