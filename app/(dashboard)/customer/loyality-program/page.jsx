"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import Header1 from "@/components/header/header-1";

const LoyalityProgram = () => {
  const options = [
    { label: "Rewards", value: "rewards", content: <Rewards /> },
    {
      label: "Point History",
      value: "pointhistory",
      content: <PointHistory />,
    },
  ];
  const [option, setOption] = useState("rewards");
  return (
    <>
      <Header1 />
      <div className="py-40"></div>
      <div className="container">
        <div className="text-30 lh-14 fw-600 mt-30">Loyalty Program</div>
        <div className="row px-10 mt-30">
          <div className="col-md-4 col-sm-12">
            <div className="border-light rounded-8 bg-white shadow-3 px-20 py-20">
              <div className="text-20 lh-14 fw-600 mb-20">
                Your Loyalty Status
              </div>
              <div className="row justify-center items-center">
                <div className="col-auto rounded-full bg-blue-1 text-white text-center text-40 fw-600">
                  AS
                </div>
                <div className="col-12 text-18 fw-600 text-center">Asf</div>
                <div class="col-auto py-5 px-15 rounded-16 text-10 lh-16 fw-500 ml-10 bg-dark-3 text-white">
                  Pending
                </div>
              </div>
              <div className="d-flex justify-between items-center mt-20">
                <div className="text-12 lh-14 fw-500">Current Points</div>
                <div className="text-12 lh-14 fw-600">100</div>
              </div>
              <div className="w-100 bg-dark-3 rounded-16 py-5 mt-10 mb-10"></div>
              <div className="d-flex justify-between items-center">
                <div className="text-10 lh-14 text-light-1 fw-400">Bronze</div>
                <div className="text-10 lh-14 text-light-1 fw-400">Silver</div>
              </div>
              <div className="text-12 lh-14 mt-10 mb-10 fw-400">
                400 more points to reach Silver
              </div>
              <div className="rounded-8 bg-blue-2 px-15 py-10">
                <div className="text-12 lh-14 fw-600">Member Benefits</div>
                <div className="text-12 lh-14 fw-400 mt-5">
                  <i className="icon icon-check mr-5 text-blue-1"></i>
                  Earn points on every booking
                </div>
                <div className="text-12 lh-14 fw-400 mt-5">
                  <i className="icon icon-check mr-5 text-blue-1"></i>
                  Exclusive member discounts
                </div>
                <div className="text-12 lh-14 fw-400 mt-5">
                  <i className="icon icon-check mr-5 text-blue-1"></i>
                  Priority customer support
                </div>
              </div>
            </div>
            <div className="border-light rounded-8 bg-white shadow-3 px-20 py-15 mt-20 mb-20">
              <div className="text-20 lh-14 fw-600 mb-15">
                How to Earn Points
              </div>
              <div className="d-flex mb-15">
                <img src="/img/dashboard/icons/bookings.svg" alt="icon" />
                <div className="ml-10">
                  <div className="text-14 lh-14 fw-500">Bookings</div>
                  <div className="text-12 lh-14 fw-400 text-light-1">
                    Earn 10 points for every $1 spent on bookings
                  </div>
                </div>
              </div>
              <div className="d-flex mb-15">
                <img src="/img/dashboard/icons/reviews.svg" alt="icon" />
                <div className="ml-10">
                  <div className="text-14 lh-14 fw-500">Reviews</div>
                  <div className="text-12 lh-14 fw-400 text-light-1">
                    Earn 50 points for each review you submit{" "}
                  </div>
                </div>
              </div>
              <div className="d-flex mb-15">
                <img src="/img/dashboard/icons/referals.svg" alt="icon" />
                <div className="ml-10">
                  <div className="text-14 lh-14 fw-500">Referrals</div>
                  <div className="text-12 lh-14 fw-400 text-light-1">
                    Earn 250 points for each friend you refer{" "}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-8 col-sm-12">
            <div className="row bg-light-2 py-5 rounded-8">
              {options.map((item) => (
                <div className="col-6 px-5" key={item.value}>
                  <button
                    className={`text-14 w-100 fw-500 py-5 rounded-8 ${
                      option === item.value ? "bg-white" : "text-light-1"
                    }`}
                    onClick={() => setOption(item.value)}
                  >
                    {item.label}
                  </button>
                </div>
              ))}
            </div>
            <div className="row mt-30 border-light rounded-8 bg-white shadow-3 px-15 py-10">
              {options.map((item) => option === item.value && item.content)}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const Rewards = () => {
  const filterOptions = [
    {
      label: "All",
      value: "all",
      icon: (
        <svg
          width="21"
          height="20"
          viewBox="0 0 21 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clip-path="url(#clip0_307_65540)">
            <path
              d="M13.5584 10.7422L14.8209 17.8472C14.8351 17.9309 14.8233 18.0168 14.7873 18.0936C14.7512 18.1705 14.6926 18.2344 14.6192 18.277C14.5458 18.3196 14.4612 18.3388 14.3766 18.3319C14.292 18.3251 14.2115 18.2926 14.1459 18.2389L11.1626 15.9997C11.0186 15.8921 10.8436 15.834 10.6638 15.834C10.4841 15.834 10.3091 15.8921 10.1651 15.9997L7.17676 18.238C7.11119 18.2917 7.03081 18.3241 6.94634 18.331C6.86187 18.3378 6.77732 18.3187 6.70398 18.2762C6.63064 18.2338 6.57199 18.17 6.53586 18.0933C6.49973 18.0166 6.48783 17.9308 6.50176 17.8472L7.76343 10.7422"
              stroke="#020817"
              stroke-width="1.66667"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M10.6602 11.668C13.4216 11.668 15.6602 9.42939 15.6602 6.66797C15.6602 3.90654 13.4216 1.66797 10.6602 1.66797C7.89873 1.66797 5.66016 3.90654 5.66016 6.66797C5.66016 9.42939 7.89873 11.668 10.6602 11.668Z"
              stroke="#020817"
              stroke-width="1.66667"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </g>
          <defs>
            <clipPath id="clip0_307_65540">
              <rect
                width="20"
                height="20"
                fill="white"
                transform="translate(0.660156)"
              />
            </clipPath>
          </defs>
        </svg>
      ),
    },
    {
      label: "Hotels",
      value: "hotels",
      icon: (
        <svg
          width="21"
          height="20"
          viewBox="0 0 21 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clip-path="url(#clip0_307_65549)">
            <path
              d="M8.49219 18.3344V12.8594"
              stroke="#020817"
              stroke-width="1.66667"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M10.1602 9.16797H10.1685"
              stroke="#020817"
              stroke-width="1.66667"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M10.1602 5.83203H10.1685"
              stroke="#020817"
              stroke-width="1.66667"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M11.8281 12.8594V18.3344"
              stroke="#020817"
              stroke-width="1.66667"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M12.6602 13.3333C11.9389 12.7924 11.0617 12.5 10.1602 12.5C9.25861 12.5 8.38139 12.7924 7.66016 13.3333"
              stroke="#020817"
              stroke-width="1.66667"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M13.4922 9.16797H13.5005"
              stroke="#020817"
              stroke-width="1.66667"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M13.4922 5.83203H13.5005"
              stroke="#020817"
              stroke-width="1.66667"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M6.82812 9.16797H6.83646"
              stroke="#020817"
              stroke-width="1.66667"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M6.82812 5.83203H6.83646"
              stroke="#020817"
              stroke-width="1.66667"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M15.1589 1.66797H5.15885C4.23838 1.66797 3.49219 2.41416 3.49219 3.33464V16.668C3.49219 17.5884 4.23838 18.3346 5.15885 18.3346H15.1589C16.0793 18.3346 16.8255 17.5884 16.8255 16.668V3.33464C16.8255 2.41416 16.0793 1.66797 15.1589 1.66797Z"
              stroke="#020817"
              stroke-width="1.66667"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </g>
          <defs>
            <clipPath id="clip0_307_65549">
              <rect
                width="20"
                height="20"
                fill="white"
                transform="translate(0.160156)"
              />
            </clipPath>
          </defs>
        </svg>
      ),
    },
    {
      label: "Flights",
      value: "flights",
      icon: (
        <svg
          width="21"
          height="20"
          viewBox="0 0 21 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clip-path="url(#clip0_307_65566)">
            <path
              d="M14.9935 16L13.4935 9.16667L16.4102 6.25C17.6602 5 18.0768 3.33333 17.6602 2.5C16.8268 2.08333 15.1602 2.5 13.9102 3.75L10.9935 6.66667L4.16016 5.16667C3.74349 5.08333 3.41016 5.25 3.24349 5.58333L2.99349 6C2.82682 6.41667 2.91016 6.83333 3.24349 7.08333L7.66016 10L5.99349 12.5H3.49349L2.66016 13.3333L5.16016 15L6.82682 17.5L7.66016 16.6667V14.1667L10.1602 12.5L13.0768 16.9167C13.3268 17.25 13.7435 17.3333 14.1602 17.1667L14.5768 17C14.9102 16.75 15.0768 16.4167 14.9935 16Z"
              stroke="#020817"
              stroke-width="1.66667"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </g>
          <defs>
            <clipPath id="clip0_307_65566">
              <rect
                width="20"
                height="20"
                fill="white"
                transform="translate(0.160156)"
              />
            </clipPath>
          </defs>
        </svg>
      ),
    },
    {
      label: "Cars",
      value: "cars",
      icon: (
        <svg
          width="21"
          height="20"
          viewBox="0 0 21 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clip-path="url(#clip0_307_65574)">
            <path
              d="M15.9948 14.1654H17.6615C18.1615 14.1654 18.4948 13.832 18.4948 13.332V10.832C18.4948 10.082 17.9115 9.41536 17.2448 9.2487C15.7448 8.83203 13.4948 8.33203 13.4948 8.33203C13.4948 8.33203 12.4115 7.16536 11.6615 6.41536C11.2448 6.08203 10.7448 5.83203 10.1615 5.83203H4.32812C3.82812 5.83203 3.41146 6.16536 3.16146 6.58203L1.99479 8.9987C1.88444 9.32055 1.82812 9.65845 1.82812 9.9987V13.332C1.82812 13.832 2.16146 14.1654 2.66146 14.1654H4.32812"
              stroke="#020817"
              stroke-width="1.66667"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M5.99479 15.8333C6.91527 15.8333 7.66146 15.0871 7.66146 14.1667C7.66146 13.2462 6.91527 12.5 5.99479 12.5C5.07432 12.5 4.32812 13.2462 4.32812 14.1667C4.32812 15.0871 5.07432 15.8333 5.99479 15.8333Z"
              stroke="#020817"
              stroke-width="1.66667"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M7.66016 14.168H12.6602"
              stroke="#020817"
              stroke-width="1.66667"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M14.3268 15.8333C15.2473 15.8333 15.9935 15.0871 15.9935 14.1667C15.9935 13.2462 15.2473 12.5 14.3268 12.5C13.4063 12.5 12.6602 13.2462 12.6602 14.1667C12.6602 15.0871 13.4063 15.8333 14.3268 15.8333Z"
              stroke="#020817"
              stroke-width="1.66667"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </g>
          <defs>
            <clipPath id="clip0_307_65574">
              <rect
                width="20"
                height="20"
                fill="white"
                transform="translate(0.160156)"
              />
            </clipPath>
          </defs>
        </svg>
      ),
    },
  ];
  const discountItems = [
    {
      name: "Hotel Discount",
      description: "Get $50 off your next hotel booking",
      points: 500,
      image: "/img/destinations/1/1.png",
    },
    {
      name: "Flight Discount",
      description: "Get $75 off your next flight booking",
      points: 750,
      image: "/img/destinations/1/1.png",
    },
    {
      name: "Room Upgrade",
      description: "Free room upgrade on your next hotel booking",
      points: 350,
      image: "/img/destinations/1/1.png",
    },
    {
      name: "Priority Check-in",
      description: "Skip the line with priority check-in",
      points: 200,
      image: "/img/destinations/1/1.png",
    },
    {
      name: "Car Rental Discount",
      description: "20% off your next car rental",
      points: 300,
      image: "/img/destinations/1/1.png",
    },
  ];
  const [filter, setFilter] = useState("all");

  return (
    <>
      <div className="text-20 lh-14 fw-600 px-0">Redeem Your Points</div>
      <div className="text-14 text-light-1 lh-14 fw-400 mb-20 px-0">
        Use your points to get discounts, upgrades, and more
      </div>
      <div className="row mb-20">
        {filterOptions.map((option, index) => (
          <div
            key={index}
            className={
              "col-auto mr-5 d-flex flex-column align-items-center rounded-8 py-15 " +
              (filter === option.value ? "border-dark-4" : "border-light")
            }
            onClick={() => setFilter(option.value)}
          >
            {option.icon}
            <div className="text-12 lh-14 fw-500 mt-5">{option.label}</div>
          </div>
        ))}
      </div>
      {discountItems.map((item, index) => (
        <DiscountCard
          key={index}
          name={item.name}
          description={item.description}
          points={item.points}
          image={item.image}
        />
      ))}
    </>
  );
};

const DiscountCard = ({ name, description, points, image }) => {
  return (
    <div className="col-md-6 col-sm-12 row mr-10 mb-10">
      <div className="col-4 px-0">
        <img
          src={image}
          alt=""
          className="rounded-start"
          style={{ width: "100%", height: "135px", objectFit: "fill" }}
        />
      </div>
      <div className="col-8 bg-blue-2 px-15 py-10 rounded-end d-flex flex-column items-start justify-between">
        <div>
          <div className="text-14 lh-16 fw-600">{name}</div>
          <div className="text-12 lh-16 text-light-1 fw-400">{description}</div>
          <div className="text-12 lh-16 text-blue-1 fw-500 mt-5">
            {points} points
          </div>
        </div>
        <button className="text-12 lh-16 rounded-4 py-5 px-15 text-white bg-blue-1 fw-400">
          Not Enough Points
        </button>
      </div>
    </div>
  );
};

const PointHistory = () => {
  const history = [
    {
      label: "Hotel Booking - The Montcalm London",
      points: +250,
      date: "May 15, 2023",
    },
    {
      label: "Flight Booking - New York to Paris",
      points: +350,
      date: "April 28, 2023",
    },
    {
      label: "Redeemed for Hotel Discount",
      points: -500,
      date: "April 10, 2023",
    },
    { label: "Car Rental - Barcelona", points: +150, date: "March 22, 2023" },
    { label: "Welcome Bonus", points: +100, date: "March 5, 2023" },
  ];
  return (
    <>
      <div className="text-20 lh-14 fw-600 mb-20">
        Points Transaction History
      </div>
      <div className="text-14 text-light-1 lh-14 fw-400 mb-20 px-0">
        See how you've earned and spent your loyalty points{" "}
      </div>
      {history.map((item, index) => (
        <PointHistoryCard
          key={index}
          date={item.date}
          label={item.label}
          points={item.points}
        />
      ))}
    </>
  );
};

const PointHistoryCard = ({ date, label, points }) => {
  return (
    <div className="border-light rounded-8 bg-white shadow-3 px-15 py-15 mb-10 d-flex items-center">
      <img
        src={`/img/dashboard/icons/${points > 0 ? "rasing" : "discount"}.svg`}
        alt=""
      />
      <div className="d-flex flex-column justify-between ml-10 me-auto">
        <div className="text-14 lh-16 fw-600">{label}</div>
        <div className="d-flex">
          <svg
            width="16"
            height="17"
            viewBox="0 0 16 17"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5.33203 1.83203V4.4987"
              stroke="#6B7280"
              stroke-width="1.33333"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M10.668 1.83203V4.4987"
              stroke="#6B7280"
              stroke-width="1.33333"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M12.6667 3.16797H3.33333C2.59695 3.16797 2 3.76492 2 4.5013V13.8346C2 14.571 2.59695 15.168 3.33333 15.168H12.6667C13.403 15.168 14 14.571 14 13.8346V4.5013C14 3.76492 13.403 3.16797 12.6667 3.16797Z"
              stroke="#6B7280"
              stroke-width="1.33333"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M2 7.16797H14"
              stroke="#6B7280"
              stroke-width="1.33333"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <div className="text-12 lh-16 text-light-1 fw-400 ml-5">{date}</div>
        </div>
      </div>
      <div className={"text-14 lh-16 fw-500 " + (points > 0 ? "text-green-2" : "text-light-1")}>{points > 0 ? `+${points}` : points}</div>
    </div>
  );
};

export default dynamic(() => Promise.resolve(LoyalityProgram), {
  ssr: false,
});
