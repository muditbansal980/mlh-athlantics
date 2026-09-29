"use client";
import { useState, useMemo, useEffect } from "react";
import { Star, Plus, Package, Flame, Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import Navbar from "@/layouts/shoppping-store/navbar";
import BottomBar from "@/layouts/shoppping-store/bottom-bar";
import { BACKEND_URL } from "@/config/app";
import { useCartStore } from "../../../../store/cartdatastore";

type Product = { Id: string; Category: string; Name: string; Description: string; Price: number; ImageUrl: string, Quantity: number, ContactInfo: string, Location: string, CreatedBy: string, CreatedAt: Date, Status: string };



// Function to add item to cart
async function addToCart(
    product: Product,
    setCartItems: (items: CartItems[]) => void,
    setStoredCartItems: (items: any[]) => void,
    currentCartItems: CartItems[]
) {
    try {
        const res = await fetch(`${BACKEND_URL}/api/store/addToCart`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ ItemId: product.Id, Quantity: 1 })
        })
        if (res.ok) {
            alert("Item added to cart!")

            const data = await res.json()
            const backendCartItem = data.cartItem[0] // Get the first item from returned array

            // Create new cart item using backend data + product data
            const newCartItem: CartItems = {
                Id: backendCartItem.Id,
                ItemId: backendCartItem.ItemId,
                Name: product.Name,
                Price: product.Price,
                Quantity: backendCartItem.Quantity,
                Status: product.Status,
                ImageUrl: product.ImageUrl,
            }

            // Update both local state and Zustand store
            const updatedCartItems = [...currentCartItems, newCartItem]
            setCartItems(updatedCartItems)
            setStoredCartItems(updatedCartItems)
        }
        // extra safety check for item already in cart
        if (res.status === 400) {
            alert("Item already in cart")
        }
    } catch (error) {
        console.error("Error adding to cart:", error)
    }
}
// ── Product Card ──────────────────────────────────────────────────────────
function ProductCard({
    product,
    isCartItem,
    setCartItems,
    setStoredCartItems,
    cartItems
}: {
    product: Product;
    isCartItem: boolean;
    setCartItems: (items: CartItems[]) => void;
    setStoredCartItems: (items: any[]) => void;
    cartItems: CartItems[];
}) {
    const router = useRouter();
    const [liked, setLiked] = useState(false);
    return (
        <div style={{
            background: "#0e150e",
            border: "1px solid rgba(255,255,255,.08)",
            borderRadius: 20,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            transition: "border-color .2s, transform .2s",
            cursor: "default",
        }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(163,230,53,.3)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,.08)"; e.currentTarget.style.transform = "translateY(0)"; }}
        >
            {/* Product image area */}
            <div style={{
                height: 160,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                borderBottom: "1px solid rgba(255,255,255,.05)",
            }}>
                {product.ImageUrl ? (
                    <img
                        src={product.ImageUrl}
                        alt={product.Name}
                        style={{
                            maxHeight: "100%",
                            maxWidth: "100%",
                            objectFit: "contain"
                        }}
                    />
                ) : (
                    <span>Image not available</span>
                )}
                {/* Like button */}
                <button
                    onClick={() => setLiked(l => !l)}
                    style={{
                        position: "absolute", top: 10, right: 10,
                        width: 32, height: 32, borderRadius: "50%",
                        background: "rgba(0,0,0,.4)", border: "1px solid rgba(255,255,255,.1)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        cursor: "pointer", transition: "all .2s",
                    }}>
                    <Heart size={14} fill={liked ? "#ef4444" : "none"} color={liked ? "#ef4444" : "rgba(255,255,255,.5)"} />
                </button>
            </div>

            {/* Content */}
            <div style={{ padding: "14px 14px 16px", display: "flex", flexDirection: "column", flex: 1, gap: 6 }}>

                {/* Name */}
                <h3 style={{ fontSize: 14, fontWeight: 800, color: "#fff", lineHeight: 1.3, margin: 0 }}>
                    {product.Name}
                </h3>

                {/* Description */}
                <p style={{
                    fontSize: 11, color: "rgba(255,255,255,.4)", lineHeight: 1.5,
                    margin: 0, display: "-webkit-box", WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical", overflow: "hidden",
                }}>
                    {product.Description}
                </p>
                {/* Quantity */}
                <p style={{
                    fontSize: 11, color: "rgba(255,255,255,.4)", lineHeight: 1.5,
                    margin: 0, display: "-webkit-box", WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical", overflow: "hidden",
                }}>
                    Quantity: {product.Quantity || 1}
                </p>

                {/* Price */}
                <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginTop: 2 }}>
                    <span style={{ fontSize: 18, fontWeight: 900, color: "#a3e635" }}>
                        ₹{product.Price}
                    </span>
                </div>

                {/* Buttons */}
                <div style={{ display: "flex", gap: 8, marginTop: 6 }}>

                    <button
                        onClick={() => addToCart(product, setCartItems, setStoredCartItems, cartItems)}
                        style={{
                            flex: 1, padding: "9px 0", borderRadius: 12, fontSize: 12, fontWeight: 700,
                            cursor: "pointer", transition: "all .2s",
                            background: "rgba(163,230,53,.15)",
                            border: "1px solid rgba(163,230,53,.4)",
                            color: "#a3e635",
                            display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
                        }}>
                        <>{isCartItem ? "In Cart" : "Add to Cart"}</>
                    </button>
                    <button
                        onClick={() => router.push(`/store/item/${product.Id}`)}
                        style={{
                            flex: 1, padding: "9px 0", borderRadius: 12, fontSize: 12, fontWeight: 700,
                            cursor: "pointer", transition: "all .2s",
                            background: "#a3e635", border: "none", color: "#000",
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = "#bef264"}
                        onMouseLeave={e => e.currentTarget.style.background = "#a3e635"}
                    >
                        Buy Now
                    </button>
                </div>
            </div>
        </div>
    );
}
async function isInCart() {
    try {
        const res = await fetch(`${BACKEND_URL}/api/store/cart`, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            }
        })
        if (res.ok) {
            const data = await res.json()
            return data
        }
    } catch (error) {
        console.error("Error checking cart:", error)
    }
}

type CartItems = {
    Id: number;
    ItemId: number;
    Name: string;
    Price: number;
    Quantity: number;
    Status: string;
    ImageUrl: string;
}

// ── Main Store Page ───────────────────────────────────────────────────────
export default function AthleteStorePage() {

    const [Products, setProducts] = useState<Product[]>([]);
    const [cartItems, setCartItems] = useState<CartItems[]>([])
    const [isCartItem, setIsCartItem] = useState(false);
    const StoredCartItems = useCartStore(state => state.StoredCartItems)
    const setStoredCartItems = useCartStore(state => state.setStoredCartItems)
    const hasHydrated = useCartStore(state => state.hasHydrated)
    // console.log("StoredCartItems from Zustand:", StoredCartItems)
    // console.log("Local cartItems state:", cartItems)
    //Checking if the product is already in cart
    useEffect(() => {
        if (!hasHydrated) return;

        if (Array.isArray(StoredCartItems) && StoredCartItems.length > 0) {
            // console.log("Using cached cart items from Zustand store");
            setCartItems(StoredCartItems);
        } else {
            // console.log("No cached cart items, fetching from API");
            isInCart().then(data => {
                if (data && Array.isArray(data)) {
                    setCartItems(data);
                    setStoredCartItems(data);
                }
            });
        }
    }, [hasHydrated]); // ← only run when hydration status changes
    const cartItemIds = useMemo(() => {
        return new Set(
            cartItems.map(item => String(item.ItemId))
        );

    }, [cartItems]);
    // console.log("Cart item IDs:", cartItemIds)
    async function fetchProducts() {
        try {
            const res = await fetch(`${BACKEND_URL}/api/store/all-items`, {
                method: "GET",
                credentials: "include",
                headers: {
                    "Cache-Control": "no-cache",
                }
            });
            const data = await res.json();
            // console.log("Fetched products from backend:", data);
            setProducts(data);

        } catch (error) {
            // console.log("Error fetching products:", error);
            console.error("Error fetching products:", error);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);
    return (
        <div style={{ minHeight: "100vh", background: "#080c08", color: "#fff", fontFamily: "'Syne','DM Sans',sans-serif", paddingBottom: 80 }}>
            <style>{`
         
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-thumb { background: #a3e635; border-radius: 2px; }
        ::-webkit-scrollbar-track { background: transparent; }
        input::placeholder { color: rgba(255,255,255,.3); }
        input { font-family: inherit; }
        button { font-family: inherit; }
      `}</style>

            {/* ── NAVBAR ──────────────────────────────────────────────────── */}
            {/* <Navbar /> */}

            {/* ── MAIN CONTENT ────────────────────────────────────────────── */}
            <main style={{ padding: "18px 16px" }}>
                {/* Results count */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                    {/* <span style={{ fontSize: 12, color: "rgba(255,255,255,.4)" }}>
                        {searchQuery && <> for "<span style={{ color: "#a3e635" }}>{searchQuery}</span>"</>}
                    </span> */}
                    <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "rgba(255,255,255,.3)" }}>
                        <Flame size={11} color="#fbbf24" /> Best deals today
                    </div>
                </div>
                {/* Product Grid */}
                {/* {filtered.length > 0 ? (
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                        gap: 14,
                    }}>
                        {filtered.map(product => (
                            <ProductCard
                                key={product.Id}
                                product={product}
                            />
                        ))}
                    </div>
                ) : (
                    <div style={{ textAlign: "center", padding: "60px 0", color: "rgba(255,255,255,.2)" }}>
                        <Package size={48} style={{ margin: "0 auto 14px", display: "block" }} />
                        <p style={{ fontSize: 14, fontWeight: 700 }}>No products found</p>
                        <p style={{ fontSize: 12, marginTop: 6 }}>Try a different search or category</p>
                    </div>
                )} */}
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                    gap: 14,
                }}>
                    {Products.length > 0 ? Products.map(product => (
                        <ProductCard
                            key={product.Id}
                            product={product}
                            isCartItem={cartItemIds.has(String(product.Id))}
                            setCartItems={setCartItems}
                            setStoredCartItems={setStoredCartItems}
                            cartItems={cartItems}
                        />
                    )) : (
                        <div style={{ textAlign: "center", padding: "60px 0", color: "rgba(255,255,255,.2)" }}>
                            <Package size={48} style={{ margin: "0 auto 14px", display: "block" }} />
                            <p style={{ fontSize: 14, fontWeight: 700 }}>No products found</p>
                            <p style={{ fontSize: 12, marginTop: 6 }}>Try a different search or category</p>
                        </div>
                    )}
                </div>
            </main>
            {/* ── BOTTOM BAR ──────────────────────────────────────────────── */}
            <BottomBar />
        </div>
    );
}