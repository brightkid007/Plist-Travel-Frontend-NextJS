import React from "react";

const FunFacts = () => {
  const questionList = [
    [
      "Do they serve breakfast?",
      "Can I park there?",
      "Is there a restaurant?",
      "Is there an airport shuttle service?",
      "Is there a spa?",
    ],
    [
      "Is the swimming pool open?",
      "What's the Wi-Fi policy?",
      "Are there rooms with a private bathroom?",
      "What restaurants, attractions, and public transport options are nearby?",
      "What's the pet policy?",
    ],
  ];

  return (
    <div className="row px-5 x-gap-30">
      {questionList.map((list, i) => (
        <div className="col-lg-4 col-md-12 px-10 py-10" key={"group" + i}>
          <div className="border-light rounded-8 px-15 py-15 d-flex flex-column justify-between h-100">
            {list.map((item, index) => (
              <React.Fragment key={`group${i}_question${index}`}>
                <div
                  className="d-flex justify-between items-center"
                  key={"group" + i + "question" + index}
                >
                  <div className="d-flex items-center">
                    <span className="material-symbols-outlined fw-300 mr-10">
                      live_help
                    </span>
                    <span className="text-16">{item}</span>
                  </div>
                  <span className="material-symbols-outlined">
                    chevron_right
                  </span>
                </div>
                {index < list.length - 1 && (
                  <div className="border-top-light pt-10 mt-10" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      ))}
      <div className="col-lg-4 col-md-12 px-10 py-10">
        <div className="border-light rounded-8 px-15 py-15 d-flex flex-column items-center justify-center h-100">
          <div className="text-24 fw-600">Still need more info?</div>
          <button className="button -md -dark-1 border-blue-1 text-blue-1 mt-20 mb-20">
            Ask a question
          </button>
          <div className="text-14">
            We have an instant answer to most questions
          </div>
        </div>
      </div>
    </div>
  );
};

export default FunFacts;
