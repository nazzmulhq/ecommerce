import { RoutePermittedRole } from "@lib/constants/AppEnums";
import { BiBookReader, BiCartAlt, BiDollar, BiErrorCircle, BiRss, BiTask } from "react-icons/bi";
import { BsBriefcase, BsCart4, BsChatDots, BsCurrencyBitcoin, BsQuestionDiamond } from "react-icons/bs";
import { CgAttachment, CgFeed, CgUserList } from "react-icons/cg";
import { DiHtml5Multimedia } from "react-icons/di";
import { FaRegCalendarAlt, FaRegHospital } from "react-icons/fa";
import { FiMail, FiMap, FiUsers } from "react-icons/fi";
import { GrUserAdmin } from "react-icons/gr";
import { HiOutlineAcademicCap, HiOutlineChartSquareBar } from "react-icons/hi";
import { IoMdNotificationsOutline } from "react-icons/io";
import {
    MdInvertColors,
    MdOutlineAnalytics,
    MdOutlineContactPhone,
    MdOutlineContactSupport,
    MdOutlineManageAccounts,
    MdTimeline,
} from "react-icons/md";
import { RiBarChart2Line, RiCustomerService2Line, RiDashboardLine, RiShieldUserLine, RiTodoLine } from "react-icons/ri";
import { TbFileInvoice } from "react-icons/tb";

const routesConfig = [
    {
        id: "dashboards",
        title: "Application",
        messageId: "sidebar.application",
        type: "group",
        children: [
            {
                id: "permissions",
                title: "Permissions",
                messageId: "sidebar.app.dashboard.crypto",
                icon: <BsCurrencyBitcoin />,
                path: "/permission",
            },
            {
                id: "role",
                title: "Role",
                messageId: "sidebar.app.dashboard.crypto",
                icon: <BsCurrencyBitcoin />,
                path: "/role",
            },
            {
                id: "crypto",
                title: "Crypto",
                messageId: "sidebar.app.dashboard.crypto",
                icon: <BsCurrencyBitcoin />,
                path: "/dashboards/crypto",
            },
            {
                id: "crm",
                title: "CRM",
                messageId: "sidebar.app.dashboard.crm",
                icon: <RiCustomerService2Line />,
                path: "/dashboards/crm",
            },
            {
                id: "analytics",
                title: "Analytics",
                messageId: "sidebar.app.dashboard.analytics",
                icon: <MdOutlineAnalytics />,
                path: "/dashboards/analytics",
            },
            {
                id: "health-care",
                title: "Health Care",
                permittedRole: RoutePermittedRole.User,
                messageId: "sidebar.healthCare",
                icon: <FaRegHospital />,
                path: "/dashboards/health-care",
            },
            {
                id: "e-commerce",
                title: "E-Commerce",
                messageId: "sidebar.app.dashboard.eCommerce",
                icon: <BsCart4 />,
                path: "/dashboards/e-commerce",
            },
            {
                id: "academy",
                title: "Academy",
                messageId: "sidebar.app.dashboard.academy",
                icon: <HiOutlineAcademicCap />,
                path: "/dashboards/academy",
            },
            {
                id: "metrics",
                title: "Metrics",
                messageId: "sidebar.app.metrics",
                icon: <HiOutlineChartSquareBar />,
                path: "/dashboards/metrics",
            },
            {
                id: "widgets",
                title: "Widgets",
                messageId: "sidebar.app.widgets",
                icon: <RiDashboardLine />,
                path: "/dashboards/widgets",
            },
        ],
    },
    {
        id: "apps",
        title: "Apps",
        messageId: "sidebar.apps",
        type: "group",
        children: [
            {
                id: "mail",
                title: "Mail",
                messageId: "sidebar.apps.mail",
                count: 4,
                icon: <FiMail />,
                path: "/apps/mail/folder/inbox",
            },
            {
                id: "todo",
                title: "ToDo",
                messageId: "sidebar.apps.todo",
                count: 6,
                icon: <RiTodoLine />,
                color: "#48bb78",
                path: "/apps/todo/folder/all",
            },
            {
                id: "calender",
                title: "Calender",
                messageId: "sidebar.apps.calender",
                icon: <BiTask />,
                path: "/apps/calender/folder/all",
            },
            {
                id: "contact",
                title: "Contact",
                messageId: "sidebar.apps.contact",
                icon: <MdOutlineContactPhone />,
                path: "/apps/contact/folder/all",
            },
            {
                id: "chat",
                title: "Chat",
                icon: <BsChatDots />,
                messageId: "sidebar.apps.chat",
                path: "/apps/chat",
            },
            {
                id: "wall",
                title: "Wall",
                messageId: "sidebar.apps.wall",
                icon: <CgFeed />,
                path: "/apps/wall",
            },
            {
                id: "ecommerce",
                title: "Ecommerce",
                messageId: "sidebar.ecommerce",
                icon: <BiCartAlt />,
                type: "collapse",
                children: [
                    {
                        id: "products",
                        title: "Products",
                        messageId: "sidebar.ecommerce.products",
                        path: "/ecommerce/products",
                    },
                    {
                        id: "product_detail",
                        title: "Product Detail",
                        messageId: "sidebar.ecommerce.productDetail",
                        path: "/ecommerce/product_detail",
                    },
                    {
                        id: "orders",
                        title: "Orders",
                        messageId: "sidebar.ecommerce.orders",
                        path: "/ecommerce/orders",
                    },
                    {
                        id: "cart",
                        title: "Cart",
                        messageId: "sidebar.ecommerce.cart",
                        path: "/ecommerce/cart",
                    },
                    {
                        id: "checkout",
                        title: "Checkout",
                        messageId: "sidebar.ecommerce.checkout",
                        path: "/ecommerce/checkout",
                    },
                    {
                        id: "confirmation",
                        title: "Confirmation",
                        messageId: "sidebar.ecommerce.confirmation",
                        path: "/ecommerce/confirmation",
                    },
                    {
                        id: "invoice-1",
                        title: "Invoice 1",
                        messageId: "sidebar.ecommerce.invoice1",
                        path: "/ecommerce/invoice-1",
                    },
                    {
                        id: "invoice-2",
                        title: "Invoice 2",
                        messageId: "sidebar.ecommerce.invoice2",
                        path: "/ecommerce/invoice-2",
                    },
                ],
            },
            {
                id: "admin-ecommerce",
                title: "Ecommerce Admin",
                messageId: "sidebar.ecommerceAdmin",
                type: "collapse",
                icon: <GrUserAdmin />,
                children: [
                    {
                        id: "productListing",
                        title: "Product Listing",
                        messageId: "sidebar.ecommerceAdmin.productListing",
                        path: "/ecommerce/product-listing",
                    },
                    {
                        id: "addProducts",
                        title: "Add Products",
                        messageId: "sidebar.ecommerceAdmin.addProducts",
                        path: "/ecommerce/add-products",
                    },
                    {
                        id: "customers",
                        title: "Customers",
                        messageId: "sidebar.ecommerce.customers",
                        path: "/ecommerce/customers",
                    },
                ],
            },
            {
                id: "invoice",
                title: "Invoice",
                messageId: "sidebar.invoice",
                type: "collapse",
                icon: <TbFileInvoice />,
                children: [
                    {
                        id: "addInvoice",
                        title: "Add Invoices",
                        messageId: "sidebar.invoice.addInvoice",
                        path: "/invoice/add-invoice",
                    },
                    {
                        id: "invoices",
                        title: "Invoices",
                        messageId: "sidebar.invoice.home",
                        path: "/invoice",
                    },
                    {
                        id: "clients",
                        title: "Clients",
                        messageId: "sidebar.invoice.clients",
                        path: "/invoice/clients",
                    },
                    {
                        id: "settings",
                        title: "Settings",
                        messageId: "sidebar.invoice.settings",
                        path: "/invoice/settings",
                    },
                ],
            },
            {
                id: "blog",
                title: "Blog",
                messageId: "sidebar.pages.extraPages.blog",
                type: "collapse",
                icon: <BiRss />,
                children: [
                    {
                        id: "bloglist",
                        title: "Blog List",
                        messageId: "sidebar.pages.extraPages.blogList",
                        path: "/extra-pages/blog",
                    },
                    {
                        id: "blogdetail",
                        title: "Blog Detail",
                        messageId: "sidebar.pages.extraPages.blogDetail",
                        path: "/extra-pages/blog/blog-details",
                    },
                    {
                        id: "blogcreate",
                        title: "Create Blog",
                        messageId: "sidebar.pages.extraPages.blogCreate",
                        path: "/extra-pages/blog/create-blog",
                    },
                ],
            },
        ],
    },
    {
        id: "third-party",
        title: "Libs",
        messageId: "sidebar.libs",
        type: "group",
        children: [
            {
                id: "google-map",
                title: "Google Map",
                messageId: "sidebar.googleMap",
                icon: <FiMap />,
                path: "/third-party/google-map",
            },
            {
                id: "recharts",
                title: "Recharts",
                messageId: "sidebar.recharts",
                icon: <RiBarChart2Line />,
                path: "recharts",
                type: "collapse",
                children: [
                    {
                        id: "area",
                        title: "Area Chart",
                        messageId: "sidebar.recharts.areaChart",
                        path: "/third-party/recharts/area",
                    },
                    {
                        id: "bar",
                        title: "Bar Chart",
                        messageId: "sidebar.recharts.barChart",
                        path: "/third-party/recharts/bar",
                    },
                    {
                        id: "composed",
                        title: "Composed Chart",
                        messageId: "sidebar.recharts.composedChart",
                        path: "/third-party/recharts/composed",
                    },
                    {
                        id: "line",
                        title: "Line Chart",
                        messageId: "sidebar.recharts.lineChart",
                        path: "/third-party/recharts/line",
                    },
                    {
                        id: "pie",
                        title: "Pie Chart",
                        messageId: "sidebar.recharts.pieChart",
                        path: "/third-party/recharts/pie",
                    },
                    {
                        id: "radar",
                        title: "Radar Chart",
                        messageId: "sidebar.recharts.radarChart",
                        path: "/third-party/recharts/radar",
                    },
                    {
                        id: "radial",
                        title: "Radial Chart",
                        messageId: "sidebar.recharts.radialChart",
                        path: "/third-party/recharts/radial",
                    },
                    {
                        id: "scatter",
                        title: "Scatter Chart",
                        messageId: "sidebar.recharts.scatterChart",
                        path: "/third-party/recharts/scatter",
                    },
                    {
                        id: "funnel",
                        title: "Funnel Chart",
                        messageId: "sidebar.recharts.funnelChart",
                        path: "/third-party/recharts/funnel",
                    },
                    {
                        id: "treemap",
                        title: "Treemap Chart",
                        messageId: "sidebar.recharts.treeChart",
                        path: "/third-party/recharts/treemap",
                    },
                ],
            },
            {
                id: "big-calendar",
                title: "Big Calendar",
                messageId: "sidebar.bigCalender",
                icon: <FaRegCalendarAlt />,
                path: "/third-party/calendar",
            },
            {
                id: "react-color",
                title: "React Color",
                messageId: "sidebar.reactColor",
                icon: <MdInvertColors />,
                path: "/third-party/react-color",
            },
            {
                id: "react-dropzone",
                title: "React Dropzone",
                messageId: "sidebar.reactDropzone",
                icon: <CgAttachment />,
                path: "/third-party/react-dropzone",
            },
            {
                id: "react-notification",
                title: "React Notification",
                messageId: "sidebar.reactNotification",
                icon: <IoMdNotificationsOutline />,
                path: "/third-party/react-notification",
            },
            {
                id: "react-player",
                title: "Player",
                messageId: "sidebar.player",
                icon: <DiHtml5Multimedia />,
                path: "/third-party/react-player",
            },
            {
                id: "time-line",
                title: "Time Line",
                messageId: "sidebar.pages.timeLine",
                icon: <MdTimeline />,
                path: "/third-party/time-line",
            },
        ],
    },
    {
        id: "extra-pages",
        title: "Extra Pages",
        messageId: "sidebar.pages.extraPages",
        path: "extra-pages",
        type: "group",
        children: [
            {
                id: "account",
                title: "Account",
                messageId: "sidebar.pages.extraPages.account",
                icon: <MdOutlineManageAccounts />,
                path: "/extra-pages/account",
            },
            {
                id: "about-us",
                title: "About Us",
                messageId: "sidebar.pages.extraPages.aboutUs",
                icon: <FiUsers />,
                path: "/extra-pages/about-us",
            },
            {
                id: "contact-us",
                title: "Contact Us",
                messageId: "sidebar.pages.extraPages.contactUs",
                icon: <MdOutlineContactSupport />,
                path: "/extra-pages/contact-us",
            },
            {
                id: "knowledge-base",
                title: "Knowledge Base",
                messageId: "sidebar.pages.extraPages.knowledgeBase",
                icon: <BiBookReader />,
                path: "/extra-pages/knowledge-base",
            },
            {
                id: "portfolio",
                title: "Portfolio",
                messageId: "sidebar.pages.extraPages.portfolio",
                icon: <BsBriefcase />,
                path: "/extra-pages/portfolio",
            },
            {
                id: "faq",
                title: "FAQ",
                messageId: "sidebar.pages.extraPages.faq",
                icon: <BsQuestionDiamond />,
                path: "/extra-pages/faq",
            },
            {
                id: "pricing",
                title: "Pricing",
                messageId: "sidebar.pages.extraPages.pricing",
                type: "collapse",
                icon: <BiDollar />,
                children: [
                    {
                        id: "pricingListing",
                        title: "Pricing Listing",
                        messageId: "sidebar.pages.extraPages.pricingListing",
                        path: "/extra-pages/pricing-listing",
                    },
                    {
                        id: "pricingDetail",
                        title: "Pricing Detail",
                        messageId: "sidebar.pages.extraPages.pricingDetail",
                        path: "/extra-pages/pricing-detail",
                    },
                ],
            },
            {
                id: "user",
                title: "user Pages",
                messageId: "sidebar.pages.userPages",
                icon: <RiShieldUserLine />,
                path: "user",
                type: "collapse",
                children: [
                    {
                        id: "sign-in-1",
                        title: "SignIn-1",
                        messageId: "sidebar.pages.userPages.signIn1",
                        path: "/user/sign-in-1",
                    },
                    {
                        id: "sign-in-2",
                        title: "SignIn-2",
                        messageId: "sidebar.pages.userPages.signIn2",
                        path: "/user/sign-in-2",
                    },
                    {
                        id: "sign-up-1",
                        title: "SignUp-1",
                        messageId: "sidebar.pages.userPages.signUp1",
                        path: "/user/sign-up-1",
                    },
                    {
                        id: "sign-up-2",
                        title: "SignUp-2",
                        messageId: "sidebar.pages.userPages.signUp2",
                        path: "/user/sign-up-2",
                    },
                    {
                        id: "forgot-password-1",
                        title: "Forgot Password-1",
                        messageId: "sidebar.pages.userPages.forgetPassword1",
                        path: "/user/forgot-password-1",
                    },
                    {
                        id: "forgot-password-2",
                        title: "Forgot Password-2",
                        messageId: "sidebar.pages.userPages.forgetPassword2",
                        path: "/user/forgot-password-2",
                    },
                    {
                        id: "reset-password-1",
                        title: "Reset Password-1",
                        messageId: "sidebar.pages.userPages.resetPassword1",
                        path: "/user/reset-password-1",
                    },
                    {
                        id: "reset-password-2",
                        title: "Reset Password-2",
                        messageId: "sidebar.pages.userPages.resetPassword2",
                        path: "/user/reset-password-2",
                    },
                    {
                        id: "lock-1",
                        title: "Lock Screen-1",
                        messageId: "sidebar.pages.userPages.lockScreen1",
                        path: "/user/lock-1",
                    },
                    {
                        id: "lock-2",
                        title: "Lock Screen-2",
                        messageId: "sidebar.pages.userPages.lockScreen2",
                        path: "/user/lock-2",
                    },
                ],
            },
            {
                id: "list-type",
                title: "user List",
                messageId: "sidebar.pages.userList",
                icon: <CgUserList />,
                path: "list-type",
                type: "collapse",
                children: [
                    {
                        id: "morden",
                        title: "Modern",
                        messageId: "sidebar.pages.userList.modern",
                        path: "/list-type/modern",
                    },
                    {
                        id: "standard",
                        title: "Standard",
                        messageId: "sidebar.pages.userList.standard",
                        path: "/list-type/standard",
                    },
                    {
                        id: "flat",
                        title: "Flat",
                        messageId: "sidebar.pages.userList.flat",
                        path: "/list-type/flat",
                    },
                ],
            },
            {
                id: "error-pages",
                title: "Error Pages",
                messageId: "sidebar.pages.errorPages",
                icon: <BiErrorCircle />,
                path: "error-pages",
                type: "collapse",
                children: [
                    {
                        id: "error-401",
                        title: "401",
                        messageId: "sidebar.pages.errorPages.401",
                        path: "/error-pages/error-401",
                    },
                    {
                        id: "error-403",
                        title: "403",
                        messageId: "sidebar.pages.errorPages.403",
                        path: "/error-pages/error-403",
                    },
                    {
                        id: "error-404",
                        title: "404",
                        messageId: "sidebar.pages.errorPages.404",
                        path: "/error-pages/error-404",
                    },
                    {
                        id: "error-500",
                        title: "500",
                        messageId: "sidebar.pages.errorPages.500",
                        path: "/error-pages/error-500",
                    },
                    {
                        id: "maintenance",
                        title: "Maintenance",
                        messageId: "sidebar.pages.errorPages.maintenance",
                        path: "/error-pages/maintenance",
                    },
                    {
                        id: "coming-soon",
                        title: "Coming Soon",
                        messageId: "sidebar.pages.errorPages.comingSoon",
                        path: "/error-pages/coming-soon",
                    },
                ],
            },
        ],
    },
];
export default routesConfig;
