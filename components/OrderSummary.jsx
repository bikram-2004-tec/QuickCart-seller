import React, { useEffect, useState } from "react";
import { useAppContext } from "@/context/AppContext";
import { useRouter } from "next/navigation";

const OrderSummary = () => {
  const router = useRouter();

  const {
    cartItems,
    products,
    getCartAmount,
    getCartCount,
    user,
  } = useAppContext();

  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userAddresses, setUserAddresses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  //for payment method selection in future
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const subtotal = getCartAmount();
  const tax = Math.floor(subtotal * 0.02);
  const total = subtotal + tax - discount;

  const fetchUserAddresses = async () => {
    try {
      const res = await fetch("/api/address/get");
      const data = await res.json();

      if (data.success) {
        setUserAddresses(data.addresses);
      }
    } catch (error) {
      alert("Error fetching address");
    }
  };

  useEffect(() => {
    fetchUserAddresses();
  }, []);

  const handleAddressSelect = (addr) => {
    setSelectedAddress(addr);
    setIsDropdownOpen(false);
  };

  const deleteAddress = async (id) => {
    try {
      await fetch("/api/address/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      fetchUserAddresses();
      setSelectedAddress(null);
    } catch (error) {
      alert("Delete failed");
    }
  };
  //promo code logic
  const applyPromoCode = () => {
    if (promoCode.toLowerCase() === "save10") {
      setDiscount(100);
      alert("Promo applied ₹100 discount");
    } else {
      setDiscount(0);
      alert("Invalid promo code");
    }
  };

  const createOrder = async () => {
    if (!selectedAddress) {
      alert("Please select address");
      return;
    }

    if (getCartCount() === 0) {
      alert("Cart is empty");
      return;
    }

    try {
      setLoading(true);

      const orderItems = Object.keys(cartItems)
        .filter((itemId) => cartItems[itemId] > 0)
        .map((itemId) => {
          const product = products.find((p) => p._id === itemId);

          return {
            productId: itemId,
            name: product?.name,
            price: product?.offerPrice,
            quantity: cartItems[itemId],
            image: product?.image?.[0],
          };
        });

      // 👉 ADD THIS FIRST
if (paymentMethod === "ONLINE") {
  const razorpayRes = await fetch("/api/razorpay/create-order", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ amount: total }),
  });

  const razorpayData = await razorpayRes.json();

  if (!razorpayData.success) {
    alert(razorpayData.message || "Payment start failed");
    return;
  }

  const options = {
    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    amount: razorpayData.order.amount,
    currency: "INR",
    name: "QuickCart",
    description: "Order Payment",
    order_id: razorpayData.order.id,

    handler: async function () {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user?.id,
          userEmail: user?.primaryEmailAddress?.emailAddress,
          items: orderItems,
          address: selectedAddress,
          amount: subtotal,
          tax,
          discount,
          total,
          paymentMethod: "ONLINE",
          paymentStatus: "Paid",
        }),
      });

      const data = await res.json();

      if (data.success) {
        router.push("/my-orders");
      } else {
        alert("Order save failed");
      }
    },
  };

  const rzp = new window.Razorpay(options);
  rzp.open();
  return;
}
// 👉 THEN your fetch
const res = await fetch("/api/order", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    userId: user?.id,
    userEmail: user?.primaryEmailAddress?.emailAddress,
    items: orderItems,
    address: selectedAddress,
    amount: subtotal,
    tax,
    discount,
    total,
  }),
});

      const data = await res.json();

      if (data.success) {
        router.push("/order-placed");
      } else {
        alert(data.message || "Order failed");
      }
    } catch (error) {
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full md:w-96 bg-gray-500/5 p-5">
      <h2 className="text-xl md:text-2xl font-medium text-gray-700">
        Order Summary
      </h2>

      <hr className="border-gray-500/30 my-5" />

      <div>
        <label className="text-base font-medium uppercase text-gray-600 block mb-2">
          Select Address
        </label>

        <button
          type="button"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="w-full border px-3 py-2 text-left bg-white"
        >
          {selectedAddress
            ? `${selectedAddress.fullName}, ${selectedAddress.area}, ${selectedAddress.city}, ${selectedAddress.state}`
            : "Select Address"}
        </button>

        {isDropdownOpen && (
          <ul className="border bg-white mt-1 shadow-md">
            {userAddresses.map((addr) => (
              <li
                key={addr._id}
                className="px-3 py-2 flex justify-between items-center hover:bg-gray-100"
              >
                <span
                  onClick={() => handleAddressSelect(addr)}
                  className="cursor-pointer"
                >
                  {addr.fullName}, {addr.city}
                </span>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteAddress(addr._id);
                  }}
                  className="text-red-500"
                >
                  ❌
                </button>
              </li>
            ))}

            <li
              onClick={() => router.push("/add-address")}
              className="px-3 py-2 text-center cursor-pointer hover:bg-gray-100"
            >
              + Add Address
            </li>
          </ul>
        )}
      </div>

      <div className="mt-5">
        <label className="text-base font-medium uppercase text-gray-600 block mb-2">
          Promo Code
        </label>

        <input
          value={promoCode}
          onChange={(e) => setPromoCode(e.target.value)}
          type="text"
          placeholder="Use SAVE10"
          className="w-full border p-2"
        />

        <button
          type="button"
          onClick={applyPromoCode}
          className="bg-green-600 text-white px-6 py-2 mt-3"
        >
          Apply
        </button>
      </div>

      <hr className="border-gray-500/30 my-5" />

      <div className="space-y-3">
        <div className="flex justify-between">
          <p>Items {getCartCount()}</p>
          <p>₹{subtotal}</p>
        </div>

        <div className="flex justify-between">
          <p>Shipping Fee</p>
          <p>Free</p>
        </div>

        <div className="flex justify-between">
          <p>Tax (2%)</p>
          <p>₹{tax}</p>
        </div>

        <div className="flex justify-between">
          <p>Discount</p>
          <p>- ₹{discount}</p>
        </div>

        <div className="flex justify-between text-lg font-medium border-t pt-3">
          <p>Total</p>
          <p>₹{total}</p>
        </div>
      </div>

      {/* Payment Method */}
      <div className="mt-5">
        <p className="font-medium mb-2">Payment Method</p>

        <button
          type="button"
          onClick={() => setPaymentMethod("COD")}
          className={`border px-4 py-2 mr-2 ${
            paymentMethod === "COD" ? "bg-orange-600 text-white" : ""
          }`}
        >
          COD
        </button>

        <button
          type="button"
          onClick={() => setPaymentMethod("ONLINE")}
          className={`border px-4 py-2 ${
            paymentMethod === "ONLINE" ? "bg-orange-600 text-white" : ""
          }`}
        >
          ONLINE
        </button>
      </div>

      <button
        onClick={createOrder}
        disabled={loading}
        className="w-full bg-orange-600 text-white py-3 mt-5 hover:bg-orange-700 disabled:opacity-60"
      >
        {loading
          ? "Placing Order..."
          : paymentMethod === "ONLINE"
          ? "Pay Online"
          : "Place Order"}
      </button>
    </div>
  );
};

export default OrderSummary;