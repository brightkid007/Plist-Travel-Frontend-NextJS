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

export default PointHistoryCard;