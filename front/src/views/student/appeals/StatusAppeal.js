import React, { useState } from 'react';
import {Link, useLocation} from 'react-router-dom';
import nft1 from "../../../assets/img/nfts/NftBanner1.png";
import {
    MdArrowBack,
    MdArrowForward,
    MdCancel,
    MdCheckCircleOutline,
    MdDownload,
    MdOutlineRemoveRedEye,
    MdPendingActions
} from "react-icons/md";
import Card from "../../../components/card";
import StarRating from "../rating/StarRating";
import { baseUrl } from "../../../config";
import Rodal from "rodal";

function StatusAppeal() {
    const location = useLocation();
    const row = location.state?.row || {}; // Access the passed row data or default to empty object

    const [showAriza, setShowAriza] = useState(false);

    console.log(row)
    function capitalizeFirstLetter(str) {
        return str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "";
    }
    const text1 = `Buxoro davlat texnika universiteti rektori S.G‘. Siddiqovaga ${row.student?.group_name || ''} guruh talabasi ${capitalizeFirstLetter(row.student?.second_name || '')} ${capitalizeFirstLetter(row.student?.first_name || '')} tomonidan`;
    // Parse appealText or use it directly if it's already an object
    const text2 = typeof row?.appealText === "string" && row?.appealText!=="" ? JSON.parse(row.appealText) : row?.appealText;



    const handleDownload = (file) => {
        const url = file ? `${baseUrl}/api/v1/file/getFile/${file.id}` : "";
        if (url) {
            fetch(url)
                .then(response => response.blob())
                .then(blob => {
                    const blobUrl = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = blobUrl;
                    a.download = "file.pdf";
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                })
                .catch(error => console.error("Download failed:", error));
        }
    };

    return (
        <>
            <div
                className="flex w-full flex-col rounded-[20px] bg-cover px-[30px] py-[30px] md:px-[64px] md:py-[56px] md:pb-0"
                style={{backgroundImage: `url(${nft1})`}}>
                <div className="w-full pb-0 p-4 pt-0">
                    <div className="flex flex-wrap w-full justify-between">
                        <div id="text" className="w-full md:w-[70%] mb-2 md:mb-0">
                            <h4 className="mb-[14px] max-w-full text-[18px] font-bold text-white md:text-3xl md:leading-[42px] lg:w-[90%] xl:w-[95%] 2xl:w-[95%] 3xl:w-[92%]">
                                Xizmat: {row.subCategory?.name}
                            </h4>
                            <p className="mb-[40px] max-w-full text-base font-medium text-[#E3DAFF] md:w-[64%] lg:w-[40%] xl:w-[72%] 2xl:w-[60%] 3xl:w-[45%]">
                                {row.description}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div className={"mx-4 mt-4 flex"}>
                <Link to={"/student/default"}
                      className="text-sm flex  items-center font-normal text-navy-700 hover:underline dark:text-white dark:hover:text-white">
                    <MdArrowBack/> <p className={"hover:border-b-2"}>Bosh sahifa</p>
                </Link>
                <Link to={"/student/appeals"}
                      className="text-sm flex  items-center font-normal text-navy-700 hover:underline dark:text-white dark:hover:text-white">
                    / <p className={"hover:border-b-2"}>Mening Arizalarim</p>
                </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 my-2 p-4">
                {/* Main content, taking 2/3 width on medium and up */}

                <div className="col-span-1 sm:col-span-2 grid h-full">
                    <Card extra="w-full h-full p-4 sm:overflow-x-auto">
                        <div className="relative flex items-center justify-between">
                            <h4 className="mb-[14px] items-center flex gap-2 max-w-full text-2xl font-bold text-dark md:text-3xl md:leading-[42px]">
                                Xizmat holati:
                                {row.appealType?.name === "INPROGRESS" &&
                                    <MdPendingActions className="h-6 w-6 text-brand-500 dark:text-white"/>}
                                {row.appealType?.name === "COMPLETED" &&
                                    <MdCheckCircleOutline className="h-6 w-6 text-brand-500 dark:text-white"/>}
                                {row.appealType?.name === "CANCELED" &&
                                    <MdCancel className="h-6 w-6 text-brand-500 dark:text-white"/>}
                                {row.appealType?.name === "PENDING" &&
                                    <MdPendingActions className="h-6 w-6 text-brand-500 dark:text-white"/>}
                                <p className="font-medium">
                                    {row.appealType?.name === "INPROGRESS" && "Ko'rib chiqilmoqda"}
                                    {row.appealType?.name === "COMPLETED" && "Bajarildi"}
                                    {row.appealType?.name === "PENDING" && "Jarayonda"}
                                    {row.appealType?.name === "CANCELED" && "Rad etildi"}
                                </p>
                            </h4>
                        </div>
                        <div className="h-full overflow-x-scroll xl:overflow-hidden">
                            <table className="w-full">
                                <tbody>
                                <tr className="border-b-2 hover:bg-gray-100">
                                    <td className="pt-[8px] pb-[8px] sm:text-[16px]">F.I.O</td>
                                    <td className="pt-[8px] pb-[8px] sm:text-[16px]">
                                        {row.student?.second_name} {row.student?.first_name}
                                    </td>
                                </tr>
                                <tr className="border-b-2 hover:bg-gray-100">
                                    <td className="pt-[8px] pb-[8px] sm:text-[16px]">Guruh</td>
                                    <td className="pt-[8px] pb-[8px] sm:text-[16px]">{row.student?.group_name}</td>
                                </tr>
                                <tr className="border-b-2 hover:bg-gray-100">
                                    <td className="pt-[8px] pb-[8px] sm:text-[16px]">Ariza topshirilgan sana</td>
                                    <td className="pt-[8px] pb-[8px] sm:text-[16px]">
                                        {row.created_at?.substring(0, 10)}
                                    </td>
                                </tr>
                                {row.appealFile && (
                                    <tr className="border-b-2 hover:bg-gray-100">
                                        <td className="pt-[8px] pb-[8px] sm:text-[16px]">Ariza faylini yuklab olish</td>
                                        <td className="pt-[8px] pb-[8px] sm:text-[16px] flex items-center gap-1"
                                            onClick={() => handleDownload(row?.appealFile)}>
                                            <MdDownload className="text-[20px] text-brand-500 dark:text-white"/> yuklash
                                        </td>
                                    </tr>
                                )}
                                {text2?.text !== "" && (
                                    <tr className="border-b-2 hover:bg-gray-100">
                                        <td className="pt-[8px] pb-[8px] sm:text-[16px]">Ariza mazmuni</td>
                                        <td onClick={() => setShowAriza(true)}
                                            className="pt-[8px] pb-[8px] sm:text-[16px] flex items-center gap-1">
                                            <MdOutlineRemoveRedEye
                                                className="text-[20px] text-brand-500 dark:text-white"/> ko'rish
                                        </td>
                                    </tr>
                                )}
                                {row.response_file && (
                                    <tr className="border-b-2 hover:bg-gray-100">
                                        <td className="pt-[8px] pb-[8px] sm:text-[16px]">Javob faylini yuklab olish</td>
                                        <td className="pt-[8px] pb-[8px] sm:text-[16px] flex items-center gap-1"
                                            onClick={() => handleDownload(row?.response_file)}>
                                            <MdDownload className="text-[20px] text-brand-500 dark:text-white"/> yuklash
                                        </td>
                                    </tr>
                                )}
                                {row.response_text !== "" && (
                                    <tr className="border-b-2 hover:bg-gray-100">
                                        <td className="pt-[8px] pb-[8px] sm:text-[16px]">Javob mazmuni</td>
                                        <td onClick={() => setShowAriza(true)}
                                            className="pt-[8px] pb-[8px] sm:text-[16px] flex items-center gap-1">
                                            {row.response_text}
                                        </td>
                                    </tr>
                                )}
                                {(row?.appealType.name === "COMPLETED" || row?.appealType.name === "CANCELED") && (
                                    <tr className="border-b-2 hover:bg-gray-100">
                                        <td className="pt-[8px] pb-[8px] sm:text-[16px]">Javob sanasi</td>
                                        <td className="pt-[8px] pb-[8px] sm:text-[16px]">
                                            {row.responseDay?.substring(0, 10)}
                                        </td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>

                {/* Sidebar content, taking 1/3 width on medium and up */}
                <div
                    className="h-[250px] col-span-1 flex text-black w-full items-center rounded-3xl justify-between bg-gray-200 hover:bg-gray-300 p-3 shadow-3xl shadow-shadow-500 dark:!bg-navy-700 dark:shadow-none">
                    <StarRating subcategory={row.subCategory} student={row.student}/>
                </div>
            </div>

            <Rodal
                visible={showAriza}
                onClose={() => setShowAriza(false)}
                customStyles={{
                    height: "580px",
                    width: "90%",
                    maxWidth: "360px",
                    padding: "20px",
                    borderRadius: "12px",
                }}
            >
                <div className="flex flex-col items-center  py-2 w-full">
                    <h4 className="mb-4 text-center text-lg font-bold text-dark">
                        {row.subCategory?.name} shakillantirilgan ariza
                    </h4>
                    <div className="w-full border-2 lg:p-2 pb-4 shadow-cyan-700">
                        <div className={"items-end w-full flex justify-end"}>

                            <p className="w-2/3  sm:w-2/3 md:w-2/3 text-sm text-gray-700 pt-2 pl-2  ">
                                {text1}
                            </p>
                        </div>
                        <p className="text-center text-sm text-gray-700 lg:mt-6 mt-4">Ariza</p>
                        <p className="text-start text-sm text-gray-700 mt-2">&nbsp;&nbsp;{text2?.text}</p>
                        <div className="flex lg:mt-10 lg:mb-32 mb-10 mt-12 justify-evenly gap-10">
                            <p className="text-start text-sm text-gray-700">
                                <b>{row.created_at?.substring(0, 10)}</b>
                            </p>
                            <p className="text-sm text-gray-700">
                                <b>
                                    {capitalizeFirstLetter(row.student?.second_name)} {capitalizeFirstLetter(row.student?.first_name)}
                                </b>
                            </p>
                        </div>
                    </div>
                </div>
            </Rodal>
        </>
    );
}

export default StatusAppeal;
