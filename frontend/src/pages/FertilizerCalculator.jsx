import { useState } from "react";
import {
  FaCalculator,
  FaSeedling,
  FaCoins,
  FaPrint,
  FaBalanceScale,
  FaUndo,
  FaInfoCircle,
  FaFlask,
} from "react-icons/fa";

function FertilizerCalculator() {
  // Preset recommendations per acre (N, P, K in kg/acre)
  const CROP_PRESETS = {
    "Paddy (Rice / நெல்)": { N: 50, P: 20, K: 20, pricePerUnit: 22500, yieldPerAcre: 2.4, unitName: "Tons" },
    "Sugarcane (கரும்பு)": { N: 110, P: 30, K: 45, pricePerUnit: 3500, yieldPerAcre: 45, unitName: "Tons" },
    "Banana (வாழை)": { N: 85, P: 25, K: 120, pricePerUnit: 18000, yieldPerAcre: 20, unitName: "Tons" },
    "Tapioca (மரவள்ளி)": { N: 36, P: 24, K: 72, pricePerUnit: 12000, yieldPerAcre: 14, unitName: "Tons" },
    "Groundnut (நிலக்கடலை)": { N: 10, P: 20, K: 30, pricePerUnit: 68000, yieldPerAcre: 1.2, unitName: "Tons" },
    "Turmeric (மஞ்சள்)": { N: 60, P: 25, K: 40, pricePerUnit: 85000, yieldPerAcre: 10, unitName: "Tons" },
    "Cotton (பருத்தி)": { N: 40, P: 20, K: 20, pricePerUnit: 62000, yieldPerAcre: 1.3, unitName: "Tons" },
    "Maize (மக்காச்சோளம்)": { N: 55, P: 25, K: 20, pricePerUnit: 21500, yieldPerAcre: 2.8, unitName: "Tons" },
    "Coconut (தென்னை)": { N: 45, P: 25, K: 90, pricePerUnit: 15, yieldPerAcre: 5000, unitName: "Nuts" },
    "Custom Crop": { N: 40, P: 20, K: 20, pricePerUnit: 20000, yieldPerAcre: 2, unitName: "Tons" },
  };

  // State inputs
  const [crop, setCrop] = useState("Paddy (Rice / நெல்)");
  const [farmArea, setFarmArea] = useState(1);
  const [areaUnit, setAreaUnit] = useState("Acre"); // "Acre" | "Hectare"
  const [soilType, setSoilType] = useState("Loamy");

  // Nutrient requirements per acre
  const [nReq, setNReq] = useState(50);
  const [pReq, setPReq] = useState(20);
  const [kReq, setKReq] = useState(20);

  // Commercial Fertilizer Nutrient % Defaults
  const [ureaNPercent, setUreaNPercent] = useState(46); // Urea = 46% N
  const [dapPPercent, setDapPPercent] = useState(46);   // DAP = 46% P, 18% N
  const [dapNPercent, setDapNPercent] = useState(18);
  const [mopKPercent, setMopKPercent] = useState(60);   // MOP = 60% K

  // Commercial Fertilizer bag prices (₹ per 50kg bag)
  const [ureaPrice, setUreaPrice] = useState(270);
  const [dapPrice, setDapPrice] = useState(1350);
  const [mopPrice, setMopPrice] = useState(1700);

  // Error state
  const [errorMsg, setErrorMsg] = useState("");

  // Results state
  const [results, setResults] = useState(null);

  // Handle crop change & auto-populate NPK preset
  const handleCropChange = (selectedCrop) => {
    setCrop(selectedCrop);
    if (CROP_PRESETS[selectedCrop]) {
      setNReq(CROP_PRESETS[selectedCrop].N);
      setPReq(CROP_PRESETS[selectedCrop].P);
      setKReq(CROP_PRESETS[selectedCrop].K);
    }
  };

  // Calculation Logic
  const calculateFertilizers = () => {
    setErrorMsg("");

    const area = parseFloat(farmArea);
    if (isNaN(area) || area <= 0) {
      setErrorMsg("Please enter a valid positive farm area.");
      return;
    }

    if (nReq < 0 || pReq < 0 || kReq < 0) {
      setErrorMsg("Nutrient requirements cannot be negative.");
      return;
    }

    if (ureaNPercent <= 0 || dapPPercent <= 0 || mopKPercent <= 0) {
      setErrorMsg("Fertilizer nutrient percentages must be greater than 0%.");
      return;
    }

    // Convert area to Acres for formula calculation
    const effectiveAcres = areaUnit === "Hectare" ? area * 2.47105 : area;

    // Total required N, P, K in kg
    const totalN = nReq * effectiveAcres;
    const totalP = pReq * effectiveAcres;
    const totalK = kReq * effectiveAcres;

    // Formula: Required Fertilizer Quantity (kg) = Required Nutrient (kg) / (Nutrient Percentage / 100)
    // 1. Calculate DAP needed for Phosphorus (P)
    const dapQtyKg = totalP / (dapPPercent / 100);
    const dapBags = dapQtyKg / 50;

    // DAP also supplies Nitrogen (dapNPercent / 100)
    const nFromDap = dapQtyKg * (dapNPercent / 100);

    // 2. Remaining Nitrogen supplied by Urea
    const remainingN = Math.max(0, totalN - nFromDap);
    const ureaQtyKg = remainingN / (ureaNPercent / 100);
    const ureaBags = ureaQtyKg / 50;

    // 3. MOP needed for Potassium (K)
    const mopQtyKg = totalK / (mopKPercent / 100);
    const mopBags = mopQtyKg / 50;

    // Total fertilizer weight
    const totalFertilizerKg = ureaQtyKg + dapQtyKg + mopQtyKg;

    // Estimated costs
    const ureaCost = Math.ceil(ureaBags) * ureaPrice;
    const dapCost = Math.ceil(dapBags) * dapPrice;
    const mopCost = Math.ceil(mopBags) * mopPrice;
    const totalCost = ureaCost + dapCost + mopCost;

    setResults({
      effectiveAcres: effectiveAcres.toFixed(2),
      totalN: totalN.toFixed(1),
      totalP: totalP.toFixed(1),
      totalK: totalK.toFixed(1),
      ureaQtyKg: ureaQtyKg.toFixed(1),
      ureaBags: Math.ceil(ureaBags),
      dapQtyKg: dapQtyKg.toFixed(1),
      dapBags: Math.ceil(dapBags),
      mopQtyKg: mopQtyKg.toFixed(1),
      mopBags: Math.ceil(mopBags),
      totalFertilizerKg: totalFertilizerKg.toFixed(1),
      ureaCost,
      dapCost,
      mopCost,
      totalCost,
    });
  };

  const handleReset = () => {
    setCrop("Paddy (Rice / நெல்)");
    setFarmArea(1);
    setAreaUnit("Acre");
    setSoilType("Loamy");
    setNReq(50);
    setPReq(20);
    setKReq(20);
    setUreaNPercent(46);
    setDapPPercent(46);
    setDapNPercent(18);
    setMopKPercent(60);
    setUreaPrice(270);
    setDapPrice(1350);
    setMopPrice(1700);
    setErrorMsg("");
    setResults(null);
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-8 print:p-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 flex items-center gap-3">
            <FaCalculator className="text-emerald-600" /> Fertilizer Calculator
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Calculate exact N-P-K nutrient requirements and commercial fertilizer bag quantities for your field.
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 bg-slate-900 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow hover:bg-slate-800 transition print:hidden self-start sm:self-auto"
        >
          <FaPrint /> Print Calculation
        </button>
      </div>

      {/* Calculator Input Form */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-slate-100 space-y-6">
        <h2 className="text-lg font-black text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3">
          <FaSeedling className="text-emerald-600" /> 1. Crop & Soil Information
        </h2>

        {errorMsg && (
          <div className="bg-red-50 text-red-800 border border-red-200 p-3.5 rounded-xl text-xs font-bold">
            ⚠️ {errorMsg}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Crop Dropdown */}
          <div>
            <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">
              Crop (பயிர்)
            </label>
            <select
              value={crop}
              onChange={(e) => handleCropChange(e.target.value)}
              className="w-full border border-slate-300 rounded-xl p-3 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500 outline-none"
            >
              {Object.keys(CROP_PRESETS).map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Farm Area */}
          <div>
            <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">
              Farm Area
            </label>
            <input
              type="number"
              min="0.1"
              step="0.5"
              value={farmArea}
              onChange={(e) => setFarmArea(e.target.value)}
              className="w-full border border-slate-300 rounded-xl p-3 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>

          {/* Area Unit */}
          <div>
            <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">
              Area Unit
            </label>
            <select
              value={areaUnit}
              onChange={(e) => setAreaUnit(e.target.value)}
              className="w-full border border-slate-300 rounded-xl p-3 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500 outline-none"
            >
              <option value="Acre">Acre (ஏக்கர்)</option>
              <option value="Hectare">Hectare (ஹெக்டேர்)</option>
            </select>
          </div>

          {/* Soil Type */}
          <div>
            <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">
              Soil Type (மண் வகை)
            </label>
            <select
              value={soilType}
              onChange={(e) => setSoilType(e.target.value)}
              className="w-full border border-slate-300 rounded-xl p-3 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500 outline-none"
            >
              <option value="Clay">Clay Soil</option>
              <option value="Sandy">Sandy Soil</option>
              <option value="Loamy">Loamy Soil</option>
              <option value="Silty">Silty Soil</option>
              <option value="Black">Black Soil</option>
              <option value="Red">Red Soil</option>
              <option value="Alluvial">Alluvial Soil</option>
              <option value="Laterite">Laterite Soil</option>
            </select>
          </div>
        </div>

        {/* N-P-K Requirements per Acre */}
        <div className="pt-4 border-t border-slate-100 space-y-4">
          <h3 className="text-sm font-black text-slate-800 flex items-center gap-2">
            <FaFlask className="text-purple-600" /> Nutrient Requirements (kg per Acre)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100">
              <label className="block text-xs font-black text-emerald-800 mb-1">
                Nitrogen (N) Requirement
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  value={nReq}
                  onChange={(e) => setNReq(parseFloat(e.target.value) || 0)}
                  className="w-full border border-emerald-300 bg-white rounded-xl p-2.5 text-sm font-black text-slate-800 outline-none"
                />
                <span className="text-xs font-bold text-slate-500">kg/acre</span>
              </div>
            </div>

            <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100">
              <label className="block text-xs font-black text-blue-800 mb-1">
                Phosphorus (P) Requirement
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  value={pReq}
                  onChange={(e) => setPReq(parseFloat(e.target.value) || 0)}
                  className="w-full border border-blue-300 bg-white rounded-xl p-2.5 text-sm font-black text-slate-800 outline-none"
                />
                <span className="text-xs font-bold text-slate-500">kg/acre</span>
              </div>
            </div>

            <div className="bg-purple-50/50 p-4 rounded-2xl border border-purple-100">
              <label className="block text-xs font-black text-purple-800 mb-1">
                Potassium (K) Requirement
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  value={kReq}
                  onChange={(e) => setKReq(parseFloat(e.target.value) || 0)}
                  className="w-full border border-purple-300 bg-white rounded-xl p-2.5 text-sm font-black text-slate-800 outline-none"
                />
                <span className="text-xs font-bold text-slate-500">kg/acre</span>
              </div>
            </div>
          </div>
        </div>

        {/* Commercial Fertilizer Percentages & Prices */}
        <div className="pt-4 border-t border-slate-100 space-y-4">
          <h3 className="text-sm font-black text-slate-800">
            Commercial Fertilizer Specifications & Prices (50kg bag)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {/* Urea */}
            <div className="bg-slate-50 p-4 rounded-2xl space-y-2 border border-slate-200">
              <span className="text-xs font-extrabold text-slate-800">Urea (46% N)</span>
              <div className="flex items-center gap-2 text-xs">
                <span className="w-20 font-bold text-slate-500">N Content:</span>
                <input
                  type="number"
                  value={ureaNPercent}
                  onChange={(e) => setUreaNPercent(parseFloat(e.target.value) || 46)}
                  className="w-16 border rounded-lg p-1 font-bold text-slate-800 text-center"
                />
                <span className="font-bold">%</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="w-20 font-bold text-slate-500">Bag Price:</span>
                <span className="font-bold">₹</span>
                <input
                  type="number"
                  value={ureaPrice}
                  onChange={(e) => setUreaPrice(parseFloat(e.target.value) || 0)}
                  className="w-20 border rounded-lg p-1 font-bold text-slate-800"
                />
              </div>
            </div>

            {/* DAP */}
            <div className="bg-slate-50 p-4 rounded-2xl space-y-2 border border-slate-200">
              <span className="text-xs font-extrabold text-slate-800">DAP (18% N, 46% P)</span>
              <div className="flex items-center gap-2 text-xs">
                <span className="w-20 font-bold text-slate-500">P Content:</span>
                <input
                  type="number"
                  value={dapPPercent}
                  onChange={(e) => setDapPPercent(parseFloat(e.target.value) || 46)}
                  className="w-16 border rounded-lg p-1 font-bold text-slate-800 text-center"
                />
                <span className="font-bold">%</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="w-20 font-bold text-slate-500">Bag Price:</span>
                <span className="font-bold">₹</span>
                <input
                  type="number"
                  value={dapPrice}
                  onChange={(e) => setDapPrice(parseFloat(e.target.value) || 0)}
                  className="w-20 border rounded-lg p-1 font-bold text-slate-800"
                />
              </div>
            </div>

            {/* MOP */}
            <div className="bg-slate-50 p-4 rounded-2xl space-y-2 border border-slate-200">
              <span className="text-xs font-extrabold text-slate-800">MOP (60% K)</span>
              <div className="flex items-center gap-2 text-xs">
                <span className="w-20 font-bold text-slate-500">K Content:</span>
                <input
                  type="number"
                  value={mopKPercent}
                  onChange={(e) => setMopKPercent(parseFloat(e.target.value) || 60)}
                  className="w-16 border rounded-lg p-1 font-bold text-slate-800 text-center"
                />
                <span className="font-bold">%</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="w-20 font-bold text-slate-500">Bag Price:</span>
                <span className="font-bold">₹</span>
                <input
                  type="number"
                  value={mopPrice}
                  onChange={(e) => setMopPrice(parseFloat(e.target.value) || 0)}
                  className="w-20 border rounded-lg p-1 font-bold text-slate-800"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-2 px-5 py-3 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 transition"
          >
            <FaUndo /> Reset
          </button>
          <button
            type="button"
            onClick={calculateFertilizers}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-8 py-3 rounded-xl shadow-md transition"
          >
            <FaCalculator /> Calculate Requirement
          </button>
        </div>
      </div>

      {/* Results Output Section */}
      {results && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Required Pure Nutrients */}
            <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-100 space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
                1. Required Nutrients ({results.effectiveAcres} Acres)
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center bg-emerald-50 p-3 rounded-xl">
                  <span className="text-xs font-bold text-emerald-900">Nitrogen (N)</span>
                  <span className="text-base font-black text-emerald-700">{results.totalN} kg</span>
                </div>
                <div className="flex justify-between items-center bg-blue-50 p-3 rounded-xl">
                  <span className="text-xs font-bold text-blue-900">Phosphorus (P)</span>
                  <span className="text-base font-black text-blue-700">{results.totalP} kg</span>
                </div>
                <div className="flex justify-between items-center bg-purple-50 p-3 rounded-xl">
                  <span className="text-xs font-bold text-purple-900">Potassium (K)</span>
                  <span className="text-base font-black text-purple-700">{results.totalK} kg</span>
                </div>
              </div>
            </div>

            {/* Recommended Commercial Fertilizer Quantity */}
            <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-100 space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
                2. Recommended Fertilizer Quantity
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl">
                  <div>
                    <p className="text-xs font-bold text-slate-800">Urea ({ureaNPercent}% N)</p>
                    <p className="text-[10px] text-slate-500">{results.ureaQtyKg} kg total</p>
                  </div>
                  <span className="text-lg font-black text-emerald-600">{results.ureaBags} Bags</span>
                </div>
                <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl">
                  <div>
                    <p className="text-xs font-bold text-slate-800">DAP ({dapPPercent}% P)</p>
                    <p className="text-[10px] text-slate-500">{results.dapQtyKg} kg total</p>
                  </div>
                  <span className="text-lg font-black text-blue-600">{results.dapBags} Bags</span>
                </div>
                <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl">
                  <div>
                    <p className="text-xs font-bold text-slate-800">MOP ({mopKPercent}% K)</p>
                    <p className="text-[10px] text-slate-500">{results.mopQtyKg} kg total</p>
                  </div>
                  <span className="text-lg font-black text-purple-600">{results.mopBags} Bags</span>
                </div>
              </div>
            </div>

            {/* Financial Cost Card */}
            <div className="bg-gradient-to-br from-emerald-800 to-slate-900 text-white rounded-3xl p-6 shadow-xl flex flex-col justify-between space-y-4">
              <div>
                <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-extrabold uppercase tracking-wider text-emerald-200">
                  Estimated Expenditure
                </span>
                <div className="mt-4">
                  <p className="text-xs text-emerald-200 font-medium">Total Fertilizer Cost</p>
                  <h3 className="text-4xl font-black text-amber-400 mt-1">
                    ₹{results.totalCost.toLocaleString("en-IN")}
                  </h3>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/20 text-xs space-y-1">
                <p className="flex items-center justify-between text-emerald-200">
                  <span>Urea Cost:</span> <span>₹{results.ureaCost}</span>
                </p>
                <p className="flex items-center justify-between text-emerald-200">
                  <span>DAP Cost:</span> <span>₹{results.dapCost}</span>
                </p>
                <p className="flex items-center justify-between text-emerald-200">
                  <span>MOP Cost:</span> <span>₹{results.mopCost}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Formula Breakdown Card */}
          <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-100 space-y-3">
            <h4 className="text-xs font-extrabold text-slate-800 flex items-center gap-2">
              <FaBalanceScale className="text-emerald-600" /> Calculation Breakdown Formula
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              <strong>Formula:</strong> Required Commercial Fertilizer Quantity = Required Nutrient Quantity / (Nutrient Percentage / 100).
              For example, {results.totalN} kg Nitrogen required ÷ (46% Urea N) = {results.ureaQtyKg} kg Urea (~{results.ureaBags} bags of 50kg).
            </p>
          </div>
        </div>
      )}

      {/* Mandatory Soil Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl text-xs text-amber-900 flex items-start gap-3">
        <FaInfoCircle className="text-amber-600 text-lg flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="font-extrabold uppercase tracking-wider text-[10px]">Disclaimer</h4>
          <p className="mt-0.5 leading-relaxed">
            Fertilizer requirements are estimates based on standard crop recommendation models. Actual application should be based on soil testing and local agricultural extension recommendations.
          </p>
        </div>
      </div>
    </div>
  );
}

export default FertilizerCalculator;
