'use client';
import { useAuth } from "@/contexts/AuthContext";
import Image from "next/image";
import Link from "next/link";

const Sidebar = () => {
  const { logout } = useAuth();
  const sidebarData = [
    {
      icon: "/img/dashboard/sidebar/compass.svg",
      title: "Dashboard",
      href: "/admin/dashboard",
    },
    // {
    //   icon: "/img/dashboard/sidebar/booking.svg",
    //   title: "Permissions & Roles",
    //   href: "/admin/roles",
    // },
    // {
    //   icon: "/img/dashboard/sidebar/house.svg",
    //   title: "Booking Management",
    //   links: [
    //     {
    //       title: "Booking List",
    //       href: "/admin/booking",
    //     },
    //     {
    //       title: "Booking Calendar",
    //       href: "/admin/booking/calendar",
    //     },
    //     // {
    //     //   title: "Rate Plan",
    //     //   href: "/admin/rateplan",
    //     // },
    //   ],
    // },
    {
      icon: "/img/dashboard/sidebar/map.svg",
      title: "User Management",
      href: "/admin/user",
    },
    {
      icon: "/img/dashboard/sidebar/taxi.svg",
      title: "Category Management",
      href: "/admin/category",
    },
    // {
    //   icon: "/img/dashboard/sidebar/canoe.svg",
    //   title: "Manual Entry Management",
    //   href: "/admin/entry",
    // },
    {
      icon: "/img/dashboard/sidebar/booking.svg",
      title: "Commission Management",
      href: "/admin/commission",
    },
    {
      icon: "/img/dashboard/sidebar/sneakers.svg",
      title: "Financial Management",
      href: "/admin/finance",
    },
    // // {
    // //   icon: "/img/dashboard/sidebar/taxi.svg",
    // //   title: "Package Builder",
    // //   href: "/admin/package-builder",
    // // },
    {
      icon: "/img/dashboard/sidebar/canoe.svg",
      title: "Vendor Listing Management",
      href: "/admin/vendor-listing",
    },
    {
      icon: "/img/dashboard/sidebar/booking.svg",
      title: "Coupon & Promotion Management",
      href: "/admin/coupon",
    },
    {
      icon: "/img/dashboard/sidebar/canoe.svg",
      title: "Package Management",
      links: [
        { title: "Package Plans", href: "/admin/package/plan" },
        {
          title: "Package Subscriptions",
          href: "/admin/package/subscription",
        },
      ],
    },
    // {
    //   icon: "/img/dashboard/sidebar/house.svg",
    //   title: "CMS Management",
    //   href: "/admin/cms",
    // },
    {
      icon: "/img/dashboard/sidebar/taxi.svg",
      title: "Email Template",
      href: "/admin/email-template",
    },
    {
      icon: "/img/dashboard/sidebar/sneakers.svg",
      title: "Notification",
      href: "/admin/notification",
    },
    // {
    //   icon: "/img/dashboard/sidebar/canoe.svg",
    //   title: "SEO Optimization",
    //   href: "/admin/seo",
    // },
    {
      icon: "/img/dashboard/sidebar/airplane.svg",
      title: "Customer Support",
      href: "/admin/customer-support",
    },
    {
      icon: "/img/dashboard/sidebar/house.svg",
      title: "Booking Oversight",
      href: "/admin/oversight",
    },
    {
      icon: "/img/dashboard/sidebar/canoe.svg",
      title: "System Settings",
      href: "/admin/setting",
    },
    {
      icon: "/img/dashboard/sidebar/log-out.svg",
      title: "Logout",
      onClick: () => {
        logout();
      },
    },
  ];

  return (
    <>
      <div className="sidebar -dashboard" id="agentSidebarMenu">
        {sidebarData.map((item, index) => (
          <div className="sidebar__item" key={index}>
            {item.links ? (
              <div className="accordion -db-sidebar js-accordion">
                <div className="accordion__item">
                  <div
                    className="accordion__button"
                    data-bs-toggle="collapse"
                    data-bs-target={`#sidebarItem${index}`}
                  >
                    <div className="sidebar__button col-12 d-flex items-center justify-between">
                      <div className="d-flex items-center text-15 lh-1 fw-500">
                        <Image
                          width={20}
                          height={20}
                          src={item.icon}
                          alt="image"
                          className="mr-10"
                        />
                        {item.title}
                      </div>
                      <div className="icon-chevron-sm-down text-7" />
                    </div>
                  </div>
                  <div
                    id={`sidebarItem${index}`}
                    className="collapse"
                    data-bs-parent="#agentSidebarMenu"
                  >
                    <ul className="list-disc pb-5 pl-40">
                      {item.links.map((link, linkIndex) => (
                        <li key={linkIndex}>
                          <Link href={link.href} className="text-15">
                            {link.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ) : (
              <Link
                onClick={item.onClick}
                href={ item.onClick ? '' : item.href }
                className="sidebar__button d-flex items-center text-15 lh-1 fw-500"
              >
                <Image
                  width={20}
                  height={20}
                  src={item.icon}
                  alt="image"
                  className="mr-15"
                  unoptimized
                />
                {item.title}
              </Link>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default Sidebar;
