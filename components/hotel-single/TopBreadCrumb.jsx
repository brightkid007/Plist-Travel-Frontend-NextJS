import Link from "next/link";

const TopBreadCrumb = () => {
  return (
    <section className="py-10 d-flex items-center bg-light-2">
      <div className="container">
        <div className="row y-gap-10 items-center justify-between">
          <div className="col-auto">
            <div className="row x-gap-10 y-gap-5 items-center text-14 text-light-1">
              <div className="col-auto">Home</div>
              {/* End .col-auto */}
              <div className="col-auto">&gt;</div>
              {/* End .col-auto */}
              <div className="col-auto">London Hotels</div>
              {/* End .col-auto */}
              <div className="col-auto">&gt;</div>
              {/* End .col-auto */}
              <div className="col-auto">
                <div className="text-dark-1">
                  Great Northern Hotel, a Tribute Portfolio Hotel, London
                </div>
              </div>
              {/* End .col-auto */}
            </div>
            {/* End .row */}
          </div>
          {/* End .col-auto */}
          <div className="col-auto">
            <div className="row x-gap-15 y-gap-15 items-center">
              <button className="col-auto h-30 px-24 -dark-1 bg-gray-800 text-black">
                <img src="/img/icons/hart.svg" alt="save_button" /> Save
              </button>
              <button className="col-auto h-30 px-24 -dark-1 bg-gray-800 text-black">
                <img src="/img/icons/share.svg" alt="share_button" /> Share
              </button>
            </div>
          </div>
          {/* End col-auto */}
        </div>
        {/* End .row */}
      </div>
      {/* End .container */}
    </section>
  );
};

export default TopBreadCrumb;
