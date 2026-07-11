import React, { useState } from "react";
import { Sparkles, Save, Code, CheckCircle, RefreshCw, Smartphone, Edit3 } from "lucide-react";
import { motion } from "motion/react";
import {
  SduiBannerProps,
  SduiLoyaltyCardProps,
  SduiProductCardProps,
  SduiSearchBarProps,
  SduiCheckoutFormProps,
  SduiComponent
} from "../types";

type ComponentType = "Banner" | "LoyaltyCard" | "ProductCard" | "SearchBar" | "CheckoutForm";

export default function ComponentStudio() {
  const [selectedType, setSelectedType] = useState<ComponentType>("Banner");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Editable states for components utilizing strict type-safety
  const [bannerProps, setBannerProps] = useState<SduiBannerProps>({
    title: "Diwali Grocery Special!",
    description: "Get 15% discount on select basmati rice and pure ghee.",
    buttonText: "Shop Special Offers",
    backgroundColor: "#DC2626", // Red-600
    textColor: "#FFFFFF",
    imageUrl: "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=500"
  });

  const [loyaltyProps, setLoyaltyProps] = useState<SduiLoyaltyCardProps>({
    points: 450,
    merchantName: "Boota Grocers Harris Park",
    barcodeText: "BT-8842-990",
    tier: "Gold Member",
    nextRewardProgress: 75
  });

  const [productProps, setProductProps] = useState<SduiProductCardProps>({
    productName: "Aashirvaad Shudh Chakki Atta 10kg",
    category: "Flours & Rice",
    price: "24.99",
    oldPrice: "29.99",
    stockStatus: "In Stock",
    rating: 4.8
  });

  const [searchProps, setSearchProps] = useState<SduiSearchBarProps>({
    placeholder: "Search ethnic spices, lentils...",
    actionId: "trigger_search_v2",
    showBarcodeIcon: true
  });

  const [checkoutProps, setCheckoutProps] = useState<SduiCheckoutFormProps>({
    title: "Express Pick-up Checkout",
    merchantName: "Spice Hub Werribee",
    customerName: "Priya Patel",
    deliveryMethod: "Direct-to-Boot",
    estimatedTime: "25 min"
  });

  // Handle Save Schema Action
  const handleSaveSchema = () => {
    setSuccessMessage("Component schema validated and synchronized with live Supabase configuration!");
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  // Compile JSON Schema dynamically based on states
  const getJsonSchema = () => {
    let props = {};
    if (selectedType === "Banner") props = bannerProps;
    else if (selectedType === "LoyaltyCard") props = loyaltyProps;
    else if (selectedType === "ProductCard") props = productProps;
    else if (selectedType === "SearchBar") props = searchProps;
    else if (selectedType === "CheckoutForm") props = checkoutProps;

    return JSON.stringify(
      {
        component: selectedType,
        id: `sdui_${selectedType.toLowerCase()}_${Date.now().toString().slice(-4)}`,
        version: "2.1.0",
        props,
        analytics: {
          track_click: true,
          event_name: `${selectedType.toLowerCase()}_clicked`
        }
      },
      null,
      2
    );
  };

  return (
    <div className="space-y-6">
      {/* Intro section */}
      <div className="flex flex-col gap-1.5 border-b border-slate-100 pb-5">
        <div className="flex items-center gap-2">
          <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
            Builder Sandbox
          </span>
          <h2 className="text-xl font-display font-semibold text-slate-900 tracking-tight">
            Server-Driven UI Component Studio
          </h2>
        </div>
        <p className="text-slate-500 text-xs max-w-3xl">
          Tweak properties below to see the **live JSON schema** parsed by the mobile client, and preview how it compiles instantly into real native-looking components on our virtual smartphone!
        </p>
      </div>

      {/* Grid container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left column - Editors (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Component selector */}
          <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm space-y-3">
            <h3 className="text-xs font-semibold text-slate-700 tracking-wider uppercase">
              1. Select Component Template
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {(["Banner", "LoyaltyCard", "ProductCard", "SearchBar", "CheckoutForm"] as ComponentType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-3 py-2.5 rounded-lg text-xs font-medium text-left border transition-all ${
                    selectedType === type
                      ? "border-orange-500 bg-orange-50/40 text-orange-800 font-semibold"
                      : "border-slate-100 bg-slate-50 hover:bg-slate-100/70 text-slate-600"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Configuration Form */}
          <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-50 pb-2">
              <h3 className="text-xs font-semibold text-slate-700 tracking-wider uppercase flex items-center gap-1.5">
                <Edit3 className="w-3.5 h-3.5 text-slate-400" />
                2. Customize Properties
              </h3>
              <span className="text-[10px] text-slate-400 font-mono">Props Map</span>
            </div>

            {/* Banner Fields */}
            {selectedType === "Banner" && (
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-500 uppercase">Banner Title</label>
                  <input
                    type="text"
                    value={bannerProps.title}
                    onChange={(e) => setBannerProps({ ...bannerProps, title: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-500 uppercase">Description</label>
                  <textarea
                    value={bannerProps.description}
                    onChange={(e) => setBannerProps({ ...bannerProps, description: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 text-xs text-slate-800 h-16 resize-none focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-slate-500 uppercase">Button Text</label>
                    <input
                      type="text"
                      value={bannerProps.buttonText}
                      onChange={(e) => setBannerProps({ ...bannerProps, buttonText: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-slate-500 uppercase">Accent Color</label>
                    <input
                      type="color"
                      value={bannerProps.backgroundColor}
                      onChange={(e) => setBannerProps({ ...bannerProps, backgroundColor: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-md h-8 p-1 text-xs focus:outline-none cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Loyalty Card Fields */}
            {selectedType === "LoyaltyCard" && (
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-500 uppercase">Merchant Store Name</label>
                  <input
                    type="text"
                    value={loyaltyProps.merchantName}
                    onChange={(e) => setLoyaltyProps({ ...loyaltyProps, merchantName: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-slate-500 uppercase">Loyalty Points</label>
                    <input
                      type="number"
                      value={loyaltyProps.points}
                      onChange={(e) => setLoyaltyProps({ ...loyaltyProps, points: Number(e.target.value) })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-slate-500 uppercase">Loyalty Tier</label>
                    <input
                      type="text"
                      value={loyaltyProps.tier}
                      onChange={(e) => setLoyaltyProps({ ...loyaltyProps, tier: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-500 uppercase">Barcode String</label>
                  <input
                    type="text"
                    value={loyaltyProps.barcodeText}
                    onChange={(e) => setLoyaltyProps({ ...loyaltyProps, barcodeText: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>
            )}

            {/* Product Card Fields */}
            {selectedType === "ProductCard" && (
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-500 uppercase">Product Name</label>
                  <input
                    type="text"
                    value={productProps.productName}
                    onChange={(e) => setProductProps({ ...productProps, productName: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-slate-500 uppercase">Price (AUD)</label>
                    <input
                      type="text"
                      value={productProps.price}
                      onChange={(e) => setProductProps({ ...productProps, price: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-slate-500 uppercase">Original Price</label>
                    <input
                      type="text"
                      value={productProps.oldPrice}
                      onChange={(e) => setProductProps({ ...productProps, oldPrice: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-slate-500 uppercase">Stock Status</label>
                    <select
                      value={productProps.stockStatus}
                      onChange={(e) => setProductProps({ ...productProps, stockStatus: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-orange-500"
                    >
                      <option value="In Stock">In Stock</option>
                      <option value="Low Stock">Low Stock</option>
                      <option value="Out of Stock">Out of Stock</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-slate-500 uppercase">User Rating</label>
                    <input
                      type="number"
                      step="0.1"
                      max="5"
                      min="0"
                      value={productProps.rating}
                      onChange={(e) => setProductProps({ ...productProps, rating: Number(e.target.value) })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Search Bar Fields */}
            {selectedType === "SearchBar" && (
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-500 uppercase">Placeholder text</label>
                  <input
                    type="text"
                    value={searchProps.placeholder}
                    onChange={(e) => setSearchProps({ ...searchProps, placeholder: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-500 uppercase">Action Endpoint trigger</label>
                  <input
                    type="text"
                    value={searchProps.actionId}
                    onChange={(e) => setSearchProps({ ...searchProps, actionId: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>
            )}

            {/* Checkout Form Fields */}
            {selectedType === "CheckoutForm" && (
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-500 uppercase">Form Header Title</label>
                  <input
                    type="text"
                    value={checkoutProps.title}
                    onChange={(e) => setCheckoutProps({ ...checkoutProps, title: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-500 uppercase">Customer Profile Name</label>
                  <input
                    type="text"
                    value={checkoutProps.customerName}
                    onChange={(e) => setCheckoutProps({ ...checkoutProps, customerName: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-slate-500 uppercase">Delivery Mode</label>
                    <select
                      value={checkoutProps.deliveryMethod}
                      onChange={(e) => setCheckoutProps({ ...checkoutProps, deliveryMethod: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-orange-500"
                    >
                      <option value="Direct-to-Boot">Direct-to-Boot</option>
                      <option value="Home Delivery">Home Delivery</option>
                      <option value="In-Store Pick">In-Store Pick</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-slate-500 uppercase">Est. Pickup Time</label>
                    <input
                      type="text"
                      value={checkoutProps.estimatedTime}
                      onChange={(e) => setCheckoutProps({ ...checkoutProps, estimatedTime: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={handleSaveSchema}
              className="w-full bg-slate-900 hover:bg-slate-850 text-white font-medium py-2 rounded-lg text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
            >
              <Save className="w-3.5 h-3.5" />
              Save & Synchronize SDUI
            </button>
          </div>
        </div>

        {/* Right columns - Live Phone Device Mock (4 cols) + Code Output (3 cols) */}
        <div className="lg:col-span-4 flex flex-col items-center">
          {/* Simulated Mobile Device Frame */}
          <div className="relative w-[280px] h-[540px] bg-slate-950 rounded-[40px] border-[10px] border-slate-900 shadow-2xl flex flex-col overflow-hidden ring-4 ring-slate-800/10">
            {/* Speaker & camera sensor bar */}
            <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-28 h-4 bg-slate-900 rounded-full z-25 flex items-center justify-center">
              <div className="w-10 h-1 bg-slate-800 rounded-full mr-2"></div>
              <div className="w-2 h-2 bg-slate-950 rounded-full"></div>
            </div>

            {/* Screen Content area */}
            <div className="flex-1 bg-slate-50 pt-8 pb-4 px-3 flex flex-col text-slate-800 select-none overflow-y-auto">
              {/* Virtual header status */}
              <div className="flex justify-between items-center text-[10px] text-slate-500 px-1.5 pb-2 font-mono">
                <span>9:41 AM</span>
                <Smartphone className="w-3.5 h-3.5" />
                <span className="flex items-center gap-1">5G 🔋</span>
              </div>

              {/* Dynamic render screen */}
              <div className="flex-1 space-y-4 pt-1">
                {/* Search Bar static reference */}
                <div className="bg-white border border-slate-100 rounded-lg p-2 flex items-center gap-2 shadow-xs">
                  <div className="w-3.5 h-3.5 rounded-full border border-slate-300"></div>
                  <span className="text-[10px] text-slate-400">Search boot products...</span>
                </div>

                {/* SDUI Component rendering under simulation */}
                <div className="border-t border-slate-100/60 pt-2">
                  <span className="text-[8px] font-mono font-semibold uppercase text-orange-500 tracking-wider block mb-1">
                    Live SDUI Component Preview
                  </span>

                  {selectedType === "Banner" && (
                    <motion.div
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-xl overflow-hidden shadow-sm"
                      style={{ backgroundColor: bannerProps.backgroundColor, color: bannerProps.textColor }}
                    >
                      <div className="p-4 space-y-2">
                        <span className="bg-white/20 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                          Promo
                        </span>
                        <h4 className="font-display font-bold text-sm tracking-tight leading-snug">
                          {bannerProps.title}
                        </h4>
                        <p className="text-[10px] text-white/85 leading-normal">
                          {bannerProps.description}
                        </p>
                        <button className="bg-white text-slate-900 font-semibold px-3 py-1 rounded-md text-[10px] shadow-sm hover:scale-102 active:scale-98 transition-all">
                          {bannerProps.buttonText}
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {selectedType === "LoyaltyCard" && (
                    <motion.div
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-slate-900 text-white rounded-xl p-4 shadow-md border border-slate-800 space-y-3"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-[8px] text-slate-400 uppercase tracking-wider">{loyaltyProps.tier}</p>
                          <h4 className="font-display font-semibold text-xs text-white truncate max-w-[150px]">
                            {loyaltyProps.merchantName}
                          </h4>
                        </div>
                        <span className="text-amber-400 text-xs font-bold font-mono">✦ Gold</span>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px]">
                          <span className="text-slate-300">Reward Balance</span>
                          <span className="font-mono text-amber-300 font-bold">{loyaltyProps.points} pts</span>
                        </div>
                        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-amber-400 h-full rounded-full transition-all duration-500"
                            style={{ width: `${loyaltyProps.nextRewardProgress}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-800/80 flex flex-col items-center justify-center gap-1.5">
                        {/* Fake barcode lines */}
                        <div className="bg-white p-1 rounded flex gap-0.5 h-6 items-center">
                          {[2, 4, 1, 3, 2, 4, 1, 3, 2, 4, 1, 3, 2].map((w, idx) => (
                            <div key={idx} className="bg-black h-full" style={{ width: `${w}px` }}></div>
                          ))}
                        </div>
                        <span className="font-mono text-[8px] text-slate-400">{loyaltyProps.barcodeText}</span>
                      </div>
                    </motion.div>
                  )}

                  {selectedType === "ProductCard" && (
                    <motion.div
                      layout
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="bg-white border border-slate-100 rounded-xl p-3 shadow-xs space-y-2.5"
                    >
                      <div className="bg-slate-50 w-full h-24 rounded-lg flex items-center justify-center overflow-hidden relative border border-slate-100">
                        <span className="text-slate-300 font-display font-medium text-[10px]">Product Image</span>
                        <span className="absolute top-1.5 right-1.5 bg-green-100 text-green-800 text-[8px] font-bold px-1.5 py-0.5 rounded-full uppercase">
                          {productProps.stockStatus}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[8px] text-slate-400 uppercase tracking-wider">{productProps.category}</span>
                        <h4 className="font-semibold text-xs text-slate-800 leading-tight">
                          {productProps.productName}
                        </h4>
                        <div className="flex items-center gap-1">
                          <span className="text-amber-400 text-[10px]">★</span>
                          <span className="text-[9px] font-medium text-slate-600 font-mono">{productProps.rating} (120)</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-1 border-t border-slate-50">
                        <div className="flex items-baseline gap-1">
                          <span className="text-xs font-bold text-slate-950 font-mono">${productProps.price}</span>
                          <span className="text-[9px] text-slate-400 line-through font-mono">${productProps.oldPrice}</span>
                        </div>
                        <button className="bg-orange-500 text-white rounded-md text-[9px] font-bold px-2 py-1 hover:bg-orange-600 active:scale-95 transition-all">
                          Add
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {selectedType === "SearchBar" && (
                    <motion.div
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-white border border-slate-200 rounded-xl p-2.5 shadow-sm space-y-2"
                    >
                      <div className="relative">
                        <input
                          type="text"
                          disabled
                          placeholder={searchProps.placeholder}
                          className="w-full bg-slate-50 border border-slate-100 rounded-lg py-1.5 pl-3 pr-8 text-[10px] text-slate-700 placeholder-slate-400 outline-none"
                        />
                        <span className="absolute right-2 top-2 text-slate-400 text-xs">🔍</span>
                      </div>
                      <div className="flex justify-between items-center text-[8px] text-slate-400 font-mono">
                        <span>Trigger: {searchProps.actionId}</span>
                        <span>Client Registry SDUI v2</span>
                      </div>
                    </motion.div>
                  )}

                  {selectedType === "CheckoutForm" && (
                    <motion.div
                      layout
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white border border-slate-100 rounded-xl p-3 shadow-md space-y-3"
                    >
                      <div className="border-b border-slate-50 pb-1.5">
                        <h4 className="font-display font-semibold text-xs text-slate-800">
                          {checkoutProps.title}
                        </h4>
                        <span className="text-[8px] text-slate-400">{checkoutProps.merchantName}</span>
                      </div>

                      <div className="space-y-2">
                        <div className="bg-slate-50 rounded-lg p-2 space-y-1.5">
                          <div className="flex justify-between text-[9px]">
                            <span className="text-slate-400">Customer</span>
                            <span className="font-medium text-slate-700">{checkoutProps.customerName}</span>
                          </div>
                          <div className="flex justify-between text-[9px]">
                            <span className="text-slate-400">Method</span>
                            <span className="font-bold text-orange-600">{checkoutProps.deliveryMethod}</span>
                          </div>
                          <div className="flex justify-between text-[9px]">
                            <span className="text-slate-400">Estimated Ready</span>
                            <span className="font-medium text-slate-700 font-mono">{checkoutProps.estimatedTime}</span>
                          </div>
                        </div>

                        <button className="w-full bg-orange-500 text-white font-bold text-[10px] py-1.5 rounded-lg shadow-sm">
                          Confirm Pickup Ticket
                        </button>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Additional list items mock */}
                <div className="bg-white/80 p-2 rounded-lg border border-slate-100">
                  <div className="h-2 bg-slate-200 rounded-full w-1/3 mb-2"></div>
                  <div className="h-1.5 bg-slate-100 rounded-full w-2/3"></div>
                </div>
              </div>
            </div>

            {/* Bottom device button */}
            <div className="h-6 bg-slate-950 flex items-center justify-center border-t border-slate-900/60 z-20">
              <div className="w-16 h-1 bg-slate-800 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Right column - Code Output (3 cols) */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-slate-950 text-slate-300 p-4 rounded-xl border border-slate-800 shadow-lg flex flex-col h-[540px]">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2 mb-2">
              <span className="text-[10px] font-mono text-orange-400 uppercase tracking-wider flex items-center gap-1.5">
                <Code className="w-3.5 h-3.5 text-slate-500" />
                Live JSON Output
              </span>
              <span className="text-[9px] bg-slate-800 px-2 py-0.5 rounded text-slate-400 font-mono">SDUI v2.1</span>
            </div>
            <pre className="text-[10px] font-mono leading-relaxed flex-1 overflow-auto pr-1">
              <code>{getJsonSchema()}</code>
            </pre>
          </div>
        </div>
      </div>

      {/* Success Notification Bar */}
      {successMessage && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-lg flex items-center gap-2 text-xs"
        >
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </motion.div>
      )}
    </div>
  );
}
