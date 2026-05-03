"use client";

import React, { useEffect, useState } from "react";
import { assets, productsDummyData } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import Footer from "@/components/seller/Footer";
import Loading from "@/components/Loading";

const ProductList = () => {
  const { router } = useAppContext();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    setProducts(productsDummyData);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="flex-1 min-w-0 h-screen overflow-y-auto flex flex-col justify-between text-sm">
      {loading ? (
        <Loading />
      ) : (
        <div className="w-full max-w-full md:p-10 p-2 space-y-5">
          <h2 className="pb-2 text-lg font-medium">All Product</h2>

          {/* Mobile view */}
<div className="space-y-3 sm:hidden">
  {products.map((product, index) => (
    <div
      key={product._id || index}
      className="bg-white border border-gray-500/20 rounded-md p-3 flex gap-3"
    >
      <Image
        src={product.image[0]}
        alt={product.name || "product"}
        width={80}
        height={80}
        className="w-16 h-16 object-contain bg-gray-100 rounded p-2"
      />

      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-700 text-sm line-clamp-2">
          {product.name}
        </p>
        <p className="text-xs text-gray-500">{product.category}</p>
        <p className="text-sm font-semibold text-gray-800">
          ₹{product.offerPrice}
        </p>
      </div>
    </div>
  ))}
</div>
          {/* Desktop/tablet view */}
          <div className="hidden sm:block w-full overflow-x-auto rounded-md bg-white border border-gray-500/20">
            <table className="w-full table-auto">
              {/* your old table here */}
            </table>
          </div>

          <div className="w-full overflow-x-auto rounded-md bg-white border border-gray-500/20">
            <table className="min-w-[600px] w-full table-auto">
              <thead className="text-gray-900 text-sm text-left">
                <tr>
                  <th className="px-3 py-3 font-medium">Product</th>
                  <th className="px-3 py-3 font-medium max-sm:hidden">
                    Category
                  </th>
                  <th className="px-3 py-3 font-medium">Price</th>
                  //seller button hide
                  <th className="px-3 py-3 font-medium hidden sm:table-cell">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="text-sm text-gray-500">
                {products.map((product, index) => (
                  <tr
                    key={product._id || index}
                    className="border-t border-gray-500/20"
                  >
                    <td className="px-2 md:px-3 py-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="bg-gray-500/10 rounded p-2 shrink-0">
                          <Image
                            src={product.image[0]}
                            alt={product.name || "product image"}
                            className="w-10 h-10 md:w-16 md:h-16 object-contain"
                            width={100}
                            height={100}
                          />
                        </div>

                        <span className="text-xs md:text-sm line-clamp-2 max-w-[150px] md:max-w-none">
                          {product.name}
                        </span>
                      </div>
                    </td>

                    <td className="px-3 py-3 max-sm:hidden">
                      {product.category}
                    </td>

                    <td className="px-3 py-3 whitespace-nowrap">
                      ₹{product.offerPrice}
                    </td>

                    <td className="px-3 py-3 hidden sm:table-cell">
                      <button
                        onClick={() => router.push(`/product/${product._id}`)}
                        className="flex items-center gap-1 px-3 py-2 bg-orange-600 text-white rounded-md"
                      >
                        <span className="hidden md:block">Visit</span>
                        <Image
                          className="h-3.5 w-3.5"
                          src={assets.redirect_icon}
                          alt="redirect_icon"
                        />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default ProductList;
