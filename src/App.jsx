import React, { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { ContactShadows, OrbitControls } from "@react-three/drei";
import "./App.css";

function Avatar({ outfit }) {
  const skin = "#d9a27f";
  return (
    <group position={[0, -1.15, 0]}>
      {/* Legs */}
      {[-0.17, 0.17].map((x) => (
        <mesh key={x} position={[x, 0.65, 0]}>
          <cylinderGeometry args={[0.13, 0.11, 0.85, 24]} />
          <meshStandardMaterial color={skin} />
        </mesh>
      ))}
      {/* Shoes */}
      {[-0.17, 0.17].map((x) => (
        <mesh key={x} position={[x, 0.17, 0.08]}>
          <boxGeometry args={[0.25, 0.14, 0.4]} />
          <meshStandardMaterial color={outfit.shoes} />
        </mesh>
      ))}
      {/* Torso */}
      <mesh position={[0, 1.35, 0]} scale={[0.42, 0.58, 0.25]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color={outfit.top} roughness={0.6} />
      </mesh>
      {/* Neck and head */}
      <mesh position={[0, 1.9, 0]}>
        <cylinderGeometry args={[0.11, 0.13, 0.25, 20]} />
        <meshStandardMaterial color={skin} />
      </mesh>
      <mesh position={[0, 2.22, 0]}>
        <sphereGeometry args={[0.29, 32, 32]} />
        <meshStandardMaterial color={skin} />
      </mesh>
      {/* Hair */}
      <mesh position={[0, 2.39, -0.04]}>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial color="#271711" />
      </mesh>
      {/* Arms */}
      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * 0.52, 1.35, 0]} rotation={[0, 0, side * -0.17]}>
          <cylinderGeometry args={[0.09, 0.1, 0.75, 20]} />
          <meshStandardMaterial color={skin} />
        </mesh>
      ))}
      {/* Bottom */}
      {outfit.bottomType === "skirt" ? (
        <mesh position={[0, 0.95, 0]}>
          <cylinderGeometry args={[0.28, 0.62, 0.75, 32]} />
          <meshStandardMaterial color={outfit.bottom} roughness={0.5} />
        </mesh>
      ) : (
        [-0.17, 0.17].map((x) => (
          <mesh key={x} position={[x, 0.85, 0]}>
            <cylinderGeometry args={[0.17, 0.15, 0.8, 24]} />
            <meshStandardMaterial color={outfit.bottom} />
          </mesh>
        ))
      )}
      {/* Necklace */}
      {outfit.accessory && (
        <mesh position={[0, 1.83, 0.23]}>
          <torusGeometry args={[0.15, 0.025, 12, 32]} />
          <meshStandardMaterial color="#e8bd64" metalness={0.8} roughness={0.25} />
        </mesh>
      )}
    </group>
  );
}

function FashionScene({ outfit }) {
  return (
    <Canvas camera={{ position: [0, 1, 5], fov: 40 }}>
      <color attach="background" args={["#f7eaf0"]} />
      <ambientLight intensity={1.4} />
      <directionalLight position={[3, 5, 4]} intensity={2} />
      <pointLight position={[-3, 2, 3]} intensity={1} />
      <Avatar outfit={outfit} />
      <ContactShadows position={[0, -1, 0]} opacity={0.25} scale={5} blur={2} />
      <OrbitControls enablePan={false} minDistance={3.5} maxDistance={7}
        minPolarAngle={0.7} maxPolarAngle={2.1} />
    </Canvas>
  );
}

const outfits = [
  { name: "Pink Glam", top: "#e94f91", bottom: "#f5b6d0", bottomType: "skirt", shoes: "#f8d6e5", accessory: true, score: 95 },
  { name: "Midnight Chic", top: "#222238", bottom: "#171725", bottomType: "skirt", shoes: "#d7b56d", accessory: true, score: 92 },
  { name: "Summer Casual", top: "#f6cf72", bottom: "#73a8d6", bottomType: "pants", shoes: "#ffffff", accessory: false, score: 89 },
  { name: "Royal Red", top: "#9d142e", bottom: "#bd2742", bottomType: "skirt", shoes: "#d7b56d", accessory: true, score: 97 }
];
const challenges = ["Red Carpet", "College Party", "Summer Vacation", "Royal Wedding"];

export default function App() {
  const [selected, setSelected] = useState(0);
  const [challenge, setChallenge] = useState("Red Carpet");
  const [result, setResult] = useState(null);
  const [coins, setCoins] = useState(100);
  const outfit = outfits[selected];

  function startBattle() {
    const bonus = challenge === "Red Carpet" && selected === 3 ? 3 : 0;
    const playerScore = Math.min(100, outfit.score + bonus);
    const opponentScore = 90;
    const won = playerScore >= opponentScore;
    setResult({ playerScore, opponentScore, won });
    if (won) setCoins((current) => current + 50);
  }

  return (
    <div className="game">
      <header className="topbar">
        <div className="logo">FASHION <span>BATTLE</span></div>
        <div className="coins">🪙 {coins}</div>
      </header>
      <section className="intro">
        <p className="eyebrow">YOUR STYLE. YOUR RULES.</p>
        <h1>Own the Runway.</h1>
        <p>Dress up, compete and become a fashion icon.</p>
      </section>
      <main className="game-layout">
        <section className="avatar-card">
          <div className="scene-heading"><span>YOUR MODEL</span><span>3D AVATAR ✨</span></div>
          <div className="scene"><FashionScene outfit={outfit} /></div>
          <p className="drag-hint">↔ Drag to rotate your model</p>
          <h2>{outfit.name}</h2>
        </section>
        <section className="controls">
          <div className="challenge-box">
            <p className="section-label">TODAY'S CHALLENGE</p>
            <select value={challenge} onChange={(event) => { setChallenge(event.target.value); setResult(null); }}>
              {challenges.map((item) => <option key={item}>{item}</option>)}
            </select>
          </div>
          <h3>Choose Your Look</h3>
          <div className="outfit-list">
            {outfits.map((item, index) => (
              <button key={item.name}
                className={selected === index ? "outfit-option active" : "outfit-option"}
                onClick={() => { setSelected(index); setResult(null); }}>
                <span className="swatch" style={{ background: item.top }} />
                <span>{item.name}</span><span>→</span>
              </button>
            ))}
          </div>
          <div className="score-preview"><span>Style rating</span><strong>{outfit.score}/100</strong></div>
          <button className="battle-button" onClick={startBattle}>⚡ START FASHION BATTLE</button>
          {result && (
            <div className="result" aria-live="polite">
              <h2>{result.won ? "🏆 YOU WON!" : "💫 GOOD TRY!"}</h2>
              <div className="score-row"><span>Your score</span><strong>{result.playerScore}</strong></div>
              <div className="score-row"><span>Opponent score</span><strong>{result.opponentScore}</strong></div>
              {result.won && <p>+50 coins earned!</p>}
            </div>
          )}
        </section>
      </main>
      <footer>FASHION BATTLE © 2026 · STYLE IS YOUR SUPERPOWER</footer>
    </div>
  );
}
