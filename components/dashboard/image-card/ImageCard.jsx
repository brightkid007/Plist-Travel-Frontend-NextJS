import Image from 'next/image'

const ImageCard = () => {
    return (
        <>
            <div className="col-12 border-light rounded-8 py-20 px-20 w-full">
                {/* <div className="row-md-auto"> */}
                <div style={{
                    position: 'relative',
                    width: '100%',
                    aspectRatio: '16/5',
                    borderRadius: '0.5rem',
                    overflow: 'hidden'
                }}>
                    <Image
                        fill
                        style={{ objectFit: 'cover' }}
                        src="/img/hotels/5.png"
                        alt="image"
                        unoptimized
                    />
                </div>
                {/* </div> */}
                {/* End col */}

                <div className="col-md">
                    <div className="d-flex items-center justify-between gap-10">
                        <h3 className="text-18 lh-14 fw-500">Staycity Aparthotels Deptford Bridge</h3>
                        <div className="d-flex x-gap-5 items-center pt-10">
                            <i className="icon-star text-10 text-yellow-1" /> 4.8
                        </div>
                    </div>
                    <div>
                        Ciutat Vella, Barcelona
                    </div>
                    <div className="d-flex items-center justify-between gap-10">
                        <div className="row x-gap-10 y-gap-10 items-center pt-20">
                            <div className="col-auto">
                                <p className="text-18">
                                    $149
                                </p>
                            </div>
                            <div className="col-auto">
                                <p className="text-14">
                                    per night
                                </p>
                            </div>
                        </div>
                        <div className="row x-gap-10 y-gap-10 items-center pt-20">2783 reviews</div>
                        {/* End .row */}
                    </div>

                    <div className="row x-gap-10 y-gap-10 pt-20">
                        <div className="col-auto">
                            <div className="border-light rounded-100 py-5 px-20 text-14 lh-14">
                                Breakfast
                            </div>
                        </div>
                        <div className="col-auto">
                            <div className="border-light rounded-100 py-5 px-20 text-14 lh-14">
                                WiFi
                            </div>
                        </div>
                        <div className="col-auto">
                            <div className="border-light rounded-100 py-5 px-20 text-14 lh-14">
                                Spa
                            </div>
                        </div>
                        <div className="col-auto">
                            <div className="border-light rounded-100 py-5 px-20 text-14 lh-14">
                                Bar
                            </div>
                        </div>
                    </div>
                    {/* End .row */}
                </div>
                {/* End col */}
            </div>

        </>
    );
};

export default ImageCard;