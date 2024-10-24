import React, { useState, useEffect } from "react";
import { FaEdit, FaEye, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Pagination from "../Pagination";
import toast from "react-hot-toast";
import Search from "../components/Search";
import { messageClear, get_products, delete_product } from "../../store/Reducers/productReducer";
import ProductCard from '../components/ProductCard.jsx'; // Import the ProductCard component

const Products = () => {
  const dispatch = useDispatch();
  const { products, totalProduct } = useSelector((state) => state.product);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [parPage, setParPage] = useState(5);
  const [selectedProduct, setSelectedProduct] = useState(null); // State for selected product

  useEffect(() => {
    const obj = { parPage: parseInt(parPage), page: parseInt(currentPage), searchValue };
    dispatch(get_products(obj));
  }, [searchValue, currentPage, parPage]);

  const handleDelete = (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      dispatch(delete_product(productId))
        .then((result) => {
          if (result.meta.requestStatus === "fulfilled") {
            toast.success("Product deleted successfully!");
            dispatch(get_products({ parPage: parseInt(parPage), page: parseInt(currentPage), searchValue }));
          }
        })
        .catch(() => {
          toast.error("Error deleting product!");
        });
    }
  };

  const openProductDetails = (product) => {
    setSelectedProduct(product);
  };

  const closeProductDetails = () => {
    setSelectedProduct(null);
  };

  return (
    <div className="px-2 lg:px-7 pt-5">
      <div className="w-full p-4 bg-[#ffffff] rounded-md">
        <Search
          setParPage={setParPage}
          setSearchValue={setSearchValue}
          searchValue={searchValue}
        />
        <div className="relative overflow-x-auto mt-5">
          <table className="w-full text-sm text-left text-[#000000]">
            <thead className="text-sm text-[#000000] uppercase border-b border-slate-700">
              <tr>
                <th scope="col" className="py-3 px-4">
                  No
                </th>
                <th scope="col" className="py-3 px-4">
                  Image
                </th>
                <th scope="col" className="py-3 px-4">
                  Name
                </th>
                <th scope="col" className="py-3 px-4">
                  Category
                </th>
                <th scope="col" className="py-3 px-4">
                  Brand
                </th>
                <th scope="col" className="py-3 px-4">
                  Price
                </th>
                <th scope="col" className="py-3 px-4">
                  Discount
                </th>
                <th scope="col" className="py-3 px-4">
                  Stock
                </th>
                <th scope="col" className="py-3 px-4">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {products.map((d, i) => (
                <tr key={i}>
                  <td className="py-1 px-4 font-medium whitespace-nowrap">
                    {i + 1}
                  </td>
                  <td className="py-1 px-4 font-medium whitespace-nowrap">
                    <img
                      className="w-[45px] h-[45px]"
                      src={d.images[0]}
                      alt=""
                    />
                  </td>
                  <td className="py-1 px-4 font-medium whitespace-nowrap">
                    <span>{d?.name?.slice(0, 16)}...</span>
                  </td>
                  <td className="py-1 px-4 font-medium whitespace-nowrap">
                    <span>{d.category}</span>
                  </td>
                  <td className="py-1 px-4 font-medium whitespace-nowrap">
                    <span>{d.brand}</span>
                  </td>
                  <td className="py-1 px-4 font-medium whitespace-nowrap">
                    <span>${d.price}</span>
                  </td>
                  <td className="py-1 px-4 font-medium whitespace-nowrap">
                    {d.discount === 0 ? (
                      <span>No discount</span>
                    ) : (
                      <span>${d.discount}%</span>
                    )}
                  </td>
                  <td className="py-1 px-4 font-medium whitespace-nowrap">
                    <span>{d.stock}</span>
                  </td>
                  <td className="py-1 px-4 font-medium whitespace-nowrap">
                    <div className="flex justify-start items-center gap-4">
                      <Link
                        to={`/seller/dashboard/edit-product/${d._id}`}
                        className="px-2 py-1 text-sm text-white bg-yellow-500 rounded hover:shadow-lg hover:shadow-yellow-500/50"
                      >
                        Edit
                      </Link>

                      <button
                        onClick={() => openProductDetails(d)}
                        className="px-2 py-1 text-sm text-white bg-green-500 rounded hover:shadow-lg hover:shadow-green-500/50"
                      >
                        View
                      </button>

                      <button
                        onClick={() => handleDelete(d._id)}
                        className="px-2 py-1 text-sm text-white bg-red-500 rounded hover:shadow-lg hover:shadow-red-500/50"
                      >
                        Delete
                      </button>

                      {/* <Link to={`/seller/dashboard/edit-product/${d._id}`} className="p-[6px] bg-yellow-500 rounded hover:shadow-lg hover:shadow-yellow-500/50">
                        <FaEdit />
                      </Link>
                      
                      <button onClick={() => openProductDetails(d)} className="p-[6px] bg-green-500 rounded hover:shadow-lg hover:shadow-green-500/50">
                        <FaEye />
                      </button>
                      
                      <button onClick={() => handleDelete(d._id)} className="p-[6px] bg-red-500 rounded hover:shadow-lg hover:shadow-red-500/50">
                        <FaTrash />
                      </button> */}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {totalProduct > parPage && (
          <div className="w-full flex justify-end mt-4">
            <Pagination
              pageNumber={currentPage}
              setPageNumber={setCurrentPage}
              totalItem={50}
              parPage={parPage}
              showItem={4}
            />
          </div>
        )}
      </div>
      {selectedProduct && (
        <ProductCard product={selectedProduct} onClose={closeProductDetails} />
      )}
    </div>
  );
};

export default Products;
