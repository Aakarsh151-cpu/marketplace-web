"use client";
import React from "react";
import { useAppStore } from "../../store/useAppStore";
import { CheckCircle2, Clock, MapPin } from "lucide-react";

export default function ProviderWebPortal() {
  const activeLeads = useAppStore((state) => state.activeLeads);
  const removeLead = useAppStore((state) => state.removeLead);

  const acceptJob = (id: string) => {
    removeLead(id);
    alert(`Job ${id} Accepted! Customer has been notified.`);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-10 font-sans">
      <div className="max-w-6xl mx-auto">
        
        <div className="mb-10">
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Partner Operations Center</h1>
          <p className="text-gray-500 font-medium mt-2">Live leads dispatched autonomously by SkillGrid AI</p>
        </div>

        {activeLeads.length === 0 ? (
          <div className="bg-white rounded-3xl p-20 text-center shadow-sm border border-gray-200 flex flex-col items-center">
            <Clock className="w-16 h-16 text-gray-300 mb-4" />
            <h3 className="text-xl font-bold text-gray-800">Queue is Empty</h3>
            <p className="text-gray-400 mt-2 font-medium">Waiting for incoming work orders...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeLeads.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 flex flex-col hover:shadow-lg transition-shadow">
                
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{item.id}</span>
                    <h2 className="text-lg font-black text-gray-900 mt-1">
                      {item.category.replace('_', ' ')}
                    </h2>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-black tracking-wider ${
                    item.urgency === 'HIGH' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                  }`}>
                    {item.urgency}
                  </span>
                </div>
                
                <p className="text-gray-600 mb-6 flex-1 text-sm font-medium leading-relaxed bg-gray-50 p-3 rounded-lg border border-gray-100">
                  {item.summary}
                </p>
                
                <div className="flex items-center gap-2 text-sm font-bold text-cyan-600 mb-6">
                  <MapPin className="w-4 h-4" />
                  <span>3.2 km away</span>
                </div>
                
                <button
                  onClick={() => acceptJob(item.id)}
                  className="w-full bg-black text-white font-bold py-3.5 rounded-xl hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  Accept & Dispatch
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}