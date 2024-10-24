import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { overrideStyle } from "../../utils/utils";
import { PropagateLoader } from "react-spinners";
import { messageClear, get_banner, delete_banner } from "../../store/Reducers/bannerReducer";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";

const Banners = () => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const { loader, successMessage, errorMessage, banner } = useSelector(
    (state) => state.banner
  );
  const [imageShow, setImageShow] = useState("");
  const [image, setImage] = useState("");
  const [editingBannerId, setEditingBannerId] = useState(null);

  const imageHandle = (e) => {
    const files = e.target.files;
    const length = files.length;

    if (length > 0) {
      setImage(files[0]);
      setImageShow(URL.createObjectURL(files[0]));
    }
  };

  useEffect(() => {
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
    }

    if (successMessage) {
      toast.success(successMessage);
      dispatch(messageClear());
      setImageShow("");
      setImage("");
      setEditingBannerId(null);
    }
  }, [successMessage, errorMessage]);

  useEffect(() => {
    if (userInfo && userInfo._id) {
      dispatch(get_banner(userInfo._id));
    }
  }, [userInfo]);

 

const deleteBanner = (bannerId) => {
  if (window.confirm("Are you sure you want to delete this Banner?")) {
    dispatch(delete_banner(bannerId))
      .then((result) => {
        if (result.meta.requestStatus === "fulfilled") {
          toast.success("Banner deleted successfully!");
         if (userInfo && userInfo._id) {
           dispatch(get_banner(userInfo._id));
         }
        }
      })
      .catch(() => {
        toast.error("Error deleting banner!");
      });
  }
};



  return (
    <div className="px-2 lg:px-7 pt-5">
      <div className="w-full p-4 bg-[#ffffff] rounded-md">
        <div className="flex justify-between items-center pb-4">
          <h1 className="text-[#000000] text-xl font-semibold">Banners</h1>
          <Link
            className="bg-blue-500 hover:shadow-blue-500/50 hover:shadow-lg text-white rounded-sm px-7 py-2 my-2"
            to="/seller/dashboard/add-banner"
          >
            Add Banners
          </Link>
        </div>

        {/* List of Banners */}
        <div className="mb-6">
          {banner && banner.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {banner.map((banner) => (
                <div
                  key={banner._id}
                  className="relative bg-- white 700 p-4 rounded-md"
                >
                  <img
                    src={banner.link}
                    alt="Banner"
                    className="w-64 h-auto mb-2 md:w-80 lg:w-96" // Responsive width
                  />

                  <div className="flex justify-between items-center mt-2">
                    <button
                      onClick={() => {
                        if (banner && banner._id) {
                          console.log(banner._id);
                          dispatch(deleteBanner(banner._id));
                        }

                        setImageShow(banner.link); // To show current image in the upload area
                      }}
                      className="bg-blue-500 text-white text-sm rounded-md px-3 py-1 hover:bg-blue-600 transition duration-200 ease-in-out shadow-md hover:shadow-lg"
                    >
                      Delete
                    </button>
                    <a
                      href={banner.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-green-500 text-white text-sm rounded-md px-3 py-1 hover:bg-green-600 transition duration-200 ease-in-out shadow-md hover:shadow-lg"
                    >
                      View
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No banners available.</p>
          )}
        </div>

        {/* Add or Update Banner Form */}
        <div></div>
      </div>
    </div>
  );
};

export default Banners;
