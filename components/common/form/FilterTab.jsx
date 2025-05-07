
'use client'



const FilterTab = ({ options, tabOption, setTabOption }) => {

//   const options = [
//     { label: "", value: "hotel" },
//     { label: "Tour", value: "tour" },
//     { label: "Activity", value: "activity" },
//     { label: " Holiday Rentals", value: "holiday_rentals" },

//   ];

  console.log(tabOption, "HERE");

  return (
    <div className="tabs__controls row x-gap-10 y-gap-10">
      {options.map((option) => (
        <div className="col-auto" key={option.value}>
          <button
            className={`tabs__button text-14 fw-500 px-20 py-10 rounded-4 bg-light-2 js-tabs-button ${
              tabOption === option.value ? "is-tab-el-active" : ""
            }`}
            onClick={() => setTabOption(option.value)}
          >
            {option.label}
          </button>
        </div>
      ))}
    </div>
  );
};

export default FilterTab;
