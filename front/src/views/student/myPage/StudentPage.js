import React, { useEffect, useState } from 'react';
import nft1 from "../../../assets/img/nfts/NftBanner1.png";
import {Link, useNavigate} from "react-router-dom";
import ApiCall from "../../../config";
import {MdArrowBack} from "react-icons/md";

function StudentPage(props) {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const token = localStorage.getItem('authToken');
        try {
            const response = await ApiCall('/api/v1/student/account/all/' + token, "GET");
            setUser(response.data);
            console.log(response.data)
        } catch (error) {
            navigate("/student/login");
            console.error('Error fetching student data or posting to server:', error);
        }
    };

    return (
        <div className="">
            <div
                className="flex w-full flex-col rounded-[20px] bg-cover px-[30px] py-[30px] md:px-[64px] md:py-[56px] md:pb-0"
                style={{backgroundImage: `url(${nft1})`}}>
                <div className="w-full pb-0 p-4 pt-0">
                    <div className="flex flex-wrap w-full justify-between">
                        <div id="text" className="w-full md:w-[70%] mb-2 md:mb-0">
                            <h4 className="mb-[14px] max-w-full text-[18px] font-bold text-white md:text-3xl md:leading-[42px] lg:w-[90%] xl:w-[95%] 2xl:w-[95%] 3xl:w-[92%]">
                                {user?.first_name} {user?.second_name}
                            </h4>
                            <p className="mb-[40px] max-w-full text-base font-medium text-[#E3DAFF] md:w-[64%] lg:w-[40%] xl:w-[72%] 2xl:w-[60%] 3xl:w-[45%]">
                                Fanlardan qarzdorlik bo'limi
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className={"p-4 md:p-8"}>
                <div className={"lg:mx-36 "}>
                    <Link to={"/student/default"}
                          className="text-sm flex  items-center font-normal text-navy-700 hover:underline dark:text-white dark:hover:text-white">
                        <MdArrowBack/> <p className={"hover:border-b-2"}>Bosh sahifa</p>
                    </Link>
                </div>
                <div className="bg-[#f0f7fb] p-4 mt-6 rounded-lg">

                    <div className="flex flex-col md:flex-row gap-2 justify-center">
                        <div className="w-full md:w-1/4">
                            <div className="flex justify-center mb-4">
                                <img
                                    src={user?.image}
                                    className="w-24 h-24 rounded-full border-4 border-[#0083CA] md:w-32 md:h-32 lg:w-40 lg:h-40"
                                    alt=""
                                />
                            </div>
                            <ul className="space-y-2 text-center text-[#0083ca] font-bold">
                                <li className="py-2 rounded-lg bg-[#0083ca] text-white">
                                    <Link to={"/student/user"}><i className="fa fa-user-circle-o"></i> Mening profilim
                                    </Link>
                                </li>
                                <li className="py-2 rounded-lg hover:bg-[#0083ca] hover:text-white">
                                    <Link to={"/student/appeals"}><i className="fa fa-user-circle-o"></i> Mening
                                        Arizalarim </Link>
                                </li>
                                <li className="py-2 rounded-lg hover:bg-[#0083ca] hover:text-white">
                                    <Link to={"/student/debt"}><i className="fa fa-user-circle-o"></i> Fandan qarzdorlik </Link>
                                </li>
                            </ul>
                        </div>

                        <div className="w-full md:w-2/3 bg-white p-4 rounded-lg">
                            <div className="flex items-center justify-between">
                                <h1 className="text-xl font-semibold text-[#0083ca]">Umumiy ma'lumot</h1>
                                <i className="fa fa-eye-slash text-[#0083ca]"></i>
                            </div>
                            <h2 className="text-lg font-semibold text-[#0083ca] my-4">Pasport ma'lumotlari</h2>
                            <div className="overflow-auto">
                                <table className="w-full text-sm md:text-base">
                                    <tbody className="text-[#585858] font-bold">
                                    <tr className="bg-[#EFF9FF]">
                                        <th className="p-2 text-left">F.I.O.</th>
                                        <td className="p-2 text-left">
                                            <span>{user?.full_name}</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th className="p-2 text-left">Tug‘ilgan sana</th>
                                        <td className="p-2 text-left">
                                            <span>{new Date(user?.birth_date * 1000).toLocaleDateString('en-GB')}</span>
                                        </td>
                                    </tr>
                                    <tr className="bg-[#EFF9FF]">
                                        <th className="p-2 text-left">Pasport seriyasi</th>
                                        <td className="p-2 text-left">
                                            <span>{user?.passport_number}</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th className="p-2 text-left">JSHR</th>
                                        <td className="p-2 text-left">
                                            <span>{user?.passport_pin}</span>
                                        </td>
                                    </tr>
                                    <tr className="bg-[#EFF9FF]">
                                        <th className="p-2 text-left">Telefon raqami</th>
                                        <td className="p-2 text-left">
                                            <span>{user?.phone}</span>
                                        </td>
                                    </tr>
                                    <tr className="">
                                        <th className="p-2 text-left">Email</th>
                                        <td className="p-2 text-left">
                                            <span>{user?.email}</span>
                                        </td>
                                    </tr>
                                    <tr className="bg-[#EFF9FF]">
                                        <th className="p-2 text-left">Jinsi</th>
                                        <td className="p-2 text-left">
                                            <span>{user?.gender?.name}</span>
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>

                            <h2 className="text-lg font-semibold text-[#0083ca] my-4 text-center">
                                Talim malumoti
                            </h2>
                            <div className="overflow-auto">
                                <table className="w-full text-sm md:text-base">
                                    <tbody className="text-[#585858] font-bold">
                                    <tr className="bg-[#EFF9FF]">
                                        <th className="p-2 text-left">Talim shakli</th>
                                        <td className="p-2 text-left">{user?.educationForm?.name}</td>
                                    </tr>
                                    <tr>
                                        <th className="p-2 text-left">Talim tili</th>
                                        <td className="p-2 text-left">
                                            <span>{user?.educationLang?.name}</span>

                                        </td>
                                    </tr>
                                    <tr className="bg-[#EFF9FF]">
                                        <th className="p-2 text-left">Fakultet</th>
                                        <td className="p-2 text-left">
                                            <span>{user?.faculty.name}</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th className="p-2 text-left">Guruh</th>
                                        <td className="p-2 text-left">
                                            <span>{user?.group?.name}</span>
                                        </td>
                                    </tr>
                                    <tr className="bg-[#EFF9FF]">
                                        <th className="p-2 text-left">O'quv kursi</th>
                                        <td className="p-2 text-left">
                                            <span>{user?.level?.name}</span>

                                        </td>
                                    </tr>
                                    <tr>
                                        <th className="p-2 text-left">O'quv semester</th>
                                        <td className="p-2 text-left">
                                            <span>{user?.semester?.code-10}-semester</span>

                                        </td>
                                    </tr>
                                    <tr className={"bg-[#EFF9FF]"}>
                                        <th className="p-2 text-left">Qabul turi</th>
                                        <td className="p-2 text-left">
                                            <span>{user?.paymentForm?.name}</span>
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>

                            <h2 className="text-lg font-semibold text-[#0083ca] my-4 text-center">
                                Doimiy ro‘yxatdan o‘tgan manzili
                            </h2>
                            <div className="overflow-auto">
                            <table className="w-full text-sm md:text-base">
                                    <tbody className="text-[#585858] font-bold">
                                    <tr className="bg-[#EFF9FF]">
                                        <th className="p-2 text-left">Mamlakat</th>
                                        <td className="p-2 text-left">{user?.country?.name} Respublikasi</td>
                                    </tr>
                                    <tr>
                                        <th className="p-2 text-left">Hudud</th>
                                        <td className="p-2 text-left">
                                            <span>{user?.province.name}</span>
                                        </td>
                                    </tr>
                                    <tr className="bg-[#EFF9FF]">
                                        <th className="p-2 text-left">Tuman</th>
                                        <td className="p-2 text-left">
                                            <span>{user?.district.name}</span>
                                            <span>{user?.address.name}</span>

                                        </td>
                                    </tr>
                                    <tr>
                                        <th className="p-2 text-left">Manzil</th>
                                        <td className="p-2 text-left">
                                            <span>{user?.address}</span>
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default StudentPage;
