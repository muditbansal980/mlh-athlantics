import { useRouter } from "next/navigation";
import { Clock, ShoppingBag, ShoppingCart, Upload } from "lucide-react";
import { useState } from "react";
export default function BottomBar() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState("buy");
    return (
        <div style={{
            position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 50,
            background: "rgba(8,12,8,.95)", backdropFilter: "blur(20px)",
            borderTop: "1px solid rgba(255,255,255,.08)",
            padding: "10px 8px 14px",
            display: "flex", alignItems: "center", justifyContent: "space-around",
        }}>
            {/* Buy */}
            <button
                style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, background: "transparent", border: "none", cursor: "pointer", padding: "6px 16px", borderRadius: 14, transition: "all .2s", color: activeTab === "buy" ? "#a3e635" : "rgba(255,255,255,.4)" }}>
                <ShoppingBag size={20} />
                <span style={{ fontSize: 10, fontWeight: 700 }}>Buy</span>
            </button>

            {/* History */}
            <button
                style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, background: "transparent", border: "none", cursor: "pointer", padding: "6px 16px", borderRadius: 14, transition: "all .2s", color: activeTab === "history" ? "#a3e635" : "rgba(255,255,255,.4)" }}>
                <Clock size={20} />
                <span style={{ fontSize: 10, fontWeight: 700 }}>History</span>
            </button>

            {/* Upload (center, elevated) */}
            <button
                style={{
                    display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
                    background: activeTab === "upload" ? "#a3e635" : "rgba(163,230,53,.9)",
                    border: "none", cursor: "pointer",
                    width: 58, height: 58, borderRadius: "50%",
                    // alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 0 20px rgba(163,230,53,.3)",
                    marginTop: -24, transition: "all .2s",
                    color: "#000",
                }} onClick={() => router.push("/store/upload")}>
                <Upload size={22} />
            </button>

            {/* Cart */}
            <button
                onClick={() => router.push("/store/cart")}
                style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, background: "transparent", border: "none", cursor: "pointer", padding: "6px 16px", borderRadius: 14, transition: "all .2s", color: activeTab === "cart" ? "#a3e635" : "rgba(255,255,255,.4)", position: "relative" }}>
                <div style={{ position: "relative" }}>
                    <ShoppingCart size={20} />
                </div>
                <span style={{ fontSize: 10, fontWeight: 700 }}>Cart</span>
            </button>

            {/* Your Uploads shortcut */}
            <button onClick={() => router.push("/store/your-uploads")}
                style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, background: "transparent", border: "none", cursor: "pointer", padding: "6px 16px", borderRadius: 14, color: "rgba(255,255,255,.4)" }}>
                <div style={{ width: 22, height: 22, borderRadius: "50%", background: "linear-gradient(135deg,#a3e635,#4ade80)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, color: "#000" }}>Y</div>
                <span style={{ fontSize: 10, fontWeight: 700 }}>Your Uploads</span>
            </button>
        </div>
    )
}