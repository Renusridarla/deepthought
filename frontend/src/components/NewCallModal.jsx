import React, { useState } from "react";
import { X, PlusCircle, Building2, User, Phone } from "lucide-react";

export function NewCallModal({ isOpen, onClose, onStartCall }) {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({
    prospectName: "Dr. Anjali Menon",
    prospectRole: "Owner & Managing Director",
    companyName: "Menon Engineering Works",
    companyKind: "mid-size private manufacturer",
    callerName: "Priya",
    phoneNumber: "+91 98490 12345",
    callType: "first call"
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onStartCall(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden my-8 animate-fadeIn">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white tracking-tight">Start New Cold Call</h2>
              <p className="text-xs text-slate-400">
                Set prospect profile before ringing.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 block mb-1.5">
              Prospect Name
            </label>
            <input
              type="text"
              required
              value={formData.prospectName}
              onChange={(e) => setFormData({ ...formData, prospectName: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-lg p-2.5 text-xs text-slate-100 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 block mb-1.5">
                Role / Title
              </label>
              <input
                type="text"
                value={formData.prospectRole}
                onChange={(e) => setFormData({ ...formData, prospectRole: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-lg p-2.5 text-xs text-slate-100 outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 block mb-1.5">
                Company Name
              </label>
              <input
                type="text"
                required
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-lg p-2.5 text-xs text-slate-100 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 block mb-1.5">
                Company Kind
              </label>
              <select
                value={formData.companyKind}
                onChange={(e) => setFormData({ ...formData, companyKind: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-lg p-2.5 text-xs text-slate-100 outline-none"
              >
                <option value="mid-size private company">Mid-size private company</option>
                <option value="mid-size private manufacturer">Mid-size private manufacturer</option>
                <option value="India arm of a multinational">India arm of a multinational</option>
                <option value="listed Indian company">Listed Indian company</option>
                <option value="startup">Startup</option>
                <option value="large private company">Large private company</option>
                <option value="small private company">Small private company</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 block mb-1.5">
                Call Type
              </label>
              <select
                value={formData.callType}
                onChange={(e) => setFormData({ ...formData, callType: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-lg p-2.5 text-xs text-slate-100 outline-none"
              >
                <option value="first call">First call</option>
                <option value="follow-up">Follow-up</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 block mb-1.5">
                Caller Name
              </label>
              <input
                type="text"
                value={formData.callerName}
                onChange={(e) => setFormData({ ...formData, callerName: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-lg p-2.5 text-xs text-slate-100 outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 block mb-1.5">
                Phone Number
              </label>
              <input
                type="text"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-lg p-2.5 text-xs text-slate-100 outline-none"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="text-xs text-slate-400 hover:text-white px-4 py-2 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="text-xs bg-blue-600 hover:bg-blue-500 text-white font-bold px-5 py-2.5 rounded-lg transition-all shadow-md shadow-blue-600/30"
            >
              Launch Call Screen
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
