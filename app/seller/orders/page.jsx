"use client";

import React, { useEffect, useState } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import Footer from "@/components/seller/Footer";
import Loading from "@/components/Loading";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all seller orders
  const fetchSellerOrders = async () => {
    try {
      const res = await fetch("/api/order");
      const data = await res.json();

      if (data.success) {
        setOrders(data.orders);
      }
    } catch (error) {
      console.error("Fetch seller orders error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Update normal order status
  const updateStatus = async (orderId, status) => {
    try {
      const res = await fetch("/api/order", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderId, status }),
      });

      const data = await res.json();

      if (data.success) {
        fetchSellerOrders();
      } else {
        alert(data.message || "Status update failed");
      }
    } catch (error) {
      console.error("Update status error:", error);
    }
  };

  // Approve / Reject return request
  const updateReturnStatus = async (orderId, status) => {
    try {
      const res = await fetch(`/api/order/return-status/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      const data = await res.json();

      if (data.success) {
        alert(data.message);
        fetchSellerOrders();
      } else {
        alert(data.message || "Return update failed");
      }
    } catch (error) {
      console.error("Return status update error:", error);
    }
  };

  useEffect(() => {
    fetchSellerOrders();
  }, []);

  return (
    <div className="flex-1 h-screen overflow-scroll flex flex-col justify-between text-sm">
      {loading ? (
        <Loading />
      ) : (
        <div className="md:p-10 p-4 space-y-5">
          <h2 className="text-lg font-medium">Orders</h2>

          <div className="max-w-5xl rounded-md">
            {orders.length === 0 ? (
              <p className="text-gray-500">No orders found</p>
            ) : (
              orders.map((order) => (
                <div
                  key={order._id}
                  className="flex flex-col md:flex-row gap-5 justify-between p-5 border-t border-gray-300"
                >
                  {/* Product Info */}
                  <div className="flex-1 flex gap-5 max-w-80">
                    <Image
                      className="max-w-16 max-h-16 object-cover"
                      src={assets.box_icon}
                      alt="box_icon"
                    />

                    <p className="flex flex-col gap-3">
                      <span className="font-medium">
                        {order.items
                          .map((item) => `${item.name} x ${item.quantity}`)
                          .join(", ")}
                      </span>
                      <span>Items : {order.items.length}</span>
                    </p>
                  </div>

                  {/* Address */}
                  <div>
                    <p>
                      <span className="font-medium">
                        {order.address?.fullName}
                      </span>
                      <br />
                      <span>{order.address?.area}</span>
                      <br />
                      <span>
                        {order.address?.city}, {order.address?.state}
                      </span>
                      <br />
                      <span>{order.address?.phoneNumber}</span>
                    </p>
                  </div>

                  {/* Price */}
                  <p className="font-medium my-auto">
                    ₹{order.total || order.amount}
                  </p>

                  {/* Status / Payment / Return Actions */}
                  <div>
                    <p className="flex flex-col gap-1">
                      <span>
                        Method :{" "}
                        {order.paymentMethod === "ONLINE"
                          ? "Online Payment"
                          : "COD"}
                      </span>

                      <span
                        className={
                          order.paymentStatus === "Paid" || order.isPaid
                            ? "text-green-600 font-semibold"
                            : "text-orange-600 font-semibold"
                        }
                      >
                        Payment :{" "}
                        {order.paymentStatus ||
                          (order.isPaid ? "Paid" : "Pending")}
                      </span>

                      <span>
                        Date : {new Date(order.createdAt).toLocaleDateString()}
                      </span>

                      <span className="font-semibold">
                        Status : {order.status || "Pending"}
                      </span>
                    </p>

                    {/* Normal status update */}
                    {![
                      "Return Requested",
                      "Return Approved",
                      "Return Rejected",
                      "Cancelled",
                    ].includes(order.status) && (
                      <select
                        value={order.status || "Pending"}
                        onChange={(e) => updateStatus(order._id, e.target.value)}
                        className="border p-2 rounded mt-3"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Out For Delivery">
                          Out For Delivery
                        </option>
                        <option value="Delivered">Delivered</option>
                      </select>
                    )}

                    {/* Return request info */}
                    {order.status === "Return Requested" && (
                      <div className="mt-3 p-3 rounded-lg bg-blue-50 border border-blue-100">
                        <p className="text-blue-700 font-semibold">
                          Return Requested
                        </p>
                        <p className="text-gray-600 text-xs mt-1">
                          Reason: {order.returnReason || "No reason"}
                        </p>

                        <div className="flex gap-2 mt-3">
                          <button
                            onClick={() =>
                              updateReturnStatus(order._id, "Return Approved")
                            }
                            className="px-3 py-2 rounded bg-green-500 text-white text-xs"
                          >
                            Approve
                          </button>

                          <button
                            onClick={() =>
                              updateReturnStatus(order._id, "Return Rejected")
                            }
                            className="px-3 py-2 rounded bg-red-500 text-white text-xs"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Return final status */}
                    {order.status === "Return Approved" && (
                      <p className="mt-3 px-3 py-2 rounded bg-green-100 text-green-700 font-semibold">
                        Return Approved
                      </p>
                    )}

                    {order.status === "Return Rejected" && (
                      <p className="mt-3 px-3 py-2 rounded bg-red-100 text-red-700 font-semibold">
                        Return Rejected
                      </p>
                    )}

                    {order.status === "Cancelled" && (
                      <p className="mt-3 px-3 py-2 rounded bg-red-100 text-red-700 font-semibold">
                        Cancelled
                      </p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Orders;