"use client";
import Link from "next/link";
// import { cookies } from "next/headers";
import { useRouter} from "next/navigation";
import { useUserData } from "../../../../store/usesUserData";
import {
  ArrowLeft,
  Package,
  CheckCircle,
  XCircle,
  MapPin,
  Tag,
  Calendar,
  UploadCloud,
} from "lucide-react";
import { BACKEND_URL } from "@/config/app";
import { useEffect, useState } from "react";

// ── Types ──────────────────────────────────────────────────────────────────
type ProductStatus = "Available" | "Sold";

type UploadedItem = {
  Id: string;
  Name: string;
  Description: string;
  Price: number;
  ContactInfo: string;
  Location: string;
  Category: string;
  CreatedAt: string;
  Status: ProductStatus;
  ImageUrl: string;
};

// ── Server fetch ───────────────────────────────────────────────────────────
async function getUserUploads(id: string, router: ReturnType<typeof useRouter>): Promise<UploadedItem[] | null> {
  try {
    const res = await fetch(
      `${BACKEND_URL}/api/store/user/uploads/${id}`,
      {
        cache: "no-store",
        credentials: "include",
      }
    );
    if (!res.ok) return null;
    if(res.status === 403){
      router.push("/store")
    }
    return await res.json();
  } catch {
    return null;
  }
}

// delete product
async function DeleteProduct(id: string) {
  try {
    const res = await fetch(`${BACKEND_URL}/api/store/item/delete/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (!res.ok) {
      console.error("Failed to delete product");
    }
  } catch {
    console.error("Error occurred while deleting product");
  }
}

// ── Pure helpers ───────────────────────────────────────────────────────────
const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const timeAgo = (iso: string) => {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 30) return `${days}d ago`;
  if (days < 365) return `${Math.floor(days / 30)}mo ago`;
  return `${Math.floor(days / 365)}y ago`;
};

// ── Page ───────────────────────────────────────────────────────────────────
export default function UserUploadsPage() {
  // const { currentUser } = useUserData((state) => ({ currentUser: state.currentUser }));
  const router = useRouter();
  const [uploads, setUploads] = useState<UploadedItem[] | null>(null);
  const currentUser = useUserData(
    (state) => state.currentUser
  );
  // console.log("Current user in uploads page:", currentUser);
  const id = currentUser?.Id;

  useEffect(() => {
    if (!id) return;
    const userId = id as string;

    async function fetchUploads() {
      return await getUserUploads(userId, router);
    }
    fetchUploads().then(setUploads);
  }, [id]);

  if (!currentUser) {
    return (
      <div className="min-h-dvh flex items-center justify-center">
        <p className="text-gray-500 text-sm">Loading your account...</p>
      </div>
    );
  }

  // // console.log("User ID in uploads page:", id);
  if (!id) {
    router.push("/register");
    return null;
  }


  //   if (!uploads) notFound();
  if (uploads === null) {
    return (
      <div className="min-h-dvh flex items-center justify-center">
        <p className="text-gray-500 text-sm">Loading your uploads...</p>
      </div>
    );
  }
  const totalItems = uploads!.length;
  const availableItems = uploads!.filter((u) => u.Status === "Available").length;
  const soldItems = uploads!.filter((u) => u.Status === "Sold").length;

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
            <Link
              href="/store"
              className="hover:text-lime-600 transition-colors font-medium"
            >
              Store
            </Link>
            <span>/</span>
            <span className="text-gray-500 font-medium">My Uploads</span>
          </div>

          {/* Upload new */}
          <Link
            href="/store/upload"
            className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-bold text-black bg-lime-400 hover:bg-lime-300 transition-all shadow-sm"
          >
            <UploadCloud size={14} />
            New Listing
          </Link>

        </div>
      </header>

      {/* ── MAIN ────────────────────────────────────────────────────── */}
      <main className="max-w-5xl mx-auto px-4 py-6 flex flex-col gap-6">

        {/* ── PAGE TITLE ────────────────────────────────────────────── */}
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
            My Uploads
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            All products you have listed on AthleteStore
          </p>
        </div>

        {/* ── STAT CARDS ────────────────────────────────────────────── */}
        <div className="grid grid-cols-3 gap-3">

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center">
            <p className="text-3xl font-black text-gray-900">{totalItems}</p>
            <p className="text-xs text-gray-400 font-semibold mt-1 uppercase tracking-wider">
              Total Listed
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-lime-100 shadow-sm p-4 text-center">
            <p className="text-3xl font-black text-lime-600">{availableItems}</p>
            <p className="text-xs text-gray-400 font-semibold mt-1 uppercase tracking-wider">
              Available
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center">
            <p className="text-3xl font-black text-red-400">{soldItems}</p>
            <p className="text-xs text-gray-400 font-semibold mt-1 uppercase tracking-wider">
              Sold
            </p>
          </div>

        </div>

        {/* ── EMPTY STATE ───────────────────────────────────────────── */}
        {uploads!.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center gap-4 py-20 px-6 text-center">
            <div className="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-center">
              <Package size={26} className="text-gray-300" />
            </div>
            <div>
              <p className="font-bold text-gray-700 text-base">
                No uploads yet
              </p>
              <p className="text-sm text-gray-400 mt-1 max-w-xs">
                You have not listed any products yet. Start by uploading your
                first item.
              </p>
            </div>
            <Link
              href="/store/upload"
              className="px-5 py-2.5 rounded-xl bg-lime-400 text-black font-bold text-sm hover:bg-lime-300 transition-all"
            >
              List Your First Item
            </Link>
          </div>
        )}

        {/* ── UPLOADS GRID ──────────────────────────────────────────── */}
        {uploads!.length > 0 && (
          <div className="flex flex-col gap-3" >
            {uploads!.map((item) => (
              <div
                key={item.Id}

                className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:border-lime-200 hover:shadow-md transition-all flex gap-4 p-4 items-start"
              >

                {/* Image */}
                <div className="w-24 h-24 rounded-xl bg-gray-50 border border-gray-100 flex-shrink-0 overflow-hidden">
                  {item.ImageUrl ? (
                    <img
                      src={item.ImageUrl}
                      alt={item.Name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package size={24} className="text-gray-200" />
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                  <span className="relative ml-auto" onClick={() => DeleteProduct(item.Id)} >
                    <button className="text-red-500 hover:text-red-700 font-medium text-sm">
                      Delete
                    </button>
                  </span>
                  {/* Name + status */}
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-bold text-gray-900 text-sm leading-tight truncate">
                      {item.Name}
                    </p>
                    {item.Status === "Available" ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-lime-50 border border-lime-200 text-lime-700 text-xs font-bold flex-shrink-0">
                        <CheckCircle size={10} />
                        Available
                      </span>


                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-50 border border-red-200 text-red-600 text-xs font-bold flex-shrink-0">
                        <XCircle size={10} />
                        Sold
                      </span>
                    )}

                  </div>


                  {/* Description */}
                  <p className="text-xs text-gray-400 leading-relaxed line-clamp-2">
                    {item.Description}
                  </p>

                  {/* Meta row */}
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">

                    {/* Price */}
                    <span className="text-sm font-black text-lime-600">
                      {formatPrice(item.Price)}
                    </span>

                    {/* Category */}
                    <span className="inline-flex items-center gap-1 text-xs text-gray-400 font-medium">
                      <Tag size={10} className="text-gray-300" />
                      {item.Category}
                    </span>

                    {/* Location */}
                    <span className="inline-flex items-center gap-1 text-xs text-gray-400 font-medium">
                      <MapPin size={10} className="text-gray-300" />
                      {item.Location}
                    </span>

                    {/* Date */}
                    <span className="inline-flex items-center gap-1 text-xs text-gray-400 font-medium">
                      <Calendar size={10} className="text-gray-300" />
                      {timeAgo(item.CreatedAt)} · {formatDate(item.CreatedAt)}
                    </span>
                  </div>
                  <Link href={`/store/item/${item.Id}`}>
                    <div>
                      View Details
                    </div>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

      </main>
    </div>
  );
}