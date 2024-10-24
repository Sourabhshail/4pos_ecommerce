import { useState, useEffect } from "react";
import api from "../api/api"; // Adjust this import path as needed

const useSellerIdByName = (sellerName) => {
  const [sellerId, setSellerId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSellerId = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/search-seller?name=${sellerName}`);

        
        if (!data?.seller?.id) {
          const { data } = await api.get(
            `/search-seller-by-id?id=${sellerName}`
          );
          if (data?.seller?.id) {
            setSellerId(data.seller.id);
            setLoading(false);
          }
        } else {
          setSellerId(data.seller.id);
          setLoading(false);
        }
      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch seller ID");
        setLoading(false);
      }
    };

    if (sellerName) {
      fetchSellerId();
    }
  }, [sellerName]);

  return { sellerId, loading, error };
};

export default useSellerIdByName;
