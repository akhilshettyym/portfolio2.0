"use client";

import axios from "axios";
import React, { useState } from "react";
import { useDeviceType } from "@/hooks/useDeviceType";
import { SERVICES, BUDGET_OPTIONS } from "@/utils/basic";
import { ShowToast } from "@/components/basic/ShowToast";
import CustomButton from "@/components/basic/CustomButton";
import { FiCheck as CheckIcon, FiChevronDown as ChevronIcon } from "react-icons/fi";

const InputField = ({ label, name, placeholder, value, onChange, type = "text", autoComplete, required = false }) => {
    return (
        <div>
            <label className="text-xs uppercase tracking-wide text-neutral-500">
                {label} {required && <span className="text-red-600">*</span>}
            </label>
            <input type={type} name={name} value={value} onChange={onChange} autoComplete={autoComplete} placeholder={placeholder} className="mt-2 w-full border border-neutral-300 px-5 py-4 outline-none transition-colors focus:border-black rounded-none text-sm" />
        </div>
    );
};

export default function CreateSomething() {
    const [purpose, setPurpose] = useState("say_hi");
    const [budget, setBudget] = useState("");
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({ type: "", message: "" });
    const [selectedServices, setSelectedServices] = useState([]);

    const { isMobile } = useDeviceType();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        organization: "",
        role: "",
        deadline: "",
        message: "",
    });

    const toggleService = (serviceId) => {
        setSelectedServices((prev) =>
            prev.includes(serviceId)
                ? prev.filter((item) => item !== serviceId)
                : [...prev, serviceId],
        );
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event?.preventDefault();

        if (loading) return;

        if (!formData.name.trim() || !formData.email.trim()) {
            setStatus({
                type: "error",
                message: "Name and Email are required fields.",
            });
            return;
        }
        if (formData.message.trim().length < 10) {
            setStatus({
                type: "error",
                message: "Your message body must be at least 10 characters long.",
            });
            return;
        }

        if (purpose === "work") {
            if (!formData.organization.trim() || !formData.role.trim()) {
                setStatus({
                    type: "error",
                    message: "Please fill out your Organization and Role details.",
                });
                return;
            }
            if (selectedServices.length === 0) {
                setStatus({
                    type: "error",
                    message:
                        "Please select at least one engineering project service type.",
                });
                return;
            }
            if (!budget) {
                setStatus({
                    type: "error",
                    message: "Please select an estimated allocation budget option.",
                });
                return;
            }
        }

        setLoading(true);
        setStatus({ type: "", message: "" });

        try {
            const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

            let payload = {
                name: formData.name.trim(),
                email: formData.email.trim().toLowerCase(),
                message: formData.message.trim(),
                purpose: purpose,
            };

            if (purpose === "work") {
                payload.organization = formData.organization.trim();
                payload.role = formData.role.trim();
                payload.projectType = selectedServices[0];
                payload.budget = budget;

                if (formData.deadline.trim()) {
                    payload.deadline = formData.deadline;
                }
            }

            const response = await axios.post(
                `${baseUrl}/api/user/contact-inquiry`,
                payload,
                {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true,
                },
            );

            if (response.data.success || response.status === 200 || response.status === 201) {
                setFormData({
                    name: "",
                    email: "",
                    organization: "",
                    role: "",
                    deadline: "",
                    message: "",
                });
                setBudget("");
                setSelectedServices([]);
                setStatus({
                    type: "success",
                    message: "Inquiry successfully recorded!",
                });
            }
            ShowToast.success(response?.data?.message);

        } catch (error) {
            console.error("Submission Error Pipeline Logs:", error.response?.data || error);
            const errorMessage = error.response?.data?.message || error.message || "Validation Error detected.";
            setStatus({ type: "error", message: errorMessage });
            ShowToast.error(errorMessage);

        } finally {
            setLoading(false);
        }
    };

    return (
        <section className={`w-full bg-white py-12 text-black ${isMobile ? "" : "p-10"}`}>
            <div className="mx-auto max-w-7xl px-6">
                <div className="gap-12">
                    <div className="w-full">
                        <div className={isMobile ? "mb-5" : "mb-10"}>
                            <label className="text-xs uppercase tracking-widest text-neutral-400 block mb-3">
                                Select Form Purpose Track
                            </label>
                            <div className="grid grid-cols-2 gap-4 max-w-md">
                                <button type="button"
                                    onClick={() => {
                                        setPurpose("say_hi");
                                        setStatus({ type: "", message: "" })
                                    }}
                                    className={`${isMobile ? "py-3" : "py-4"} px-5 text-xs font-bold uppercase tracking-wider border transition-all text-center rounded-none ${purpose === "say_hi" ? "bg-black border-black text-white" : "bg-white border-neutral-200 text-black hover:border-black"}`}>
                                    Just Say Hi
                                </button>

                                <button type="button"
                                    onClick={() => {
                                        setPurpose("work");
                                        setStatus({ type: "", message: "" })
                                    }}
                                    className={`${isMobile ? "py-3" : "py-4"} px-5 text-xs font-bold uppercase tracking-wider border transition-all text-center rounded-none ${purpose === "work" ? "bg-black border-black text-white" : "bg-white border-neutral-200 text-black hover:border-black"}`}>
                                    {isMobile ? "Build Project" : "Build A Project"}
                                </button>
                            </div>
                        </div>

                        <p className="text-left text-xl md:text-2xl font-light leading-relaxed text-neutral-700 border-t border-neutral-100 pt-6">
                            {purpose === "say_hi"
                                ? "Drop your details below to say hello, ask a general question, or just connect!"
                                : "Let's turn your idea into code. Tell me about your organization and project requirements below."}
                        </p>

                        <form onSubmit={handleSubmit} className="mt-12 space-y-12">
                            <div>
                                <h3 className="mb-6 text-sm font-bold uppercase tracking-widest border-b border-black pb-2 flex justify-between items-baseline w-full">
                                    <span> About You </span>
                                    <span className="text-[10px] font-normal tracking-normal text-red-500 capitalize">
                                        {" "} * Required Details{" "}
                                    </span>
                                </h3>

                                <div className="grid gap-x-10 gap-y-8 grid-cols-1 sm:grid-cols-2">
                                    <InputField label="Your Name" name="name" value={formData.name} onChange={handleInputChange} placeholder="What should I call you?" required={true} />

                                    <div className="flex flex-col space-y-1.5">
                                        <InputField label="Your Email Address" name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="How I'll reach you" required={true} />
                                        <p className="text-[10px] text-neutral-400 tracking-widest pl-0.5">
                                            Please enter a valid email address so I can reliably get back to you.
                                        </p>
                                    </div>

                                    {purpose === "work" && (
                                        <>
                                            <InputField label="Your Organization" name="organization" value={formData.organization} onChange={handleInputChange} placeholder="Company or project name" required={true} />
                                            <InputField label="Your Role" name="role" value={formData.role} onChange={handleInputChange} placeholder="e.g. Founder, Product Lead" required={true} />
                                        </>
                                    )}
                                </div>
                            </div>

                            {purpose === "work" && (
                                <div className="animate-fadeIn">
                                    <h3 className="mb-2 text-sm font-bold uppercase tracking-widest border-b border-black pb-2">
                                        About The Project
                                    </h3>
                                    <label className="mb-6 block text-[11px] uppercase tracking-wider text-neutral-400">
                                        What development service model do you need?{" "}
                                        <span className="text-red-600">*</span>
                                    </label>

                                    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                                        {SERVICES.map((service) => {
                                            const checked = selectedServices.includes(service.id);
                                            return (
                                                <button key={service.id} type="button" onClick={() => toggleService(service.id)} className={`relative flex items-center justify-between border px-5 py-4 transition-all duration-200 rounded-none text-xs uppercase tracking-wide ${checked ? "border-black bg-black text-white" : "border-neutral-200 bg-white text-black  hover:border-black"}`}>
                                                    <span> {service.label} </span>
                                                    {checked && (
                                                        <CheckIcon className="text-sm shrink-0 ml-2" />
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>

                                    <div className="mt-10 grid gap-10 grid-cols-1 sm:grid-cols-2">
                                        <div>
                                            <label className="text-xs uppercase tracking-wide text-neutral-500">
                                                Project Budget Allocation{" "}
                                                <span className="text-red-600">*</span>
                                            </label>

                                            <div className="relative mt-2 border border-neutral-300 transition-colors focus-within:border-black bg-white">
                                                <select value={budget} onChange={(e) => setBudget(e.target.value)} className="w-full appearance-none bg-transparent px-5 py-4 outline-none text-xs uppercase tracking-wider rounded-none pr-12 cursor-pointer text-black">
                                                    <option value="" className="bg-white text-black">
                                                        Select range allocation
                                                    </option>
                                                    {BUDGET_OPTIONS.map((item) => (
                                                        <option key={item.id} value={item.id} className="bg-white text-black">
                                                            {item.label}
                                                        </option>
                                                    ))}
                                                </select>
                                                <ChevronIcon className="absolute right-5 top-1/2 -translate-y-1/2 text-base pointer-events-none text-neutral-500" />
                                            </div>
                                        </div>
                                        <InputField label="Target Deadline" name="deadline" type="date" value={formData.deadline} onChange={handleInputChange} />
                                    </div>
                                </div>
                            )}

                            <div>
                                <h3 className="mb-6 text-sm font-bold uppercase tracking-widest border-b border-black pb-2">
                                    {purpose === "work" ? "Project Details" : "Your Message"}{" "}
                                    <span className="text-red-600">*</span>
                                </h3>
                                <textarea rows={6} name="message" value={formData.message} onChange={handleInputChange} placeholder={purpose === "work" ? "Provide an overview of objectives, tech requirements, scope..." : "Write your message here..."} className="mt-2 w-full resize-none border border-neutral-300 px-5 py-4 outline-none transition-colors focus:border-black rounded-none text-sm font-sans" />
                            </div>

                            <div className="mt-10 flex flex-col sm:flex-row justify-end items-center gap-6">
                                {status.message && (
                                    <p className={`text-xs tracking-wide w-full sm:w-auto text-center sm:text-right ${status.type === "success" ? "text-emerald-700" : "text-red-700 font-bold"}`} aria-live="polite">
                                        {status.message}
                                    </p>
                                )}
                                <div className="w-full sm:w-auto flex justify-end">
                                    <CustomButton title={loading ? "Processing..." : purpose === "work" ? "Submit Project Request" : "Send Message"} onClick={handleSubmit} width={290} height={50} disabled={loading} />
                                </div>
                            </div>
                        </form>
                    </div>

                    <div className="hidden lg:block" />
                </div>

                <p className="border-b border-black mt-10" />
            </div>

        </section>
    );
};