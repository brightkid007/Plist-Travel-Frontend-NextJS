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
            <div className="row x-gap-10 y-gap-10">
              <div className="col-auto">
                <button className="button px-15 py-10 -blue-1">
                  <i className="icon-share mr-10" />
                  Share
                </button>
              </div>
              {/* End .col */}
              <div className="col-auto">
                <button className="button px-15 py-10 -blue-1 bg-light-2">
                  <i className="icon-heart mr-10" />
                  Save
                </button>
              </div>
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
