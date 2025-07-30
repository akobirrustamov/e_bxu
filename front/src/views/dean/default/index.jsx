import MiniCalendar from "components/calendar/MiniCalendar";
import WeeklyRevenue from "views/dean/default/components/WeeklyRevenue";
import { IoDocuments } from "react-icons/io5";
import { MdBarChart, MdDashboard } from "react-icons/md";

import Widget from "components/widget/Widget";
import React, {useEffect, useState} from "react";
import ApiCall from "../../../config";
import {useNavigate} from "react-router-dom";
import Card from "../../../components/card";

const Dashboard = () => {
    const [duties, setDuties] = useState([])
    const  navigate = useNavigate()

    const [admin, setAdmin] = useState(null);
    useEffect(() => {
        getAdmin()
    }, []);
    const getAdmin = async () => {
        try {
            const response = await ApiCall("/api/v1/auth/decode", "GET", null);
            setAdmin(response.data);
            await getDuties(response?.data?.id);
        } catch (error) {
            navigate("/admin/login");
            console.error("Error fetching account data:", error);
        }
    };
    const getDuties = async (deanId) => {
        try {
            const response = await ApiCall("/api/v1/dean/my-duty/"+deanId, "GET", null);
            setDuties(response.data);
            console.log(response.data)
        } catch (error) {
            navigate("/admin/login");
            console.error("Error fetching account data:", error);
        }
    };





    return (
      <div>
        {/* Card widget */}

        {/*<div className="mt-3 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-3 3xl:grid-cols-6">*/}
        {/*  <Widget*/}
        {/*      icon={<MdBarChart className="h-7 w-7"/>}*/}
        {/*      title={"Foydalanuvchilar soni"}*/}
        {/*      subtitle={"2901"}*/}
        {/*  />*/}
        {/*  <Widget*/}
        {/*      icon={<IoDocuments className="h-6 w-6"/>}*/}
        {/*      title={"Mavjud xizmatlar"}*/}
        {/*      subtitle={"40"}*/}
        {/*  />*/}
        {/*  <Widget*/}
        {/*      icon={<MdBarChart className="h-7 w-7"/>}*/}
        {/*      title={"statistikalar"}*/}
        {/*      subtitle={"574"}*/}
        {/*  />*/}

        {/*</div>*/}
          <div className="grid my-8 h-full grid-cols-1 gap-5 lg:!grid-cols-12">

              <div className="col-span-12 ">
                  <Card extra={"w-full h-full p-3"}>
                      {/* Header */}
                      <div className="mt-2 mb-8 w-full">
                          <h4 className="px-2 text-xl font-bold text-navy-700 dark:text-white">
                              Hizmat haqida malumot
                          </h4>
                          <p className="mt-2 px-2 text-base text-gray-600">
                              Siz o'zingizga tayinlangan xizmat turlari bo'yicha kelib tushgan arizalarni korish va
                              ularga mos
                              ravishda javob berishingiz zarur.
                          </p>
                      </div>
                      <hr/>
                      {/* Cards */}
                      <h4 className="px-2 my-4 text-md font-bold text-navy-700 dark:text-white">
                          Tayinlangan xizmatlar
                      </h4>
                      <div className="grid grid-cols-2 gap-4 px-2">

                          {duties?.map((item, index) =>
                              <div
                                  className="flex flex-col items-start justify-center rounded-2xl bg-white bg-clip-border px-3 py-4 shadow-3xl shadow-shadow-500 dark:!bg-navy-700 dark:shadow-none">
                                  <p className="text-base font-medium text-navy-700 dark:text-white">
                                      {item.subCategory.name}
                                  </p>
                                  <p className="text-sm text-gray-600"> Javob berish
                                      muddati: {item.subCategory.service_day} kun</p>
                                  <p className="text-sm text-gray-600"> Javobgar
                                      hodim: {item.subCategory.dean ? "O'zingiz" : "O'zingiz"} </p>

                              </div>
                          )}


                      </div>
                  </Card>
              </div>


          </div>




      </div>
  );
};

export default Dashboard;
