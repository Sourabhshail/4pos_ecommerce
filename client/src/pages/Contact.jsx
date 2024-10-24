import React, { useEffect, useState } from "react";
import Headers from "../components/Headers";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { FiMail, FiPhone, FiMapPin } from "react-icons/fi";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { save_contact, messageClear } from "../store/reducers/contactReducer";
import { get_banners } from "../store/reducers/homeReducer";
import toast from "react-hot-toast";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  subject: yup.string().required("Subject is required"),
  message: yup.string().required("Message is required"),
});

const Contact = ({ sellerId }) => {
  const dispatch = useDispatch();
  const { loader, errorMessage, successMessage } = useSelector(
    (state) => state.contact
  );
  const { supportInfo } = useSelector((state) => state.auth);
  const { banners } = useSelector((state) => state.home);

  const responsiveBanner = {
    superLargeDesktop: { breakpoint: { max: 4000, min: 3000 }, items: 1 },
    desktop: { breakpoint: { max: 3000, min: 1024 }, items: 1 },
    tablet: { breakpoint: { max: 1024, min: 464 }, items: 1 },
    mobile: { breakpoint: { max: 464, min: 0 }, items: 1 },
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    dispatch(get_banners(sellerId));
  }, [dispatch, sellerId]);

  const submitForm = (data) => {
    dispatch(save_contact({ ...data, sellerId }));
  };

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      reset();
      dispatch(messageClear());
    }
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
    }
  }, [successMessage, errorMessage, dispatch, reset]);

  return (
    <div>
      <Headers sellerId={sellerId} />

      <section className="h-[220px] mt-6 bg-cover bg-no-repeat relative bg-left">
        <Carousel
          autoPlay={true}
          infinite={true}
          arrows={false}
          showDots={false}
          responsive={responsiveBanner}
          className="h-full"
        >
          {banners &&
            banners.length > 0 &&
            banners.map((b, i) => (
              <div key={i} className="h-full w-full">
                <img
                  className="w-full h-full object-cover"
                  src={b.banner}
                  alt=""
                />
              </div>
            ))}
        </Carousel>
        <div className="absolute left-0 top-0 w-full h-full bg-[#2422228a]">
          <div className="w-[85%] md:w-[80%] sm:w-[90%] lg:w-[90%] h-full mx-auto">
            <div className="flex flex-col justify-center gap-1 items-center h-full w-full text-white">
              <h2 className="text-3xl font-bold">Contact Us</h2>
              <div className="flex justify-center items-center gap-2 text-2xl w-full">
                <Link to={`/${sellerId}`}>Home</Link>
                <span className="pt-2">
                  <MdOutlineKeyboardArrowRight />
                </span>
                <span>Contact</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#eeeeee] py-16">
        <div className="w-[85%] md:w-[80%] sm:w-[90%] lg:w-[90%] mx-auto">
          <div className="flex flex-wrap gap-8">
            <div className="w-[32%] md-lg:w-full">
              <div className="bg-white p-6 shadow-sm rounded-md">
                <div className="flex flex-col gap-8">
                  <div className="flex gap-3 items-center">
                    <span className="w-[40px] h-[40px] bg-indigo-500 flex justify-center items-center rounded-full">
                      <FiMail className="text-white text-2xl" />
                    </span>
                    <div>
                      <h2 className="text-lg font-bold text-slate-600">
                        Email
                      </h2>
                      <p className="text-slate-600">
                        {supportInfo?.email || "Not available"}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3 items-center">
                    <span className="w-[40px] h-[40px] bg-indigo-500 flex justify-center items-center rounded-full">
                      <FiPhone className="text-white text-2xl" />
                    </span>
                    <div>
                      <h2 className="text-lg font-bold text-slate-600">
                        Phone
                      </h2>
                      <p className="text-slate-600">
                        {supportInfo?.mobileNo || "Not available"}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3 items-center">
                    <span className="w-[40px] h-[40px] bg-indigo-500 flex justify-center items-center rounded-full">
                      <FiMapPin className="text-white text-2xl" />
                    </span>
                    <div>
                      <h2 className="text-lg font-bold text-slate-600">
                        Address
                      </h2>
                      <p className="text-slate-600">
                        {supportInfo?.address || "Not available"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-[63%] md-lg:w-full">
              <div className="bg-white p-8 shadow-sm rounded-md">
                <h2 className="text-2xl font-bold text-slate-600 mb-6">
                  Get In Touch
                </h2>
                <form onSubmit={handleSubmit(submitForm)}>
                  <div className="flex md:flex-col md:gap-2 w-full gap-5 text-slate-600">
                    <div className="flex flex-col gap-1 mb-4 w-full">
                      <label htmlFor="name">Name</label>
                      <input
                        {...register("name")}
                        type="text"
                        className="w-full px-3 py-2 border border-slate-200 outline-none focus:border-indigo-500 rounded-md"
                        placeholder="Your name"
                        id="name"
                      />
                      {errors.name && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.name.message}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col gap-1 mb-4 w-full">
                      <label htmlFor="email">Email</label>
                      <input
                        {...register("email")}
                        type="email"
                        className="w-full px-3 py-2 border border-slate-200 outline-none focus:border-indigo-500 rounded-md"
                        placeholder="Your email"
                        id="email"
                      />
                      {errors.email && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.email.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-1 mb-4">
                    <label htmlFor="subject">Subject</label>
                    <input
                      {...register("subject")}
                      type="text"
                      className="w-full px-3 py-2 border border-slate-200 outline-none focus:border-indigo-500 rounded-md"
                      placeholder="Message subject"
                      id="subject"
                    />
                    {errors.subject && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.subject.message}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col gap-1 mb-4">
                    <label htmlFor="message">Message</label>
                    <textarea
                      {...register("message")}
                      className="w-full px-3 py-2 border border-slate-200 outline-none focus:border-indigo-500 rounded-md h-32"
                      placeholder="Your message"
                      id="message"
                    ></textarea>
                    {errors.message && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.message.message}
                      </p>
                    )}
                  </div>

                  <button
                    disabled={loader}
                    className={`px-8 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition-colors ${
                      loader ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {loader ? "Sending..." : "Send Message"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer sellerId={sellerId} />
    </div>
  );
};

export default Contact;
