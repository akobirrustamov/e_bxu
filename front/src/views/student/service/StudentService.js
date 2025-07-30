import React, {useEffect, useState} from 'react';
import Navbar from "../../../layouts/student/navbar";
import Footer from "../../../components/footer/Footer";
import {Link, useNavigate, useParams} from "react-router-dom";
import {
    MdArrowBack, MdFileUpload, MdLocalPhone, MdOutlineAccessTime,
    MdOutlineCheckBox, MdOutlineDocumentScanner,
    MdOutlineMessage,
    MdOutlineNavigateNext,
    MdOutlinePermIdentity,
    MdOutlineShare
} from "react-icons/md";
import StarRating from "../rating/StarRating";
import Card from "../../../components/card";
import Statistics from "../statistics/Statistics";
import {toast, ToastContainer} from "react-toastify";
import ApiCall from "../../../config";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";
function StudentService(props) {
    const { subCategoryId } = useParams();
    const [open, setOpen] = React.useState(true);
    const [modalWidth, setModalWidth] = useState("360px");
    const [showAriza, setShowAriza] = useState(false)
    const [boshlanishSana, setBoshlanishSana] = useState('');  // State for start date
    const [tugashSana, setTugashSana] = useState('');          // State for end date
    const handleBoshlanishSanaChange = (e) => {
        const dateValue = e.target.value;
        setBoshlanishSana(dateValue);
        const date = new Date(dateValue);
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
    };
    const [masul, setMasul]=useState(null)
    const handleTugashSanaChange = (e) => {
        const dateValue = e.target.value;
        setTugashSana(dateValue);
        const date = new Date(dateValue);
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
    };
    const updateModalWidth = () => {
        const screenWidth = window.innerWidth;
        if (screenWidth >= 1280) setModalWidth("500px"); // XL screens
        else if (screenWidth >= 768) setModalWidth("500px"); // LG & MD screens
        else setModalWidth("360px"); // SM screens
    };
    function capitalizeFirstLetter(str) {
        if(!str)return "";
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    }


    useEffect(() => {

        updateModalWidth(); // Set initial width
        window.addEventListener("resize", updateModalWidth); // Update on resize
        return () => window.removeEventListener("resize", updateModalWidth); // Cleanup
    }, []);

    const [user, setUser] = useState({});
    const [show, setShow] = useState(false);
    const [show1, setShow1] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [subcategory, setSubcategory] = useState({
        id: 1,
        name: "",
        category: null,
        service_day: 0,
        created_at: "2024-09-30T13:19:56.617009"
    });
    const [studentAppeal, setStudentAppeal] = useState(null)
    const [asos, setAsos] = useState(false);
    const [sabab, setSabab] = useState([]);
    const [selectedSabab, setSelectedSabab] = useState(""); // New state for selected sabab
    const [customSabab, setCustomSabab] = useState(""); // New state for custom sabab input
    const navigate = useNavigate();

    useEffect( () => {
        if(subCategoryId===null || subCategoryId===undefined){
            navigate("/")
        }else {
            getSubCategory(subCategoryId);
            getMasul(subCategoryId);
            fetchData();
        }

    }, []);

    const getSubCategory = async (subCategoryId) => {
        try {
            const response = await ApiCall(`/api/v1/superadmin/subcategory/${subCategoryId}`, "GET");
            setSubcategory(response.data);
            setAsos(response?.data?.asos)
            if (response.data.sabab) {
                setSabab([])
                try {
                    const response = await ApiCall(`/api/v1/superadmin/subcategory/reason/${subCategoryId}`, "GET");
                    setSabab(response.data)
                } catch (error) {
                }
            }
        } catch (error) {
        }
    };

    const handleShare = () => {
        const currentUrl = window.location.href;
        const telegramLink = `https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=Check this out!`;
        window.open(telegramLink, "_blank");
    };


    const fetchData = async () => {
        const token = localStorage.getItem('authToken');
        try {
            const response = await ApiCall('/api/v1/student/account/'+token, "GET");
            setUser(response.data)
            await checkAppealStudent(subCategoryId, response.data.id)
        } catch (error) {
            navigate("/student/login")
        }
    };

    const checkAppealStudent = async (subCategoryId, studentId) =>{
        try {
            const response = await ApiCall('/api/v1/student/appeal/me/'+studentId+"/"+subCategoryId, "GET");
            setStudentAppeal(response.data)
        } catch (error) {
            setStudentAppeal(null)
        }
    }
    const uploadPdf = async (pdf, prefix) => {
        const formData = new FormData();
        formData.append('photo', pdf);
        formData.append('prefix', prefix);

        try {
            const response = await ApiCall('/api/v1/file/upload', 'POST', formData, null, true);
            return response.data;
        } catch (error) {
            throw error;
        }
    };
    const text1 = `   Buxoro davlat texnika universiteti rektori S.G‘. Siddiqovaga  ${user?.group_name} guruh talabasi ${capitalizeFirstLetter(user?.second_name)} ${capitalizeFirstLetter(user?.first_name)} tomonidan`
    const [text2, setText2] = useState(""); // State for text2

    const sendAppeal = async () => {
        if (!subcategory.ariza) {
            await senAppeal1();
        } else {
            let updatedText2 = subcategory?.ariza_text || "";

            if (subcategory.ariza && subcategory?.arizaSana && subcategory?.sabab) {
                const selectedSababTitle = sabab?.find(item => item?.id == selectedSabab)?.title || customSabab || '';
                updatedText2 = updatedText2
                    .replace('_sabab_', selectedSababTitle)
                    .replace('_sana1_', boshlanishSana)
                    .replace('_sana2_', tugashSana);
            } else if (subcategory.ariza && subcategory?.arizaSana && !subcategory?.sabab) {
                updatedText2 = updatedText2
                    .replace('_sana1_', boshlanishSana)
                    .replace('_sana2_', tugashSana);
            } else if (subcategory.ariza && !subcategory?.arizaSana && subcategory?.sabab) {
                const selectedSababTitle = sabab?.find(item => item?.id == selectedSabab)?.title || customSabab || '';
                updatedText2 = updatedText2
                    .replace('_sabab_', selectedSababTitle)
            }
            setText2(updatedText2);
            setShowAriza(true); // Show modal
        }
    };

    const senAppeal1 = async () => {
        setShowAriza(false);
        setShow(false);

        try {
            // Show loading toast and handle promise with toast.promise
            const response = await toast.promise(
                (async () => {
                    await fetchData();

                    // Initialize pdfUrl if a file is selected
                    let pdfUrl = null;
                    if (selectedFile) {
                        pdfUrl = await uploadPdf(selectedFile, 'appeal');
                    }

                    // Determine the final appeal text based on selectedSabab
                    let finalAppealText = "";
                    if (selectedSabab === "-1") {
                        finalAppealText = customSabab.trim();
                        if (!finalAppealText) {
                            alert("Iltimos, sababni kiriting yoki boshqa sababni tanlang.");
                            throw new Error("Custom reason not provided");  // Early exit
                        }
                    } else {
                        const selectedItem = sabab.find(item => item.id.toString() === selectedSabab);
                        finalAppealText = selectedItem ? selectedItem.title : "";
                    }

                    // Prepare the data to be sent in the API call
                    const data = {
                        studentId: user?.passport_pin,
                        subCategoryId: subcategory.id,
                        appealText: JSON.stringify({ text: finalAppealText }),
                        attachmentId: pdfUrl,
                    };

                    // Set appealText based on subcategory properties
                    if (subcategory.arizaSana) {
                        data.appealText = JSON.stringify({ text: text2 });
                    } else if (subcategory.ariza) {
                        data.appealText = JSON.stringify({ text: text2 });
                    }

                    // Make API call to submit the appeal
                    const response = await ApiCall(`/api/v1/student/appeal`, "POST", data);
                    alert(JSON.stringify(response.data))
                    // Reset states after successful submission
                    setShow(false);
                    setSelectedFile(null);
                    setSelectedSabab("");
                    setCustomSabab("");

                    return response; // Return response to resolve the promise
                })(),
                {
                    pending: 'Ariza yuborilmoqda...',  // Loading message
                    success: 'Ariza muvaffaqiyatli yuborildi!',  // Success message
                    error: `Xatolik yuz berdi. \n Qayta urinib ko'ring`,  // Error message
                }
            );

            // Check the appeal status for the student after submission
            await checkAppealStudent(subCategoryId, user.id);
        } catch (error) {
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type === 'application/pdf') {
            setSelectedFile(file);
        } else {
            setSelectedFile(null);
        }
    };



    const getMasul = async (subcategoryId) => {
        try {
            const response = await ApiCall(`/api/v1/admin/masul/${subcategoryId}`, "GET");
            setMasul(response.data);

        } catch (error) {
        }
    }

    function checkProses() {

        if(studentAppeal!==null){
            setShow1(true)
            return;
        }
        if (subcategory.ariza && !subcategory.asos && !subcategory?.arizaSana && !subcategory?.sabab){
            setShowAriza(true)
            setText2(subcategory.ariza_text);
            return;
        }

        if(studentAppeal===null){
            setShow(true)
        }else {
            setShow1(true)
        }
    }



    return (
        <div className="flex h-full w-full">
            {/*<Sidebar open={open} onClose={() => setOpen(false)} />*/}
            {/* Navbar & Main Content */}
            <div className="h-full w-full bg-lightPrimary dark:!bg-navy-900 ">
                <Navbar
                    onOpenSidenav={() => setOpen(true)}
                    logoText={"salom"}
                    brandText={"service"}
                    secondary={[]}

                />

                {/* Routes */}
                <div className="h-full">

                    <div className="pt-5s mx-auto mb-auto h-full min-h-[84vh] p-2 md:pr-2 ">
                        <div>
                            {/*header*/}

                            <div className="mb-5 mt-5  items-center align-bottom px-[26px]">
                                <Link to={"/student/default"}
                                      className="text-sm flex  items-center font-normal text-navy-700 hover:underline dark:text-white dark:hover:text-white">
                                    <MdArrowBack/> <p className={"hover:border-b-2"}>Bosh sahifa</p>
                                </Link>
                                <h4 className="mb-[14px] max-w-full text-lg font-bold text-dark md:text-2xl md:leading-[42px] ">
                                    {subcategory?.name} xizmatidan foydalanish uchun ariza yuborish
                                </h4>

                            </div>

                            {/*body*/}
                            <div
                                className="grid lg:pt-0 lg:p-20 grid-cols-1 sm:grid-cols-2 lg:grid-cols-[70%,30%] md:grid-cols-[70%,30%] gap-5  p-8 pt-0 h-full">
                                <div className="col-span-1 p-4 h-full rounded-xl order-1 md:order-2 xl:order-2">
                                    {/*foydalanish*/}
                                    {subcategory?.strange ?

                                        <a onClick={() => sendAppeal()} href={subcategory?.url}
                                           rel="noopener noreferrer"
                                           target="_blank"
                                           className=" flex text-white w-full items-center rounded-3xl justify-between  bg-blue-500 hover:bg-blue-600  p-3  shadow-3xl shadow-shadow-500 dark:!bg-navy-700 dark:shadow-none">
                                            <div className="flex items-center justify-between">
                                                <div
                                                    className="mt-2 flex items-center justify-center rounded-full  p-[6px] text-5xl font-bold  dark:!bg-navy-700 dark:text-white">
                                                    <MdOutlineCheckBox/>
                                                </div>
                                                <div className="ml-4 ">
                                                    <p className="text-xl my-2 font-medium  dark:text-white">
                                                        Xizmatdan foydalanish
                                                    </p>

                                                </div>
                                                <div
                                                    className="mt-2 flex items-center justify-center rounded-full  p-[6px] text-5xl font-bold  dark:!bg-navy-700 dark:text-white">
                                                    <MdOutlineNavigateNext/>
                                                </div>
                                            </div>

                                        </a>
                                        :

                                        <div onClick={() => checkProses()}
                                             className="flex text-white w-full items-center rounded-3xl justify-between bg-blue-500 hover:bg-blue-600 p-3 shadow-3xl shadow-shadow-500 dark:!bg-navy-700 dark:shadow-none">
                                            <div className="flex items-center justify-between">
                                                <div
                                                    className="md:text-sm xl:text-2xl text-2xl my-2 font-medium dark:text-white">
                                                    <MdOutlineCheckBox/>
                                                </div>
                                                <div className="ml-4">
                                                    <p className="md:text-sm xl:text-2xl text-2xl my-2 font-medium dark:text-white">Xizmatdan
                                                        foydalanish</p>
                                                </div>
                                                <div
                                                    className="md:text-sm xl:text-2xl text-2xl my-2 font-medium dark:text-white">
                                                    <MdOutlineNavigateNext/>
                                                </div>
                                            </div>
                                        </div>

                                    }
                                    {/* Share */}
                                    <div onClick={handleShare}
                                         className="my-4 flex text-black w-full items-center rounded-3xl justify-between bg-gray-200 hover:bg-gray-300 p-3 shadow-3xl shadow-shadow-500 dark:!bg-navy-700 dark:shadow-none">
                                        <div className="md:text-sm flex items-center justify-between">
                                            <div
                                                className="md:text-sm xl:text-2xl text-2xl my-2 font-medium dark:text-white">
                                                <MdOutlineShare/>
                                            </div>
                                            <div className="ml-4">
                                                <p className="md:text-sm xl:text-2xl text-2xl my-2 font-medium dark:text-white">Ulashish</p>
                                            </div>
                                            <div
                                                className="md:text-sm xl:text-2xl text-2xl my-2 font-medium dark:text-white">
                                                <MdOutlineNavigateNext/>
                                            </div>
                                        </div>
                                    </div>

                                    <div
                                        className="my-4 flex text-black w-full items-center rounded-3xl justify-between bg-gray-200 hover:bg-gray-300 p-3 shadow-3xl shadow-shadow-500 dark:!bg-navy-700 dark:shadow-none">
                                        <StarRating subcategory={subcategory} student={user}/>
                                    </div>
                                </div>
                                <div className="col-span-1 order-2 sm:order-2 md:order-1 xl:order-1">
                                    <Card extra="w-full p-4 h-full ">
                                        <div
                                            className="flex w-full items-center justify-between rounded-2xl bg-white hover:bg-blue-50 p-3 shadow-3xl shadow-shadow-500 dark:!bg-navy-700 dark:shadow-none">
                                            <div className="flex items-center">
                                                <div
                                                    className="mt-2 flex items-center justify-center rounded-full bg-lightPrimary p-[12px] text-5xl font-bold text-brand-500 dark:!bg-navy-700 dark:text-white">
                                                    <MdOutlineMessage/>
                                                </div>
                                                <div className="ml-4">
                                                    <p className="text-xl font-medium text-navy-700 dark:text-white">Bu
                                                        qanday
                                                        ishlaydi.</p>
                                                    <p className="mt-2 text-sm text-gray-600">Bu qanday ishlashi haqida
                                                        malumot</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div
                                            className="my-2 flex w-full items-center justify-between rounded-2xl bg-white hover:bg-blue-50 p-3 shadow-3xl shadow-shadow-500 dark:!bg-navy-700 dark:shadow-none">
                                            <div className="flex items-center">
                                                <div
                                                    className="mt-2 flex items-center justify-center rounded-full bg-lightPrimary p-[12px] text-5xl font-bold text-brand-500 dark:!bg-navy-700 dark:text-white">
                                                    <MdOutlinePermIdentity/>
                                                </div>
                                                <div className="ml-4">
                                                    <p className="text-xl font-medium text-navy-700 dark:text-white">Masul
                                                        shaxs</p>
                                                    <p className="mt-2 text-sm text-gray-600">{masul}</p>
                                                </div>
                                            </div>
                                        </div>
                                        {/* Project 3 */}
                                        <div
                                            className="my-2 flex w-full items-center justify-between rounded-2xl bg-white hover:bg-blue-50 p-3 shadow-3xl shadow-shadow-500 dark:!bg-navy-700 dark:shadow-none">
                                            <div className="flex items-center">
                                                <div
                                                    className="mt-2 flex items-center justify-center rounded-full bg-lightPrimary p-[12px] text-5xl font-bold text-brand-500 dark:!bg-navy-700 dark:text-white">
                                                    <MdOutlineDocumentScanner/>
                                                </div>
                                                <div className="ml-4">
                                                    <p className="text-xl font-medium text-navy-700 dark:text-white">Xizmatdan
                                                        foydalanish uchun kerakli hujjatlar</p>
                                                    <p className="mt-2 text-sm text-gray-600">
                                                        {subcategory?.service_day === 0 ? "Talab etilmaydi" : "Ariza yozma ravishda .pdf farmatga o'tkazgan holda"}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        {/* Project 4 */}
                                        <div
                                            className="my-2 flex w-full items-center justify-between rounded-2xl bg-white hover:bg-blue-50 p-3 shadow-3xl shadow-shadow-500 dark:!bg-navy-700 dark:shadow-none">
                                            <div className="flex items-center">
                                                <div
                                                    className="mt-2 flex items-center justify-center rounded-full bg-lightPrimary p-[12px] text-5xl font-bold text-brand-500 dark:!bg-navy-700 dark:text-white">
                                                    <MdOutlineAccessTime/>
                                                </div>
                                                <div className="ml-4">
                                                    <p className="text-xl font-medium text-navy-700 dark:text-white">Xizmat
                                                        ko'rsatish
                                                        muddati</p>
                                                    <p className="mt-2 text-sm text-gray-600">
                                                        {subcategory?.service_day === 0 ? "O'z vaqtida" : subcategory?.service_day + " ish kunida"}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Project 5 */}
                                        <div
                                            className="my-2 flex w-full items-center justify-between rounded-2xl bg-white hover:bg-blue-50 p-3 shadow-3xl shadow-shadow-500 dark:!bg-navy-700 dark:shadow-none">
                                            <div className="flex items-center">
                                                <div
                                                    className="mt-2 flex items-center justify-center rounded-full bg-lightPrimary p-[12px] text-5xl font-bold text-brand-500 dark:!bg-navy-700 dark:text-white">
                                                    <MdLocalPhone/>
                                                </div>
                                                <div className="ml-4">
                                                    <p className="text-xl font-medium text-navy-700 dark:text-white">Bog'lanish</p>
                                                    <p className="mt-2 text-sm text-gray-600">Ishinch telefoni: +998 (65) 223 28 83</p>
                                                    <p className="mt-2 text-sm text-gray-600">
                                                        Telegram manzil: <a className="text-blue-500"
                                                                            href="https://t.me/bdtu_uz_rasmiy">@bdtu_uz_rasmiy</a>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                </div>
                            </div>


                            <div>


                                <Modal open={show} onClose={() => setShow(false)} center styles={{ modal: { width: modalWidth } }}>
                                        <h4 className="mb-2 text-center text-lg font-bold text-dark">
                                            {subcategory.name} xizmatidan foydalanish uchun ariza yuborish.
                                        </h4>
                                        <form onSubmit={(e) => {
                                            e.preventDefault();
                                            sendAppeal();
                                        }}>
                                            <Card
                                                className="grid h-full w-full grid-cols-1 gap-3 rounded-[20px] bg-white bg-clip-border p-1 shadow-xl dark:!bg-navy-800">

                                                {/* Sabab Selection */}

                                                {subcategory?.sabab &&
                                                    <>
                                                        {/*main select saba*/}
                                                        <div>
                                                            <label htmlFor="sabab"
                                                                   className="block text-sm font-medium text-gray-700 dark:text-white">
                                                                Sababni tanlang
                                                            </label>
                                                            <select id="sabab" value={selectedSabab}
                                                                    onChange={(e) => setSelectedSabab(e.target.value)}
                                                                    className="p-2 border-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 dark:bg-navy-700 dark:border-navy-600 dark:text-white"
                                                                    required>
                                                                <option value="" disabled>Sababni tanlang</option>
                                                                {sabab.map(item =>
                                                                    <option key={item.id} value={item.id}>{item.title}</option>
                                                                )}
                                                                <option value="-1">Boshqa</option>
                                                            </select>
                                                        </div>
                                                        {/* Conditionally render input for 'Boshqa' */}
                                                        {selectedSabab === "-1" &&
                                                            <div>
                                                                <label htmlFor="customSabab"
                                                                       className="block mt-2 text-sm font-medium text-gray-700 dark:text-white">
                                                                    Boshqa sababni kiriting
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    id="customSabab"
                                                                    value={customSabab}
                                                                    onChange={(e) => setCustomSabab(e.target.value)}
                                                                    placeholder="Iltimos sababni kiriting"
                                                                    className="mt-2 block  w-full p-1 rounded-md border-2 border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 dark:bg-navy-700 dark:border-navy-600 dark:text-white"
                                                                    required={selectedSabab === "-1"}
                                                                />
                                                            </div>
                                                        }
                                                    </>
                                                }




                                                {/* sana start */}
                                                {
                                                    subcategory?.arizaSana &&
                                                    <div className={"flex justify-around"}>


                                                        <div>
                                                            <label htmlFor="boshlanishSana"
                                                                   className="block mt-2 text-sm font-medium text-gray-700 dark:text-white">
                                                                Boshlanish sanasini
                                                            </label>
                                                            <input
                                                                type="date"
                                                                id="boshlanishSana"
                                                                value={boshlanishSana}
                                                                onChange={handleBoshlanishSanaChange}
                                                                className="mt-1 lg:w-full  w-2/3 p-2 border-2 rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 dark:bg-navy-700 dark:border-navy-600 dark:text-white"
                                                                required
                                                            />
                                                        </div>


                                                        <div className="">
                                                            <label htmlFor="tugashSana"
                                                                   className="block mt-2 text-sm font-medium text-gray-700 dark:text-white">
                                                                Tugash sanasini
                                                            </label>
                                                            <input
                                                                type="date"
                                                                id="tugashSana"
                                                                value={tugashSana}
                                                                onChange={handleTugashSanaChange}
                                                                className="mt-1 lg:w-full  w-2/3 p-2 border-2 rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 dark:bg-navy-700 dark:border-navy-600 dark:text-white"
                                                                required
                                                            />
                                                        </div>
                                                    </div>
                                                }
                                                {
                                                    subcategory?.asos &&
                                                    <div className={"pt-0 p-4  mb-2"}>
                                                        <label htmlFor="customSabab"
                                                               className="block mt-4   text-sm font-medium text-gray-700 dark:text-white">
                                                            Asos Faylini yuklang (hajmi 2mb dan oshmasin)
                                                        </label>
                                                        <div
                                                            className="col-span-1 w-full rounded-xl bg-lightPrimary dark:!bg-navy-700">

                                                            <label
                                                                className="flex h-full w-full flex-col items-center justify-center rounded-xl border-[2px] border-dashed border-gray-200 py-2 dark:!border-navy-700 cursor-pointer"
                                                            >
                                                                <MdFileUpload
                                                                    className="text-[30px] text-brand-500 dark:text-white"/>
                                                                <input
                                                                    type="file"
                                                                    onChange={handleFileChange}
                                                                    accept=".pdf" // Only accept PDF files
                                                                    className="hidden"
                                                                    required // Make file upload required
                                                                />
                                                                <p className=" text-sm font-medium text-gray-600">PDF fayl
                                                                    yuklang</p>
                                                                {selectedFile && (
                                                                    <p className="text-sm text-gray-600">
                                                                        Yuklangan fayl: <span
                                                                        className="font-semibold">{selectedFile.name}</span>
                                                                    </p>
                                                                )}
                                                            </label>
                                                        </div>
                                                    </div>
                                                }

                                            </Card>
                                            <button type="submit" className={"linear flex items-center justify-center rounded-xl bg-brand-500 px-4 py-2 text-base font-medium text-white transition duration-200 hover:bg-brand-600 dark:bg-brand-400 " + (selectedSabab === "-1" ? "mt-8" : "mt-28")}>
                                                Arizani yuborish
                                            </button>


                                        </form>
                                    </Modal>








                                <Modal
                                    open={show1}
                                    onClose={() => setShow1(false)}
                                    center
                                    styles={{
                                        modal: {
                                            width: modalWidth,
                                            maxHeight: "80vh",
                                            padding: "20px",
                                            borderRadius: "16px",
                                            maxWidth: "90%",
                                            boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
                                            border: "none",
                                            backgroundColor: "#f8fafc"
                                        },
                                        overlay: {
                                            backgroundColor: "rgba(0, 0, 0, 0.5)",
                                            backdropFilter: "blur(3px)"
                                        }
                                    }}
                                >
                                    <div className="flex flex-col items-center px-6 py-5">
                                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-6 w-6 text-blue-600"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                                />
                                            </svg>
                                        </div>

                                        <h4 className="mb-3 text-center text-xl font-bold text-gray-800">
                                            {subcategory.name} xizmatidan foydalanish uchun arizangiz
                                        </h4>
                                        <p className="mb-3 text-center text-gray-600">
                                            Ma'sul hodimlar tomonidan ko'rib chiqilmoqda. Iltimos, javobni kuting.
                                        </p>

                                        <p className="mb-4 text-center text-sm text-gray-500">
                                          <span className="font-medium text-blue-600">
                                            {subcategory?.service_day} ish kunida
                                          </span> javob beriladi.
                                        </p>

                                        <div className="mb-4 w-full border-t border-gray-200"></div>

                                        <Link
                                            to="/student/appeals"
                                            className="mb-5 text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline"
                                        >
                                            Shu yerdan arizalaringiz holatini ko'rish mumkin →
                                        </Link>

                                        <button
                                            onClick={() => setShow1(false)}
                                            className="relative overflow-hidden rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-2 font-medium text-white shadow-lg transition-all duration-300 hover:from-blue-600 hover:to-blue-700 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 active:scale-95"
                                        >
                                            <span className="relative z-10">Tushunarli</span>
                                            <span className="absolute inset-0 z-0 h-full w-full bg-white opacity-0 transition-opacity duration-300 hover:opacity-10"></span>
                                        </button>
                                    </div>
                                </Modal>




                                <Modal open={showAriza} onClose={() => setShowAriza(false)} center styles={{ modal: { height: "620px", width: modalWidth, padding: "20px", borderRadius: "12px" } }}>

                                <div>
                                        <div className="flex flex-col items-center lg:px-6 md:px-4 py-5 w-full">
                                            <h4 className="mb-4  text-center text-lg font-bold text-dark">
                                                {subcategory.name} shakillantirilgan ariza
                                            </h4>
                                            <div className={"w-full border-2 lg:p-2  pb-4  shadow-cyan-700"}>
                                                <div className={"items-end w-full flex justify-end"}>

                                                    <p className="w-2/3 lg:w-1/2 md:w-1/2 sm:w-2/3 md:w-2/3 text-sm text-gray-700 pt-2  ">
                                                        {text1}
                                                    </p>
                                                </div>
                                                <p className="text-center text-sm text-gray-700 lg:mt-6 mt-4">
                                                    Ariza
                                                </p>
                                                <p className="text-start text-sm text-gray-700 mt-2">
                                                    &nbsp; &nbsp;{text2}
                                                </p>
                                                <div
                                                    className={"flex lg:mt-10 lg:mb-32 mb-10 mt-12 justify-evenly gap-10"}>
                                                    <p className="text-start text-sm text-gray-700">
                                                        <b>{new Date().toLocaleDateString('en-GB').replace(/\//g, '.')}</b>
                                                    </p>
                                                    <p className="text-start text-sm text-gray-700 ">
                                                        <b>  {capitalizeFirstLetter(user?.second_name)} {capitalizeFirstLetter(user?.first_name)}</b>
                                                    </p>
                                                </div>

                                            </div>

                                        </div>
                                        <div className={"flex justify-between"}>
                                            <button
                                                onClick={senAppeal1}
                                                type="submit"
                                                className="linear mt-2 flex items-center justify-center rounded-xl bg-brand-500 lg:md:px-4 py-2 md:p-0 sm:p-0 text-base font-medium text-white transition duration-200 hover:bg-brand-600 dark:bg-brand-400"
                                            >
                                                Arizani tasdiqlash
                                            </button>
                                            <button
                                                onClick={() => setShowAriza(false)}
                                                type="submit"
                                                className="linear mt-2 flex items-center justify-center rounded-xl bg-red-500 px-4 py-2 text-base font-medium text-white transition duration-200 hover:bg-brand-600 dark:bg-brand-400"
                                            >
                                                Bekor qilish
                                            </button>
                                        </div>
                                    </div>
                                </Modal>
                            </div>
                            <ToastContainer/>

                        </div>
                    </div>
                    <div className="p-3">
                        <Footer/>
                    </div>
                </div>

            </div>
        </div>

    );
}

export default StudentService;