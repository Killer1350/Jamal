/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { X, Mail, Lock, User as UserIcon, Phone, Flame, Eye, EyeOff } from "lucide-react";
import { UserSession } from "../types";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (session: UserSession) => void;
}

export default function AuthModal({ isOpen, onClose, onAuthSuccess }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    const url = isLogin ? "/api/auth/login" : "/api/auth/signup";
    const body = isLogin 
      ? { email, password }
      : { name, email, phone, password };

    try {
      const resp = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await resp.json();

      if (!resp.ok || !data.success) {
        throw new Error(data.error || "Something went wrong. Please check your credentials.");
      }

      setSuccessMsg(isLogin ? "Welcome back to Jamal's!" : "Account created successfully!");
      
      setTimeout(() => {
        onAuthSuccess(data);
        onClose();
        // Reset fields
        setName("");
        setEmail("");
        setPhone("");
        setPassword("");
        setSuccessMsg(null);
      }, 1200);

    } catch (err: any) {
      setError(err.message || "Failed to authenticate.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#2C2C24]/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-md bg-[#FAF9F6] border border-[#EAE7E1] rounded-3xl shadow-xl overflow-hidden animate-slide-up z-10 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-[#EAE7E1] flex items-center justify-between bg-[#F5F2ED]">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-[#5A5A40] animate-pulse" />
            <h3 className="font-cinzel text-sm font-bold tracking-widest text-[#2C2C24]">
              {isLogin ? "Sizzle & Sign In" : "Join Jamal's Feasters"}
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-[#EAE7E1] text-[#6B6B5E] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {error && (
            <div className="mb-4 p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-semibold flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
              {error}
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-700 font-semibold flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 animate-ping" />
              {successMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Name - only for Signup */}
            {!isLogin && (
              <div>
                <label className="block text-[10px] font-mono uppercase text-[#8A8A7A] mb-1.5 font-bold tracking-wider">
                  Full Name
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-3.5 top-3 w-4 h-4 text-[#8A8A7A]" />
                  <input
                    type="text"
                    required
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-white border border-[#EAE7E1] focus:border-[#5A5A40] pl-10 pr-4 py-2.5 rounded-xl text-xs text-[#2C2C24] font-semibold outline-none transition-all placeholder:text-[#CAC4B8]"
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-[10px] font-mono uppercase text-[#8A8A7A] mb-1.5 font-bold tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 w-4 h-4 text-[#8A8A7A]" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white border border-[#EAE7E1] focus:border-[#5A5A40] pl-10 pr-4 py-2.5 rounded-xl text-xs text-[#2C2C24] font-semibold outline-none transition-all placeholder:text-[#CAC4B8]"
                />
              </div>
            </div>

            {/* Phone - only for Signup */}
            {!isLogin && (
              <div>
                <label className="block text-[10px] font-mono uppercase text-[#8A8A7A] mb-1.5 font-bold tracking-wider">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-3 w-4 h-4 text-[#8A8A7A]" />
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 08027402094"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-white border border-[#EAE7E1] focus:border-[#5A5A40] pl-10 pr-4 py-2.5 rounded-xl text-xs text-[#2C2C24] font-semibold outline-none transition-all placeholder:text-[#CAC4B8]"
                  />
                </div>
              </div>
            )}

            {/* Password */}
            <div>
              <label className="block text-[10px] font-mono uppercase text-[#8A8A7A] mb-1.5 font-bold tracking-wider">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-[#8A8A7A]" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white border border-[#EAE7E1] focus:border-[#5A5A40] pl-10 pr-10 py-2.5 rounded-xl text-xs text-[#2C2C24] font-semibold outline-none transition-all placeholder:text-[#CAC4B8]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-[#8A8A7A] hover:text-[#5A5A40] focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Action Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#5A5A40] text-white py-3 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#4A4A35] transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 cursor-pointer mt-6"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : isLogin ? (
                "Log In Instantly"
              ) : (
                "Create My Account"
              )}
            </button>
          </form>

          {/* Toggle link */}
          <div className="mt-6 text-center text-xs text-[#6B6B5E] font-medium border-t border-[#EAE7E1] pt-4">
            {isLogin ? "Don't have an account yet?" : "Already have an account?"}{" "}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError(null);
                setSuccessMsg(null);
              }}
              className="text-[#D4A373] hover:text-[#5A5A40] font-bold cursor-pointer underline"
            >
              {isLogin ? "Register here" : "Sign in here"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
