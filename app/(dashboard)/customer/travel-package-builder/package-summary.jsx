import flight from "../../../../public/img/dashboard/services/flight.svg";
import hotel from "../../../../public/img/dashboard/services/hotel.svg";
import transportation from "../../../../public/img/dashboard/services/transportation.svg";
import tours from "../../../../public/img/dashboard/services/tours.svg";
import activities from "../../../../public/img/dashboard/services/activities.svg";
import Image from "next/image";

export const PackageSummary = () => {
  const data = [
    {
      name: "Transportation",
      icon: transportation,
      content: (
        <>
          <div className="mt-10 d-flex items-center">
            <svg
              width="16"
              height="17"
              viewBox="0 0 16 17"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5.33203 4.5V8.5"
                stroke="#6B7280"
                stroke-width="1.33333"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M10 4.5V8.5"
                stroke="#6B7280"
                stroke-width="1.33333"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M1.33203 8.5H14.3987"
                stroke="#6B7280"
                stroke-width="1.33333"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M11.9987 12.5H13.9987C13.9987 12.5 14.332 11.3667 14.532 10.6333C14.5987 10.3667 14.6654 10.1 14.6654 9.83333C14.6654 9.56667 14.5987 9.3 14.532 9.03333L13.5987 5.7C13.3987 5.03333 12.732 4.5 11.9987 4.5H2.66536C2.31174 4.5 1.9726 4.64048 1.72256 4.89052C1.47251 5.14057 1.33203 5.47971 1.33203 5.83333V12.5H3.33203"
                stroke="#6B7280"
                stroke-width="1.33333"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M4.66536 13.8346C5.40174 13.8346 5.9987 13.2377 5.9987 12.5013C5.9987 11.7649 5.40174 11.168 4.66536 11.168C3.92898 11.168 3.33203 11.7649 3.33203 12.5013C3.33203 13.2377 3.92898 13.8346 4.66536 13.8346Z"
                stroke="#6B7280"
                stroke-width="1.33333"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M6 12.5H9.33333"
                stroke="#6B7280"
                stroke-width="1.33333"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M10.6654 13.8346C11.4017 13.8346 11.9987 13.2377 11.9987 12.5013C11.9987 11.7649 11.4017 11.168 10.6654 11.168C9.92898 11.168 9.33203 11.7649 9.33203 12.5013C9.33203 13.2377 9.92898 13.8346 10.6654 13.8346Z"
                stroke="#6B7280"
                stroke-width="1.33333"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <div className="text-12 lh-14 fw-600 ml-5">Hourly Transfer</div>
          </div>
          <div className="mt-10 d-flex items-center">
            <svg
              width="16"
              height="17"
              viewBox="0 0 16 17"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M13.3346 7.16536C13.3346 11.1654 8.0013 15.1654 8.0013 15.1654C8.0013 15.1654 2.66797 11.1654 2.66797 7.16536C2.66797 5.75088 3.22987 4.39432 4.23007 3.39413C5.23026 2.39393 6.58681 1.83203 8.0013 1.83203C9.41579 1.83203 10.7723 2.39393 11.7725 3.39413C12.7727 4.39432 13.3346 5.75088 13.3346 7.16536Z"
                stroke="#6B7280"
                stroke-width="1.33333"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M8 9.16797C9.10457 9.16797 10 8.27254 10 7.16797C10 6.0634 9.10457 5.16797 8 5.16797C6.89543 5.16797 6 6.0634 6 7.16797C6 8.27254 6.89543 9.16797 8 9.16797Z"
                stroke="#6B7280"
                stroke-width="1.33333"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <div className="text-12 text-light-1 lh-14 fw-400 ml-5">
              Pickup location to Dropoff location
            </div>
          </div>
          <div className="mt-10 d-flex items-center">
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
            <div className="text-12 text-light-1 lh-14 fw-400 ml-5">
              No date selected
            </div>
          </div>
        </>
      ),
    },
    {
      name: "Flight",
      icon: flight,
      content: (
        <>
          <div className="mt-10 d-flex items-center">
            <svg
              width="16"
              height="17"
              viewBox="0 0 16 17"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11.8667 13.3L10.6667 7.83333L13 5.5C14 4.5 14.3333 3.16667 14 2.5C13.3333 2.16667 12 2.5 11 3.5L8.66667 5.83333L3.2 4.63333C2.86667 4.56667 2.6 4.7 2.46667 4.96667L2.26667 5.3C2.13333 5.63333 2.2 5.96667 2.46667 6.16667L6 8.5L4.66667 10.5H2.66667L2 11.1667L4 12.5L5.33333 14.5L6 13.8333V11.8333L8 10.5L10.3333 14.0333C10.5333 14.3 10.8667 14.3667 11.2 14.2333L11.5333 14.1C11.8 13.9 11.9333 13.6333 11.8667 13.3Z"
                stroke="#6B7280"
                stroke-width="1.33333"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <div className="text-12 lh-14 fw-600 ml-5">To</div>
          </div>
          <div className="mt-10 d-flex items-center">
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
            <div className="text-12 text-light-1 lh-14 fw-400 ml-5">
              No date selected
            </div>
          </div>
          <div className="mt-10 d-flex items-center">
            <svg
              width="16"
              height="17"
              viewBox="0 0 16 17"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10.6654 14.5V13.1667C10.6654 12.4594 10.3844 11.7811 9.88432 11.281C9.38422 10.781 8.70594 10.5 7.9987 10.5H3.9987C3.29145 10.5 2.61318 10.781 2.11308 11.281C1.61298 11.7811 1.33203 12.4594 1.33203 13.1667V14.5"
                stroke="#6B7280"
                stroke-width="1.33333"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M5.9987 7.83333C7.47146 7.83333 8.66536 6.63943 8.66536 5.16667C8.66536 3.69391 7.47146 2.5 5.9987 2.5C4.52594 2.5 3.33203 3.69391 3.33203 5.16667C3.33203 6.63943 4.52594 7.83333 5.9987 7.83333Z"
                stroke="#6B7280"
                stroke-width="1.33333"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M14.668 14.4993V13.1659C14.6675 12.5751 14.4709 12.0011 14.1089 11.5341C13.7469 11.0672 13.2401 10.7336 12.668 10.5859"
                stroke="#6B7280"
                stroke-width="1.33333"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M10.668 2.58594C11.2416 2.7328 11.75 3.0664 12.1131 3.53414C12.4761 4.00188 12.6732 4.57716 12.6732 5.16927C12.6732 5.76138 12.4761 6.33666 12.1131 6.8044C11.75 7.27214 11.2416 7.60574 10.668 7.7526"
                stroke="#6B7280"
                stroke-width="1.33333"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <div className="text-12 text-light-1 lh-14 fw-400 ml-5">
              1 passenger(s), Economy class
            </div>
          </div>
        </>
      ),
    },
    {
      name: "Tours",
      icon: tours,
      content: (
        <>
          <div className="mt-10 d-flex items-center">
            <svg
              width="16"
              height="17"
              viewBox="0 0 16 17"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9.404 4.20087C9.58907 4.29335 9.79312 4.34149 10 4.34149C10.2069 4.34149 10.4109 4.29335 10.596 4.20087L13.0353 2.98087C13.1371 2.93004 13.2501 2.90608 13.3637 2.91125C13.4773 2.91642 13.5876 2.95056 13.6843 3.01043C13.781 3.07029 13.8607 3.15388 13.916 3.25326C13.9713 3.35264 14.0002 3.4645 14 3.5782V12.0875C13.9999 12.2113 13.9654 12.3326 13.9003 12.4379C13.8352 12.5432 13.7421 12.6282 13.6313 12.6835L10.596 14.2015C10.4109 14.294 10.2069 14.3422 10 14.3422C9.79312 14.3422 9.58907 14.294 9.404 14.2015L6.596 12.7975C6.41094 12.7051 6.20689 12.6569 6 12.6569C5.79312 12.6569 5.58907 12.7051 5.404 12.7975L2.96467 14.0175C2.8629 14.0684 2.74982 14.0924 2.63617 14.0872C2.52253 14.0819 2.41211 14.0477 2.31541 13.9878C2.21872 13.9279 2.13898 13.8442 2.08377 13.7447C2.02856 13.6452 1.99972 13.5333 2 13.4195V4.91087C2.00007 4.7871 2.03459 4.66578 2.0997 4.56052C2.16482 4.45526 2.25795 4.3702 2.36867 4.31487L5.404 2.79687C5.58907 2.70439 5.79312 2.65625 6 2.65625C6.20689 2.65625 6.41094 2.70439 6.596 2.79687L9.404 4.20087Z"
                stroke="#6B7280"
                stroke-width="1.33333"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M10 4.34375V14.3438"
                stroke="#6B7280"
                stroke-width="1.33333"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M6 2.65625V12.6563"
                stroke="#6B7280"
                stroke-width="1.33333"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <div className="text-12 lh-14 fw-600 ml-5">Guided Tour</div>
          </div>
          <div className="mt-10 d-flex items-center">
            <svg
              width="16"
              height="17"
              viewBox="0 0 16 17"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M13.3346 7.16536C13.3346 11.1654 8.0013 15.1654 8.0013 15.1654C8.0013 15.1654 2.66797 11.1654 2.66797 7.16536C2.66797 5.75088 3.22987 4.39432 4.23007 3.39413C5.23026 2.39393 6.58681 1.83203 8.0013 1.83203C9.41579 1.83203 10.7723 2.39393 11.7725 3.39413C12.7727 4.39432 13.3346 5.75088 13.3346 7.16536Z"
                stroke="#6B7280"
                stroke-width="1.33333"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M8 9.16797C9.10457 9.16797 10 8.27254 10 7.16797C10 6.0634 9.10457 5.16797 8 5.16797C6.89543 5.16797 6 6.0634 6 7.16797C6 8.27254 6.89543 9.16797 8 9.16797Z"
                stroke="#6B7280"
                stroke-width="1.33333"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <div className="text-12 text-light-1 lh-14 fw-400 ml-5">
              Tour location
            </div>
          </div>
          <div className="mt-10 d-flex items-center">
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
            <div className="text-12 text-light-1 lh-14 fw-400 ml-5">
              No date selected
            </div>
          </div>
        </>
      ),
    },
    {
      name: "Activities",
      icon: activities,
      content: (
        <>
          <div className="mt-10 d-flex items-center">
            <svg
              width="16"
              height="17"
              viewBox="0 0 16 17"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1.33203 6.4987C1.86246 6.4987 2.37117 6.70941 2.74624 7.08448C3.12132 7.45956 3.33203 7.96827 3.33203 8.4987C3.33203 9.02913 3.12132 9.53784 2.74624 9.91291C2.37117 10.288 1.86246 10.4987 1.33203 10.4987V11.832C1.33203 12.1857 1.47251 12.5248 1.72256 12.7748C1.9726 13.0249 2.31174 13.1654 2.66536 13.1654H13.332C13.6857 13.1654 14.0248 13.0249 14.2748 12.7748C14.5249 12.5248 14.6654 12.1857 14.6654 11.832V10.4987C14.1349 10.4987 13.6262 10.288 13.2512 9.91291C12.8761 9.53784 12.6654 9.02913 12.6654 8.4987C12.6654 7.96827 12.8761 7.45956 13.2512 7.08448C13.6262 6.70941 14.1349 6.4987 14.6654 6.4987V5.16536C14.6654 4.81174 14.5249 4.4726 14.2748 4.22256C14.0248 3.97251 13.6857 3.83203 13.332 3.83203H2.66536C2.31174 3.83203 1.9726 3.97251 1.72256 4.22256C1.47251 4.4726 1.33203 4.81174 1.33203 5.16536V6.4987Z"
                stroke="#6B7280"
                stroke-width="1.33333"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M8.66797 3.83203V5.16536"
                stroke="#6B7280"
                stroke-width="1.33333"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M8.66797 11.832V13.1654"
                stroke="#6B7280"
                stroke-width="1.33333"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M8.66797 7.83203V9.16536"
                stroke="#6B7280"
                stroke-width="1.33333"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <div className="text-12 lh-14 fw-600 ml-5">Adventure Activity</div>
          </div>
          <div className="mt-10 d-flex items-center">
            <svg
              width="16"
              height="17"
              viewBox="0 0 16 17"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M13.3346 7.16536C13.3346 11.1654 8.0013 15.1654 8.0013 15.1654C8.0013 15.1654 2.66797 11.1654 2.66797 7.16536C2.66797 5.75088 3.22987 4.39432 4.23007 3.39413C5.23026 2.39393 6.58681 1.83203 8.0013 1.83203C9.41579 1.83203 10.7723 2.39393 11.7725 3.39413C12.7727 4.39432 13.3346 5.75088 13.3346 7.16536Z"
                stroke="#6B7280"
                stroke-width="1.33333"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M8 9.16797C9.10457 9.16797 10 8.27254 10 7.16797C10 6.0634 9.10457 5.16797 8 5.16797C6.89543 5.16797 6 6.0634 6 7.16797C6 8.27254 6.89543 9.16797 8 9.16797Z"
                stroke="#6B7280"
                stroke-width="1.33333"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <div className="text-12 text-light-1 lh-14 fw-400 ml-5">
              Activity location
            </div>
          </div>
          <div className="mt-10 d-flex items-center">
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
            <div className="text-12 text-light-1 lh-14 fw-400 ml-5">
              No date selected
            </div>
          </div>
        </>
      ),
    },
    {
      name: "Hotel",
      icon: hotel,
      content: (
        <>
          <div className="mt-10 d-flex items-center">
            <svg
              width="16"
              height="17"
              viewBox="0 0 16 17"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4 15.1654V3.16536C4 2.81174 4.14048 2.4726 4.39052 2.22256C4.64057 1.97251 4.97971 1.83203 5.33333 1.83203H10.6667C11.0203 1.83203 11.3594 1.97251 11.6095 2.22256C11.8595 2.4726 12 2.81174 12 3.16536V15.1654H4Z"
                stroke="#6B7280"
                stroke-width="1.33333"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M3.9987 8.5H2.66536C2.31174 8.5 1.9726 8.64048 1.72256 8.89052C1.47251 9.14057 1.33203 9.47971 1.33203 9.83333V13.8333C1.33203 14.187 1.47251 14.5261 1.72256 14.7761C1.9726 15.0262 2.31174 15.1667 2.66536 15.1667H3.9987"
                stroke="#6B7280"
                stroke-width="1.33333"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M12 6.5H13.3333C13.687 6.5 14.0261 6.64048 14.2761 6.89052C14.5262 7.14057 14.6667 7.47971 14.6667 7.83333V13.8333C14.6667 14.187 14.5262 14.5261 14.2761 14.7761C14.0261 15.0262 13.687 15.1667 13.3333 15.1667H12"
                stroke="#6B7280"
                stroke-width="1.33333"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M6.66797 4.5H9.33464"
                stroke="#6B7280"
                stroke-width="1.33333"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M6.66797 7.16797H9.33464"
                stroke="#6B7280"
                stroke-width="1.33333"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M6.66797 9.83203H9.33464"
                stroke="#6B7280"
                stroke-width="1.33333"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M6.66797 12.5H9.33464"
                stroke="#6B7280"
                stroke-width="1.33333"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <div className="text-12 lh-14 fw-600 ml-5">Hotel accommodation</div>
          </div>
          <div className="mt-10 d-flex items-center">
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
            <div className="text-12 text-light-1 lh-14 fw-400 ml-5">
              No date selected
            </div>
          </div>
          <div className="mt-10 d-flex items-center">
            <svg
              width="16"
              height="17"
              viewBox="0 0 16 17"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10.6654 14.5V13.1667C10.6654 12.4594 10.3844 11.7811 9.88432 11.281C9.38422 10.781 8.70594 10.5 7.9987 10.5H3.9987C3.29145 10.5 2.61318 10.781 2.11308 11.281C1.61298 11.7811 1.33203 12.4594 1.33203 13.1667V14.5"
                stroke="#6B7280"
                stroke-width="1.33333"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M5.9987 7.83333C7.47146 7.83333 8.66536 6.63943 8.66536 5.16667C8.66536 3.69391 7.47146 2.5 5.9987 2.5C4.52594 2.5 3.33203 3.69391 3.33203 5.16667C3.33203 6.63943 4.52594 7.83333 5.9987 7.83333Z"
                stroke="#6B7280"
                stroke-width="1.33333"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M14.668 14.4993V13.1659C14.6675 12.5751 14.4709 12.0011 14.1089 11.5341C13.7469 11.0672 13.2401 10.7336 12.668 10.5859"
                stroke="#6B7280"
                stroke-width="1.33333"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M10.668 2.58594C11.2416 2.7328 11.75 3.0664 12.1131 3.53414C12.4761 4.00188 12.6732 4.57716 12.6732 5.16927C12.6732 5.76138 12.4761 6.33666 12.1131 6.8044C11.75 7.27214 11.2416 7.60574 10.668 7.7526"
                stroke="#6B7280"
                stroke-width="1.33333"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <div className="text-12 text-light-1 lh-14 fw-400 ml-5">
              1 room(s), 2 adult(s), 0 child(ren)
            </div>
          </div>
        </>
      ),
    },
  ];
  const categoryList = [
    { label: "Flight" },
    { label: "Hotel" },
    { label: "Transportation" },
    { label: "Tours" },
    { label: "Activities" },
  ];
  return (
    <div className="row y-gap-20 py-10 px-10 rounded-8 bg-white shadow-3">
      <h1 className="text-20 lh-14 fw-600">Package Summary</h1>
      {categoryList.map((item, index) => (
        <div
          key={index}
          class="col-auto py-5 px-15 rounded-16 text-10 lh-16 fw-500 uppercase ml-10 mb-10 bg-blue-2 text-dark-3"
        >
          {item.label}
        </div>
      ))}
      <h1 className="text-18 lh-14 fw-500">Package Summary</h1>
      <div className="py-5 px-15">
        <div className="py-15 px-15 rounded-8 border-light bg-white"></div>
      </div>
      <h1 className="text-18 lh-14 fw-500">Selected Services</h1>
      {data.map((item, index) => (
        <div key={index} className="col-6">
          <div className="py-15 px-15 rounded-8 bg-white shadow-3 border-light">
            <div className="d-flex items-center">
              <Image src={item.icon} alt={item.name} width={30} height={30} />
              <div className="text-15 lh-14 fw-500 ml-10">{item.name}</div>
            </div>
            {item.content}
          </div>
        </div>
      ))}
      <div className="py-5 px-15">
        <div className="py-15 px-15 rounded-8 border-light bg-white">
          <div className="d-flex items-center justify-between">
            <div className="text-12 lh-14 fw-500">Status</div>
            <div class="col-auto py-5 px-15 rounded-100 text-10 lh-16 fw-500 ml-10 bg-yellow-1 text-dark-3">
              Pending
            </div>
          </div>
          <div className="d-flex items-center justify-between mt-5">
            <div className="text-12 lh-14 fw-500">Room(s) Price:</div>
            <div className="text-12 lh-14 fw-500">$ 200,000.00</div>
          </div>
          <div className="d-flex items-center justify-between mt-5">
            <div className="text-12 lh-14 fw-500">Extra(s) price:</div>
            <div className="text-12 lh-14 fw-500">$ 0.00</div>
          </div>
          <div className="d-flex items-center justify-between mt-5">
            <div className="text-12 lh-14 fw-500">Discount:</div>
            <div className="text-12 lh-14 fw-500">$ 0.00</div>
          </div>
          <div className="d-flex items-center justify-between border-top-light pt-15 mt-15">
            <div className="text-12 lh-14 fw-600">Total:</div>
            <div className="text-12 lh-14 fw-600">$ 200,000.00</div>
          </div>
        </div>
      </div>
    </div>
  );
};
