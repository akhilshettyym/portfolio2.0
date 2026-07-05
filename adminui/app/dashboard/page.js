"use client";

import { showToast } from "@/utils/toast";
import { apiFetch } from "../../utils/api";
import { useEffect, useState } from "react";
import { LuWorkflow } from "react-icons/lu";

export default function DashboardPage() {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [leadToDelete, setLeadToDelete] = useState(null);

    const initiateDelete = (id) => {
        if (!id) return;
        setLeadToDelete(id);
        setIsModalOpen(true);
    };

    useEffect(() => {
        let isMounted = true;

        const fetchLeads = async () => {
            try {
                const res = await apiFetch("/api/admin/get-all-inquiries");
                if (isMounted) {
                    setLeads(res.data || []);
                }
            } catch (err) {
                if (isMounted) {
                    showToast.error(err.message);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchLeads();
        return () => { isMounted = false; };
    }, []);

    const handleConfirmDelete = async () => {
        if (!leadToDelete) return;

        try {
            await apiFetch(`/api/admin/delete-details/${leadToDelete}`, {
                method: "DELETE",
            });
            setLeads((prevLeads) => prevLeads.filter((lead) => lead._id !== leadToDelete));
            showToast.success("Lead Deleted Successfully");
        } catch (err) {
            showToast.error(err.message);
        } finally {
            setIsModalOpen(false);
            setLeadToDelete(null);
        }
    };

    if (loading) {
        return (
            <div className="flex-1 flex items-center justify-center font-mono text-xs uppercase">
                Loading Inquiries Stack...
            </div>
        );
    }

    return (
        <div className="p-4 md:p-6 max-w-6xl w-full mx-auto bg-white">
            <div className="flex justify-between items-center border-b border-black pb-4 mb-6">
                <h1 className="font-mono font-semibold uppercase tracking-normal text-lg">Inbound Leads</h1>
                <span className="font-semibold text-xs border border-black px-3 py-1.5 bg-black text-white"> Count: {leads.length} </span>
            </div>

            {leads.length === 0 ? (
                <div className="border border-dashed border-black p-12 text-center text-sm font-mono text-gray-500">
                    No inbound portfolio inquiries found.
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {leads.map((lead, index) => (
                        <div key={lead._id || `${lead.email || "lead"}-${lead.createdAt || index}`} className="border border-black p-4 flex flex-col md:flex-row justify-between items-start md:items-stretch gap-4 bg-white">
                            <div className="space-y-2 flex-1 w-full">
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className="font-bold text-base tracking-tight">{lead.name}</span>
                                    <span className="text-xs font-mono text-gray-500">({lead.email})</span>
                                    <span className={`text-[10px] font-mono uppercase tracking-widest px-3 py-1 ml-auto md:ml-0 border border-black ${lead.purpose === "work" ? "bg-black text-white" : "bg-white text-black"}`}>
                                        <span className="flex items-center gap-2">
                                            {lead.purpose === "work" ? <> Project <LuWorkflow /> </> : <> Say Hi </>}
                                        </span>
                                    </span>
                                </div>

                                {(lead.organization || lead.role) && (
                                    <p className="text-xs font-mono text-gray-700">
                                        {lead.role || "Individual"} {lead.organization ? `@ ${lead.organization}` : ""}
                                    </p>
                                )}

                                {lead.purpose === "work" && (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 py-2 border-t border-b border-dashed border-black/40 text-xs font-mono">
                                        <div>
                                            <span className="text-gray-500">Type:</span> <span className="uppercase">{lead.projectType}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Est. Budget:</span> <span className="uppercase">{lead.budget?.replace("_", " ")}</span>
                                        </div>
                                        {lead.deadline && (
                                            <div>
                                                <span className="text-gray-500">Target:</span> {new Date(lead.deadline).toLocaleDateString()}
                                            </div>
                                        )}
                                    </div>
                                )}

                                <p className="text-sm pt-1 leading-relaxed break-words whitespace-pre-wrap font-sans text-black">
                                    {lead.message}
                                </p>

                                <div className="text-[10px] text-gray-400 font-mono pt-1">
                                    Received: {lead.createdAt ? new Date(lead.createdAt).toLocaleString() : "Unknown"}
                                </div>
                            </div>

                            <div className="flex items-end md:items-center justify-end w-full md:w-auto pt-2 md:pt-0 border-t md:border-t-0 md:border-l border-dashed border-black/40 md:pl-4">
                                <button onClick={() => initiateDelete(lead._id)} className="w-full md:w-auto border border-black text-black px-4 py-2 md:py-1 text-xs font-mono uppercase hover:bg-black hover:text-white transition-colors duration-150">
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="w-full max-w-sm bg-white p-6 border border-black">
                        <h3 className="text-lg font-mono font-bold uppercase">Delete Lead</h3>
                        <p className="mt-2 text-sm text-gray-600 font-sans">
                            Are you sure you want to delete this lead permanently? This action cannot be undone.
                        </p>
                        <div className="mt-6 flex justify-end gap-3">
                            <button onClick={() => setIsModalOpen(false)} className="border border-black px-4 py-2 text-xs font-mono uppercase hover:bg-gray-100 transition-colors">
                                Cancel
                            </button>
                            <button onClick={handleConfirmDelete} className="px-4 py-2 text-xs font-mono uppercase bg-black text-white border border-black hover:bg-white hover:text-black transition-colors">
                                Confirm Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}