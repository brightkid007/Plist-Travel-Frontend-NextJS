
'use client'

import { useState } from "react";
import Pagination from "../../common/Pagination";
import ActionsButton from "../components/ActionsButton";

const BookingHistory = () => {

  return (
    <>
      <div className="tabs -underline-2 js-tabs">
        

        <div className="tabs__content pt-30 js-tabs-content">
          <div className="tabs__pane -tab-item-1 is-tab-el-active">
            <div className="overflow-scroll scroll-bar-1">
              <table className="table-3 -border-bottom col-12">
                <thead className="bg-light-2">
                  <tr>
                    <th>Type</th>
                    <th>Title</th>
                    <th>Order Date</th>
                    <th>Execution Time</th>
                    <th>Total</th>
                    <th>Paid</th>
                    <th>Remain</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Hotel</td>
                    <td>The May Fair Hotel</td>
                    <td>04/04/2022</td>
                    <td className="lh-16">
                      Check in : 05/14/2022
                      <br />
                      Check out : 05/29/2022
                    </td>
                    <td className="fw-500">$130</td>
                    <td>$0</td>
                    <td>$35</td>
                    <td>
                      <span className="rounded-100 py-4 px-10 text-center text-14 fw-500 bg-yellow-4 text-yellow-3">
                        Pending
                      </span>
                    </td>
                    <td>
                      <ActionsButton />
                    </td>
                  </tr>
                  <tr>
                    <td>Hotel</td>
                    <td>The May Fair Hotel</td>
                    <td>04/04/2022</td>
                    <td className="lh-16">
                      Check in : 05/14/2022
                      <br />
                      Check out : 05/29/2022
                    </td>
                    <td className="fw-500">$130</td>
                    <td>$0</td>
                    <td>$35</td>
                    <td>
                      <span className="rounded-100 py-4 px-10 text-center text-14 fw-500 bg-blue-1-05 text-blue-1">
                        Confirmed
                      </span>
                    </td>
                    <td>
                      <ActionsButton />
                    </td>
                  </tr>
                  <tr>
                    <td>Hotel</td>
                    <td>The May Fair Hotel</td>
                    <td>04/04/2022</td>
                    <td className="lh-16">
                      Check in : 05/14/2022
                      <br />
                      Check out : 05/29/2022
                    </td>
                    <td className="fw-500">$130</td>
                    <td>$0</td>
                    <td>$35</td>
                    <td>
                      <span className="rounded-100 py-4 px-10 text-center text-14 fw-500 bg-red-3 text-red-2">
                        Rejected
                      </span>
                    </td>
                    <td>
                      <ActionsButton />
                    </td>
                  </tr>
                  <tr>
                    <td>Hotel</td>
                    <td>The May Fair Hotel</td>
                    <td>04/04/2022</td>
                    <td className="lh-16">
                      Check in : 05/14/2022
                      <br />
                      Check out : 05/29/2022
                    </td>
                    <td className="fw-500">$130</td>
                    <td>$0</td>
                    <td>$35</td>
                    <td>
                      <span className="rounded-100 py-4 px-10 text-center text-14 fw-500 bg-blue-1-05 text-blue-1">
                        Confirmed
                      </span>
                    </td>
                    <td>
                      <ActionsButton />
                    </td>
                  </tr>
                  <tr>
                    <td>Hotel</td>
                    <td>The May Fair Hotel</td>
                    <td>04/04/2022</td>
                    <td className="lh-16">
                      Check in : 05/14/2022
                      <br />
                      Check out : 05/29/2022
                    </td>
                    <td className="fw-500">$130</td>
                    <td>$0</td>
                    <td>$35</td>
                    <td>
                      <span className="rounded-100 py-4 px-10 text-center text-14 fw-500 bg-blue-1-05 text-blue-1">
                        Confirmed
                      </span>
                    </td>
                    <td>
                      <ActionsButton />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <Pagination />
    </>
  );
};

export default BookingHistory;
