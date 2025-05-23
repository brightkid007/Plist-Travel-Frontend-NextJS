import Image from "next/image";
import Link from "next/link";

const Sidebar = () => {
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
    {
      icon: "/img/dashboard/sidebar/map.svg",
      title: "Operations Management",
      href: "/vendor/operations",
    },
    {
      icon: "/img/dashboard/sidebar/sneakers.svg",
      title: "Listings Management",
      href: "/vendor/listings",
    },
    {
      icon: "/img/dashboard/sidebar/house.svg",
      title: "Booking Management",
      href: "#",
    },
    {
      icon: "/img/dashboard/sidebar/taxi.svg",
      title: "Messaging & Communication",
      href: "#",
    },
    {
      icon: "/img/dashboard/sidebar/canoe.svg",
      title: "Coupons & Promotions",
      href: "#",
    },
    {
      icon: "/img/dashboard/sidebar/airplane.svg",
      title: "Subscription & Payments",
      href: "#",
    },
    {
      icon: "/img/dashboard/sidebar/log-out.svg",
      title: "Logout",
      href: "/vendor",
    },
  ];

  return (
    <>
      <div className="sidebar -dashboard" id="vendorSidebarMenu">
        {sidebarData.map((item, index) => (
          <div className="sidebar__item" key={index}>
            <Link
              href={item.href}
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
          </div>
        ))}
      </div>
    </>
  );
};

export default Sidebar;
