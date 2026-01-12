import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(email, password);

      toast.success("Login successful");

      setTimeout(() => {
        navigate("/");
      }, 500);
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Invalid email or password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F2F2F7] flex justify-center">
      <div className="w-full max-w-[402px] flex flex-col items-center">
        {/* Main Content */}
        <div className="w-full flex flex-col items-center px-10 py-12 gap-6">
          {/* Header */}
          <div className="w-full max-w-[322px] flex flex-col gap-1">
            <h1 className="text-[34px] leading-[41px] tracking-[0.4px] pt-[20px] text-black font-normal">
              Welcome
            </h1>
            <p className="text-[17px] leading-[22px] font-semibold text-[rgba(60,60,67,0.6)]">
              Hello there, sign in to continue
            </p>
          </div>

          {/* Hero */}
          <div className="w-[300px] h-[300px] flex items-center justify-center mt-[40px]">
            <img
                src="https://filtered.anemona.cloud/hydro.svg"
                alt="Hydro Element"
                className="w-[300px] h-[300px] object-cover rounded-[999px] bg-white outline-2 outline-solid" 
                loading="lazy"
            />
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-[322px] flex flex-col pt-[30px] gap-[15px]"
          >
            {error && (
              <p className="text-[13px] text-red-500 text-center">
                {error}
              </p>
            )}

            {/* Email */}
            <input
              type="email"
              placeholder="Email or Username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="
                w-full h-[60px]
                px-[20px]
                rounded-[20px]
                border border-[rgba(60,60,67,0.29)]
                bg-white
                text-black
                caret-black
                text-[17px]
                leading-[22px]
                placeholder:text-[rgba(60,60,67,0.3)]
                focus:outline-none
                focus:ring-2 focus:ring-[#34C759]/40
              "
              required
            />

            {/* Password */}
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="
                w-full h-[60px]
                px-[20px]
                rounded-[20px]
                border border-[rgba(60,60,67,0.29)]
                bg-white
                text-black
                caret-black
                text-[17px]
                leading-[22px]
                placeholder:text-[rgba(60,60,67,0.3)]
                focus:outline-none
                focus:ring-2 focus:ring-[#34C759]/40
              "
              required
            />

            {/* Forgot Password */}
            <div className="flex justify-end">
              <button
                type="button"
                className="text-[13px] font-semibold text-[#34C759]"
              >
                Forgot Password?
              </button>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="
                w-full h-[60px]
                rounded-[20px]
                bg-[#34C759]
                text-white
                text-[17px]
                leading-[22px]
                font-semibold
                transition
                disabled:opacity-60
              "
            >
              {loading ? "Signing in..." : "Login"}
            </button>
          </form>

          {/* Footer */}
          <div className="w-full max-w-[322px] flex justify-center gap-1 text-[13px]">
            <span className="text-[rgba(60,60,67,0.6)]">
              Don’t have account yet?
            </span>
            <button className="font-semibold text-[#34C759]">
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
