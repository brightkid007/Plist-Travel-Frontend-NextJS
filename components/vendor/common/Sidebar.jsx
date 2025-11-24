"use client";
import { useAuth } from "@/contexts/AuthContext";
import { useVendorPermissions } from "@/hooks/useVendorPermissions";
import Image from "next/image";
import Link from "next/link";

const Sidebar = () => {
  const { logout } = useAuth();
  const { hasPermission } = useVendorPermissions();

  const allSidebarData = [
    {
      icon: "/img/dashboard/sidebar/compass.svg",
      title: "Dashboard",
      href: "/vendor/dashboard",
      permission: { resource: "dashboard", action: "view" },
    },
    {
      icon: "/img/dashboard/sidebar/booking.svg",
      title: "Profile Management",
      href: "/vendor/profile",
      permission: { resource: "profile_management", action: "view" },
    },
    {
      icon: "/img/dashboard/sidebar/sneakers.svg",
      title: "User Management",
      href: "/vendor/user",
      permission: { resource: "user_management", action: "view" },
    },
    {
      icon: "/img/dashboard/sidebar/sneakers.svg",
      title: "Listings Management",
      permission: { resource: "listings_management", action: "view" },
      links: [
        { 
          title: "Property Listings", 
          href: "/vendor/listings/property",
          permission: { resource: "listings_management", action: "view" },
        },
        {
          title: "Non-Property Listings",
          href: "/vendor/listings/non-property",
          permission: { resource: "listings_management", action: "view" },
        },
        { 
          title: "Room Type", 
          href: "/vendor/room-type",
          permission: { resource: "listings_management", action: "view" },
        },
      ],
    },
    {
      icon: "/img/dashboard/sidebar/house.svg",
      title: "Add-on Services",
      href: "/vendor/addon",
      permission: { resource: "addon_services_management", action: "view" },
    },
    {
      icon: "/img/dashboard/sidebar/booking.svg",
      title: "Booking Management",
      permission: { resource: "bookings_calendar_management", action: "view" },
      links: [
        {
          title: "Booking List",
          href: "/vendor/booking",
          permission: { resource: "bookings_calendar_management", action: "view" },
        },
        {
          title: "Booking Calendar",
          href: "/vendor/booking/calendar",
          permission: { resource: "bookings_calendar_management", action: "view" },
        },
        {
          title: "Rate Plan",
          href: "/vendor/rateplan",
          permission: { resource: "rateplan_management", action: "view" },
        },
      ],
    },
    {
      icon: "/img/dashboard/sidebar/taxi.svg",
      title: "Messaging & Communication",
      permission: { resource: "messaging_communication", action: "view" },
      links: [
        {
          title: "Inbox",
          href: "/vendor/conversation",
          permission: { resource: "messaging_communication", action: "view" },
        },
        {
          title: "Guest Reviews & Ratings",
          href: "/vendor/review",
          permission: { resource: "messaging_communication", action: "view" },
        },
      ],
    },
    {
      icon: "/img/dashboard/sidebar/canoe.svg",
      title: "Coupons & Promotions",
      href: "/vendor/coupon",
      permission: { resource: "coupon_promotion_management", action: "view" },
    },
    {
      icon: "/img/dashboard/sidebar/airplane.svg",
      title: "Subscription & Payments",
      href: "/vendor/payment",
      permission: { resource: "subscription_payment_management", action: "view" },
    },
    {
      icon: "/img/dashboard/sidebar/log-out.svg",
      title: "Logout",
      onClick: () => {
        logout();
      },
      permission: null, // Logout doesn't need permission
    },
  ];

  // Filter sidebar items based on permissions
  const sidebarData = allSidebarData.filter((item) => {
    // Always show logout
    if (!item.permission) return true;
    
    // Check if user has permission for this item
    if (item.links) {
      // For items with sub-links, show if at least one sub-link has permission
      const hasAnyLinkPermission = item.links.some((link) => {
        if (!link.permission) return true;
        return hasPermission(link.permission.resource, link.permission.action);
      });
      return hasAnyLinkPermission;
    }
    
    return hasPermission(item.permission.resource, item.permission.action);
  }).map((item) => {
    // Filter sub-links based on permissions
    if (item.links) {
      return {
        ...item,
        links: item.links.filter((link) => {
          if (!link.permission) return true;
          return hasPermission(link.permission.resource, link.permission.action);
        }),
      };
    }
    return item;
  }).filter((item) => {
    // Remove parent items if all sub-links were filtered out
    if (item.links && item.links.length === 0) return false;
    return true;
  });

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
