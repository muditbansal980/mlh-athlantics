"use client"

import { BACKEND_URL } from "../../../config/app"
import { use, useEffect, useState } from "react"
import { ShoppingCart, Package, MapPin, Tag, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { useCartStore } from "../../../../store/cartdatastore"
async function getCart() {
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

export default function Cart() {
    const [cartItems, setCartItems] = useState<CartItems[]>([])
    const router = useRouter()
    // const { StoredCartItems,setStoredCartItems } = useCartStore()
    const StoredCartItems = useCartStore(state => state.StoredCartItems)
    const setStoredCartItems = useCartStore(state => state.setStoredCartItems)

    useEffect(() => {
        // using cached data in local storage (Zustand persist) to avoid unnecessary API call and also to prevent empty cart on page refresh. This is because the cart items are not stored in a global state and are lost on page refresh, so we use Zustand persist to store them in local storage and retrieve them on page load.
        if (StoredCartItems.length > 0 && cartItems.length === 0) {
            setCartItems(StoredCartItems)
        }
        // if no cached data, fetch from API and update both local state and Zustand store
        else {
            getCart().then(data => {
                setCartItems(data)
                setStoredCartItems(data) // Update Zustand store with fetched cart items
            })
        }
    }, [])

    // Function to remove item from cart
    const removefromcart = async (cartItemId: number) => {
        try {
            const res = await fetch(`${BACKEND_URL}/api/store/cart/removeitem/${cartItemId}`, {
                method: "DELETE",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                }
            })
            if (res.ok) {
                // Remove item from local state
                setCartItems(cartItems.filter(item => item.Id !== cartItemId))
                // Update Zustand store
                setStoredCartItems(cartItems.filter(item => item.Id !== cartItemId))
            }
        } catch (error) {
            console.error("Error removing from cart:", error)
        }
    }   

    return (
        <div className="min-h-dvh bg-gray-50 font-sans">

            {/* Header */}
            <div className="bg-white border-b border-gray-100 shadow-sm px-6 py-4">
                <div className="flex items-center gap-3 cursor-pointer" onClick={() => router.push("/store")}>
                    <ArrowLeft size={18} className="text-gray-400" />
                    <span className="text-sm text-gray-500">Back to Store</span>
                </div>
                <div className="max-w-4xl mx-auto flex items-center gap-3">
                    <ShoppingCart size={20} className="text-lime-500" />
                    <h1 className="text-xl font-extrabold text-gray-900 tracking-tight">
                        Your Cart
                    </h1>
                    {cartItems.length > 0 && (
                        <span className="ml-auto text-sm font-semibold text-gray-400">
                            {cartItems.length} item{cartItems.length !== 1 ? "s" : ""}
                        </span>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 py-6">

                {/* Empty state */}
                {cartItems.length === 0 && (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center gap-4 py-20 text-center">
                        <div className="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-center">
                            <ShoppingCart size={26} className="text-gray-300" />
                        </div>
                        <div>
                            <p className="font-bold text-gray-700 text-base">Your cart is empty</p>
                            <p className="text-sm text-gray-400 mt-1">Add some items from the store</p>
                        </div>
                    </div>
                )}

                {/* Cart items */}
                {cartItems.length > 0 && (
                    <div className="flex flex-col gap-3">
                        {cartItems.map((item: any) => (
                            <div
                                key={item.Id}
                                className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:border-lime-200 hover:shadow-md transition-all flex items-stretch overflow-hidden"
                            >

                                {/* Image — left */}
                                <div className="w-24 h-24 flex-shrink-0 bg-gray-50 border-r border-gray-100 flex items-center justify-center self-stretch">
                                    {item.ImageUrl ? (
                                        <img
                                            src={item.ImageUrl}
                                            alt={item.Name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <Package size={24} className="text-gray-200" />
                                    )}
                                </div>

                                {/* All other info — middle */}
                                <div className="flex-1 min-w-0 px-4 py-3 flex flex-col justify-center gap-1">

                                    <p className="font-bold text-gray-900 text-sm truncate">
                                        {item.Name}
                                    </p>

                                    <p className="text-lg font-black text-lime-600 leading-none">
                                        ₹{Number(item.Price).toLocaleString("en-IN")}
                                    </p>

                                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-0.5">

                                        <span className="text-xs text-gray-400 font-medium">
                                            Qty: {item.Quantity}
                                        </span>

                                        {item.Category && (
                                            <span className="inline-flex items-center gap-1 text-xs text-gray-400 font-medium">
                                                <Tag size={10} className="text-gray-300" />
                                                {item.Category}
                                            </span>
                                        )}

                                        {item.Location && (
                                            <span className="inline-flex items-center gap-1 text-xs text-gray-400 font-medium">
                                                <MapPin size={10} className="text-gray-300" />
                                                {item.Location}
                                            </span>
                                        )}

                                    </div>

                                </div>

                                {/* Status — right */}
                                <div className=" flex-col items-center px-4 py-4 border-l border-gray-100 justify-center">
                                    {item.Status === "Available" ? (
                                        <span className="px-3 py-1.5 rounded-full bg-lime-50 border border-lime-200 text-lime-700 text-xs font-bold whitespace-nowrap">
                                            Available
                                        </span>
                                    ) : item.Status === "Sold" ? (
                                        <span className="px-3 py-1.5 rounded-full bg-red-50 border border-red-200 text-red-600 text-xs font-bold whitespace-nowrap">
                                            Sold
                                        </span>
                                    ) : (
                                        <span className="px-3 py-1.5 rounded-full bg-gray-50 border border-gray-200 text-gray-500 text-xs font-bold whitespace-nowrap">
                                            {item.Status}
                                        </span>


                                    )}
                                    <div className="mt-4 flex items-center justify-center" onClick={()=>{removefromcart(item.Id)}}>
                                        <button className="text-red-500 hover:text-red-700 text-sm font-medium">
                                            Remove from Cart
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

            </div>
        </div>
    )
}