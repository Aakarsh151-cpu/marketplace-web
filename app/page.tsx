"use client";
import React, { useState } from "react";
import axios from "axios";
import { useAppStore } from "../store/useAppStore";
import { Bot, Send, Loader2, AlertTriangle, Camera } from "lucide-react";
import LiveMap from "../components/LiveMap";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "https://marketplace-5baf.onrender.com";

export default function CustomerDashboard() {
  const addLead = useAppStore((state) => state.addLead);

  const [issue, setIssue] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const selectedFiles = Array.from(e.target.files).slice(0, 4);
    setImages(selectedFiles);
    setImagePreviews(selectedFiles.map((file) => URL.createObjectURL(file)));
  };

  const handleDispatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!issue.trim()) return;
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("customer_message", issue);
      images.forEach((file) => formData.append("files", file));

      const res = await axios.post(`${BACKEND_URL}/api/triage/chat-with-images`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const aiData = res.data.dispatch;
      setResponse(aiData);

      addLead({
        id: `BK-${Math.floor(Math.random() * 10000)}`,
        category: aiData.category || "UNKNOWN",
        urgency: aiData.urgency || "ROUTINE",
        summary: aiData.summary_for_technician || aiData.temporary_fix || "Needs inspection",
      });

      setIssue("");
      setImages([]);
      setImagePreviews([]);
    } catch (error) {
      console.error(error);
      alert("Ghost Assistant is currently offline. Ensure FastAPI is running and backend is accessible.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full bg-gray-50 font-sans">
      
      {/* LEFT SIDE: Map (ONLY THIS PART CHANGED) */}
      <div className="w-2/3 h-full bg-slate-800 flex flex-col items-center justify-center relative overflow-hidden">
        <LiveMap />
      </div>

      {/* RIGHT SIDE: Booking Panel */}
      <div className="w-1/3 h-full bg-white shadow-2xl flex flex-col border-l border-gray-200">
        
        {/* Header */}
        <div className="p-8 pb-4 border-b border-gray-100">
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">SkillGrid</h1>
          <p className="text-gray-500 mt-1 font-medium text-sm">Autonomous Service Dispatch</p>
        </div>

        {/* Chat / Response Area */}
        <div className="flex-1 p-8 overflow-y-auto bg-gray-50">
          {response ? (
            <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm animate-in slide-in-from-bottom-4">
              <div className="flex justify-between items-start mb-4">
                <span className="bg-cyan-100 text-cyan-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  {response.category?.replace('_', ' ') || 'UNKNOWN'}
                </span>
                {response.urgency === 'HIGH' && (
                  <span className="flex items-center gap-1 text-red-600 text-xs font-bold uppercase">
                    <AlertTriangle className="w-4 h-4" /> High Priority
                  </span>
                )}
              </div>
              <p className="text-gray-800 font-medium italic mb-4">"{response.summary_for_technician || 'Awaiting inspection details'}"</p>

              <div className="mb-4">
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Temporary Fix</h3>
                <p className="text-sm text-slate-700">{response.temporary_fix || 'Keep systems off and isolate the problem area.'}</p>
              </div>

              <div className="mb-4">
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Permanent Fix</h3>
                <p className="text-sm text-slate-700">{response.permanent_fix || 'Replace or repair the faulty component with certified services.'}</p>
              </div>

              {Array.isArray(response.solution_suggestions) && response.solution_suggestions.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Suggested Steps</h3>
                  <ul className="list-disc list-inside text-sm text-slate-700">
                    {response.solution_suggestions.map((item: string, idx: number) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="bg-green-50 text-green-700 p-3 rounded-xl text-sm font-bold flex items-center justify-center border border-green-200">
                Lead dispatched to local partners!
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
              <Bot className="w-16 h-16 text-gray-300 mb-4" />
              <p className="text-gray-500 max-w-[200px]">Describe your issue, and the AI will route it instantly.</p>
            </div>
          )}
        </div>

        {/* Input Form */}
        <form onSubmit={handleDispatch} className="p-6 bg-white border-t border-gray-100">
          <div className="mb-3">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1 block">Attach photos (up to 4)</label>
            <div className="flex items-center gap-2">
              <label htmlFor="images" className="inline-flex items-center gap-2 cursor-pointer px-3 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold">
                <Camera className="w-4 h-4" /> Add photos
              </label>
              <input
                id="images"
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
            {imagePreviews.length > 0 && (
              <div className="mt-3 grid grid-cols-2 gap-2">
                {imagePreviews.map((src, idx) => (
                  <img key={idx} src={src} alt={`upload-${idx}`} className="rounded-lg border border-gray-200 h-20 w-full object-cover" />
                ))}
              </div>
            )}
          </div>

          <div className="relative flex items-center">
            <input
              type="text"
              placeholder="e.g., My AC compressor is making a loud noise..."
              value={issue}
              onChange={(e) => setIssue(e.target.value)}
              disabled={isLoading}
              className="w-full bg-gray-100 border-transparent focus:bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 rounded-xl py-4 pl-4 pr-14 text-sm transition-all outline-none text-gray-800"
            />
            <button
              type="submit"
              disabled={isLoading || (!issue.trim() && images.length === 0)}
              className="absolute right-2 p-2.5 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}