import Footer from "components/footer/FooterAuthDefault";
import { Link, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import React, { useState } from "react";
import ApiCall from "../index"

export default function Auth() {
  const navigate = useNavigate();
  const [studentData, setStudentData] = useState({ phone: '', password: '', rememberMe: false });

  const handleStudentChange = (e) => {
    const { name, value } = e.target;
    setStudentData({ ...studentData, [name]: value });
  };

  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await toast.promise(
          ApiCall('/api/v1/auth/login', 'POST', studentData, null, false),
          {
            pending: 'Login...',
            error: 'Failed to login',
          }
      );

      console.log('Full response:', response);
      console.log('Response data:', response.data);
      if (response.data?.access_token) {
        await localStorage.setItem("access_token", response.data.access_token);
        console.log('Access token saved:', response.data.access_token);

        if (response.data?.refresh_token) {
          await localStorage.setItem("refresh_token", response.data.refresh_token);
          console.log('Refresh token saved:', response.data.refresh_token);
        }
      }

      const roles = response.data.roles || [];

      if (roles.length > 0) {
        if (roles[0].name === "ROLE_ADMIN") navigate("/admin");
        else if (roles[0].name === "ROLE_SUPERADMIN") navigate("/superadmin/default");
        else if (roles[0].name === "ROLE_DEKAN") navigate("/dean/default");
        else if (roles[0].name === "ROLE_REKTOR")navigate("/rector/rector-default");

      } else {
        toast.error("Invalid role or unauthorized access!");
      }

    } catch (error) {
      console.error('Error during login:', error);
      toast.error("Login or password incorrect");
    }



  };

  return (
      <div className="min-h-screen bg-white selection:bg-primary/10 selection:text-primary dark:bg-gray-900">
        <section className="pt-10 mt-0 sm:pt-16 md:pt-40 lg:pt-12">
          <div className="mx-auto px-4 sm:px-12 xl:max-w-6xl xl:px-0 pb-32">
            <div>
              <div aria-hidden="true"
                   className="absolute inset-0 top-60 grid grid-cols-2 -space-x-52 opacity-50 dark:opacity-30">
                <div className="h-60 bg-gradient-to-br from-primary to-purple-400 blur-[106px] dark:from-blue-700"></div>
                <div className="h-40 bg-gradient-to-r from-cyan-600 to-sky-500 blur-[106px] dark:to-indigo-600"></div>
              </div>
              <div className="items-center gap-12 lg:flex justify-center">

                <div
                    className="relative w-1/2 rounded-3xl border border-gray-100 bg-white p-4 shadow-2xl shadow-gray-600/10 dark:border-gray-700 dark:bg-gray-800 dark:shadow-none sm:p-8">

                  <h2 className="text-center text-3xl font-bold text-gray-800 dark:text-white">Registrator ofisi elektron platformasiga kirish.</h2>
                  <h2 className="text-center text-2xl font-bold text-gray-800 dark:text-white">Adminlar bo'limi</h2>

                  <form onSubmit={handleAdminSubmit} className="p-10 pt-0">
                    <div>
                      <div className="p-6 pt-2"></div>
                      <label htmlFor="phone"
                             className="mb-2 block text-gray-600 dark:text-gray-300">Login <span
                          className="text-xl text-red-500 dark:text-red-400">*</span></label>
                      <input type="text" name="phone" id="phone" autoComplete="name"
                             value={studentData.phone} onChange={handleStudentChange}
                             className="peer block w-full rounded-lg border border-gray-200 bg-transparent px-4 py-2 text-gray-600 transition-shadow duration-300 invalid:ring-2 invalid:ring-red-400 focus:ring-2 dark:border-gray-700" />
                      <span
                          className="mt-1 hidden text-sm text-red-500 peer-invalid:block"></span>
                    </div>

                    <div className="mt-4">
                      <label htmlFor="password"
                             className="mb-2 block text-gray-600 dark:text-gray-300">Parol <span
                          className="text-xl text-red-500 dark:text-red-400">*</span></label>
                      <input type="password" name="password" id="password" autoComplete="tel"
                             value={studentData.password} onChange={handleStudentChange}
                             className="peer block w-full rounded-lg border border-gray-200 bg-transparent px-4 py-2 text-gray-600 transition-shadow duration-300 invalid:ring-2 invalid:ring-red-400 focus:ring-2 dark:border-gray-700" />
                      <span
                          className="mt-1 hidden text-sm text-red-500 peer-invalid:block"></span>
                    </div>

                    <button type="submit"
                            className="relative mt-6 flex h-12 w-full items-center justify-center px-6 bg-blue-800 rounded-3xl hover:bg-black text-white text-xl font-semibold">
                      Kirish
                    </button>
                  </form>

                </div>
              </div>
            </div>
          </div>
        </section>
        <ToastContainer/>

      </div>
  );
}
