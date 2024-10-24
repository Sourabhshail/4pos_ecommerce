import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchContent } from "../store/reducers/linksReducer";
import Headers from "./Headers";
import Footer from "./Footer";

const pageNameMapping = {
  "about-us": "About Us",
  "about-our-shop": "About our Shop",
  blogs: "Blogs",
  "delivery-information": "Delivery Information",
  "privacy-policy": "Privacy Policy",
};

const StaticPage = ({ sellerId }) => {
  const { pageName } = useParams();
  const dispatch = useDispatch();
  const { tabContent, status } = useSelector((state) => state.content);

  useEffect(() => {
    dispatch(fetchContent(sellerId));
  }, [dispatch]);

  const mappedPageName = pageNameMapping[pageName] || pageName;
  const content = tabContent[mappedPageName] || "Content not found";

  return (
    <div className="flex flex-col min-h-screen">
      <Headers sellerId={sellerId}/>
      <main className="flex-grow bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden min-h-[70vh] flex flex-col">
            <div className="bg-purple-500 p-6">
              <h6 className="text-2xl md:text-2xl font-bold text-white">
                {mappedPageName}
              </h6>
            </div>
            <div className="flex-grow flex items-center justify-center p-8">
              {status === "loading" ? (
                <div className="flex justify-center items-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
                </div>
              ) : (
                <div className="prose prose-lg max-w-3xl mx-auto">
                  {content.split("\n").map((paragraph, index) => (
                    <p
                      key={index}
                      className="mb-4 text-gray-700 leading-relaxed"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              )}
            </div>
            <div className="bg-gray-100 p-6 mt-auto">
              <p className="text-center text-gray-600">
                Thank you for visiting our {mappedPageName.toLowerCase()} page.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer sellerId={sellerId}/>
    </div>
  );
};

export default StaticPage;
