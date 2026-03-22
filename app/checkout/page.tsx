"use client";
import React, { useState, useEffect } from "react";
import { Lock, ShieldCheck, CreditCard } from "lucide-react";

export default function CheckoutPage() {
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Hardcoded for UI. In production, pass this via URL params or Zustand
  const bookingDetails = {
    id: "BK-99482",
    service: "AC Deep Cleaning & Gas Refill",
    amount: 899,
  };

  useEffect(() => {
    // Inject Razorpay Script into the DOM
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const handlePayment = async () => {
    setIsProcessing(true);
    
    // In production, you will await an Axios call to FastAPI to generate an order_id here.
    setTimeout(() => {
      const options = {
        key: "rzp_test_SUFiXryKUgGzZC", // Replace with your actual Test/Live key
        amount: bookingDetails.amount * 100, // Razorpay takes paise (multiply by 100)
        currency: "INR",
        name: "SkillGrid India",
        description: bookingDetails.service,
        image: "https://yourdomain.com/logo.png",
        handler: function (response: any) {
          alert(`Payment Successful! TXN ID: ${response.razorpay_payment_id}`);
        },
        prefill: {
          name: "Aakarsh",
          email: "customer@skillgrid.in",
          contact: "9999999999"
        },
        theme: {
          color: "#000000"
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (response: any){
        alert(`Payment Failed: ${response.error.description}`);
      });
      rzp.open();
      setIsProcessing(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white max-w-md w-full rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
        <div className="bg-black p-8 text-center relative">
          <ShieldCheck className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
          <h2 className="text-3xl font-black text-white">Secure Checkout</h2>
          <p className="text-gray-400 mt-1 font-medium text-sm">Escrow secured by Razorpay</p>
        </div>
        
        <div className="p-8">
          <div className="space-y-4 mb-8 bg-gray-50 p-6 rounded-2xl border border-gray-100">
            <div className="flex justify-between pb-4 border-b border-gray-200">
              <span className="text-gray-500 font-bold text-sm uppercase tracking-wider">Service ID</span>
              <span className="text-gray-900 font-black">{bookingDetails.id}</span>
            </div>
            <div className="flex justify-between pb-4 border-b border-gray-200">
              <span className="text-gray-500 font-bold text-sm uppercase tracking-wider">Task</span>
              <span className="text-gray-900 font-bold text-right max-w-[150px]">{bookingDetails.service}</span>
            </div>
            <div className="flex justify-between pt-2 items-center">
              <span className="text-gray-900 font-black text-xl">Total Due</span>
              <span className="text-green-600 font-black text-3xl">₹{bookingDetails.amount}</span>
            </div>
          </div>

          <button
            onClick={handlePayment}
            disabled={isProcessing}
            className={`w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 ${
              isProcessing ? "bg-gray-200 text-gray-500" : "bg-black text-white hover:bg-gray-800 shadow-lg"
            }`}
          >
            {isProcessing ? "Initializing Gateway..." : (
              <>
                <CreditCard className="w-5 h-5" /> Pay ₹{bookingDetails.amount} Securely
              </>
            )}
          </button>
          
          <p className="text-center text-xs text-gray-400 mt-6 font-bold flex items-center justify-center gap-1 uppercase tracking-widest">
            <Lock className="w-3 h-3" /> 256-Bit Encryption
          </p>
        </div>
      </div>
    </div>
  );
}
