"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Footer from "../../../layouts/Footer";
import {
    ArrowLeft,
    MapPin,
    Phone,
    Tag,
    Calendar,
    Package,
    CheckCircle,
    XCircle,
    Clock,
    ShoppingBag,
} from "lucide-react";
import { BACKEND_URL } from "@/config/app";

// ── Types ──────────────────────────────────────────────────────────────────
type ProductStatus = "Available" | "Sold";

type Product = {
    Id: string;
    Name: string;
    Description: string;
    Price: number;
    ContactInfo: string;
    Location: string;
    Category: string;
    Quantity: number;
    CreatedAt: string;
    Status: ProductStatus;
    ImageUrl: string;
};

// ── Helpers ────────────────────────────────────────────────────────────────
const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(price);

const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

const timeAgo = (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime();
    const days = Math.floor(diff / 86400000);
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 30) return `${days} days ago`;
    if (days < 365) return `${Math.floor(days / 30)} months ago`;
    return `${Math.floor(days / 365)} years ago`;
};

// ── Page component ─────────────────────────────────────────────────────────
export default function ProductDetailPage() {
    const params = useParams();
    const id = params?.id as string;

    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState<true | false>(true);
    const [error404, setError404] = useState<true | false>(false);

    useEffect(() => {
        if (!id) return;

        async function fetchProduct() {
            try {
                // Using the absolute client public API url
                const res = await fetch(`${BACKEND_URL}/api/store/item/${id}`, {
                    method: "GET",
                    headers: {
                        "Cache-Control": "no-cache",
                    },
                    // Crucial: Tells the browser to automatically include the 'uid' cookie
                    credentials: "include", 
                });

                if (res.status === 404 || !res.ok) {
                    setError404(true);
                    setLoading(false);
                    return;
                }

                const data = await res.json();
                if (!data) {
                    setError404(true);
                } else {
                    setProduct(data);
                }
            } catch (err) {
                console.error("Error fetching product on client:", err);
                setError404(true);
            } finally {
                setLoading(false);
            }
        }

        fetchProduct();
    }, [id]);

    // Handle 404 Redirect/Render
    if (error404) {
        notFound();
    }

    // Elegant loading skeletons/state
    if (loading) {
        return (
            <div className="min-h-dvh bg-gray-50 flex items-center justify-center font-sans">
                <div className="flex flex-col items-center gap-2">
                    <div className="w-8 h-8 border-4 border-lime-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-sm text-gray-500 font-semibold tracking-wide">Loading product details...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-dvh bg-gray-50 font-sans">
            {/* ── TOPBAR ──────────────────────────────────────────────────── */}
            <header className="sticky top-0 z-30 bg-white border-b border-gray-100 shadow-sm">
                <div className="max-w-5xl mx-auto px-4 h-14 flex items-center gap-3">
                    <Link
                        href="/store"
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-semibold text-gray-500 hover:text-gray-900 hover:bg-gray-50 border border-gray-200 hover:border-gray-300 transition-all"
                    >
                        <ArrowLeft size={15} />
                        Back to Store
                    </Link>

                    {/* Breadcrumb */}
                    <div className="hidden sm:flex items-center gap-1.5 text-xs text-gray-400">
                        <Link href="/store" className="hover:text-lime-600 transition-colors font-medium">
                            Store
                        </Link>
                        <span>/</span>
                        <span className="text-gray-500 font-medium truncate max-w-xs">
                            {product?.Name}
                        </span>
                    </div>
                </div>
            </header>

            {/* ── MAIN CONTENT ────────────────────────────────────────────── */}
            <main className="max-w-5xl mx-auto px-4 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

                    {/* ── LEFT: PRODUCT IMAGE ─────────────────────────────────── */}
                    <div className="flex flex-col gap-3">
                        <div className="relative bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden aspect-square">
                            <div className="absolute top-3 left-3 z-10">
                                {product?.Status === "Available" ? (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-lime-400 text-black text-xs font-bold shadow-sm">
                                        <CheckCircle size={12} />
                                        Available
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-100 text-red-700 text-xs font-bold border border-red-200">
                                        <XCircle size={12} />
                                        Sold
                                    </span>
                                )}
                            </div>

                            {product?.ImageUrl ? (
                                <img
                                    src={product.ImageUrl}
                                    alt={product.Name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center gap-3 bg-gray-50">
                                    <Package size={48} className="text-gray-200" />
                                    <span className="text-sm text-gray-300 font-medium">No image provided</span>
                                </div>
                            )}
                        </div>

                        <div className="bg-white rounded-xl border border-gray-100 px-4 py-3 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
                                <Clock size={15} className="text-gray-400" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 font-medium">Listed</p>
                                <p className="text-sm font-semibold text-gray-700">
                                    {product ? `${timeAgo(product.CreatedAt)} · ${formatDate(product.CreatedAt)}` : ""}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* ── RIGHT: PRODUCT DETAILS ──────────────────────────────── */}
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-2">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-lime-50 border border-lime-200 text-lime-700 text-xs font-bold uppercase tracking-wide">
                                <Tag size={10} />
                                {product?.Category}
                            </span>
                        </div>

                        <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight leading-tight">
                            {product?.Name}
                        </h1>

                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-black text-lime-600">
                                {product ? formatPrice(product.Price) : ""}
                            </span>
                            <span className="text-sm text-gray-400 font-medium">Fixed price</span>
                        </div>

                        <div className="border-t border-gray-100" />

                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Description</p>
                            <p className="text-sm text-gray-600 leading-relaxed">{product?.Description}</p>
                        </div>

                        <div className="border-t border-gray-100" />

                        <div className="flex flex-col gap-3">
                            {/* Location */}
                            <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                                <div className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center flex-shrink-0 shadow-sm">
                                    <MapPin size={14} className="text-lime-500" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Location</p>
                                    <p className="text-sm font-semibold text-gray-800 mt-0.5">{product?.Location}</p>
                                </div>
                            </div>

                            {/* Quantity */}
                            <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                                <div className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center flex-shrink-0 shadow-sm">
                                    <MapPin size={14} className="text-lime-500" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Quantity</p>
                                    <p className="text-sm font-semibold text-gray-800 mt-0.5">{product?.Quantity || 1}</p>
                                </div>
                            </div>

                            {/* Contact */}
                            <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                                <div className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center flex-shrink-0 shadow-sm">
                                    <Phone size={14} className="text-lime-500" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Contact</p>
                                    <p className="text-sm font-semibold text-gray-800 mt-0.5">{product?.ContactInfo}</p>
                                </div>
                            </div>

                            {/* Category */}
                            <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                                <div className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center flex-shrink-0 shadow-sm">
                                    <ShoppingBag size={14} className="text-lime-500" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Category</p>
                                    <p className="text-sm font-semibold text-gray-800 mt-0.5">{product?.Category}</p>
                                </div>
                            </div>

                            {/* Listed On */}
                            <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                                <div className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center flex-shrink-0 shadow-sm">
                                    <Calendar size={14} className="text-lime-500" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Listed On</p>
                                    <p className="text-sm font-semibold text-gray-800 mt-0.5">
                                        {product ? formatDate(product.CreatedAt) : ""}
                                    </p>
                                </div>
                            </div>

                            {/* Status */}
                            <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                                <div className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center flex-shrink-0 shadow-sm">
                                    {product?.Status === "Available" ? (
                                        <CheckCircle size={14} className="text-lime-500" />
                                    ) : (
                                        <XCircle size={14} className="text-red-400" />
                                    )}
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Status</p>
                                    <p className={["text-sm font-bold mt-0.5", product?.Status === "Available" ? "text-lime-600" : "text-red-500"].join(" ")}>
                                        {product?.Status}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* CTA blocks */}
                        {product?.Status === "Available" && (
                            <div className="flex flex-col gap-2 pt-2">
                                <Link
                                    href="/store"
                                    className="w-full py-3 rounded-2xl border border-gray-200 text-gray-600 font-semibold text-sm text-center hover:bg-gray-50 hover:border-gray-300 transition-all"
                                >
                                    Browse More Items
                                </Link>
                            </div>
                        )}

                        {product?.Status === "Sold" && (
                            <div className="flex flex-col gap-2 pt-2">
                                <div className="w-full py-3.5 rounded-2xl bg-gray-100 text-gray-400 font-bold text-sm text-center cursor-not-allowed">
                                    This item has been sold
                                </div>
                                <Link
                                    href="/store"
                                    className="w-full py-3 rounded-2xl bg-lime-400 text-black font-bold text-sm text-center hover:bg-lime-300 transition-all"
                                >
                                    Find Similar Items
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}