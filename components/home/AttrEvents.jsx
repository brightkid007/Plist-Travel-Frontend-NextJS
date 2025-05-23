import Image from "next/image";
import Link from "next/link";

const AttrEvents = () => {
  const addContent = [
    {
      id: 1,
      img: "/img/activities/home/attr1.jpg",
      title: "Best staycation Deals",
      meta: "Enjoy these cool staycation promotions in Singapore",
      routerPath: "/",
      delayAnimation: "0",
    },
    {
      id: 2,
      img: "/img/activities/home/attr2.jpg",
      title: "All Time Favourite Activities in Dubai",
      meta: "Don't forget to check out these activities while you're here",
      routerPath: "/",
      delayAnimation: "0",
    },
  ];

  return (
    <>
      {addContent.map((item) => (
        <div
          className="col-lg-6 col-md-12"
          data-aos="fade-up"
          data-aos-delay={item.delayAnimation}
          key={item.id}
        >
          <div className="ctaCard -type-1 rounded-22">
            <div className="ctaCard__image ratio ratio-16:9">
              <Image
                width={636}
                height={400}
                className="img-ratio js-lazy loaded"
                src={item.img}
                alt="image"
                unoptimized
              />
            </div>
            <div className="ctaCard__content d-flex justify-center items-center flex-column">
              {item.meta ? (
                <>
                  <div className="text-15 fw-500 text-white mb-10">
                    {item.meta}
                  </div>
                </>
              ) : (
                ""
              )}

              <div className="text-30 lg:text-26 text-white text-center">{item.title}</div>
              <div className="d-inline-block mt-20">
                <Link
                  href={item.routerPath}
                  className="button px-48 py-15 -blue-1 -min-180 bg-white text-dark-1"
                >
                  See Attractions/Events
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default AttrEvents;
