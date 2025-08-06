import React from "react";

// Admin Imports
import MainDashboard from "views/admin/default";
import NFTMarketplace from "views/admin/marketplace";
import Profile from "views/admin/profile";
import Home from "views/admin/home";
import DataTables from "views/admin/tables";
import RTLDefault from "views/rtl/default";
import Subject from "views/admin/subject"
import Duty from "views/admin/duty"

// student imports
import MainDashboardStudent from "views/student/default";

import StudentAppeals from "views/student/appeals"



// dean imports
import DeanHome from "views/dean/default/index";
import DeanDuty from "views/dean/duty/index"
import DeanProfile from "views/dean/profile"

// rector
import MainDashboardRector from "views/rector/default";
import RectorAdmins from "views/rector/tables";
import RectorGroup from "views/rector/subject";
import RectorCategories from "views/rector/categories"
import RectorSubCategories from "views/rector/subCategories"
import RectorDean from "views/rector/dean"
import RectorProfile from "views/rector/profile"
import RectorAllAppeals from "views/rector/all-appeals"
import RectorExpired from "views/rector/expiredAppeals/Expired"

// superadmin
import MainDashboardSuper from "views/superadmin/default";
import SuperadminAdmins from "views/superadmin/tables";
import SuperadminGroups from "views/superadmin/subject";
import SuperAdminCategories from "views/superadmin/categories"
import SuperAdminSubCategories from "views/superadmin/subCategories"
import SuperAdminTeacher from "views/superadmin/teacher"
import SuperAdminProfile from "views/superadmin/profile"
import SuperAdminAllAppeals from "views/superadmin/all-appeals"
import SuperAdminToken from "views/superadmin/token"
// Auth Imports
import SignIn from "views/auth/SignIn";

// Icon Imports
import {
  MdHome,
  MdPerson,
  MdLock,
  MdDocumentScanner,
  MdOutlineDocumentScanner,
  MdOutlinePayments,
  MdPayment,
  MdCastForEducation,
  MdPersonalInjury,
  MdGroups,
  MdOutlineSubject,
  MdSubject,
  MdWallpaper,
  MdFirstPage,
  MdSettingsApplications,
  MdOutlineTextFields,
  MdOutlineWrapText,
  MdOutlineAttachment,
  MdAttachFile,
  MdOutlinePlayLesson,
  MdPlayLesson,
  MdPin,
  MdSocialDistance,
  MdOutlineMap,
  MdOutlineLibraryAddCheck,
  MdOutlinePolymer,
  MdCalendarToday,
  MdGeneratingTokens,
  MdAddTask,
  MdOutlinePublish,
  MdOutlineScience,
  MdOutlineAirlineSeatFlat,
  MdOutlineMapsHomeWork,
  MdNaturePeople,
  MdOutlinePersonAdd,
  MdOutlineLiving,
  MdOutlineEmojiPeople,
  MdOutlinePeopleOutline,
  MdArticle,
  MdAutoAwesomeMotion,
  MdOutlineSettings,
  MdCameraFront,
  MdManageAccounts,
  MdOutlineAddToPhotos,
  MdOutlineAssignment,
  MdOutlineAutoStories,
  MdOutlineBallot,
  MdOutlineChecklistRtl,
  MdOutlineCreditCardOff,
  MdOutlineDriveFileMove,
  MdOutlineFlipCameraAndroid,
  MdOutlineLeaderboard,
  MdOutlineMarkunreadMailbox,
  MdOutlineMoveToInbox,
  MdOutlineMenuBook,
  MdOutlineNoteAlt,
  MdOutlineNote,
  MdOutlinePictureInPicture,
  MdOutlineQueryStats,
  MdOutlineSubtitles,
  MdOutlineVilla,
  MdOutlineWysiwyg,
  MdPadding,
  MdPriceChange,
  MdReceiptLong,
  MdRedeem,
  MdSpa,
  MdAllInbox,
  MdChat,
  MdDesignServices,
  MdOutlineSafetyDivider,
  MdOutlineWeb,
  MdQuestionAnswer,
  MdSchool,
  MdMiscellaneousServices,
  MdOutlineSettingsSuggest,
  MdPhotoFilter, MdPersonalVideo, MdErrorOutline,

} from "react-icons/md";
import Categories from "./views/superadmin/categories";
import StatusAppeal from "./views/student/appeals/StatusAppeal";
import Debt from "./views/student/debt/Debt";
import StudentPage from "./views/student/myPage/StudentPage";
import Expired from "./views/superadmin/expiredAppeals/Expired";
import AddNewSubCategory from "./views/superadmin/subCategories/AddNewSubCategory";
import Rectors from "views/rector/tables";

const routes = [
  {
    name: "Bosh sahifa",
    layout: "/student",
    path: "appeals",
    icon: <MdHome className="h-6 w-6" />,
    component: <StudentAppeals />,
    stranger: false,
    url: ""
  },
  {
    name: "Fandan qarzdorlik",
    layout: "/student",
    path: "debt",
    icon: <MdHome className="h-6 w-6" />,
    component: <Debt />,
    stranger: false,
    url: ""
  },
  {
    name: "Mening profilim",
    layout: "/student",
    path: "user",
    icon: <MdHome className="h-6 w-6" />,
    component: <StudentPage />,
    stranger: false,
    url: ""
  },
  {
    name: "Mening arizam",
    layout: "/student",
    path: "appeal/:id",
    icon: <MdHome className="h-6 w-6" />,
    component: <StatusAppeal />,
    stranger: false,
    url: ""
  },
  {
    name: "Bosh sahifa",
    layout: "/student",
    path: "default",
    icon: <MdHome className="h-6 w-6" />,
    component: <MainDashboardStudent />,
    stranger: false,
    url: ""
  },





  //   old
  {
    name: "Bosh sahifa",
    layout: "/admin",
    path: "default",
    icon: <MdHome className="h-6 w-6" />,
    component: <MainDashboard />,
  },

  {
    name: "Xizmat ko'rsatish",
    layout: "/admin",
    path: "duty",
    icon: <MdOutlineSettings className="h-6 w-6" />,
    component: <Duty />,
  },
  {
    name: "Profile",
    layout: "/admin",
    path: "profile",
    icon: <MdPerson className="h-6 w-6" />,
    component: <Profile />,
  },

  // {
  //   name: "Tanlov fanlari",
  //   layout: "/admin",
  //   path: "vote",
  //   icon: <MdBarChart className="h-6 w-6" />,
  //   component: <Subject />,
  // },

  // {
  //
  //   name: "Bosh sahifa",
  //   layout: "/admin",
  //   path: "home",
  //   icon: <MdHome className="h-6 w-6" />,
  //   component: <Home />,
  // },
  // {
  //   name: "NFT Marketplace",
  //   layout: "/admin",
  //   path: "nft-marketplace",
  //   icon: <MdOutlineShoppingCart className="h-6 w-6" />,
  //   component: <NFTMarketplace />,
  //   secondary: true,
  // },
  // {
  //   name: "Data Tables",
  //   layout: "/admin",
  //   icon: <MdBarChart className="h-6 w-6" />,
  //   path: "data-tables",
  //   component: <DataTables />,
  // },

  // {
  //   name: "Sign In",
  //   layout: "/auth",
  //   path: "sign-in",
  //   icon: <MdLock className="h-6 w-6" />,
  //   component: <SignIn />,
  // },
  // {
  //   name: "RTL Admin",
  //   layout: "/rtl",
  //   path: "rtl",
  //   icon: <MdHome className="h-6 w-6" />,
  //   component: <RTLDefault />,
  // },


  // dekan

  {
    name: "Bosh sahifa",
    layout: "/dean",
    path: "default",
    icon: <MdHome className="h-6 w-6" />,
    component: <DeanHome />,
  },

  {
    name: "Xizmat ko'rsatish",
    layout: "/dean",
    path: "duty",
    icon: <MdOutlineSettings className="h-6 w-6" />,
    component: <DeanDuty />,
  },
  {
    name: "Profile",
    layout: "/dean",
    path: "profile",
    icon: <MdPerson className="h-6 w-6" />,
    component: <DeanProfile />,
  },







  //   superadmin

  {
    name: "Bosh sahifa",
    layout: "/superadmin",
    path: "default",
    icon: <MdHome className="h-6 w-6" />,
    component: <MainDashboardSuper />,
  },
  // {
  //   name: "Muddati o'tgan arizalar",
  //   layout: "/superadmin",
  //   path: "expired",
  //   icon: <MdErrorOutline className="h-6 w-6" />,
  //   component: <Expired />,
  // },
  {
    name: "Adminlar",
    layout: "/superadmin",
    path: "admins",
    icon: <MdPerson className="h-6 w-6" />,
    component: <SuperadminAdmins />,
  },
  {
    name: "O'qituvchilar",
    layout: "/superadmin",
    path: "teachers",
    icon: <MdPerson className="h-6 w-6" />,
    component: <SuperAdminTeacher />,
  },

  {
    name: "O'quv rejalar ro'yxati",
    layout: "/superadmin",
    path: "curriculum",
    icon: <MdArticle className="h-6 w-6" />,
    component: <SuperAdminCategories />,
  },
  // {
  //   name: "NewSubcategory",
  //   layout: "/superadmin",
  //   path: "newsubcategory",
  //   icon: <MdArticle className="h-6 w-6" />,
  //   component: <AddNewSubCategory />,
  // },

  {
    name: "Fanlar",
    layout: "/superadmin",
    path: "subjects",
    icon: <MdAutoAwesomeMotion className="h-6 w-6" />,
    component: <SuperAdminSubCategories />,
  },
  {
    name: "Guruhlar",
    layout: "/superadmin",
    path: "groups",
    icon: <MdGroups className="h-6 w-6" />,
    component: <SuperadminGroups />,
  },
  {
    name: "Talabalar",
    layout: "/superadmin",
    path: "groups/students",
    icon: <MdPerson className="h-6 w-6" />,
    component: <SuperAdminAllAppeals />,
  },
  {
    name: "Token",
    layout: "/superadmin",
    path: "token",
    icon: <MdArticle className="h-6 w-6" />,
    component: <SuperAdminToken />,
  },
  {
    name: "Profile",
    layout: "/superadmin",
    path: "profile",
    icon: <MdPerson className="h-6 w-6" />,
    component: <SuperAdminProfile />,
  },

  // {
  //   name: "Data Tables",
  //   layout: "/superadmin",
  //   icon: <MdBarChart className="h-6 w-6" />,
  //   path: "data-tables",
  //   component: <DataTables />,
  // },


  //rector uchun
  {
    name: "Bosh sahifa",
    layout: "/rector",
    path: "rector-default",
    icon: <MdHome className="h-6 w-6" />,
    component: <MainDashboardRector />,
  },
  {
    name: "Muddati o'tgan arizalar",
    layout: "/rector",
    path: "rector-expired",
    icon: <MdErrorOutline className="h-6 w-6" />,
    component: <RectorExpired />,
  },
  {
    name: "Adminlar",
    layout: "/rector",
    path: "rector-admins",
    icon: <MdPerson className="h-6 w-6" />,
    component: <RectorAdmins />,
  },
  {
    name: "Mas'ullar",
    layout: "/rector",
    path: "rector-masullar",
    icon: <MdPerson className="h-6 w-6" />,
    component: <RectorDean />,
  },
  // {
  //   name: "Guruhlar",
  //   layout: "/rector",
  //   path: "groups",
  //   icon: <MdCastForEducation className="h-6 w-6" />,
  //   component: <SuperadminGroups />,
  // },
  {
    name: "Kategoriyalar",
    layout: "/rector",
    path: "rector-categories",
    icon: <MdArticle className="h-6 w-6" />,
    component: <RectorCategories />,
  },
  // {
  //   name: "NewSubcategory",
  //   layout: "/superadmin",
  //   path: "newsubcategory",
  //   icon: <MdArticle className="h-6 w-6" />,
  //   component: <AddNewSubCategory />,
  // },

  {
    name: "Xizmat turlari",
    layout: "/rector",
    path: "rector-subcategories",
    icon: <MdAutoAwesomeMotion className="h-6 w-6" />,
    component: <RectorSubCategories />,
  },
  {
    name: "Barcha arizalar",
    layout: "/rector",
    path: "rector-appeals",
    icon: <MdArticle className="h-6 w-6" />,
    component: <RectorAllAppeals />,
  },
  {
    name: "Profile",
    layout: "/rector",
    path: "rector-profile",
    icon: <MdPerson className="h-6 w-6" />,
    component: <RectorProfile />,
  },

  // {
  //   name: "Data Tables",
  //   layout: "/rector",
  //   icon: <MdBarChart className="h-6 w-6" />,
  //   path: "data-tables",
  //   component: <DataTables />,
  // },


];
export default routes;
