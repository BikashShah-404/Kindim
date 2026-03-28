import {
  useSubscribeMutation,
  useToogleSubscribtionMutation,
} from "@/redux/api/subscribtionSlice";
import { setSubscribtionState } from "@/redux/features/auth/authSlice";
import React, { useDebugValue, useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Footer = () => {
  const shopLinks = [
    { label: "New arrivals", href: "#" },
    { label: "Best sellers", href: "#" },
    { label: "Collections", href: "#" },
    { label: "Sale", href: "#" },
  ];

  const accountLinks = [
    { label: "My orders", href: "/orders" },
    { label: "Favourites", href: "/favourites" },
    { label: "Returns", href: "#" },
    { label: "Sign in", href: "/login" },
  ];

  const companyLinks = [
    { label: "About us", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Contact", href: "#" },
  ];

  const socials = [
    {
      name: "Instagram",
      href: "https://instagram.com",
      icon: (
        <svg
          viewBox="0 0 24 24"
          className="w-[15px] h-[15px] fill-[rgba(232,228,220,0.6)] group-hover:fill-[#f0ebe0] transition-all"
        >
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      ),
    },
    {
      name: "Facebook",
      href: "https://facebook.com",
      icon: (
        <svg
          viewBox="0 0 24 24"
          className="w-[15px] h-[15px] fill-[rgba(232,228,220,0.6)] group-hover:fill-[#f0ebe0] transition-all"
        >
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
    },
    {
      name: "X",
      href: "https://x.com",
      icon: (
        <svg
          viewBox="0 0 24 24"
          className="w-[15px] h-[15px] fill-[rgba(232,228,220,0.6)] group-hover:fill-[#f0ebe0] transition-all"
        >
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.261 5.631 5.903-5.631zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
    {
      name: "Pinterest",
      href: "https://pintrest.com",
      icon: (
        <svg
          viewBox="0 0 24 24"
          className="w-[15px] h-[15px] fill-[rgba(232,228,220,0.6)] group-hover:fill-[#f0ebe0] transition-all"
        >
          <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
        </svg>
      ),
    },
    {
      name: "TikTok",
      href: "https://tiktok.com",
      icon: (
        <svg
          viewBox="0 0 24 24"
          className="w-[15px] h-[15px] fill-[rgba(232,228,220,0.6)] group-hover:fill-[#f0ebe0] transition-all"
        >
          <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
        </svg>
      ),
    },
    {
      name: "YouTube",
      href: "https://youtube.com",
      icon: (
        <svg
          viewBox="0 0 24 24"
          className="w-[15px] h-[15px] fill-[rgba(232,228,220,0.6)] group-hover:fill-[#f0ebe0] transition-all"
        >
          <path d="M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805zM9.609 15.601V8.408l6.264 3.602z" />
        </svg>
      ),
    },
  ];

  const { userInfo } = useSelector((state) => state.auth);
  const [email, setEmail] = useState("");
  const displayEmail = userInfo ? userInfo.email : email;

  const [subscribe] = useSubscribeMutation();
  const [toggleSubscription] = useToogleSubscribtionMutation();

  const dispatch = useDispatch();

  const handleSubscribe = async () => {
    try {
      if (!email) {
        toast.error("Email is required");
        return;
      }
      const response = await subscribe({ email }).unwrap();
      if (response.status === 200) {
        toast.success(response.msg);
        setEmail("");
      }
    } catch (err) {
      console.log(err);
      toast.error(err.data.message || "An unknown error occurred");
    }
  };

  const handleToogleSubscribe = async () => {
    try {
      const response = await toggleSubscription({
        email: displayEmail,
      }).unwrap();
      if (response.status === 200) {
        toast.success(response.msg);
        dispatch(setSubscribtionState(response.data.isSubscribed));
        console.log(userInfo);
      }
    } catch (err) {
      console.log(err);
      toast.error(err.data.message || "An unknown error occurred");
    }
  };

  return (
    <footer className="bg-gradient-to-br from-black via-gray-900 to-gray-500 text-[#e8e4dc] relative overflow-hidden px-12 pt-16 pb-8 flex flex-col justify-center ">
      {/* ghost watermark */}
      <span className="absolute -top-[1.6vw] -right-5  text-[16vw] sm:text-[15vw] md:text-[12vw] lg:text-[10vw] font-semibold text-white/[0.125] pointer-events-none leading-none font-berkshireswash italic  select-none tracking-[20px]">
        KINDIM
      </span>

      {/* top grid */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-2 gap-y-10  border-b border-white/[0.2] pb-6">
        {/* brand col */}
        <div className="col-span-2">
          <p className=" text-[28px] font-montserrat font-semibold    tracking-[3px] text-secondary uppercase mb-3">
            Kindim
          </p>
          <p className="text-[13px] text-secondary font-light leading-relaxed max-w-[240px] mb-7 tracking-[0.3px]">
            Curated goods for the discerning. Delivered with care, crafted with
            purpose.
          </p>
          <p className="text-[11px] tracking-[2px] uppercase text-secondary mb-2.5">
            Stay in the loop
          </p>
          <div className="flex">
            <input
              type="email"
              placeholder="your@email.com"
              value={displayEmail}
              onChange={(e) => !userInfo && setEmail(e.target.value)}
              disabled={userInfo}
              className="bg-transparent border border-white/20 border-r-0 px-3.5 py-2.5 text-[12px] text-[#e8e4dc] outline-none w-44  placeholder:text-secondary/40 focus:border-white/40 rounded-l-md"
            />
            <button
              className="bg-[#e8e4dc] text-primary px-4 text-[11px] font-medium tracking-[1.5px] uppercase hover:bg-white transition-colors rounded-r-xl cursor-pointer"
              onClick={userInfo ? handleToogleSubscribe : handleSubscribe}
            >
              {userInfo?.isSubscribed ? "Unsubscribe" : "Subscribe"}
            </button>
          </div>
          <div className="flex items-center gap-1.5 mt-3.5">
            <span className="w-[5px] h-[5px] rounded-full bg-green-400 inline-block" />
            <span className="text-[10px] tracking-[1.5px] uppercase text-secondary/60">
              Free shipping on orders over $50
            </span>
          </div>
        </div>

        <div>
          <p className="text-[20px]  tracking-[2.5px] uppercase text-[rgba(232,228,220,0.35)] mb-5 font-alegreya">
            Shop
          </p>
          <ul className="flex flex-col gap-3">
            {shopLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="text-[13px] text-[rgba(232,228,220,0.6)] font-light tracking-[0.2px] hover:text-[#f0ebe0] transition-colors "
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-[20px] tracking-[2.5px] uppercase text-[rgba(232,228,220,0.35)] mb-5 font-alegreya">
            Account
          </p>
          <ul className="flex flex-col gap-3">
            {accountLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="text-[13px] text-[rgba(232,228,220,0.6)] font-light tracking-[0.2px] hover:text-[#f0ebe0] transition-colors"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-[20px] tracking-[2.5px] uppercase text-[rgba(232,228,220,0.35)] mb-5 font-alegreya">
            Company
          </p>
          <ul className="flex flex-col gap-3">
            {companyLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="text-[13px] text-[rgba(232,228,220,0.6)] font-light tracking-[0.2px] hover:text-[#f0ebe0] transition-colors"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex items-center justify-between pt-7 flex-wrap gap-5">
        <span className="text-[12px] text-secondary font-light tracking-[0.3px]">
          © 2026 Kindim. All rights reserved.
        </span>

        {/* socials */}
        <div className="flex gap-1.5 gap-x-3">
          {socials.map((s) => (
            <a
              key={s.name}
              href={s.href}
              title={s.name}
              className="group w-9 h-9   flex items-center justify-center hover:border-white/40 hover:bg-white/5 transition-all bg-gradient-to-r from-black via-gray-800 to-gray-400 rounded-sm bg-"
            >
              {s.icon}
            </a>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4 my-4">
        <a
          href="#"
          className="text-[11px] text-secondary/50 hover:text-[rgba(232,228,220,0.7)] transition-colors tracking-[0.3px]"
        >
          Privacy policy
        </a>
        <span className="text-[rgba(232,228,220,0.2)] text-[11px]">·</span>
        <a
          href="#"
          className="text-[11px] text-secondary/50 hover:text-[rgba(232,228,220,0.7)] transition-colors tracking-[0.3px]"
        >
          Terms of service
        </a>
        <span className="text-[rgba(232,228,220,0.2)] text-[11px]">·</span>
        <a
          href="#"
          className="text-[11px] text-secondary/50 hover:text-[rgba(232,228,220,0.7)] transition-colors tracking-[0.3px]"
        >
          Cookies
        </a>
      </div>
    </footer>
  );
};

export default Footer;
