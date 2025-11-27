import { useState } from "react";
import { MoreVertical } from "lucide-react";
import { Menu, MenuItem } from "@mui/material";

const index = () => {
  const [menuAnchor, setMenuAnchor] = useState({});

  // Menu handlers for dropdown actions
  const handleMenuOpen = (event, pageIndex) => {
    setMenuAnchor({ [pageIndex]: event.currentTarget });
  };

  const handleMenuClose = (pageIndex) => {
    setMenuAnchor({ [pageIndex]: null });
  };

  const pages = [
    {
      page_title: "Home Page",
      url: "/",
      meta_title: "TravelSaaS-complete travel Management Platform",
      status: "Optimized",
    },
    {
      page_title: "About Us",
      url: "/about",
      meta_title: "About TravelSaaS - our story and mission",
      status: "Optimized",
    },
    {
      page_title: "Hotels",
      url: "/hotels",
      meta_title: "Book Hotels Worldwide - TravelSaaS",
      status: "Needs improvement",
      note: "Requires content updates",
    },
    {
      page_title: "Flights",
      url: "/flights",
      meta_title: "Book Flights - TravelSaaS",
      status: "Needs improvement",
      note: "Requires meta description",
    },
    {
      page_title: "Contact Us",
      url: "/contact",
      meta_title: "Contact TravelSaaS - Get in Touch",
      status: "Optimized",
    },
  ];

  return (
    <div className="overflow-scroll scroll-bar-1">
      <div className="d-flex items-center justify-between mb-10 mt-5">
        <div className="position-relative d-flex items-center w-180 sm:w-full">
          <input
            type="text"
            placeholder="Search pages..."
            className="border-light bg-white rounded-8 px-10 py-5 pl-30"
          />
          <i
            className="icon-search text-light-1 position-absolute"
            style={{
              left: "10px",
              top: "50%",
              transform: "translateY(-50%)",
            }}
          ></i>
        </div>
        <button className="button border-light px-20 py-10 rounded-8">
          Export SEO Data
        </button>
      </div>
      <table className="table-2 col-12 text-14">
        <thead className="text-nowrap">
          <tr>
            <th>Page Title</th>
            <th>URL</th>
            <th>Meta Title</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {pages.map((row, index) => (
            <tr key={index}>
              <td className="align-middle">{row.page_title}</td>
              <td className="align-middle">{row.url}</td>
              <td className="align-middle">{row.meta_title}</td>
              <td className="align-middle">
                <span
                  className={`rounded-100 px-10 text-center text-12 fw-500 ${
                    {
                      "Needs improvement": "bg-yellow-4 text-red-1",
                      Optimized: "bg-dark-blue text-white",
                    }[row.status] || "bg-gray-4 text-gray-3"
                  }`}
                >
                  {row.status}
                </span>
              </td>
              <td className="align-middle">
                <div className="position-relative">
                  <button
                    className="border-0 bg-transparent cursor-pointer px-5 py-5"
                    onClick={(e) => handleMenuOpen(e, index)}
                  >
                    <MoreVertical size={16} />
                  </button>
                  <Menu
                    anchorEl={menuAnchor[index]}
                    open={Boolean(menuAnchor[index])}
                    onClose={() => handleMenuClose(index)}
                  >
                    <MenuItem 
                      onClick={() => {
                        // Add view/edit action here
                        handleMenuClose(index);
                      }}
                    >
                      View
                    </MenuItem>
                    <MenuItem 
                      onClick={() => {
                        // Add edit action here
                        handleMenuClose(index);
                      }}
                    >
                      Edit
                    </MenuItem>
                  </Menu>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default index;
