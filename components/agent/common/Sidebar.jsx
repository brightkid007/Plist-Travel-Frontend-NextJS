"use client";
import { useAuth } from "@/contexts/AuthContext";
import Image from "next/image";
import Link from "next/link";

const Sidebar = () => {
  const { logout } = useAuth();
  const sidebarData = [
    {
      icon: "/img/dashboard/sidebar/compass.svg",
      title: "Dashboard",
      href: "/agent/dashboard",
    },
    {
      icon: "/img/dashboard/sidebar/booking.svg",
      title: "Profile & Branding",
      href: "/agent/profile",
    },
    {
      icon: "/img/dashboard/sidebar/house.svg",
      title: "Booking Management",
      links: [
        {
          title: "Booking List",
          href: "/agent/booking",
        },
        {
          title: "Booking Calendar",
          href: "/agent/booking/calendar",
        },
        // {
        //   title: "Rate Plan",
        //   href: "/agent/rateplan",
        // },
      ],
    },
    // {
    //   icon: "/img/dashboard/sidebar/map.svg",
    //   title: "Operations Management",
    //   href: "/agent/operations",
    // },
    {
      icon: "/img/dashboard/sidebar/canoe.svg",
      title: "Wallet",
      href: "/agent/wallet",
    },
    {
      icon: "/img/dashboard/sidebar/booking.svg",
      title: "Commission",
      href: "/agent/commission",
    },
    {
      icon: "/img/dashboard/sidebar/sneakers.svg",
      title: "Sales Links",
      href: "/agent/sales-links",
    },
    // {
    //   icon: "/img/dashboard/sidebar/taxi.svg",
    //   title: "Package Builder",
    //   href: "/agent/package-builder",
    // },
    {
      icon: "/img/dashboard/sidebar/canoe.svg",
      title: "CMS",
      href: "/agent/cms",
    },
    {
      icon: "/img/dashboard/sidebar/airplane.svg",
      title: "Email Template",
      href: "/agent/email-template",
    },
    {
      icon: "/img/dashboard/sidebar/house.svg",
      title: "Clients",
      href: "/agent/clients",
    },
    {
      icon: "/img/dashboard/sidebar/sneakers.svg",
      title: "Support",
      href: "/agent/support",
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
