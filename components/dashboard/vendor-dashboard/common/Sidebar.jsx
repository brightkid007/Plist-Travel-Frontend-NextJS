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
      title: "Manage Tour",
      href: "#",
    },
    {
      icon: "/img/dashboard/sidebar/sneakers.svg",
      title: "Manage Activity",
      href: "#",
    },
    {
      icon: "/img/dashboard/sidebar/house.svg",
      title: "Manage Holiday Rental",
      href: "#",
    },
    {
      icon: "/img/dashboard/sidebar/taxi.svg",
      title: "Manage Car",
      href: "#",
    },
    {
      icon: "/img/dashboard/sidebar/canoe.svg",
      title: "Manage Cruise",
      href: "#",
    },
    {
      icon: "/img/dashboard/sidebar/airplane.svg",
      title: "Manage Flights",
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
