import React from "react";
import { Link } from "react-router-dom";
import { FaArrowRight, FaShippingFast } from "react-icons/fa";
import { FiSend } from "react-icons/fi";
import { MdPayment } from "react-icons/md";
import { BiSupport } from "react-icons/bi";
const Hero = () => {
  const features = [
    {
      icon: <FaShippingFast />,
      title: "Free Shiping",
      text: "On all Orders over $100",
    },
    {
      icon: <FiSend />,
      title: "Fast Delivery",
      text: "Wordwide in3-5 days",
    },
    {
      icon: <BiSupport />,
      title: "24/7  Support",
      text: "Expert fashion advice",
    },
    {
      icon: <MdPayment />,
      title: "Secure Payment",
      text: "100% encrypted checkout",
    },
  ];
  return (
    <div className="relative overflow-hidden bg-white pt-28 pb-12 md:pt-32 md:pb-16">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 md:grid-cols-2 md:gap-8 lg:px-10">
        {/* Left Side: Hero Content */}
        <div className="z-10">
          {/* Small Label */}
          <div className="mb-5 inline-flex items-center rounded-full bg-orange-50 px-4 py-2">
            <span className="mr-2 h-2 w-2 rounded-full bg-orange-500"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
              New Season Arrival
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="max-w-xl text-4xl font-black leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Elevate Your
            <br />
            <span className="relative inline-block">
              Everyday
              <span className="absolute bottom-1 left-0 -z-10 h-1.5 w-full bg-orange-400"></span>
            </span>{" "}
            Style.
          </h1>

          {/* Description */}
          <p className="mt-6 max-w-md text-sm leading-7 text-gray-500 sm:text-base">
            Discover the intersection of comfort and high-fashion. Our 2026
            collection features sustainable materials and timeless silhouettes.
          </p>

          {/* Buttons */}
          <div className="mt-7 flex flex-wrap items-center gap-4">
            <Link
              to="/category/Women"
              className="inline-flex items-center gap-3 rounded-full bg-black px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-orange-500"
            >
              Shop Collection
              <FaArrowRight />
            </Link>

            <Link
              to="/category/Women"
              className="rounded-full border border-gray-100 px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-700 transition hover:border-orange-400 hover:text-orange-500"
            >
              View Lookbook
            </Link>
          </div>
        </div>

        {/* Right Side: Fashion Image */}
        <div className="relative mx-auto w-full max-w-lg">
          {/* Soft Background Shape */}
          <div className="absolute inset-4 rounded-full bg-orange-50"></div>

          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=85"
            alt="Fashion model showcasing a modern style"
            className="relative z-10 mx-auto h-[380px] w-full rounded-[45%_45%_0_0] object-cover object-center sm:h-[480px] lg:h-[540px]"
          />
        </div>
      </div>
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-8 bg-gray-50">
        {features.map((item, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-3x1 shadow-lg shadow-gray-100 flex flex-col items-start gap-4"
          >
            <div className="bg-orange-600 rounded-2xl p-3 flex items-center justify-center text-white text-2xl">
              {item.icon}
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-lg mb-1">
                {item.title}
              </h3>
              <p className="text-gray-500 text-sm">{item.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Hero;
