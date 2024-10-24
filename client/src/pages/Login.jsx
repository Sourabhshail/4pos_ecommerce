import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  customer_register,
  customer_login,
  messageClear,
} from "../store/reducers/authReducer";
import toast from "react-hot-toast";
import useSellerIdByName from "../hooks/useSellerIdByName";

const Login = () => {
  const { successMessage, errorMessage, userInfo } = useSelector(
    (state) => state.auth
  );

  const { sellerName } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    sellerId,
    loading: sellerLoading,
    error: sellerError,
  } = useSellerIdByName(sellerName);

  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState("generating");
  const [credentials, setCredentials] = useState(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const generateRandomCredentials = () => {
    const randomName = `User${Math.floor(Math.random() * 10000)}`;
    const randomEmail = `user${Math.floor(Math.random() * 10000)}@4pos.co.za`;
    const randomPassword = Math.random().toString(36).slice(-8);
    return { name: randomName, email: randomEmail, password: randomPassword };
  };

  // Moved getStepMessage inside component
  const getStepMessage = () => {
    switch (step) {
      case "generating":
        return "Generating credentials for new account...";
      case "registering":
        return "Registering new account...";
      case "logging_in":
        return "Account registered successfully. Logging in...";
      default:
        return "Please wait...";
    }
  };

  // Handle credential generation
  useEffect(() => {
    if (step === "generating" && !credentials) {
      const newCredentials = generateRandomCredentials();
      setCredentials(newCredentials);
      setTimeout(() => {
        setStep("registering");
        setIsRegistering(true);
      }, 2000);
    }
  }, [step, credentials]);

  // Handle registration
  useEffect(() => {
    if (step === "registering" && credentials && isRegistering) {
      const registrationData = sellerId
        ? { ...credentials, sellerId }
        : credentials;

      console.log("Registering with data:", registrationData);
      dispatch(customer_register(registrationData));
      setIsRegistering(false);
    }
  }, [dispatch, step, credentials, sellerId, isRegistering]);

  // Handle login
  useEffect(() => {
    if (step === "logging_in" && credentials && isLoggingIn) {
      console.log("Logging in with:", credentials.email);
      dispatch(
        customer_login({
          email: credentials.email,
          password: credentials.password,
        })
      );
      setIsLoggingIn(false);
    }
  }, [dispatch, step, credentials, isLoggingIn]);

  // Handle messages and navigation
  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(messageClear());

      if (step === "registering") {
        setStep("logging_in");
        setProgress(0);
        setIsLoggingIn(true);
      }
    }

    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
      setStep("generating");
      setCredentials(null);
      setProgress(0);
    }

    if (userInfo && sellerId) {
      console.log("Navigating to seller page:", sellerId);
      navigate(`/${sellerId}`, { replace: true });
    }
  }, [
    successMessage,
    errorMessage,
    userInfo,
    dispatch,
    navigate,
    step,
    sellerId,
  ]);

  // Handle progress bar
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress >= 100) {
          clearInterval(interval);
          return 100;
        }
        return oldProgress + 1;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [step]);

  // Debug logging
  useEffect(() => {
    console.log("Current step:", step);
    console.log("Credentials:", credentials);
    console.log("SellerId:", sellerId);
  }, [step, credentials, sellerId]);

  if (sellerLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading seller information...</div>
      </div>
    );
  }

  if (sellerError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-red-500">
          Error loading seller: {sellerError}
        </div>
      </div>
    );
  }

  if (!sellerId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-red-500">
          Invalid seller name. Please check the URL.
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-4 bg-white rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-700">
          Auto Register and Login for Seller
        </h2>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="text-center text-gray-600">{getStepMessage()}</p>
        {credentials && (
          <div className="text-sm text-gray-500 mt-4">
            <p>Email: {credentials.email}</p>
            <p>Password: {credentials.password}</p>
          </div>
        )}
        {/* Debug information */}
        <div className="text-xs text-gray-400 mt-4">
          <p>Seller ID: {sellerId}</p>
          <p>Current Step: {step}</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
