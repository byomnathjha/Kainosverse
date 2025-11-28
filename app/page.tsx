"use client";

import React, { useState, FormEvent } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";

/**
 * PREMIUM Registration Form UI (Simplified)
 * - Removed the entire Right Column (Contest Focus, Tips, etc.).
 * - Kept the form and the primary submission button.
 */

/* ---------------- Styled Components ---------------- */

const Page = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  /* Darker, more dramatic background for premium feel */
  background: radial-gradient(1200px 600px at 10% 90%, rgba(99,102,241,0.08), transparent),
              radial-gradient(1000px 500px at 95% 10%, rgba(6,182,212,0.06), transparent),
              linear-gradient(180deg, #1e293b 0%, #0f172a 100%);
  padding: 40px;
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
`;

const Card = styled.div`
  width: 100%;
  max-width: 600px; /* Reduced width since the right column is gone */
  /* Clean, high-contrast white card */
  background: #ffffff;
  border-radius: 20px;
  padding: 40px; /* Increased padding */
  box-shadow: 0 40px 100px rgba(0,0,0,0.15), 0 10px 30px rgba(0,0,0,0.08); /* Stronger, deeper shadow */
  display: flex; /* Changed to flex for single column layout */
  flex-direction: column;
  gap: 30px;
  border: 1px solid rgba(226, 232, 240, 0.7); /* Lighter border for clean look */

  @media (max-width: 640px) {
    padding: 30px;
  }
`;

/* main form */
const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 18px; /* Increased gap */
`;

/* small headings */
const Headline = styled.h1`
  margin: 0;
  font-size: 36px; /* Bigger headline */
  line-height: 1.1;
  color: #1e293b;
  font-weight: 900;
  letter-spacing: -0.5px;
`;

const Sub = styled.p`
  margin: 8px 0 0;
  color: #475569;
  font-weight: 600;
  font-size: 17px;
`;

/* grid fields */
const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px; /* Increased gap */
  margin-top: 10px;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

/* input wrapper like your 'inputForm' */
const InputWrap = styled(motion.label)`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 18px; /* Slightly larger padding */
  background: #f8fafc; /* Lighter input background */
  border-radius: 12px; /* Less rounded corners for professionalism */
  border: 1.5px solid #e2e8f0;
  height: 56px; /* Taller input */
  transition: border-color 200ms ease, box-shadow 200ms ease;

  &:focus-within {
    border-color: #3b82f6; /* Blue focus for a cleaner, professional look */
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2), 0 4px 15px rgba(59, 130, 246, 0.1);
  }
`;

const IconBox = styled.div`
  width: 22px;
  height: 22px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #475569; /* Darker icon color */
  flex: 0 0 22px;
  svg { display: block; width: 100%; height: auto; fill: currentColor; } /* Ensure SVG fill works with currentColor */
`;

const Input = styled.input`
  border: none;
  outline: none;
  font-size: 16px; /* Slightly larger font */
  color: #1e293b;
  background: transparent;
  width: 100%;
  height: 100%;
  padding-right: 6px;

  &::placeholder { color: #94a3b8; font-weight: 500; }
`;

const Textarea = styled.textarea`
  width: 100%;
  min-height: 140px;
  border-radius: 12px;
  border: 1.5px solid #e2e8f0;
  padding: 14px 18px;
  font-size: 16px;
  color: #1e293b;
  background: #f8fafc;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
  }
`;

/* big submit button */
const Submit = styled(motion.button)`
  width: 100%;
  padding: 18px 20px; /* Larger button */
  border-radius: 12px; /* Less rounded corners */
  border: none;
  /* Premium solid color blue */
  background: #3b82f6;
  color: #fff;
  font-weight: 700;
  font-size: 16px;
  cursor: pointer;
  /* Stronger box shadow for impact */
  box-shadow: 0 16px 30px rgba(59, 130, 246, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.15);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: all 200ms ease;

  &:hover {
    background: #2563eb;
    box-shadow: 0 20px 40px rgba(59, 130, 246, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.15);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

/* message box */
const Message = styled.div<{ ok?: boolean }>`
  margin-top: 10px;
  padding: 14px 18px;
  border-radius: 12px;
  font-weight: 700;
  font-size: 15px;
  color: ${(p) => (p.ok ? "#15803d" : "#b91c1c")};
  background: ${(p) => (p.ok ? "#f0fdf4" : "#fef2f2")};
  border: 1px solid ${(p) => (p.ok ? "#34d399" : "#f87171")};
`;

/* small helper text */
const Minor = styled.div`
  color: #94a3b8;
  font-size: 13px;
  margin-top: 6px;
`;

/* ---------------- Helpers ---------------- */

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

// Icon for the main button
const SendIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 12L20 4L14 20L4 12Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M14 4L10 12L20 18L14 4Z" fill="white"/>
    </svg>
);


/* ---------------- Main Component ---------------- */

const PageComponent: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");
    setSuccess(false);

    const form = e.target as HTMLFormElement;
    const fd = new FormData(form);
    const data = Object.fromEntries(fd) as Record<string, any>;

    // client-side basic validation
    if (!data.student_name || !data.email) {
      setMessage("Please provide name and email.");
      setSuccess(false);
      return;
    }
    if (!isEmail(String(data.email))) {
      setMessage("Please enter a valid email address.");
      setSuccess(false);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data }),
      });

      const body = await res.json();
      setLoading(false);

      if (res.ok) {
        setMessage(" Registration successful! Confirmation sent to your email.");
        setSuccess(true);
        form.reset();
      } else {
        setMessage(body?.error || " Submission failed. Try again.");
        setSuccess(false);
      }
    } catch (err) {
      console.error("Submit error:", err);
      setLoading(false);
      setMessage(" Network error. Please check your connection.");
      setSuccess(false);
    }
  };

  return (
    <Page>
      <Card>
        <FormContainer onSubmit={handleSubmit}>
          <div>
            <Headline>IDAIS Show Jr.</Headline>
            <Sub>Premier Innovation & AI Contest — Registration</Sub>
          </div>

          <Minor style={{ marginTop: 10 }}>
            Fill the form below and we'll email a confirmation to the address provided.
          </Minor>

          <Grid>
            {/* Student Name */}
            <InputWrap htmlFor="student_name">
              <IconBox aria-hidden>
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5z" fill="currentColor" />
                  <path d="M4 20a8 8 0 0 1 16 0" fill="currentColor" />
                </svg>
              </IconBox>
              <Input name="student_name" placeholder="Student Name (Full)" required />
            </InputWrap>

            {/* Email ID */}
            <InputWrap htmlFor="email">
              <IconBox aria-hidden>
                <svg viewBox="0 0 24 24" fill="none">
                  <rect x="2" y="6" width="20" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M2 6L12 12L22 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </IconBox>
              <Input name="email" type="email" placeholder="Email ID (Primary)" required />
            </InputWrap>

            {/* Mobile Contact */}
            <InputWrap htmlFor="contact_number">
              <IconBox aria-hidden>
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M6.6 10.8a10.7 10.7 0 0 0 6.6 6.6l1.6-1.6a1 1 0 0 1 1-.2c1.1.4 2.3.7 3.6.7a1 1 0 0 1 1 1V21a1 1 0 0 1-1 1A18 18 0 0 1 3 4a1 1 0 0 1 1-1h2.5a1 1 0 0 1 1 1c0 1.3.2 2.5.7 3.6a1 1 0 0 1-.2 1l-1.4 1.2z" fill="currentColor"/>
                </svg>
              </IconBox>
              <Input name="contact_number" placeholder="Mobile Contact" required />
            </InputWrap>

            {/* Grade / Class */}
            <InputWrap htmlFor="class_standard">
              <IconBox aria-hidden>
                <svg viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M7 9h4M7 13h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </IconBox>
              <Input name="class_standard" placeholder="Grade / Class" required />
            </InputWrap>

            {/* School / Institution */}
            <InputWrap htmlFor="school_name">
              <IconBox aria-hidden>
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M12 2l9 4-9 4-9-4 9-4z" fill="currentColor"/>
                  <path d="M3 10v6a9 9 0 0 0 18 0v-6M12 10v10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </IconBox>
              <Input name="school_name" placeholder="School / Institution" required />
            </InputWrap>

            {/* Team Name */}
            <InputWrap htmlFor="group">
              <IconBox aria-hidden>
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 20a8 8 0 0 1 16 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  <circle cx="17.5" cy="17.5" r="3.5" stroke="currentColor" strokeWidth="1.5"/>
                </svg>
              </IconBox>
              <Input name="group" placeholder="Team Name (optional)" />
            </InputWrap>
          </Grid>

          <div>
            <Minor style={{ fontWeight: 700, marginBottom: 8, color: "#1e293b", fontSize: 14 }}>Project Idea</Minor>
            <Textarea name="idea" placeholder="Outline the problem you're solving, your solution, and the anticipated impact (max 1000 characters)" maxLength={1000} />
            <div style={{ textAlign: "right", marginTop: 8, color: "#94a3b8", fontSize: 13 }}>Max 1000 characters</div>
          </div>

          {/* inline message area */}
          {message && <Message ok={success}>{message}</Message>}
          
          <div style={{ marginTop: '10px' }}>
            <Submit
              type="submit"
              whileHover={!loading ? { scale: 1.01 } : {}}
              whileTap={!loading ? { scale: 0.98 } : {}}
              disabled={loading}
            >
              {loading ? (
                <span style={{ display: "inline-flex", gap: 10, alignItems: "center" }}>
                  <span style={{ width: 18, height: 18, border: "3px solid rgba(255,255,255,0.25)", borderTopColor: "#ffffff", borderRadius: 999, animation: "spin 1s linear infinite" }} />
                  Processing Submission...
                </span>
              ) : (
                <>
                  Register
                </>
              )}
            </Submit>

            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        </FormContainer>
      </Card>
    </Page>
  );
};

export default PageComponent;