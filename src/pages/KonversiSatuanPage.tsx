import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { Calculator, ArrowRight, RefreshCw } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";

type UnitCategory = {
  id: string;
  name: string;
  icon: string;
  units: {
    name: string;
    symbol: string;
    toBase: number; // Factor to convert to base unit
  }[];
  baseUnit: string;
};

const unitCategories: UnitCategory[] = [
  {
    id: "panjang",
    name: "Panjang",
    icon: "📏",
    baseUnit: "m",
    units: [
      { name: "Kilometer", symbol: "km", toBase: 1000 },
      { name: "Hektometer", symbol: "hm", toBase: 100 },
      { name: "Dekameter", symbol: "dam", toBase: 10 },
      { name: "Meter", symbol: "m", toBase: 1 },
      { name: "Desimeter", symbol: "dm", toBase: 0.1 },
      { name: "Sentimeter", symbol: "cm", toBase: 0.01 },
      { name: "Milimeter", symbol: "mm", toBase: 0.001 },
      { name: "Inci", symbol: "in", toBase: 0.0254 },
      { name: "Kaki", symbol: "ft", toBase: 0.3048 },
      { name: "Yard", symbol: "yd", toBase: 0.9144 },
      { name: "Mil", symbol: "mi", toBase: 1609.344 },
    ]
  },
  {
    id: "massa",
    name: "Massa/Berat",
    icon: "⚖️",
    baseUnit: "g",
    units: [
      { name: "Kilogram", symbol: "kg", toBase: 1000 },
      { name: "Hektogram", symbol: "hg", toBase: 100 },
      { name: "Dekagram", symbol: "dag", toBase: 10 },
      { name: "Gram", symbol: "g", toBase: 1 },
      { name: "Desigram", symbol: "dg", toBase: 0.1 },
      { name: "Sentigram", symbol: "cg", toBase: 0.01 },
      { name: "Miligram", symbol: "mg", toBase: 0.001 },
      { name: "Ton", symbol: "ton", toBase: 1000000 },
      { name: "Kuintal", symbol: "kw", toBase: 100000 },
      { name: "Ons", symbol: "ons", toBase: 100 },
      { name: "Pon", symbol: "lb", toBase: 453.592 },
    ]
  },
  {
    id: "waktu",
    name: "Waktu",
    icon: "⏱️",
    baseUnit: "s",
    units: [
      { name: "Tahun", symbol: "thn", toBase: 31536000 },
      { name: "Bulan (30 hari)", symbol: "bln", toBase: 2592000 },
      { name: "Minggu", symbol: "mgg", toBase: 604800 },
      { name: "Hari", symbol: "hr", toBase: 86400 },
      { name: "Jam", symbol: "jam", toBase: 3600 },
      { name: "Menit", symbol: "mnt", toBase: 60 },
      { name: "Detik", symbol: "s", toBase: 1 },
      { name: "Milidetik", symbol: "ms", toBase: 0.001 },
    ]
  },
  {
    id: "luas",
    name: "Luas",
    icon: "⬛",
    baseUnit: "m²",
    units: [
      { name: "Kilometer persegi", symbol: "km²", toBase: 1000000 },
      { name: "Hektare", symbol: "ha", toBase: 10000 },
      { name: "Are", symbol: "a", toBase: 100 },
      { name: "Meter persegi", symbol: "m²", toBase: 1 },
      { name: "Desimeter persegi", symbol: "dm²", toBase: 0.01 },
      { name: "Sentimeter persegi", symbol: "cm²", toBase: 0.0001 },
      { name: "Milimeter persegi", symbol: "mm²", toBase: 0.000001 },
      { name: "Acre", symbol: "ac", toBase: 4046.86 },
    ]
  },
  {
    id: "volume",
    name: "Volume",
    icon: "🧊",
    baseUnit: "L",
    units: [
      { name: "Kiloliter", symbol: "kL", toBase: 1000 },
      { name: "Hektoliter", symbol: "hL", toBase: 100 },
      { name: "Dekaliter", symbol: "daL", toBase: 10 },
      { name: "Liter", symbol: "L", toBase: 1 },
      { name: "Desiliter", symbol: "dL", toBase: 0.1 },
      { name: "Sentiliter", symbol: "cL", toBase: 0.01 },
      { name: "Mililiter", symbol: "mL", toBase: 0.001 },
      { name: "Meter kubik", symbol: "m³", toBase: 1000 },
      { name: "Desimeter kubik", symbol: "dm³", toBase: 1 },
      { name: "Sentimeter kubik", symbol: "cm³", toBase: 0.001 },
      { name: "Galon (US)", symbol: "gal", toBase: 3.78541 },
    ]
  },
  {
    id: "suhu",
    name: "Suhu",
    icon: "🌡️",
    baseUnit: "°C",
    units: [
      { name: "Celsius", symbol: "°C", toBase: 1 },
      { name: "Fahrenheit", symbol: "°F", toBase: 1 },
      { name: "Kelvin", symbol: "K", toBase: 1 },
      { name: "Reamur", symbol: "°R", toBase: 1 },
    ]
  },
  {
    id: "kecepatan",
    name: "Kecepatan",
    icon: "🚀",
    baseUnit: "m/s",
    units: [
      { name: "Meter per detik", symbol: "m/s", toBase: 1 },
      { name: "Kilometer per jam", symbol: "km/h", toBase: 0.277778 },
      { name: "Mil per jam", symbol: "mph", toBase: 0.44704 },
      { name: "Knot", symbol: "kn", toBase: 0.514444 },
    ]
  },
  {
    id: "sudut",
    name: "Sudut",
    icon: "📐",
    baseUnit: "°",
    units: [
      { name: "Derajat", symbol: "°", toBase: 1 },
      { name: "Radian", symbol: "rad", toBase: 57.2958 },
      { name: "Gradian", symbol: "grad", toBase: 0.9 },
      { name: "Menit busur", symbol: "'", toBase: 1/60 },
      { name: "Detik busur", symbol: "\"", toBase: 1/3600 },
    ]
  },
  {
    id: "data",
    name: "Data Digital",
    icon: "💾",
    baseUnit: "B",
    units: [
      { name: "Bit", symbol: "bit", toBase: 0.125 },
      { name: "Byte", symbol: "B", toBase: 1 },
      { name: "Kilobyte", symbol: "KB", toBase: 1024 },
      { name: "Megabyte", symbol: "MB", toBase: 1048576 },
      { name: "Gigabyte", symbol: "GB", toBase: 1073741824 },
      { name: "Terabyte", symbol: "TB", toBase: 1099511627776 },
    ]
  },
];

// Special temperature conversion functions
const convertTemperature = (value: number, from: string, to: string): number => {
  // First convert to Celsius
  let celsius: number;
  switch (from) {
    case "°C":
      celsius = value;
      break;
    case "°F":
      celsius = (value - 32) * 5/9;
      break;
    case "K":
      celsius = value - 273.15;
      break;
    case "°R":
      celsius = value * 5/4;
      break;
    default:
      celsius = value;
  }

  // Then convert from Celsius to target
  switch (to) {
    case "°C":
      return celsius;
    case "°F":
      return (celsius * 9/5) + 32;
    case "K":
      return celsius + 273.15;
    case "°R":
      return celsius * 4/5;
    default:
      return celsius;
  }
};

const KonversiSatuanPage = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>("panjang");
  const [inputValue, setInputValue] = useState<string>("1");
  const [fromUnit, setFromUnit] = useState<string>("m");
  const [toUnit, setToUnit] = useState<string>("cm");
  const [result, setResult] = useState<string>("");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Update units when category changes
  useEffect(() => {
    const category = unitCategories.find(c => c.id === selectedCategory);
    if (category) {
      setFromUnit(category.units[0].symbol);
      setToUnit(category.units[1]?.symbol || category.units[0].symbol);
      setInputValue("1");
      setResult("");
    }
  }, [selectedCategory]);

  // Calculate conversion
  useEffect(() => {
    const value = parseFloat(inputValue);
    if (isNaN(value)) {
      setResult("");
      return;
    }

    const category = unitCategories.find(c => c.id === selectedCategory);
    if (!category) return;

    let convertedValue: number;

    // Special handling for temperature
    if (selectedCategory === "suhu") {
      convertedValue = convertTemperature(value, fromUnit, toUnit);
    } else {
      const fromUnitData = category.units.find(u => u.symbol === fromUnit);
      const toUnitData = category.units.find(u => u.symbol === toUnit);

      if (!fromUnitData || !toUnitData) return;

      // Convert: input -> base -> target
      const baseValue = value * fromUnitData.toBase;
      convertedValue = baseValue / toUnitData.toBase;
    }

    // Format the result
    if (Math.abs(convertedValue) < 0.000001 || Math.abs(convertedValue) > 999999999) {
      setResult(convertedValue.toExponential(6));
    } else {
      setResult(convertedValue.toLocaleString('id-ID', { maximumFractionDigits: 10 }));
    }
  }, [inputValue, fromUnit, toUnit, selectedCategory]);

  const swapUnits = () => {
    playPopSound();
    const temp = fromUnit;
    setFromUnit(toUnit);
    setToUnit(temp);
  };

  const currentCategory = unitCategories.find(c => c.id === selectedCategory);

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <Calculator className="w-12 h-12 text-accent mx-auto mb-4" />
        <h1 className="font-display text-2xl md:text-3xl font-bold text-primary text-glow-cyan mb-2 text-center">
          KONVERSI SATUAN
        </h1>
        <p className="text-white/60 text-sm text-center mb-6 font-body">
          Konversi berbagai satuan pengukuran
        </p>

        {/* Category Selector */}
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mb-6">
          {unitCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => { playPopSound(); setSelectedCategory(category.id); }}
              className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                selectedCategory === category.id
                  ? "bg-accent/20 border-accent text-white"
                  : "bg-card/80 border-border text-white/60 hover:border-white/30"
              }`}
            >
              <span className="text-xl mb-1">{category.icon}</span>
              <span className="text-[10px] font-medium">{category.name}</span>
            </button>
          ))}
        </div>

        {/* Converter */}
        <div className="bg-card/80 backdrop-blur border border-border rounded-xl p-6">
          {/* Input */}
          <div className="mb-4">
            <label className="text-xs text-white/60 mb-2 block">Nilai</label>
            <input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full bg-slate-800/50 border border-white/10 rounded-lg px-4 py-3 text-2xl text-white font-mono focus:outline-none focus:border-accent/60"
              placeholder="Masukkan nilai"
            />
          </div>

          {/* From/To Units */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1">
              <label className="text-xs text-white/60 mb-2 block">Dari</label>
              <select
                value={fromUnit}
                onChange={(e) => { playPopSound(); setFromUnit(e.target.value); }}
                className="w-full bg-slate-800/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent/60"
              >
                {currentCategory?.units.map((unit) => (
                  <option key={unit.symbol} value={unit.symbol}>
                    {unit.name} ({unit.symbol})
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={swapUnits}
              className="mt-6 p-3 bg-accent/20 border border-accent/30 rounded-lg hover:bg-accent/30 transition-colors"
            >
              <RefreshCw className="w-5 h-5 text-accent" />
            </button>

            <div className="flex-1">
              <label className="text-xs text-white/60 mb-2 block">Ke</label>
              <select
                value={toUnit}
                onChange={(e) => { playPopSound(); setToUnit(e.target.value); }}
                className="w-full bg-slate-800/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent/60"
              >
                {currentCategory?.units.map((unit) => (
                  <option key={unit.symbol} value={unit.symbol}>
                    {unit.name} ({unit.symbol})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Result */}
          <div className="bg-gradient-to-br from-accent/10 to-primary/10 border border-accent/30 rounded-xl p-6">
            <div className="text-center">
              <div className="text-sm text-white/60 mb-2">Hasil Konversi</div>
              <div className="flex items-center justify-center gap-3">
                <span className="text-lg text-white/70">{inputValue || "0"} {fromUnit}</span>
                <ArrowRight className="w-5 h-5 text-accent" />
                <span className="text-3xl font-bold text-accent font-mono">
                  {result || "0"}
                </span>
                <span className="text-lg text-white/70">{toUnit}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Reference */}
        <div className="mt-6 bg-card/80 backdrop-blur border border-border rounded-xl p-4">
          <h3 className="text-sm font-bold text-white mb-3">Tangga Konversi {currentCategory?.name}</h3>
          <div className="flex flex-wrap gap-2">
            {currentCategory?.units.slice(0, 8).map((unit, idx) => (
              <div
                key={unit.symbol}
                className="bg-slate-800/50 border border-white/10 rounded-lg px-3 py-2 text-xs"
              >
                <span className="text-white font-medium">{unit.symbol}</span>
                <span className="text-white/40 ml-1">({unit.name})</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => { playPopSound(); navigate("/menu"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body"
          >
            ← Kembali ke Menu
          </button>
        </div>
      </div>
    </div>
  );
};

export default KonversiSatuanPage;
