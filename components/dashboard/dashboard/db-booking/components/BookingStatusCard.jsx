'use client'
import React, { useState } from "react";
import DatePicker, { DateObject } from "react-multi-date-picker";

const BookingStatusCard = ( {roomPrice=0, extraPrice=0, discount=0} ) => {

    return (
        <div className="row border-light rounded-8 py-20 px-20 w-full ml-15 mt-10">
          <div className="d-flex items-center justify-between">
            <div className="text-15 lh-14 fw-500">Status</div>
            <div class="col-auto py-5 px-15 rounded-100 text-12 lh-16 fw-500 ml-10 bg-yellow-1 text-dark-3">
              Pending
            </div>
          </div>
          <div className="d-flex items-center justify-between mt-5">
            <div className="text-15 lh-14 fw-500">Room(s) Price:</div>
            <div className="text-15 lh-14 fw-500">$ {roomPrice}</div>
          </div>
          <div className="d-flex items-center justify-between mt-5">
            <div className="text-15 lh-14 fw-500">Extra(s) price:</div>
            <div className="text-15 lh-14 fw-500">$ {extraPrice}</div>
          </div>
          <div className="d-flex items-center justify-between mt-5">
            <div className="text-15 lh-14 fw-500">Discount:</div>
            <div className="text-15 lh-14 fw-500">$ {discount}</div>
          </div>
          <div className="d-flex items-center justify-between border-top-light pt-15 mt-15">
            <div className="text-15 lh-14 fw-600">Total:</div>
            <div className="text-15 lh-14 fw-600">$ {roomPrice + extraPrice - discount}</div>
          </div>
        </div>
        // <div className="row border-light rounded-8 py-20 px-20 w-full ml-15 mt-10">
            
        //     <div className="d-flex mt-10 justify-between">
        //         <h1 className="text-15 lh-14 fw-500">Status</h1>
        //         <h1 className="text-15 lh-14 fw-500">Status</h1>

        //     </div>
        //     <div className="d-flex mt-10 justify-between">
        //         <h1 className="text-15 lh-14 fw-500">Room(s) price:</h1>
        //         <h1 className="text-15 lh-14 fw-500">$ {roomPrice}</h1>

        //     </div>
        //     <div className="d-flex mt-10 justify-between">
        //         <h1 className="text-15 lh-14 fw-500">Extra(s) price:</h1>
        //         <h1 className="text-15 lh-14 fw-500">$ {extraPrice}</h1>

        //     </div>
        //     <div className="d-flex mt-10 mb-5 justify-between">
        //         <h1 className="text-15 lh-14 fw-500">Discount:</h1>
        //         <h1 className="text-15 lh-14 fw-500">$ {discount}</h1>

        //     </div>
        //     <hr />
        //     <div className="d-flex mt-5 justify-between">
        //         <h1 className="text-15 lh-14 fw-bold">Total:</h1>
        //         <h1 className="text-15 lh-14 fw-bold">$ {roomPrice + extraPrice - discount}</h1>

        //     </div>
        // </div>
        
    )
}

export default BookingStatusCard;

