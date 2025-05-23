import Link from "next/link";
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
          <button
            className="button -md -dark-1 border-blue-1 text-blue-1 mt-20 mb-20"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#questionOffCanvas"
            aria-controls="questionOffCanvas"
          >
            Ask a question
          </button>

          <div
            className="offcanvas offcanvas-end rounded-left-22"
            style={{ width: "600px" }}
            tabindex="-1"
            id="questionOffCanvas"
            aria-labelledby="questionOffCanvasLabel"
          >
            <div className="offcanvas-header">
              <div>
                <div id="questionOffCanvasLabel" className="text-26 fw-600">
                  Ask a question
                </div>
                <div className="text-16 text-light-1">
                  <span className="fw-600">About: </span>Studio 6-Denton, TX -
                  UNT
                </div>
              </div>
              <button
                type="button"
                className="btn-close text-reset"
                data-bs-dismiss="offcanvas"
                aria-label="Close"
              />
            </div>
            <div className="offcanvas-body">
              <h1 className="text-15 lh-14 fw-500">
                Your question<span className="text-red-1">*</span>
              </h1>
              <textarea
                rows={3}
                className="border-light rounded-8 py-5 px-20 w-full mt-10"
                type="textarea"
                placeholder="e.g. do you offer room service? "
              />
              <div className="text-12 text-light-1">300 characters left</div>
              <div className="d-flex mt-10">
                <span className="material-symbols-outlined fw-300 mr-10">
                  info
                </span>
                <span className="text-14 fw-500 items-center">
                  If we can't answer your question right away, you can forward
                  it to the property. Please make sure to not include any
                  personal info and{" "}
                  <button
                    className="btn btn-link text-14 fw-500 px-0 py-0"
                    type="button"
                    data-bs-toggle="modal"
                    data-bs-target="#guidelinesModal"
                  >
                    follow our guidelines.
                  </button>
                </span>
              </div>
            </div>
            <div className="border-top-light px-30 py-20">
              <button className="button -md -dark-1 bg-blue-1 text-white fw-600 w-100 rounded-8">
                Submit question
              </button>
            </div>
          </div>
          <div className="text-14">
            We have an instant answer to most questions
          </div>
        </div>
      </div>
      <GuidelinesModal />
    </div>
  );
};

const GuidelinesModal = () => {
  return (
    <div
      className="modal fade"
      id="guidelinesModal"
      tabIndex="-1"
      aria-labelledby="guidelinesModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-body">
            <div className="d-flex justify-between items-center">
              <div className="text-20 fw-600">
                Booking.com questions and answers guidelines
              </div>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>
            <div className="text-14 mt-20 mb-20">
              Questions and answers should be property or room related. The most
              helpful contributions are detailed and help others make better
              decisions. Please don’t include personal, political, ethical, or
              religious commentary. Promotional content will be removed and
              issues concerning Booking.com’s services should be routed to our
              Customer Service or Accommodation Service teams.
            </div>
            <div className="text-14 mt-20 mb-20">
              Please avoid using profanity or attempts to approximate profanity
              with creative spelling, in any language. Comments and media that
              include 'hate speech', discriminatory remarks, threats, sexually
              explicit remarks, violence, and the promotion of illegal activity
              are not permitted.
            </div>
            <div className="text-14 mt-20 mb-20">
              Respect the privacy of others. Booking.com will make an effort to
              obscure email addresses, telephone numbers, website addresses,
              social media accounts, and similar details.
            </div>
            <div className="text-14 mt-20 mb-20">
              Booking.com does not accept responsibility or liability for any
              question and answers. Booking.com is a distributor (without any
              obligation to verify) and not a publisher of these questions and
              answers. Booking.com may, at its own discretion, alter, modify,
              delete or otherwise change these Guidelines.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FunFacts;
