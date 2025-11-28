"use client";

import React, { useState, FormEvent } from "react";
import { motion, Variants, Transition } from "framer-motion";

// --- TYPE DEFINITIONS ---
interface InputFieldProps {
  type: "text" | "email" | "tel" | "number";
  name: string;
  placeholder: string;
  required?: boolean;
}

interface ApiResponse {
  ok: boolean;
  json: () => Promise<{ success?: boolean; data?: unknown; error?: string }>;
}
// ------------------------

// Helper component for the input fields
const InputField: React.FC<InputFieldProps> = ({
  type,
  name,
  placeholder,
  required = false,
}) => (
  <motion.input
    type={type}
    name={name}
    placeholder={placeholder}
    className="w-full p-4 border-2 border-slate-200 dark:border-indigo-700 rounded-xl focus:ring-4
    focus:ring-sky-300 focus:border-sky-500 outline-none transition-all duration-300
    bg-white dark:bg-slate-900/60 dark:text-gray-50 placeholder-gray-400 dark:placeholder-gray-500
    shadow-inner text-lg"
    required={required}
    // framer-motion supports whileFocus; TypeScript sometimes complains depending on versions,
    // but this generally works — if your TS complains, you can cast as any: (whileFocus as any)={...}
    whileFocus={{ scale: 1.005, borderColor: "#0ea5e9", boxShadow: "0 0 0 4px rgba(14, 165, 233, 0.2)" }}
  />
);

// Main component: App
const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData);

    // Simulate API call with exponential backoff logic (simplified retry mechanism)
    const MAX_RETRIES = 3;
    let attempts = 0;

    const simulateApiCall = async (): Promise<ApiResponse> => {
      // Wait for the simulated latency
      await new Promise((r) => setTimeout(r, 1200));
      const success = Math.random() > 0.1;
      if (success) {
        return {
          ok: true,
          json: async () => ({ success: true, data }),
        };
      } else {
        return {
          ok: false,
          json: async () => ({ error: "Server load exceeded capacity." }),
        };
      }
    };

    while (attempts < MAX_RETRIES) {
      try {
        const res = await simulateApiCall();
        const result = await res.json();

        setLoading(false);

        if (res.ok) {
          setMessage("✅ Registration successful! Confirmation email sent.");
        } else {
          setMessage(result.error || "❌ Failed to submit. Please check your data.");
        }
        return;
      } catch (error) {
        // This catch will only trigger on unexpected runtime errors
        attempts++;
        if (attempts >= MAX_RETRIES) {
          setLoading(false);
          setMessage("❌ Submission failed after multiple retries. Please try again later.");
          console.error("Final submission error:", error);
          return;
        }
        // Exponential backoff delay
        const delay = Math.pow(2, attempts) * 500;
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  };

  const formVariants: Variants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 15,
        delay: 0.1,
        when: "beforeChildren",
        staggerChildren: 0.1,
      } as Transition,
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  // Custom Icon for Registration/Submit (A modern rocket icon)
  const SendIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-7 w-7"
    >
      <path d="M15 11l4-4L5 3zM15 11l-4 4-2-3-3 2 4 4 4-4z" />
      <path d="M22 2L11 13M22 2l-2-2-19 19 4-4 4-2 3-2z" />
    </svg>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-950 dark:to-indigo-950 p-4 sm:p-8 font-inter relative overflow-hidden">
      <motion.div
        className="absolute top-0 left-0 w-[400px] h-[400px] bg-sky-400 rounded-full opacity-10 filter blur-3xl dark:bg-sky-500/20"
        animate={{ x: [0, 100, 0], y: [0, 80, 0], rotate: [0, 30, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-indigo-500 rounded-full opacity-10 filter blur-3xl dark:bg-indigo-700/20"
        animate={{ x: [0, -120, 0], y: [0, -90, 0], rotate: [0, -45, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />

      <motion.form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-slate-800 shadow-2xl rounded-3xl p-6 sm:p-12 w-full max-w-2xl space-y-8
        transition-all duration-500 transform border-4 border-sky-400 dark:border-sky-700 ring-8 ring-sky-100 dark:ring-indigo-800/50
        relative z-10 hover:shadow-3xl hover:border-indigo-500 dark:hover:border-sky-500"
        variants={formVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="text-center" variants={itemVariants}>
          <h1 className="text-5xl font-extrabold text-indigo-700 dark:text-sky-300 mb-2 leading-tight tracking-tight">
            IDAIS Show Jr.
          </h1>
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-5">
            Premier Innovation & AI Contest Registration
          </h2>
          <motion.div
            className="w-24 h-1 bg-gradient-to-r from-sky-400 to-indigo-600 mx-auto rounded-full mt-3"
            variants={{ hidden: { width: 0 }, visible: { width: "6rem", transition: { duration: 0.8 } } }}
          />
          <p className="text-lg text-gray-600 dark:text-gray-300 mt-5">
            Submit your groundbreaking project details and secure your spot among the best young innovators.
          </p>
        </motion.div>

        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField type="text" name="student_name" placeholder="Student Name (Full)" required />
          <InputField type="email" name="email" placeholder="Email ID (Primary)" required />
          <InputField type="tel" name="contact_number" placeholder="Mobile Contact" required />
          <InputField type="text" name="class_standard" placeholder="Grade/Class" required />
          <InputField type="text" name="school_name" placeholder="School Name" required />
          <InputField type="text" name="group" placeholder="Team Name (Optional)" />
        </motion.div>

        <motion.div variants={itemVariants}>
          <label className="text-gray-700 dark:text-gray-300 font-semibold mb-2 block text-xl">
            Project Idea Description
          </label>
          <motion.textarea
            name="idea"
            placeholder="Outline your innovative idea (Problem, Proposed Solution, and anticipated Impact on society or industry). Max 1000 characters."
            className="w-full p-5 border-2 border-slate-200 dark:border-indigo-700 rounded-2xl focus:ring-4
            focus:ring-sky-300 focus:border-sky-500 outline-none transition-all duration-300
            resize-none h-48 bg-white dark:bg-slate-900/60 dark:text-gray-50 shadow-inner text-lg
            placeholder-gray-400 dark:placeholder-gray-500"
            maxLength={1000}
            required
            whileFocus={{ scale: 1.005, borderColor: "#0ea5e9", boxShadow: "0 0 0 4px rgba(14, 165, 233, 0.2)" }}
          />
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 text-right">Max 1000 characters</p>
        </motion.div>

        <motion.button
          type="submit"
          disabled={loading}
          className="w-full py-5 text-white font-extrabold text-xl rounded-full
          bg-gradient-to-r from-sky-500 to-indigo-600 dark:from-sky-400 dark:to-indigo-500
          shadow-xl shadow-sky-400/40 dark:shadow-indigo-800/50
          hover:shadow-2xl hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 ease-in-out
          disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center space-x-3 tracking-wider"
          whileHover={{ scale: 1.005, boxShadow: "0 15px 30px rgba(14, 165, 233, 0.4)" }}
          whileTap={{ scale: 0.99 }}
          variants={itemVariants}
        >
          {loading ? (
            <>
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="inline-block w-6 h-6 border-4 border-t-4 border-t-white border-sky-200 rounded-full"
              />
              <span>Processing Submission...</span>
            </>
          ) : (
            <>
              <SendIcon />
              <span>Register & Launch Idea</span>
            </>
          )}
        </motion.button>

        {message && (
          <motion.p
            className={`text-center font-bold text-lg p-3 rounded-xl border-2 ${
              message.startsWith("✅")
                ? "text-green-600 bg-green-50 border-green-300 dark:text-green-400 dark:bg-green-900/50 dark:border-green-700"
                : "text-red-600 bg-red-50 border-red-300 dark:text-red-400 dark:bg-red-900/50 dark:border-red-700"
            } mt-5`}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 100, damping: 10 }}
          >
            {message}
          </motion.p>
        )}
      </motion.form>
    </div>
  );
};

export default App;
