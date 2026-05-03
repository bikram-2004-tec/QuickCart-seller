"use client";

import React, { useEffect, useState } from "react";
import { useAppContext } from "@/context/AppContext";
import { useRouter } from "next/navigation";
const MyOrders = () => {
  const { user } = useAppContext();
  const router = useRouter();
 
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    const fetchOrders = async () => {
      try {
        setLoading(true);

        const res = await fetch(`/api/order?userId=${user.id}`);
        const data = await res.json();

        if (data.success) {
          setOrders(data.orders);
        }
      } catch (error) {
        console.error("Order fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);
  if (loading) {
  return (
    <div className="px-6 md:px-16 lg:px-32 py-16 min-h-screen bg-gray-50">
      <h1 className="text-2xl font-semibold text-gray-800">My Orders</h1>
      <p className="mt-4 text-gray-500">Loading orders...</p>
    </div>
  );
}

return (
  <div className="px-4 md:px-16 lg:px-32 py-12 min-h-screen bg-gray-50">
    <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>

    {orders.length === 0 ? (
      <div className="bg-white p-10 rounded-2xl shadow-sm border text-center">
        <p className="text-gray-500 text-lg">No orders found</p>
      </div>
    ) : (
      <div className="space-y-7">
        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 p-5 md:p-6"
          >
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b pb-5">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">
                  Order ID
                </p>
                <p className="font-semibold text-gray-800 break-all">
                  #{order._id}
                </p>
              </div>

              <div className="text-left md:text-right">
                <p className="text-xs text-gray-500 uppercase tracking-wide">
                  Order Date
                </p>
                <p className="font-semibold text-gray-800">
                  {new Date(order.createdAt).toLocaleDateString("en-IN")}
                </p>
              </div>
            </div>

            {/* Status Badges */}
            <div className="flex flex-wrap gap-2 mt-4">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  order.status === "Delivered"
                    ? "bg-green-100 text-green-700"
                    : order.status === "Shipped"
                    ? "bg-blue-100 text-blue-700"
                    : order.status === "Cancelled"
                    ? "bg-red-100 text-red-700"
                    : "bg-orange-100 text-orange-700"
                }`}
              >
                {order.status || "Pending"}
              </span>

              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  order.paymentStatus === "Paid" || order.isPaid
                    ? "bg-green-100 text-green-700"
                    : "bg-orange-100 text-orange-700"
                }`}
              >
                {order.paymentStatus === "Paid" || order.isPaid
                  ? "Paid"
                  : "Payment Pending"}
              </span>

              <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700">
                {order.paymentMethod === "ONLINE" ||
                order.paymentMethod === "Online" ||
                order.paymentMethod === "Razorpay"
                  ? "Online Payment"
                  : "Cash On Delivery"}
              </span>
            </div>

            {/* Items */}
            <div className="mt-5 space-y-4">
              {order.items.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-gray-200 rounded-xl p-4 bg-gray-50"
                >
                  <div className="flex items-center gap-4">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 object-contain bg-white rounded-xl border p-2"
                      />
                    ) : (
                      <div className="w-20 h-20 bg-white border rounded-xl flex items-center justify-center text-gray-400 text-xs">
                        No Image
                      </div>
                    )}

                    <div>
                      <h2 className="font-semibold text-gray-900">
                        {item.name}
                      </h2>
                      <p className="text-sm text-gray-500">
                        Quantity: {item.quantity}
                      </p>
                      <p className="text-sm text-gray-600">
                        Price: ₹{item.price}
                      </p>
                    </div>
                  </div>

                  <p className="font-bold text-gray-900 text-lg">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            {/* Address */}
            <div className="mt-5 bg-gray-50 rounded-xl p-4 border border-gray-200">
              <h3 className="font-semibold text-gray-800 mb-1">
                Delivery Address
              </h3>
              <p className="text-sm text-gray-600">
                {order.address?.fullName}, {order.address?.area},{" "}
                {order.address?.city}, {order.address?.state} -{" "}
                {order.address?.pincode}
              </p>
              <p className="text-sm text-gray-600">
                Phone: {order.address?.phoneNumber}
              </p>
            </div>

            {/* Price */}
            <div className="mt-5 border-t pt-4 space-y-2">
              <div className="flex justify-between text-gray-600">
                <p>Subtotal</p>
                <p>₹{order.amount}</p>
              </div>

              <div className="flex justify-between text-gray-600">
                <p>Tax</p>
                <p>₹{order.tax || 0}</p>
              </div>

              <div className="flex justify-between text-xl font-bold text-gray-900 pt-2">
                <p>Total</p>
                <p>₹{order.total || order.amount}</p>
              </div>
            </div>
            

            {/* Buttons */}
   <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
  

  <button
    onClick={() => router.push(`/order-details/${order._id}`)}
    className="w-full px-5 py-3 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition"
  >
    View Details
  </button>

  <button
    onClick={() => window.print()}
    className="w-full px-5 py-3 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition"
  >
    Download Invoice
  </button>
</div>
          </div>
        ))}
      </div>
    )}
  </div>
);
    
};

export default MyOrders;