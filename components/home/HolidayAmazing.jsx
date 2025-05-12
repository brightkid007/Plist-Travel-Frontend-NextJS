"use client"

const HolidayAmazing = () => {
    return (
        <div 
            style={{
                backgroundColor: '#EEFAFF',
            }}
            className="row container-fluid"
        >
            <div className="col-4 text-center text-primary d-flex flex-column justify-between">
                <h2 className="col-12 mt-20">Let's make your next holiday amazing</h2>
                <img src="/img/general/amazing3.png" class="rounded float-start img-fluid w-50" alt="" />
            </div>
            <div className="col-4">
                <img src="/img/general/amazing1.png" alt="" />
            </div>
            <div className="col-4">
                <img src="/img/general/amazing2.png" alt="" />
            </div>
        </div>
    )
};

export default HolidayAmazing;