import {useRouter} from "next/navigation";
import {ArrowLeft, Search, X, ShoppingCart} from "lucide-react";
import {useState,useEffect} from "react";

import { Notifications } from "@/types/notifications";
import { fetchNotifications } from "../../../api/notifications/fetchnotifications";
// import { useStore } from "../../../store/shopping-store/useStore";
// import {useStore} from "@/stores/store";
export default function Navbar(){
    const router = useRouter();
    const [searchOpen, setSearchOpen] = useState(false);
    
    
    // const { searchQuery, setSearchQuery } = useStore();
    return(
        <header style={{
                position: "sticky", top: 0, zIndex: 50,
                background: "rgba(8,12,8,.92)", backdropFilter: "blur(20px)",
                borderBottom: "1px solid rgba(255,255,255,.07)",
                padding: "0 16px", height: 60,
                display: "flex", alignItems: "center", gap: 12,
            }}>
                {/* Back button → /home */}
                <button
                    onClick={() => router.push("/home")}
                    style={{
                        width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                        background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.1)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        cursor: "pointer", color: "rgba(255,255,255,.7)", transition: "all .2s",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = "rgba(163,230,53,.1)"; e.currentTarget.style.borderColor = "rgba(163,230,53,.3)"; e.currentTarget.style.color = "#a3e635"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,.06)"; e.currentTarget.style.borderColor = "rgba(255,255,255,.1)"; e.currentTarget.style.color = "rgba(255,255,255,.7)"; }}
                >
                    <ArrowLeft size={17} />
                </button>

                {/* Logo */}
                <div style={{ display: "flex", alignItems: "center", gap: 7, flexShrink: 0 }}>
                    <div style={{
                        width: 30, height: 30, borderRadius: 9, background: "#a3e635",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontWeight: 900, color: "#000", fontSize: 14,
                    }}>A</div>
                    <div>
                        <span style={{ fontWeight: 800, fontSize: 14, lineHeight: 1 }}>
                            Athlete<span style={{ color: "#a3e635" }}>Store</span>
                        </span>
                    </div>
                </div>

                {/* Search bar (desktop always visible, mobile toggle) */}
                <div style={{ flex: 1, maxWidth: 360, margin: "0 auto" }}>
                    {searchOpen  ? (
                        <div style={{ position: "relative" }}>
                            <Search size={13} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,.3)" }} />
                            <input
                                autoFocus={searchOpen}
                                type="text"
                                placeholder="Search products, brands…"
                                // value={searchQuery}
                                // onChange={(e) => setSearchQuery(e.target.value)}
                                style={{
                                    width: "100%", padding: "8px 10px 8px 30px", borderRadius: 10,
                                    background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.1)",
                                    color: "#fff", fontSize: 12, outline: "none",
                                }}
                                onFocus={e => e.target.style.borderColor = "rgba(163,230,53,.4)"}
                                onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,.1)"; setSearchOpen(false); }}
                            />
                            {/* {searchQuery && (
                                <button onClick={() => setSearchQuery("")}
                                    style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", background: "transparent", border: "none", cursor: "pointer", color: "rgba(255,255,255,.3)", display: "flex" }}>
                                    <X size={12} />
                                </button>
                            )} */}
                        </div>
                    ) : (
                        <button onClick={() => setSearchOpen(true)}
                            style={{ background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 10, padding: "8px 12px", display: "flex", alignItems: "center", gap: 6, cursor: "pointer", color: "rgba(255,255,255,.4)", fontSize: 12, width: "100%" }}>
                            <Search size={13} /> Search…
                        </button>
                    )}
                </div>

                {/* Cart icon shortcut */}
                <button
                    
                    style={{
                        position: "relative", width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                        background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.1)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        cursor: "pointer", color: "rgba(255,255,255,.7)",
                    }}>
                    <ShoppingCart size={16} />
                </button>
            </header>
    )
}