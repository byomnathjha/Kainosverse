// App.tsx
"use client";

import React, { useState, useEffect, useCallback, ChangeEvent, FormEvent, memo } from 'react';

// --- TYPE DEFINITIONS ---
interface FormData {
    student_name: string;
    email: string;
    contact_number: string;
    class_standard: string;
    school_name: string;
    group: string;
    idea: string;
}

interface IconProps extends React.SVGProps<SVGSVGElement> {
    strokeColor?: string;
    strokeWidth?: string;
}

interface InputFieldProps {
    name: keyof FormData;
    placeholder: string;
    type?: string;
    icon: (props?: IconProps) => JSX.Element;
    required?: boolean;
    formData: FormData;
    handleChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    loading: boolean;
}

// --- Icons (Keep these unchanged) ---
const IconBase: React.FC<IconProps> = (props) => (
    <svg 
        className={`w-full h-full ${props.className || ''}`}
        stroke={props.strokeColor || "currentColor"}
        strokeWidth={props.strokeWidth || "1.5"}
        viewBox="0 0 24 24"
        fill="none"
        {...props}
    >
        {props.children}
    </svg>
);

const UserIcon: React.FC<IconProps> = (props) => (
    <IconBase {...props}>
        <circle cx="12" cy="7" r="4" fill="currentColor" />
        <path d="M12 15c-4.42 0-8 1.79-8 4v2h16v-2c0-2.21-3.58-4-8-4z" fill="currentColor" />
    </IconBase>
);

const MailIcon: React.FC<IconProps> = (props) => (
    <IconBase {...props}>
        <rect x="2" y="6" width="20" height="12" rx="2" stroke="currentColor" fill="none" />
        <path d="M2 6L12 12L22 6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
    </IconBase>
);

const PhoneIcon: React.FC<IconProps> = (props) => (
    <IconBase {...props} strokeWidth="1.5">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 18 18 0 0 1-17.6-17.6A2 2 0 0 1 3.08 2h3a2 2 0 0 1 2 1.72 12.8 12.8 0 0 0 1.6 4.75 1 1 0 0 1-.36 1.15l-1.4 1.25a12.7 12.7 0 0 0 6.54 6.54l1.25-1.4a1 1 0 0 1 1.15-.36 12.8 12.8 0 0 0 4.75 1.6 2 2 0 0 1 1.72 2z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
    </IconBase>
);

const ClassIcon: React.FC<IconProps> = (props) => (
    <IconBase {...props}>
        <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" fill="none"/>
        <path d="M7 9h4M7 13h10" stroke="currentColor" strokeLinecap="round"/>
    </IconBase>
);

const SchoolIcon: React.FC<IconProps> = (props) => (
    <IconBase {...props} strokeWidth="1.5">
        <path d="M12 2L21 6V10M3 6L12 2M3 6L3 18M21 10V18" stroke="currentColor" strokeLinejoin="round"/>
        <path d="M12 22v-4M21 18a9 9 0 0 0-18 0" stroke="currentColor" strokeLinejoin="round"/>
    </IconBase>
);

const TeamIcon: React.FC<IconProps> = (props) => (
    <IconBase {...props}>
        <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 20a8 8 0 0 1 16 0" stroke="currentColor" strokeLinecap="round"/>
        <circle cx="17.5" cy="17.5" r="3.5" stroke="currentColor" fill="none"/>
    </IconBase>
);


// --- Component Sub-Modules (Keep InputField and ImageCarousel unchanged) ---
const InputField: React.FC<InputFieldProps> = memo(({ name, placeholder, type = 'text', icon: Icon, required = false, formData, handleChange, loading }) => (
    <label htmlFor={String(name)} className="flex items-center gap-3 p-3 bg-transparent rounded-xl border border-[#414141] h-14 transition-all duration-300 focus-within:border-[#40c9ff] focus-within:shadow-lg focus-within:shadow-[#40c9ff]/20 hover:border-[#40c9ff]/70">
        <div className={`w-5 h-5 flex-shrink-0 ${required ? 'text-[#40c9ff]' : 'text-gray-500'}`}>
            <Icon />
        </div>
        <input 
            name={String(name)} 
            id={String(name)} 
            type={type}
            value={formData[name] as string}
            onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(e)}
            placeholder={placeholder + (required ? ' *' : '')} 
            required={required}
            className="w-full text-white bg-transparent outline-none text-base placeholder-gray-500 disabled:text-gray-600"
            disabled={loading}
        />
    </label>
));

const ImageCarousel: React.FC = memo(() => {
    const IMAGE_PATHS: string[] = [
        '/img2.jpeg', '/img3.jpeg', '/img4.jpeg', '/img5.jpeg', 
        '/img6.jpeg', '/img8.jpeg', '/img9.jpeg', '/img13.jpeg'
    ];
    
    const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
    const cycleInterval = 4000;

    const goToImage = useCallback((index: number) => {
        setCurrentImageIndex(index);
    }, []);

    const nextImage = useCallback(() => {
        setCurrentImageIndex(prev => (prev + 1) % IMAGE_PATHS.length);
    }, [IMAGE_PATHS.length]);

    // Automatic image cycling effect
    useEffect(() => {
        const intervalId = setInterval(nextImage, cycleInterval);
        return () => clearInterval(intervalId);
    }, [nextImage]);

    // Type definition for image error handler
    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        const target = e.currentTarget;
        target.onerror = null; 
        target.src = `https://placehold.co/600x450/111/40c9ff?text=Image+Missing+${target.alt.slice(0, 10)}...`;
        target.className = target.className.replace('object-cover', 'object-contain');
    };

    return (
        <div className="w-full aspect-[4/3] max-w-lg mx-auto flex items-center justify-center rounded-2xl overflow-hidden bg-black/50 border-4 border-transparent shadow-lg shadow-[#40c9ff]/20 transition-all duration-500 ease-in-out transform hover:scale-[1.01] relative carousel-glow-border">
            
            {/* The actual image container - for Cross-Fade effect */}
            {IMAGE_PATHS.map((path, index) => (
                <img 
                    key={path}
                    src={path} 
                    alt={`IDAIS Innovation Show Jr. Event Highlight: ${path.replace('/', '')}`}
                    className={`absolute inset-0 w-full h-full object-cover rounded-lg transition-opacity duration-500 ease-in-out`}
                    style={{ 
                        opacity: index === currentImageIndex ? 1 : 0,
                        viewTransitionName: index === currentImageIndex ? 'carousel-image-active' : ''
                    }}
                    onError={handleImageError}
                />
            ))}
            
            {/* Bottom Dots Navigation */}
            <div className="absolute bottom-4 left-0 right-0 z-10 flex justify-center space-x-2">
                {IMAGE_PATHS.map((_, index) => (
                    <span
                        key={index}
                        className={`block w-2.5 h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                            index === currentImageIndex ? 'bg-[#40c9ff] scale-125 shadow-md shadow-[#40c9ff]' : 'bg-gray-500/50'
                        }`}
                        onClick={() => goToImage(index)}
                    ></span>
                ))}
            </div>
        </div>
    );
});


// --- Main Application Component ---
const App: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({
        student_name: '',
        email: '',
        contact_number: '',
        class_standard: '',
        school_name: '',
        group: '',
        idea: ''
    });
    const [loading, setLoading] = useState<boolean>(false);
    const [message, setMessage] = useState<string>('');
    const [success, setSuccess] = useState<boolean>(false);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target as HTMLInputElement | HTMLTextAreaElement;
        setFormData(prev => ({ ...prev, [name as keyof FormData]: value }));
    };

    const isEmailValid = (email: string): boolean => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setMessage('');
        setSuccess(false);

        const requiredFields: (keyof FormData)[] = ['student_name', 'email', 'contact_number', 'class_standard', 'school_name', 'idea'];
        const isFormIncomplete = requiredFields.some(field => !formData[field]);

        if (isFormIncomplete) {
            setMessage(" Please fill in all required fields (Team Name is optional).");
            return;
        }

        if (!isEmailValid(formData.email)) {
            setMessage(" Please enter a valid email address.");
            return;
        }

        if (formData.idea.length > 1000) {
            setMessage(" Project Idea is too long (Max 1000 characters).");
            return;
        }

        // === Real submission to your API ===
        setLoading(true);

        (async () => {
            try {
                const res = await fetch("/api/register", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formData),
                });

                const body = await res.json();
                setLoading(false);

                if (res.ok) {
                    setMessage(" Registration successful! A confirmation email has been sent.");
                    setSuccess(true);
                    // Reset form after success
                    setFormData({
                        student_name: '',
                        email: '',
                        contact_number: '',
                        class_standard: '',
                        school_name: '',
                        group: '',
                        idea: ''
                    });
                } else {
                    // server returned an error
                    setMessage(body?.error || " Submission failed. Try again.");
                    setSuccess(false);
                }
            } catch (err) {
                console.error("Submit error:", err);
                setLoading(false);
                setMessage(" Network error. Please check your connection.");
                setSuccess(false);
            }
        })();
    };

    const charCount: number = formData.idea.length;

    return (
        <div className="flex justify-center min-h-screen bg-[#0a0a10] p-4 font-sans antialiased">
            {/* Main Content Wrapper */}
            <div className="w-full max-w-7xl flex flex-col lg:flex-row gap-10 lg:gap-16 py-10">

                {/* Left Column: Registration Form (7/12 width) */}
                <div className="lg:w-7/12">
                    <div className="form-container w-full p-6 sm:p-10 rounded-3xl flex flex-col gap-8 box-border">
                        
                        {/* Header: LOGO REPLACEMENT APPLIED HERE - Combined Image and Text */}
                        <header className="mb-2 text-center">
                            {/* Combined Logo and Text, centered with flex */}
                            <div className="flex items-center justify-center gap-3 mb-4">
                                <img
                                    src="/kainologo.png" // Updated image path
                                    alt="Kainosverse Logo"
                                    className="h-16 w-auto object-contain filter drop-shadow-[0_0_15px_rgba(232,28,255,0.7)]"
                                    onError={(e) => {
                                        e.currentTarget.onerror = null;
                                        e.currentTarget.style.display = 'none';
                                    }}
                                />
                                {/* Written 'Kainosverse' text */}
                                <p className="text-3xl font-extrabold text-gray-200 tracking-widest">
                                    Kainosverse
                                </p>
                            </div>
                            
                            <h1
                                className="text-4xl sm:text-5xl font-extrabold text-white leading-snug whitespace-nowrap"
                            >
                                IDAIS Innovation Show{" "}
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#40c9ff] to-[#e81cff]">
                                    Jr.
                                </span>
                            </h1>

                            <p className="mt-3 text-lg font-medium text-gray-400">
                                    Where Young Minds Turn Ideas Into Impact.
                            </p>
                        </header>

                        <p className="text-sm text-gray-400 font-medium border-t border-gray-800 pt-4">
                            Please fill in your details below to register. Fields marked with <span className="text-[#40c9ff]">*</span> are required.
                        </p>

                        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
                            
                            {/* Section 1: Personal Details */}
                            <h2 className="text-xl font-bold text-[#40c9ff] mt-2 pb-2 border-b border-gray-800/50 uppercase tracking-wider">1. Personal & School Details</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <InputField name="student_name" placeholder="Student Name (Full)" icon={UserIcon} required={true} formData={formData} handleChange={handleChange} loading={loading} />
                                <InputField name="email" placeholder="Email ID (Primary)" icon={MailIcon} type="email" required={true} formData={formData} handleChange={handleChange} loading={loading} />
                                <InputField name="contact_number" placeholder="Mobile Contact" icon={PhoneIcon} type="tel" required={true} formData={formData} handleChange={handleChange} loading={loading} />
                                <InputField name="class_standard" placeholder="Grade / Class (e.g., 10th)" icon={ClassIcon} required={true} formData={formData} handleChange={handleChange} loading={loading} />
                                <InputField name="school_name" placeholder="School / Institution Name" icon={SchoolIcon} required={true} formData={formData} handleChange={handleChange} loading={loading} />
                                <InputField name="group" placeholder="Team Name (Optional)" icon={TeamIcon} required={false} formData={formData} handleChange={handleChange} loading={loading} />
                            </div>

                            {/* Section 2: Project Idea */}
                            <h2 className="text-xl font-bold text-[#e81cff] mt-4 pb-2 border-b border-gray-800/50 uppercase tracking-wider">2. Project Idea Submission</h2>
                            <div className="flex flex-col gap-2">
                                <label htmlFor="idea" className="text-gray-400 font-semibold text-sm uppercase tracking-wider">Project Idea Outline *</label>
                                <textarea 
                                    name="idea" 
                                    id="idea"
                                    rows={6}
                                    value={formData.idea}
                                    onChange={handleChange}
                                    placeholder="Briefly outline the problem you're solving, your solution, and the anticipated impact (Max 1000 characters)."
                                    maxLength={1000}
                                    required={true}
                                    className="w-full p-4 rounded-xl resize-y text-white bg-transparent border border-[#414141] transition-all duration-300 focus:outline-none focus:border-[#e81cff] focus:shadow-lg focus:shadow-[#e81cff]/20 disabled:bg-[#1a1a1a] disabled:text-gray-600"
                                    disabled={loading}
                                />
                                <div className={`text-xs text-right font-mono ${charCount > 900 ? 'text-red-400' : 'text-gray-500'}`}>
                                    {charCount} / 1000 characters
                                </div>
                            </div>
                            
                            {/* Status Message */}
                            {message && (
                                <div className={`mt-2 p-3 rounded-xl font-medium transition-all duration-300 ${success ? 'bg-green-600/20 text-green-300 border border-green-700/50' : 'bg-red-600/20 text-red-300 border border-red-700/50'}`}>
                                    {message}
                                </div>
                            )}

                            {/* Submit Button - REPLACED WITH THE SPACE THEME BUTTON */}
                            <div className="mt-4 flex justify-center">
                                <button type="submit" className="btn" disabled={loading}>
                                    {loading ? (
                                        <span className="flex items-center gap-3">
                                            <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"></circle><path fill="currentColor" d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 0 1 4 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                            <strong style={{ zIndex: 2 }}>SUBMITTING...</strong>
                                        </span>
                                    ) : (
                                        <>
                                            <strong>REGISTER NOW</strong>
                                            <div id="container-stars">
                                                <div id="stars"></div>
                                            </div>

                                            <div id="glow">
                                                <div className="circle"></div>
                                                <div className="circle"></div>
                                            </div>
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Right Column: Event Info Panel (5/12 width, sticky on large screens) */}
                <div className="lg:w-5/12 flex-shrink-0">
                    <div className="info-panel-container h-full p-8 bg-[#150a25] rounded-3xl flex flex-col gap-8 shadow-2xl shadow-[#e81cff]/15 lg:sticky lg:top-10">
                        
                        {/* Title and Logo */}
                        <div className="flex flex-col items-center justify-center text-center pb-4 border-b border-[#e81cff]/20">
                            <svg className="w-12 h-12 text-[#40c9ff]" viewBox="0 0 48 48" fill="none">
                                <path d="M24 4L4 16v16l20 12 20-12V16L24 4z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
                                <path d="M14 16l10 6 10-6M24 28V46M4 16l20 12 20-12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            <h3 className="text-2xl font-extrabold text-white mt-2 uppercase tracking-widest">Event Highlights</h3>
                        </div>

                        {/* Featured Visual Carousel */}
                        <ImageCarousel />

                        {/* Key Info / Details */}
                        <div className="mt-4 text-center">
                            <h4 className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#e81cff] to-[#40c9ff] mb-4 uppercase tracking-wider">Key Details</h4>
                            <div className="flex flex-wrap justify-center gap-4 text-sm font-semibold">
                                <div className="p-3 bg-white/5 rounded-xl border border-gray-700/50 text-white shadow-md hover:border-[#40c9ff]">
                                    <p className="text-gray-400">Target Grades:</p>
                                    <p className="text-[#40c9ff] text-base">Class 6th - 12th</p>
                                </div>
                                <div className="p-3 bg-white/5 rounded-xl border border-gray-700/50 text-white shadow-md hover:border-[#e81cff]">
                                    <p className="text-gray-400">Deadline:</p>
                                    <p className="text-[#e81cff] text-base">Enrollment Closes Soon!</p>
                                </div>
                            </div>
                        </div>
                        
                        {/* Contact Info */}
                        <div className="mt-4 text-center pt-4 border-t border-gray-800">
                            <p className="text-sm font-semibold text-gray-300">Organized by</p>
                            <p className="text-xl font-bold text-white mt-1">
                                Kainosverse Innovations
                            </p>
                            <p className="text-base text-[#e81cff] mt-2">
                                <a href="http://www.kainosverse.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#40c9ff] transition-colors">www.kainosverse.com</a>
                            </p>
                            <p className="text-base text-white mt-1">
                                <span className="text-[#40c9ff]">Contact:</span> +91 7999847933
                            </p>
                        </div>

                    </div>
                </div>
            </div>
            
            {/* Custom CSS for Animated Gradient Border & Carousel */}
            <style>{`
                /* ENHANCED GLOWING AND FLOWING BORDER */
                @keyframes gradient-border {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                
                .form-container {
                    background: linear-gradient(#101010, #101010) padding-box, 
                                        linear-gradient(145deg, #ff1ce8, #40c9ff, #ff1ce8) border-box; 
                    border: 3px solid transparent; 
                    background-size: 400% 400%; 
                    animation: gradient-border 10s ease infinite; 
                    box-shadow: 
                        0 0 15px rgba(232, 28, 255, 0.4), 
                        0 0 30px rgba(64, 201, 255, 0.3), 
                        0 10px 40px rgba(0, 0, 0, 0.5);
                }

                .info-panel-container {
                    background-color: #150a25; 
                }
                
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .animate-spin {
                    animation: spin 1s linear infinite;
                }

                .carousel-glow-border {
                    border: 4px solid;
                    border-image-slice: 1;
                    border-image-source: linear-gradient(45deg, #40c9ff, #e81cff);
                    position: relative; 
                }
                .carousel-glow-border:hover {
                    box-shadow: 0 0 40px rgba(64, 201, 255, 0.5);
                }
                
                .btn {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    width: 15rem;
                    overflow: hidden;
                    height: 3.5rem;
                    background-size: 300% 300%;
                    cursor: pointer;
                    backdrop-filter: blur(1rem);
                    border-radius: 5rem;
                    transition: 0.5s;
                    animation: gradient_301 5s ease infinite;
                    border: double 4px transparent;
                    background-image: linear-gradient(#212121, #212121),
                        linear-gradient(
                            137.48deg,
                            #ffdb3b 10%,
                            #fe53bb 45%,
                            #8f51ea 67%,
                            #0044ff 87%
                        );
                    background-origin: border-box;
                    background-clip: content-box, border-box;
                }

                #container-stars {
                    position: absolute;
                    z-index: -1;
                    width: 100%;
                    height: 100%;
                    overflow: hidden;
                    transition: 0.5s;
                    backdrop-filter: blur(1rem);
                    border-radius: 5rem;
                }

                strong {
                    z-index: 2;
                    font-size: 14px;
                    letter-spacing: 4px;
                    color: #ffffff;
                    text-shadow: 0 0 6px rgba(255, 255, 255, 0.8);
                    font-weight: 700;
                }

                #glow {
                    position: absolute;
                    display: flex;
                    width: 12rem;
                }

                .circle {
                    width: 100%;
                    height: 30px;
                    filter: blur(2rem);
                    animation: pulse_3011 4s infinite;
                    z-index: -1;
                }

                .circle:nth-of-type(1) {
                    background: rgba(254, 83, 186, 0.636);
                }

                .circle:nth-of-type(2) {
                    background: rgba(142, 81, 234, 0.704);
                }

                .btn:hover #container-stars {
                    z-index: 1;
                    background-color: #212121;
                }

                .btn:hover {
                    transform: scale(1.05);
                }

                .btn:active {
                    border: double 4px #fe53bb;
                    background-origin: border-box;
                    background-clip: content-box, border-box;
                    animation: none;
                    transform: scale(0.98);
                }

                .btn:active .circle {
                    background: #fe53bb;
                }
                
                .btn:disabled {
                    cursor: not-allowed;
                    opacity: 0.7;
                    transform: none;
                    animation: none;
                    background-image: linear-gradient(#151515, #151515), linear-gradient(
                        137.48deg,
                        #555 10%,
                        #555 45%,
                        #555 67%,
                        #555 87%
                    );
                }
                .btn:disabled strong {
                    color: #aaa;
                    text-shadow: none;
                }

                #stars {
                    position: relative;
                    background: transparent;
                    width: 200rem;
                    height: 200rem;
                }

                #stars::after {
                    content: "";
                    position: absolute;
                    top: -10rem;
                    left: -100rem;
                    width: 100%;
                    height: 100%;
                    animation: animStarRotate 90s linear infinite;
                }

                #stars::after {
                    background-image: radial-gradient(#ffffff 1px, transparent 1%);
                    background-size: 50px 50px;
                }

                #stars::before {
                    content: "";
                    position: absolute;
                    top: 0;
                    left: -50%;
                    width: 170%;
                    height: 500%;
                    animation: animStar 60s linear infinite;
                }

                #stars::before {
                    background-image: radial-gradient(#ffffff 1px, transparent 1%);
                    background-size: 50px 50px;
                    opacity: 0.5;
                }

                @keyframes animStar {
                    from {
                        transform: translateY(0);
                    }

                    to {
                        transform: translateY(-135rem);
                    }
                }

                @keyframes animStarRotate {
                    from {
                        transform: rotate(360deg);
                    }

                    to {
                        transform: rotate(0);
                    }
                }

                @keyframes gradient_301 {
                    0% {
                        background-position: 0% 50%;
                    }

                    50% {
                        background-position: 100% 50%;
                    }

                    100% {
                        background-position: 0% 50%;
                    }
                }

                @keyframes pulse_3011 {
                    0% {
                        transform: scale(0.75);
                        box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.7);
                    }

                    70% {
                        transform: scale(1);
                        box-shadow: 0 0 0 10px rgba(0, 0, 0, 0);
                    }

                    100% {
                        transform: scale(0.75);
                        box-shadow: 0 0 0 0 rgba(0, 0, 0, 0);
                    }
                }
            `}</style>
        </div>
    );
}

export default App;
