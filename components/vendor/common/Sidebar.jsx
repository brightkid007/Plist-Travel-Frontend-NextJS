import { useAuth } from "@/contexts/AuthContext";
import Image from "next/image";
import Link from "next/link";

const Sidebar = () => {
  const { logout } = useAuth();
  const sidebarData = [
    {
      icon: "/img/dashboard/sidebar/compass.svg",
      title: "Dashboard",
      href: "/vendor/dashboard",
    },
    {
      icon: "/img/dashboard/sidebar/booking.svg",
      title: "Profile Management",
      href: "/vendor/profile",
    },
    // {
    //   icon: "/img/dashboard/sidebar/map.svg",
    //   title: "Operations Management",
    //   href: "/vendor/operations",
    // },
    {
      icon: "/img/dashboard/sidebar/sneakers.svg",
      title: "Listings Management",
      links: [
        { title: "Property Listings", href: "/vendor/listings/property" },
        {
          title: "Non-Property Listings",
          href: "/vendor/listings/non-property",
        },
        { title: "Room Type", href: "/vendor/room-type" },
      ],
    },
    {
      icon: "/img/dashboard/sidebar/house.svg",
      title: "Add-on Services",
      href: "/vendor/addon",
    },
    {
      icon: "/img/dashboard/sidebar/booking.svg",
      title: "Booking Management",
      links: [
        {
          title: "Booking List",
          href: "/vendor/booking",
        },
        {
          title: "Booking Calendar",
          href: "/vendor/booking/calendar",
        },
        {
          title: "Rate Plan",
          href: "/vendor/rateplan",
        },
      ],
    },
    {
      icon: "/img/dashboard/sidebar/sneakers.svg",
      title: "User Management",
      href: "/vendor/user",
    },
    {
      icon: "/img/dashboard/sidebar/taxi.svg",
      title: "Messaging & Communication",
      links: [
        {
          title: "Inbox",
          href: "/vendor/conversation",
        },
        {
          title: "Guest Reviews & Ratings",
          href: "/vendor/review",
        },
      ],
    },
    {
      icon: "/img/dashboard/sidebar/canoe.svg",
      title: "Coupons & Promotions",
      href: "/vendor/coupon",
    },
    {
      icon: "/img/dashboard/sidebar/airplane.svg",
      title: "Subscription & Payments",
      href: "/vendor/payment",
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
      <div className="sidebar -dashboard" id="vendorSidebarMenu">
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
                    data-bs-parent="#vendorSidebarMenu"
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
