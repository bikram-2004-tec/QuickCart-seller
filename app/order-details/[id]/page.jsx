"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const OrderDetails = () => {
  const { id } = useParams();
  const router = useRouter();

  const [order, setOrder] = useState(null);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelLoading, setCancelLoading] = useState(false);
  const [returnReason, setReturnReason] = useState("");
const [returnLoading, setReturnLoading] = useState(false);

  const handleReturnOrder = async () => {
    if (!returnReason.trim()) {
      alert("Please write return reason");
      return;
    }

    try {
      setReturnLoading(true);

      const res = await fetch(`/api/order/return/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ returnReason }),
      });

      const data = await res.json();

      if (data.success) {
        alert("Return requested");
        setOrder(data.order);
        setReturnReason("");
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert("Error returning order");
    } finally {
      setReturnLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!cancelReason.trim()) {
      alert("Please write cancel reason");
      return;
    }

    try {
      setCancelLoading(true);

      const res = await fetch(`/api/order/cancel/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cancelReason }),
      });

      const data = await res.json();

      if (data.success) {
        alert("Order cancelled");
        setOrder(data.order);
        setCancelReason("");
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert("Error cancelling order");
    } finally {
      setCancelLoading(false);
    }
  };

  useEffect(() => {
    const fetchOrder = async () => {
      const res = await fetch(`/api/order/${id}`);
      const data = await res.json();

      if (data.success) {
        setOrder(data.order);
      }
    };

    if (id) fetchOrder();
  }, [id]);

  if (!order) {
    return <p className="p-10">Loading...</p>;
  }

  const steps = [
    "Pending",
    "Confirmed",
    "Shipped",
    "Out For Delivery",
    "Delivered",
  ];

  const currentIndex = steps.indexOf(order.status || "Pending");

  return (
    <div className="min-h-screen bg-gray-50 px-4 md:px-16 lg:px-32 py-12">
      <button
        onClick={() => router.back()}
        className="mb-6 px-4 py-2 rounded-lg border bg-white hover:bg-gray-100"
      >
        ← Back
      </button>

      <div className="bg-white rounded-2xl border shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:justify-between gap-4 border-b pb-5">
          <div>
            <p className="text-sm text-gray-500">Order ID</p>
            <p className="font-semibold text-gray-800 break-all">
              #{order._id}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Order Status</p>
            <span className="px-3 py-1 rounded-full text-sm bg-green-100 text-green-700">
              {order.status}
            </span>
          </div>
        </div>

        <div className="mt-8 space-y-6">
          {steps.map((step, index) => {
            const active = index <= currentIndex;

            return (
              <div key={step} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-5 h-5 rounded-full ${
                      active ? "bg-green-500" : "bg-gray-300"
                    }`}
                  />

                  {index !== steps.length - 1 && (
                    <div
                      className={`w-1 h-12 ${
                        active ? "bg-green-500" : "bg-gray-300"
                      }`}
                    />
                  )}
                </div>

                <div>
                  <p
                    className={`font-medium ${
                      active ? "text-gray-900" : "text-gray-400"
                    }`}
                  >
                    {step}
                  </p>
                  <p className="text-sm text-gray-500">
                    {active ? "Completed" : "Pending"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-10 space-y-4">
          <h2 className="text-lg font-semibold text-gray-800">Items</h2>

          {order.items.map((item, index) => (
            <div
              key={index}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border rounded-xl p-4 bg-gray-50"
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
                  <p className="font-medium text-gray-800">{item.name}</p>
                  <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  <p className="text-sm text-gray-600">₹{item.price}</p>
                </div>
              </div>

              <p className="font-semibold text-gray-900">
                ₹{(item.price * item.quantity).toFixed(2)}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-10 bg-gray-50 rounded-xl p-4 border">
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

        <div className="mt-6 flex gap-2 flex-wrap">
          <span className="px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700">
            {order.paymentMethod === "ONLINE"
              ? "Online Payment"
              : "Cash On Delivery"}
          </span>

          <span
            className={`px-3 py-1 rounded-full text-sm ${
              order.paymentStatus === "Paid" || order.isPaid
                ? "bg-green-100 text-green-700"
                : "bg-orange-100 text-orange-700"
            }`}
          >
            {order.paymentStatus === "Paid" || order.isPaid
              ? "Paid"
              : "Pending"}
          </span>
        </div>

        <div className="mt-8 border-t pt-5 space-y-2">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal</span>
            <span>₹{order.amount}</span>
          </div>

          <div className="flex justify-between text-gray-600">
            <span>Tax</span>
            <span>₹{order.tax || 0}</span>
          </div>

          <div className="flex justify-between text-xl font-bold text-gray-900 pt-2">
            <span>Total</span>
            <span>₹{order.total || order.amount}</span>
          </div>
        </div>

        {["Pending", "Confirmed", "Shipped"].includes(order.status) && (
          <div className="mt-8 border-t pt-5">
            <h3 className="font-semibold mb-2 text-red-600">Cancel Order</h3>

            <textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Write cancel reason..."
              className="w-full border p-3 rounded-lg"
            />

            <button
              onClick={handleCancelOrder}
              disabled={cancelLoading}
              className="mt-3 px-5 py-2 bg-red-500 text-white rounded-lg disabled:opacity-50"
            >
              {cancelLoading ? "Cancelling..." : "Cancel Order"}
            </button>
          </div>
        )}

        {order.status === "Delivered" && (
  <div className="mt-8 border-t pt-5">
    <h3 className="font-semibold mb-2 text-blue-600">Return Order</h3>

    <textarea
      value={returnReason}
      onChange={(e) => setReturnReason(e.target.value)}
      placeholder="Write return reason..."
      className="w-full border p-3 rounded-lg"
    />

    <button
      onClick={handleReturnOrder}
      disabled={returnLoading}
      className="mt-3 px-5 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50"
    >
      {returnLoading ? "Processing..." : "Return Order"}
    </button>
  </div>
)}

                {/* Show After Cancel */}
        {order.status === "Cancelled" && (
          <div className="mt-6 bg-red-50 p-4 rounded-xl border">
            <p className="text-red-600 font-semibold">Order Cancelled</p>
            <p className="text-sm text-gray-600 mt-1">
              Reason: {order.cancelReason}
            </p>
          </div>
        )}

      </div> 
    </div>   
  );
 };

export default OrderDetails;