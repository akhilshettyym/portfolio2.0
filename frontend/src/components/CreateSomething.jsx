"use client";

import React, { useState } from "react";
import { FiCheck, FiChevronDown } from "react-icons/fi";
import { SERVICES, BUDGETS } from "@/utils/basic-utils";
import CustomButton from "@/components/basic/CustomButton";

const InputField = ({ label, name, placeholder, value, onChange, type = "text", autoComplete }) => {
    return (
        <div>
            <label className="field-label"> {label} </label>
            <input type={type} name={name} value={value} onChange={onChange} autoComplete={autoComplete} placeholder={placeholder} className="mt-2 w-full border border-neutral-300 px-5 py-4 outline-none transition-colors focus:border-black" />
        </div>
    );
};

const CreateSomething = () => {

    const [budget, setBudget] = useState("");
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({ type: "", message: "" });
    const [selectedServices, setSelectedServices] = useState([]);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        organization: "",
        role: "",
        deadline: "",
        details: "",
    });

    const toggleService = (service) => {
        setSelectedServices((prev) =>
            prev.includes(service) ? prev.filter((item) => item !== service) : [...prev, service]
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

        setLoading(true);
        setStatus({ type: "", message: "" });

        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    budget,
                    services: selectedServices,
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || "Unable to send your request right now.");
            }

            setFormData({
                name: "",
                email: "",
                organization: "",
                role: "",
                deadline: "",
                details: "",
            });
            setBudget("");
            setSelectedServices([]);
            setStatus({ type: "success", message: "Request sent. I will get back to you soon." });
        } catch (error) {
            setStatus({ type: "error", message: error.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="w-full bg-white py-5 text-black">
            <div className="mx-auto max-w-450 px-6">
                <div className="grid gap-12 grid-cols-[20%_70%_10%]">

                    <div>
                        <div className="sticky top-32">
                            <span className="text-sm font-semibold tracking-wider text-neutral-500">
                                01_INQUIRY_FORM
                            </span>
                        </div>

                        <div className="sticky top-125 flex flex-col">
                            <span className="text-[10px] font-semibold uppercase tracking-normal text-neutral-500">
                                Contact me directly
                            </span>
                            <span className="text-xs font-semibold tracking-normal text-neutral-500">
                                akhilshettym2003@gmail.com
                            </span>
                        </div>
                    </div>

                    <div className="max-w-5xl">
                        <p className="max-w-5xl indent-16 text-justify text-2xl font-medium text-neutral-600">
                            Interested in working with me? I&apos;d love to hear a bit more about
                            your project! Fill out the form below and I&apos;ll get back to you as
                            soon as possible.
                        </p>
                        <form onSubmit={handleSubmit} className="mt-10">
                            <div className="mb-10">
                                <h3 className="mb-5 text-xl font-semibold uppercase tracking-normal">
                                    About You
                                </h3>
                                <div className="grid gap-x-10 gap-y-8 md:grid-cols-2">
                                    <InputField label="Your Name" name="name" value={formData.name} onChange={handleInputChange} placeholder="What should I call you?" autoComplete="name" />
                                    <InputField label="Your Email Address" name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="How I'll contact you" autoComplete="email" />
                                    <InputField label="Your Organization" name="organization" value={formData.organization} onChange={handleInputChange} placeholder="What company are you with?" autoComplete="organization" />
                                    <InputField label="Your Role" name="role" value={formData.role} onChange={handleInputChange} placeholder="Are you the client?" />
                                </div>
                            </div>

                            <hr className="my-6 border-t border-gray-300" />

                            <div className="mt-10">
                                <h3 className="mb-2 text-xl font-semibold uppercase tracking-normal">
                                    About The Project
                                </h3>
                                <label className="mb-6 block text-xs font-semibold uppercase tracking-wide text-neutral-500">
                                    What development services do you need?
                                </label>

                                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                                    {SERVICES.map((service) => {
                                        const checked = selectedServices.includes(service);
                                        return (
                                            <button key={service} type="button" onClick={() => toggleService(service)} className={`relative flex items-center justify-between border px-5 py-4 transition-all duration-300 ${checked ? "border-black bg-black text-white" : "border-neutral-300 bg-white text-black hover:border-black"}`}>

                                                <span> {service} </span>
                                                {checked && <FiCheck className="text-lg" />}
                                            </button>
                                        );
                                    })}
                                </div>
                                <div className="mt-10 grid gap-10 md:grid-cols-2">
                                    <div>
                                        <label className="field-label">
                                            Project Budget
                                        </label>

                                        <div className="relative mt-2 border border-neutral-300 transition-colors focus-within:border-black">
                                            <select value={budget} onChange={(e) => setBudget(e.target.value)} className="w-full appearance-none bg-transparent px-5 py-4 outline-none">

                                                <option value=""> Select allocation </option>
                                                {BUDGETS.map((item) => (
                                                    <option key={item} value={item}> {item} </option>
                                                ))}
                                            </select>
                                            <FiChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-xl" />
                                        </div>
                                    </div>
                                    <InputField label="Target Deadline" name="deadline" value={formData.deadline} onChange={handleInputChange} placeholder="Is there a timeframe?" />
                                </div>

                                <div className="mt-10">
                                    <label className="field-label"> Project Details </label>
                                    <textarea rows={8} name="details" value={formData.details} onChange={handleInputChange} placeholder="Tell me a bit about your project..." className="mt-2 w-full resize-none border border-neutral-300 px-5 py-4 outline-none  transition-colors focus:border-black" />
                                </div>
                                <div className="mt-10 flex justify-end">
                                    <div className="flex flex-col items-end gap-4">
                                        {status.message && (
                                            <p className={`max-w-md text-right text-sm ${status.type === "success" ? "text-emerald-700" : "text-red-700"}`} aria-live="polite">
                                                {status.message}
                                            </p>
                                        )}
                                        <CustomButton title={loading ? "Sending..." : "Send Project Request"} onClick={handleSubmit} width={270} height={50} disabled={loading} />
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div />
                </div>
                <hr className="my-6 border-t border-gray-300" />
            </div>
        </section>
    );
};

export default CreateSomething;
