"use client";
import React, { useState, useRef } from "react";
import axios from "axios";
import { Camera, UploadCloud, ShieldAlert, CheckCircle, Wrench } from "lucide-react";

export default function DiagnosticsPage() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 1. Handle user selecting an image
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResult(null); // Clear previous results if they upload a new photo
    }
  };

  // 2. Send the image to your live Python backend
  const analyzeImage = async () => {
    if (!imageFile) return;
    setIsAnalyzing(true);
    
    // Package the file securely for HTTP transit
    const formData = new FormData();
    formData.append("file", imageFile);

    try {
      // Ping your live Render API
      const res = await axios.post("https://marketplace-5baf.onrender.com/api/vision/diagnose/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      
      // Update UI with the AI's response
      setResult(res.data.diagnostic_summary || res.data); 
      
    } catch (error) {
      console.error("Vision API Error:", error);
      alert("Failed to analyze image. Ensure your Render backend is awake.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Camera className="w-8 h-8 text-cyan-400" />
          </div>
          <h1 className="text-4xl font-black text-gray-900 mb-2">AI Vision Diagnostics</h1>
          <p className="text-lg text-gray-500 font-medium">Upload a photo of the problem. Get an instant price.</p>
        </div>

        {/* Upload Container */}
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
          <div 
            className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:bg-gray-50 transition cursor-pointer relative overflow-hidden group"
            onClick={() => fileInputRef.current?.click()}
          >
            {previewUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={previewUrl} alt="Preview" className="w-full h-64 object-cover rounded-xl" />
            ) : (
              <div className="space-y-4 py-8">
                <UploadCloud className="w-12 h-12 text-cyan-500 mx-auto group-hover:scale-110 transition-transform" />
                <div>
                  <p className="text-gray-900 font-bold text-lg">Click to upload photo</p>
                  <p className="text-sm text-gray-400 font-medium">PNG, JPG up to 5MB</p>
                </div>
              </div>
            )}
            <input type="file" className="hidden" ref={fileInputRef} accept="image/*" onChange={handleFileChange} />
          </div>

          <button
            onClick={analyzeImage}
            disabled={!imageFile || isAnalyzing}
            className={`mt-6 w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 ${
              !imageFile || isAnalyzing ? "bg-gray-100 text-gray-400" : "bg-black text-white hover:bg-gray-800 shadow-lg"
            }`}
          >
            {isAnalyzing ? "Scanning Image Data..." : "Run AI Diagnostic"}
          </button>

          {/* AI Result Card */}
          {result && (
            <div className="mt-8 bg-slate-900 rounded-2xl p-6 shadow-inner text-white animate-in fade-in slide-in-from-bottom-4">
              <div className="flex items-center gap-2 mb-6">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <h3 className="text-green-400 font-bold tracking-widest uppercase text-sm">Diagnostic Complete</h3>
              </div>
              
              <div className="space-y-5">
                <div className="flex gap-4">
                  <ShieldAlert className="w-6 h-6 text-cyan-400 shrink-0" />
                  <div>
                    <p className="text-sm text-gray-400 uppercase tracking-wider font-bold mb-1">Detected Fault</p>
                    <p className="text-lg font-bold">{result.detected_fault || result.fault || "Unknown Issue"}</p>
                    <p className="text-sm text-cyan-400 mt-1">Confidence: {result.confidence || "High"}</p>
                  </div>
                </div>
                
                <div className="flex gap-4 pt-4 border-t border-slate-800">
                  <Wrench className="w-6 h-6 text-orange-400 shrink-0" />
                  <div>
                    <p className="text-sm text-gray-400 uppercase tracking-wider font-bold mb-2">Required Action Plan</p>
                    <ul className="space-y-2">
                      {/* Safely map over the action plan array */}
                      {(result.action_plan || ["Dispatch technician for manual review"]).map((step: string, idx: number) => (
                        <li key={idx} className="flex items-center gap-2 text-sm font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-orange-400" /> {step}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              
              <button className="w-full mt-6 bg-cyan-500 text-slate-900 py-3 rounded-lg font-black hover:bg-cyan-400 transition-colors">
                Book {result.category ? result.category.replace('_', ' ') : 'Service'} Partner Now
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}