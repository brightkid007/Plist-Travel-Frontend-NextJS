import svgIcon from "@/components/data/svgIcon";

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
            {svgIcon.calendar}
            <div className="text-12 lh-16 text-light-1 fw-400 ml-5">{date}</div>
          </div>
        </div>
        <div className={"text-14 lh-16 fw-500 " + (points > 0 ? "text-green-2" : "text-light-1")}>{points > 0 ? `+${points}` : points}</div>
      </div>
    );
};

export default PointHistoryCard;