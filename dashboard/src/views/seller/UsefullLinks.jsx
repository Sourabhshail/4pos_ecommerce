import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { PropagateLoader } from "react-spinners";
import toast from "react-hot-toast";
import {
  fetchContent,
  updateContent,
  messageClear,
} from "../../store/Reducers/linksReducer";

import { overrideStyle } from "../../utils/utils";

const UsefulLinksTabs = () => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const {
    tabContent = {},
    status,
    error,
    successMessage,
    loader,
  } = useSelector((state) => state.content);

  const [localTabContent, setLocalTabContent] = useState({});
  const [activeTab, setActiveTab] = useState("About Us");

  const tabs = [
    "About Us",
    "About our Shop",
    "Delivery Information",
    "Privacy Policy",
    "Blogs",
  ];

  useEffect(() => {
    if (userInfo?._id) {
      dispatch(fetchContent(userInfo._id));
    }
  }, [dispatch, userInfo]);

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(messageClear());
    }
    if (error) {
      toast.error(error);
      dispatch(messageClear());
    }
  }, [successMessage, error, dispatch]);

  useEffect(() => {
    if (
      Object.keys(tabContent).length > 0 &&
      Object.keys(localTabContent).length === 0
    ) {
      setLocalTabContent(tabContent);
    }
  }, [tabContent, localTabContent]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleContentChange = (e) => {
    const newContent = e.target.value;
    setLocalTabContent((prevContent) => ({
      ...prevContent,
      [activeTab]: newContent,
    }));
  };

  const handleSubmit = () => {
    if (userInfo?._id) {
      dispatch(
        updateContent({
          sellerId: userInfo._id,
          tab: activeTab,
          content: localTabContent[activeTab],
        })
      );
    } else {
      toast.error("User ID is not available");
    }
  };

  if (status === "loading" && !Object.keys(tabContent).length) {
    return (
      <div className="flex justify-center items-center h-screen">
        <PropagateLoader color="#3b82f6" cssOverride={overrideStyle} />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Useful Links</h2>

      <div className="mb-4 border-b border-gray-200">
        <nav className="-mb-px flex flex-wrap" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`mr-2 py-2 px-4 text-sm font-medium ${
                activeTab === tab
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">{activeTab}</h3>
          <textarea
            value={localTabContent[activeTab] || ""}
            onChange={handleContentChange}
            className="w-full h-48 p-2 border border-gray-300 rounded mb-4 focus:ring-blue-500 focus:border-blue-500"
            placeholder={`Enter content for ${activeTab}...`}
          />
          <button
            onClick={handleSubmit}
            disabled={loader}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors disabled:bg-blue-300"
          >
            {loader ? (
              <PropagateLoader color="#ffffff" cssOverride={overrideStyle} />
            ) : (
              "Submit Changes"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UsefulLinksTabs;
