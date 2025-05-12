'use client'

import Image from "next/image";
import Link from "next/link";

import { isActiveLink } from "@/utils/linkActiveChecker";
import { usePathname } from "next/navigation";

const Sidebar = () => {
const pathname = usePathname()

  const sidebarContent = [
    // {
    //   id: 1,
    //   icon: "/img/dashboard/sidebar/compass.svg",
    //   name: "Dashboard",
    //   routePath: "/dashboard/db-dashboard",
    // },
    {
      id: 1,
      icon: "/img/dashboard/sidebar/booking.svg",
      name: "Booking History",
      routePath: "/customer/booking-history",
    },
    {
      id: 2,
      icon: "/img/dashboard/sidebar/house.svg",
      name: "Travel Package Builder",
      routePath: "/customer/package-builder",
    },
    {
      id: 3,
      icon: "/img/dashboard/sidebar/bookmark.svg",
      name: "Sales Link Generator",
      routePath: "/customer/sales-link-generator",
    },
    {
      id: 4,
      icon: "/img/dashboard/sidebar/gear.svg",
      name: "Profile",
      routePath: "/customer/profile",
    },
    {
      id: 5,
      icon: "/img/dashboard/sidebar/canoe.svg",
      name: "Loyalty",
      routePath: "/customer/loyalty",
    },
    // {
    //   id: 6,
    //   icon: "/img/dashboard/sidebar/log-out.svg",
    //   name: " Logout",
    //   routePath: "/",
    // },
  ];
  return (
    <div className="sidebar -dashboard">
      {sidebarContent.map((item) => (
        <div className="sidebar__item" key={item.id}>
          <div
            className={`${
              isActiveLink(item.routePath, pathname) ? "-is-active" : ""
            } sidebar__button `}
          >
            <Link
              href={item.routePath}
              className="d-flex items-center text-15 lh-1 fw-500"
            >
              <Image
                width={20}
                height={20}
                src={item.icon}
                alt="image"
                className="mr-15"
              />
              {item.name}
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Sidebar;
