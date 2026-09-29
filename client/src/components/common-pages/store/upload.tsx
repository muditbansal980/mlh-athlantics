"use client"
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../../layouts/shoppping-store/navbar";
import BottomBar from "../../../layouts/shoppping-store/bottom-bar";
import {
  ArrowLeft, Package, Tag, AlignLeft, IndianRupee,
  Link2, Phone, MapPin, ChevronDown, Check, AlertCircle,
  Upload, Eye, Loader2, Sparkles, Store, X, Image
} from "lucide-react";
import { BACKEND_URL } from "@/config/app";

// ── Data ──────────────────────────────────────────────────────────────────
const CATEGORIES = [
  { value: "footwear", label: "Footwear", icon: "👟" },
  { value: "apparel", label: "Apparel", icon: "👕" },
  { value: "equipment", label: "Equipment", icon: "🏋️" },
  { value: "nutrition", label: "Nutrition", icon: "💊" },
  { value: "recovery", label: "Recovery", icon: "🧊" },
  { value: "accessories", label: "Accessories", icon: "⌚" },
  { value: "other", label: "Other", icon: "📦" },
];


// ── Main Upload Dashboard ─────────────────────────────────────────────────
export default function UploadDashboard() {
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);
  const [activeSection, setActiveSection] = useState(0);
  const [Productname, setProductName] = useState("");
  const [Description, setDescription] = useState("");
  const [Category, setCategory] = useState("");
  // const [ImageUrl, setImageUrl] = useState("");
  const [ImageFile, setImageFile] = useState<File | null>(null);
  const [Price, setPrice] = useState("");
  const [Contact, setContact] = useState("");
  const [Quantity, setQuantity] = useState("");
  const [Location, setLocation] = useState("");
  const [Error, setError] = useState("");
  const [errdisplay, setErrdisplay] = useState<"hidden" | "fixed">("hidden");

  async function handleSubmit(e: any) {
    e.preventDefault();
    const formData = new FormData();

    formData.append("Name", Productname);
    formData.append("Description", Description);
    formData.append("Price", Price);
    formData.append("ContactInfo", Contact);
    formData.append("Location", Location);
    formData.append("Category", Category);
    formData.append("Quantity", Quantity);

    if (ImageFile) {
      formData.append("image", ImageFile);
    }
    const res = await fetch(`${BACKEND_URL}/api/store/upload`, {
      method: "POST",
      body: formData,
      credentials: "include",
      headers: {
        "Cache-Control": "no-cache",
      }
    });
    if (res.ok) {
      setSubmitted(true);
    }
    else {
      setError("Failed to upload product. Please try again.");
      setErrdisplay("fixed");
    }
  }
  if (errdisplay === "fixed") {
    setTimeout(() => {
      setErrdisplay("hidden");
    }, 5000);
  }
  // ── Success Screen ───────────────────────────────────────────────────
  if (submitted) return (
    <div style={{
      minHeight: "100vh", background: "#080c08", display: "flex",
      alignItems: "center", justifyContent: "center", padding: 24,
      fontFamily: "'Syne','DM Sans',sans-serif",
    }}>
      <div style={{ textAlign: "center", maxWidth: 400 }}>
        <div style={{
          width: 90, height: 90, borderRadius: "50%",
          background: "rgba(163,230,53,.12)", border: "2px solid #a3e635",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 24px", animation: "pop .5s cubic-bezier(.34,1.56,.64,1) forwards",
        }}>
          <Check size={40} color="#a3e635" />
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: "#fff", marginBottom: 10, animation: "fadeUp .4s .2s both" }}>
          Product Listed! 🎉
        </h1>
        <p style={{ fontSize: 14, color: "rgba(255,255,255,.4)", lineHeight: 1.6, marginBottom: 8, animation: "fadeUp .4s .3s both" }}>
          <span style={{ color: "#a3e635", fontWeight: 700 }}>{Productname}</span> is now live on AthleteStore.
        </p>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,.25)", marginBottom: 32, animation: "fadeUp .4s .35s both" }}>
          Buyers can reach you at <span style={{ color: "rgba(255,255,255,.5)" }}>{Contact}</span>
        </p>
      </div>
    </div>
  );

  // ── Main Form ────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: "#080c08", color: "#fff", fontFamily: "'Syne','DM Sans',sans-serif" }}>
      {/* ── BODY ──────────────────────────────────────────────────── */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 20px 60px", display: "grid", gridTemplateColumns: "1fr", gap: 24 }} id="upload-grid">
        <style>{`@media(min-width:860px){#upload-grid{grid-template-columns:1fr 380px;}}`}</style>

        {/* ── LEFT: FORM ──────────────────────────────────────────── */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 0 }}>

          {/* Header */}
          <div style={{ marginBottom: 28, animation: "fadeUp .4s ease" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(163,230,53,.1)", border: "1px solid rgba(163,230,53,.2)", borderRadius: 20, padding: "4px 12px", marginBottom: 12 }}>
              <Sparkles size={11} color="#a3e635" />
              <span style={{ fontSize: 11, color: "#a3e635", fontWeight: 700 }}>New Listing</span>
            </div>
            <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-0.5px", lineHeight: 1.2, marginBottom: 6 }}>
              List Your Product
            </h1>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,.4)", lineHeight: 1.6 }}>
              Fill in the details below. Buyers will see exactly what you enter.
            </p>
          </div>
          {/* ── SECTION 1: Product Info ──────────────────────────── */}
          <div style={{ background: "rgba(255,255,255,.02)", border: "1px solid rgba(255,255,255,.08)", borderRadius: 20, padding: 22, marginBottom: 14, animation: "fadeUp .4s .1s both" }}
            onClick={() => setActiveSection(0)}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: "rgba(163,230,53,.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Package size={14} color="#a3e635" />
              </div>
              <span style={{ fontWeight: 800, fontSize: 14 }}>Product Info</span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {/* Name */}
              <label style={{ display: "block", fontSize: 16, color: "rgba(255,255,255,.4)", marginBottom: 6 }}>Product Name</label>
              <input
                type="text"
                placeholder="e.g. Nike Air Max 270, Whey Protein 2kg…"
                value={Productname}
                onChange={(e) => setProductName(e.target.value)}
                style={{
                  background: "#0e150e", border: "1px solid rgba(163,230,53,.2)",
                  borderRadius: 14, overflow: "hidden",
                  boxShadow: "0 20px 40px rgba(0,0,0,.5)",
                  padding: "11px 14px",
                  outline: "none",
                }}
              />
              {/* Category */}
              <label style={{ display: "block", fontSize: 16, color: "rgba(255,255,255,.4)", marginBottom: 6 }}>Category</label>
              <select value={Category} onChange={(e) => setCategory(e.target.value)} style={{
                background: "#0e150e", border: "1px solid rgba(163,230,53,.2)",
                borderRadius: 14, overflow: "hidden",
                boxShadow: "0 20px 40px rgba(0,0,0,.5)",
                padding: "11px 14px",
                outline: "none",
              }}>
                <option value="" disabled style={{ color: "rgba(255,255,255,.25)" }}>Select a category</option>
                {CATEGORIES.map(cat => (
                  <option key={cat.value} value={cat.value} style={{ color: "#fff", background: "#0e150e" }}>
                    {cat.icon} {cat.label}
                  </option>
                ))}
              </select>

              {/* Description */}
              <label style={{ display: "block", fontSize: 16, color: "rgba(255,255,255,.4)", marginBottom: 6 }}>Description</label>
              <textarea
                placeholder="Describe your product in detail — condition, features, size, why you're selling…"
                value={Description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                maxLength={500}
                style={{
                  background: "#0e150e", border: "1px solid rgba(163,230,53,.2)",
                  borderRadius: 14, overflow: "hidden",
                  boxShadow: "0 20px 40px rgba(0,0,0,.5)",
                  padding: "11px 14px",
                  outline: "none",
                }}
              />
            </div>
          </div>

          {/* ── SECTION 2: Media & Price ─────────────────────────── */}
          <div style={{ background: "rgba(255,255,255,.02)", border: "1px solid rgba(255,255,255,.08)", borderRadius: 20, padding: 22, marginBottom: 14, animation: "fadeUp .4s .2s both" }}
            onClick={() => setActiveSection(1)}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: "rgba(163,230,53,.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <IndianRupee size={14} color="#a3e635" />
              </div>
              <span style={{ fontWeight: 800, fontSize: 14 }}>Media & Price</span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {/* Image URL */}
              <div style={{ position: "relative" }}>
                <label style={{ display: "block", fontSize: 16, color: "rgba(255,255,255,.4)", marginBottom: 6 }}>Image URL</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setImageFile(e.target.files[0]);
                    }
                  }}
                  style={{
                    width: "100%",
                    background: "#0e150e",
                    border: "1px solid rgba(163,230,53,.2)",
                    borderRadius: 14,
                    padding: "11px 14px",
                    color: "#fff",
                    outline: "none",
                  }}
                />
              </div>

              {/* Price */}
              <div style={{ position: "relative" }}>
                <label style={{ display: "block", fontSize: 16, color: "rgba(255,255,255,.4)", marginBottom: 6 }}>Price</label>
                <input
                  type="text"
                  placeholder="Enter Price in ₹ (e.g. 499 or 1299)"
                  min="0"
                  value={Price}
                  onChange={(e) => setPrice(e.target.value)}
                  style={{
                    width: "100%",
                    background: "#0e150e", border: "1px solid rgba(163,230,53,.2)",
                    borderRadius: 14, overflow: "hidden",
                    boxShadow: "0 20px 40px rgba(0,0,0,.5)",
                    padding: "11px 14px",
                    outline: "none",
                  }}
                />
              </div>
              <div style={{ position: "relative" }}>
                <label style={{ display: "block", fontSize: 16, color: "rgba(255,255,255,.4)", marginBottom: 6 }}>Quantity</label>
                <input
                  type="Number"
                  placeholder="Enter Quantity"
                  min="1"
                  value={Quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  style={{
                    width: "100%",
                    background: "#0e150e", border: "1px solid rgba(163,230,53,.2)",
                    borderRadius: 14, overflow: "hidden",
                    boxShadow: "0 20px 40px rgba(0,0,0,.5)",
                    padding: "11px 14px",
                    outline: "none",
                  }}
                />
              </div>
            </div>
          </div>

          {/* ── SECTION 3: Contact & Location ───────────────────── */}
          <div style={{ background: "rgba(255,255,255,.02)", border: "1px solid rgba(255,255,255,.08)", borderRadius: 20, padding: 22, marginBottom: 24, animation: "fadeUp .4s .3s both" }}
            onClick={() => setActiveSection(2)}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: "rgba(163,230,53,.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Phone size={14} color="#a3e635" />
              </div>
              <span style={{ fontWeight: 800, fontSize: 14 }}>Contact & Location</span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {/* Contact */}
              <label style={{ display: "block", fontSize: 16, color: "rgba(255,255,255,.4)", marginBottom: 6 }}>Contact</label>
              <input
                type="text"
                placeholder="e.g. +91 98765 43210 or @your_handle"
                value={Contact}
                onChange={(e) => setContact(e.target.value)}
                style={{
                  width: "100%",
                  background: "#0e150e", border: "1px solid rgba(163,230,53,.2)",
                  borderRadius: 14, overflow: "hidden",
                  boxShadow: "0 20px 40px rgba(0,0,0,.5)",
                  padding: "11px 14px",
                  outline: "none",
                }}
              />
              <label style={{ display: "block", fontSize: 16, color: "rgba(255,255,255,.4)", marginBottom: 6 }}>Location</label>
              <input
                style={{
                  width: "100%",
                  background: "#0e150e", border: "1px solid rgba(163,230,53,.2)",
                  borderRadius: 14, overflow: "hidden",
                  boxShadow: "0 20px 40px rgba(0,0,0,.5)",
                  padding: "11px 14px",
                  outline: "none",
                }}
                type="text"
                placeholder="City and area helps buyers know if pickup or delivery is possible"
                value={Location}
                onChange={(e) => setLocation(e.target.value)}
              />

            </div>
          </div>
          {/* Submit */}
          <button
            type="submit"
            style={{
              width: "100%", padding: "15px 0", borderRadius: 16,
              background: "#a3e635",
              border: "none", color: "#000", fontWeight: 800, fontSize: 15,
              cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
              transition: "all .2s", boxShadow: "0 0 24px rgba(163,230,53,.25)",
            }}

            onMouseEnter={e => { e.currentTarget.style.background = "#bef264"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "#a3e635"; }}
          >Submit
          </button>
        </form>
        {/* -------Bottom Bar --------------------------------- */}
        <BottomBar />
      </div>
      {/* Error Screen */}
      {Error.length > 0 && (
        <div style={{
          position: "fixed", top: 20, left: "50%", transform: "translateX(-50%)",
          background: "#ff4d4f", color: "#fff", padding: "12px 20px", borderRadius: 8,
          display: "flex", alignItems: "center", gap: 10, zIndex: 1000,
          boxShadow: "0 4px 12px rgba(255,77,79,.5)",
        }}>
          <AlertCircle size={16} />
          <span style={{ fontSize: 14 }}>{Error}</span>
          <X size={16} style={{ cursor: "pointer" }} onClick={() => setError("")} />
        </div>
      )}
    </div>
  );
}