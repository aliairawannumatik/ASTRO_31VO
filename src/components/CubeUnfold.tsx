import { useState } from "react";

const CubeUnfold = () => {
  // Step 0: full 3D cube
  // Step 1: unfold top face
  // Step 2: unfold left face  
  // Step 3: unfold right face
  // Step 4: unfold bottom face (fully unfolded net)
  const [step, setStep] = useState(0);

  const faceColors = [
    "hsl(190, 100%, 50%)",   // cyan - front
    "hsl(320, 100%, 60%)",   // magenta - back
    "hsl(45, 100%, 55%)",    // gold - top
    "hsl(140, 100%, 50%)",   // green - bottom
    "hsl(260, 80%, 60%)",    // purple - left
    "hsl(10, 90%, 55%)",     // red - right
  ];

  const labels = ["DEPAN", "BELAKANG", "ATAS", "BAWAH", "KIRI", "KANAN"];

  const buttonLabels = [
    "Klik disini! ↑ Buka Atas",
    "Klik disini! ← Buka Kiri",
    "Klik disini! → Buka Kanan",
    "Klik disini! ↓ Buka Bawah",
  ];

  return (
    <div className="flex flex-col items-center gap-6">
      {/* SVG-based progressive unfolding */}
      <div className="relative w-full flex justify-center" style={{ minHeight: 340 }}>
        <svg viewBox="0 0 400 340" className="w-full max-w-md" style={{ overflow: "visible" }}>
          {/* Grid reference: each cell is 70x70, center of cross at (200, 170) */}
          
          {/* FRONT face - always visible in center */}
          <g>
            <rect x="165" y="135" width="70" height="70" rx="4"
              fill={faceColors[0] + "cc"} stroke="hsl(0,0%,80%)" strokeWidth="2" />
            <text x="200" y="175" textAnchor="middle" fontSize="9" fontWeight="bold" fill="white" fontFamily="Orbitron, sans-serif">
              {labels[0]}
            </text>
          </g>

          {/* BACK face - always visible on far right */}
          <g>
            <rect x="305" y="135" width="70" height="70" rx="4"
              fill={faceColors[1] + "cc"} stroke="hsl(0,0%,80%)" strokeWidth="2" />
            <text x="340" y="175" textAnchor="middle" fontSize="9" fontWeight="bold" fill="white" fontFamily="Orbitron, sans-serif">
              {labels[1]}
            </text>
          </g>

          {/* TOP face - unfolds at step 1 */}
          <g style={{
            transition: "transform 0.8s ease-in-out",
            transformOrigin: "200px 135px",
            transform: step >= 1 ? "rotateX(0deg)" : "rotateX(-90deg)",
            opacity: step >= 1 ? 1 : 0.3,
          }}>
            <rect x="165" y="60" width="70" height="70" rx="4"
              fill={faceColors[2] + "cc"} stroke="hsl(0,0%,80%)" strokeWidth="2" />
            <text x="200" y="100" textAnchor="middle" fontSize="9" fontWeight="bold" fill="white" fontFamily="Orbitron, sans-serif">
              {labels[2]}
            </text>
          </g>

          {/* Step 1 button - above top face */}
          {step === 0 && (
            <g onClick={() => setStep(1)} className="cursor-pointer">
              <rect x="145" y="25" width="110" height="28" rx="14" fill="hsl(230, 80%, 55%)" />
              <text x="200" y="44" textAnchor="middle" fontSize="8" fontWeight="bold" fill="white" fontFamily="Orbitron, sans-serif">
                {buttonLabels[0]}
              </text>
            </g>
          )}

          {/* LEFT face - unfolds at step 2 */}
          <g style={{
            transition: "transform 0.8s ease-in-out",
            transformOrigin: "165px 170px",
            transform: step >= 2 ? "rotateY(0deg)" : "rotateY(90deg)",
            opacity: step >= 2 ? 1 : 0.3,
          }}>
            <rect x="90" y="135" width="70" height="70" rx="4"
              fill={faceColors[4] + "cc"} stroke="hsl(0,0%,80%)" strokeWidth="2" />
            <text x="125" y="175" textAnchor="middle" fontSize="9" fontWeight="bold" fill="white" fontFamily="Orbitron, sans-serif">
              {labels[4]}
            </text>
          </g>

          {/* Step 2 button - left of left face */}
          {step === 1 && (
            <g onClick={() => setStep(2)} className="cursor-pointer">
              <rect x="15" y="156" width="110" height="28" rx="14" fill="hsl(230, 80%, 55%)" />
              <text x="70" y="175" textAnchor="middle" fontSize="8" fontWeight="bold" fill="white" fontFamily="Orbitron, sans-serif">
                {buttonLabels[1]}
              </text>
            </g>
          )}

          {/* RIGHT face - unfolds at step 3 */}
          <g style={{
            transition: "transform 0.8s ease-in-out",
            transformOrigin: "235px 170px",
            transform: step >= 3 ? "rotateY(0deg)" : "rotateY(-90deg)",
            opacity: step >= 3 ? 1 : 0.3,
          }}>
            <rect x="240" y="135" width="70" height="70" rx="4"
              fill={faceColors[5] + "cc"} stroke="hsl(0,0%,80%)" strokeWidth="2" />
            <text x="275" y="175" textAnchor="middle" fontSize="9" fontWeight="bold" fill="white" fontFamily="Orbitron, sans-serif">
              {labels[5]}
            </text>
          </g>

          {/* Step 3 button - right of right face */}
          {step === 2 && (
            <g onClick={() => setStep(3)} className="cursor-pointer">
              <rect x="280" y="100" width="110" height="28" rx="14" fill="hsl(230, 80%, 55%)" />
              <text x="335" y="119" textAnchor="middle" fontSize="8" fontWeight="bold" fill="white" fontFamily="Orbitron, sans-serif">
                {buttonLabels[2]}
              </text>
            </g>
          )}

          {/* BOTTOM face - unfolds at step 4 */}
          <g style={{
            transition: "transform 0.8s ease-in-out",
            transformOrigin: "200px 205px",
            transform: step >= 4 ? "rotateX(0deg)" : "rotateX(90deg)",
            opacity: step >= 4 ? 1 : 0.3,
          }}>
            <rect x="165" y="210" width="70" height="70" rx="4"
              fill={faceColors[3] + "cc"} stroke="hsl(0,0%,80%)" strokeWidth="2" />
            <text x="200" y="250" textAnchor="middle" fontSize="9" fontWeight="bold" fill="white" fontFamily="Orbitron, sans-serif">
              {labels[3]}
            </text>
          </g>

          {/* Step 4 button - below bottom face */}
          {step === 3 && (
            <g onClick={() => setStep(4)} className="cursor-pointer">
              <rect x="145" y="290" width="110" height="28" rx="14" fill="hsl(230, 80%, 55%)" />
              <text x="200" y="309" textAnchor="middle" fontSize="8" fontWeight="bold" fill="white" fontFamily="Orbitron, sans-serif">
                {buttonLabels[3]}
              </text>
            </g>
          )}

          {/* Connecting lines between faces */}
          {step >= 1 && (
            <line x1="200" y1="130" x2="200" y2="135" stroke="hsl(0,0%,60%)" strokeWidth="1" strokeDasharray="3,2" />
          )}
          {step >= 2 && (
            <line x1="160" y1="170" x2="165" y2="170" stroke="hsl(0,0%,60%)" strokeWidth="1" strokeDasharray="3,2" />
          )}
          {step >= 3 && (
            <line x1="235" y1="170" x2="240" y2="170" stroke="hsl(0,0%,60%)" strokeWidth="1" strokeDasharray="3,2" />
          )}
          {step >= 4 && (
            <line x1="200" y1="205" x2="200" y2="210" stroke="hsl(0,0%,60%)" strokeWidth="1" strokeDasharray="3,2" />
          )}
        </svg>
      </div>

      {/* Status & Reset */}
      <div className="flex items-center gap-4">
        <p className="font-display text-xs text-muted-foreground">
          {step === 0 && "Klik tombol untuk membongkar sisi kubus satu per satu"}
          {step > 0 && step < 4 && `Langkah ${step}/4 — Klik tombol berikutnya!`}
          {step === 4 && "✅ Jaring-jaring kubus selesai dibongkar!"}
        </p>
        {step > 0 && (
          <button
            onClick={() => setStep(0)}
            className="font-display text-xs px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity cursor-pointer"
          >
            🔒 RESET
          </button>
        )}
      </div>
    </div>
  );
};

export default CubeUnfold;
