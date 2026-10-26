import React from "react";
import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaRegCompass,
} from "react-icons/fa";
import { FiSend } from "react-icons/fi";

const Footer = () => {
  return (
    <footer className="bg-[#020813] px-6 pt-16 text-gray-400 sm:px-10 lg:px-16">
      {/* Newsletter Section */}
      <div className="mx-auto mt-20 mb-20 max-w-6xl rounded-[35px] bg-orange-600 px-6 py-12 text-white sm:px-12 lg:flex lg:items-center lg:justify-between lg:gap-10">
        <div className="mb-8 lg:mb-0">
          <h2 className="mb-3 text-2xl font-bold sm:text-3xl">
            Stay ahead of the curve.
          </h2>
          <h3 className="mb-3 text-xl font-bold sm:text-2xl">
            Get the latest drops.
          </h3>
          <p className="text-sm text-orange-100">
            Subscribe to our newsletter and get 10% off your first order.
          </p>
        </div>

        <form
          onSubmit={(e) => e.preventDefault()}
          className="flex w-full max-w-md items-center rounded-2xl bg-white p-1.5"
        >
          <input
            type="email"
            required
            placeholder="Enter your email"
            aria-label="Email address"
            className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm text-gray-900 outline-none placeholder:text-gray-400"
          />

          <button
            type="submit"
            className="shrink-0 rounded-xl bg-[#020813] px-5 py-3 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-gray-800"
          >
            Join Now
          </button>
        </form>
      </div>

      {/* Main Footer */}
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 border-b border-white/10 pb-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10">
        {/* Brand Information */}
        <div className="sm:col-span-2 lg:col-span-2">
          <Link to="/" className="mb-6 inline-flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-600 text-white">
              <FaRegCompass size={19} />
            </span>

            <span className="text-xl font-extrabold tracking-tight text-white">
              STYLE<span className="text-orange-500">WAVE</span>
            </span>
          </Link>

          <p className="max-w-sm text-sm leading-7 text-gray-400">
            Redefining your everyday wardrobe with premium essentials and
            seasonal trends.
          </p>

          {/* Social Media */}
          <div className="mt-6 flex items-center gap-4">
            <a
              href="https://www.facebook.com/"
              aria-label="Facebook"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 transition hover:bg-orange-600 hover:text-white"
            >
              <FaFacebookF size={15} />
            </a>

            <a
              href="https://www.instagram.com/"
              aria-label="Instagram"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 transition hover:bg-orange-600 hover:text-white"
            >
              <FaInstagram size={17} />
            </a>

            <a
              href="https://www.youtube.com/"
              aria-label="YouTube"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 transition hover:bg-orange-600 hover:text-white"
            >
              <FaYoutube size={17} />
            </a>
          </div>
        </div>

        {/* Company Links */}
        <div>
          <h3 className="mb-6 text-xs font-bold uppercase tracking-[0.2em] text-white">
            Company
          </h3>

          <ul className="space-y-4 text-sm">
            <li>
              <Link to="/" className="transition hover:text-orange-500">
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/collection"
                className="transition hover:text-orange-500"
              >
                Services
              </Link>
            </li>
            <li>
              <Link to="/about" className="transition hover:text-orange-500">
                About Us
              </Link>
            </li>
            <li>
              <Link to="/contact" className="transition hover:text-orange-500">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* Support Links */}
        <div>
          <h3 className="mb-6 text-xs font-bold uppercase tracking-[0.2em] text-white">
            Support
          </h3>

          <ul className="space-y-4 text-sm">
            <li>
              <Link
                to="/privacy-policy"
                className="transition hover:text-orange-500"
              >
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="/terms" className="transition hover:text-orange-500">
                Terms of Use
              </Link>
            </li>
            <li>
              <Link to="/shipping" className="transition hover:text-orange-500">
                Shipping Info
              </Link>
            </li>
            <li>
              <Link to="/returns" className="transition hover:text-orange-500">
                Returns
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 py-6 text-xs text-gray-500 sm:flex-row">
        <p>© {new Date().getFullYear()} STYLEWAVE. All rights reserved.</p>

        <p className="flex items-center gap-2">
          Made for everyday style
          <FiSend className="text-orange-500" />
        </p>
      </div>
    </footer>
  );
};

export default Footer;
