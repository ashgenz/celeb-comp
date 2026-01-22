"use client"

import React from "react"

import { useEffect, useState, useRef, useCallback } from "react"
import Image from "next/image"

export default function CulturalFestBanner() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [rawMousePos, setRawMousePos] = useState({ x: 0, y: 0 })
  const [activeVinyl, setActiveVinyl] = useState<number | null>(null)
  const [isPlaying, setIsPlaying] = useState([false, false, false])
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([])
  const [confetti, setConfetti] = useState<{ x: number; y: number; color: string; id: number; angle: number; velocity: number }[]>([])
  const [hoverIndex, setHoverIndex] = useState<number | null>(null)
  const [clickCount, setClickCount] = useState(0)
  const [showFireworks, setShowFireworks] = useState(false)
  const [discoBallActive, setDiscoBallActive] = useState(false)
  const [spotlightOn, setSpotlightOn] = useState(false)
  const [shakingVinyl, setShakingVinyl] = useState<number | null>(null)
  const [glitchEffect, setGlitchEffect] = useState(false)
  const [autoRickshaw, setAutoRickshaw] = useState({ active: false, x: -200 })
  const [magneticPull, setMagneticPull] = useState<{ index: number; strength: number } | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const rippleIdRef = useRef(0)
  const confettiIdRef = useRef(0)
  const trailIdRef = useRef(0)
  const [cursorTrail, setCursorTrail] = useState<{ x: number; y: number; id: number }[]>([])

  // Mouse tracking with parallax
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        setRawMousePos({ x, y })
        setMousePos({
          x: (e.clientX - rect.left - rect.width / 2) / 30,
          y: (e.clientY - rect.top - rect.height / 2) / 30,
        })

        // Add cursor trail
        const newTrail = { x, y, id: trailIdRef.current++ }
        setCursorTrail(prev => [...prev.slice(-15), newTrail])
      }
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  // Auto-rickshaw animation every 15 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setAutoRickshaw({ active: true, x: -200 })
      const animate = () => {
        setAutoRickshaw(prev => {
          if (prev.x > 1600) {
            return { active: false, x: -200 }
          }
          return { ...prev, x: prev.x + 8 }
        })
      }
      const animationInterval = setInterval(animate, 16)
      setTimeout(() => clearInterval(animationInterval), 5000)
    }, 15000)

    // Trigger once on mount
    setTimeout(() => {
      setAutoRickshaw({ active: true, x: -200 })
      const animate = () => {
        setAutoRickshaw(prev => {
          if (prev.x > 1600) return { active: false, x: -200 }
          return { ...prev, x: prev.x + 8 }
        })
      }
      const animationInterval = setInterval(animate, 16)
      setTimeout(() => clearInterval(animationInterval), 5000)
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  // Confetti cannon
  const launchConfetti = useCallback((x: number, y: number) => {
    const colors = ["#FF3B8F", "#00E5FF", "#C4FF2B", "#FFD700", "#FF6B35", "#9B59B6", "#E74C3C", "#2ECC71"]
    const newConfetti = Array.from({ length: 50 }, (_, i) => ({
      x,
      y,
      color: colors[i % colors.length],
      id: confettiIdRef.current++,
      angle: (Math.PI * 2 * i) / 50 + Math.random() * 0.5,
      velocity: 8 + Math.random() * 8,
    }))
    setConfetti(prev => [...prev, ...newConfetti])
    setTimeout(() => {
      setConfetti(prev => prev.filter(c => !newConfetti.find(nc => nc.id === c.id)))
    }, 3000)
  }, [])

  // Ripple effect
  const createRipple = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const newRipple = { x, y, id: rippleIdRef.current++ }
    setRipples(prev => [...prev, newRipple])
    setClickCount(prev => prev + 1)

    // Fireworks on every 10 clicks
    if ((clickCount + 1) % 10 === 0) {
      setShowFireworks(true)
      launchConfetti(720, 450)
      setTimeout(() => setShowFireworks(false), 2000)
    }

    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== newRipple.id))
    }, 1000)
  }, [clickCount, launchConfetti])

  // Vinyl interaction
  const togglePlay = (index: number, e: React.MouseEvent) => {
    e.stopPropagation()

    // Shake effect
    setShakingVinyl(index)
    setTimeout(() => setShakingVinyl(null), 500)

    // Launch confetti from vinyl
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    launchConfetti(e.clientX - rect.left, e.clientY - rect.top)

    // Glitch effect
    setGlitchEffect(true)
    setTimeout(() => setGlitchEffect(false), 200)

    setIsPlaying(prev => {
      const newState = [...prev]
      newState[index] = !newState[index]
      return newState
    })
    setActiveVinyl(isPlaying[index] ? null : index)
  }

  // Double click for disco ball
  const handleDoubleClick = () => {
    setDiscoBallActive(prev => !prev)
    setSpotlightOn(prev => !prev)
  }

  const celebrities = [
    { name: "CELEBRITY 1", title: "THE HEADLINER", image: "/placeholder.svg?height=200&width=200", color: "#FF3B8F" },
    { name: "CELEBRITY 2", title: "SPECIAL GUEST", image: "/placeholder.svg?height=200&width=200", color: "#00E5FF" },
    { name: "CELEBRITY 3", title: "STAR PERFORMER", image: "/placeholder.svg?height=200&width=200", color: "#C4FF2B" },
  ]

  return (
    <div
      ref={containerRef}
      onClick={createRipple}
      onDoubleClick={handleDoubleClick}
      className={`relative w-full max-w-[1440px] h-[900px] mx-auto overflow-hidden select-none  ${glitchEffect ? "animate-glitch" : ""}`}
    >
      {/* Custom Cursor with trail */}
     



      {/* Spotlight Effect */}
      {spotlightOn && (
        <div 
          className="absolute inset-0 pointer-events-none z-[80]"
          style={{
            background: `radial-gradient(circle 300px at ${rawMousePos.x}px ${rawMousePos.y}px, transparent 0%, rgba(0,0,0,0.7) 100%)`,
          }}
        />
      )}

      {/* BACKGROUND IMAGE */}
      <Image
        src="/images/festival-bg.png"
        alt="Festival Background"
        fill
        className="object-cover"
        priority
      />

      {/* Disco Ball */}
      {discoBallActive && (
        <div className="absolute top-10 left-1/2 -translate-x-1/2 z-[70]">
          <div 
            className="w-32 h-32 rounded-full relative"
            style={{
              background: "radial-gradient(circle, #fff 0%, #ccc 50%, #999 100%)",
              animation: "spin 3s linear infinite",
            }}
          >
            {/* Disco ball facets */}
            {[...Array(24)].map((_, i) => (
              <div
                key={i}
                className="absolute w-3 h-3 bg-white rounded-sm"
                style={{
                  top: `${30 + 20 * Math.sin((i * Math.PI * 2) / 12)}%`,
                  left: `${30 + 20 * Math.cos((i * Math.PI * 2) / 12)}%`,
                  transform: `rotate(${i * 30}deg)`,
                  boxShadow: "0 0 10px white",
                }}
              />
            ))}
          </div>
          {/* Disco light rays */}
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute top-16 left-16 w-[800px] h-2 origin-left"
              style={{
                background: `linear-gradient(90deg, ${["#FF3B8F", "#00E5FF", "#C4FF2B", "#FFD700", "#9B59B6", "#FF6B35", "#2ECC71", "#E74C3C"][i]} 0%, transparent 100%)`,
                transform: `rotate(${i * 45 + Date.now() / 50}deg)`,
                animation: `disco-ray ${2 + i * 0.3}s linear infinite`,
                opacity: 0.6,
              }}
            />
          ))}
        </div>
      )}

      {/* Fireworks */}
      {showFireworks && (
        <div className="absolute inset-0 pointer-events-none z-[90]">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute"
              style={{
                left: `${20 + i * 15}%`,
                top: `${20 + (i % 3) * 15}%`,
              }}
            >
              {[...Array(12)].map((_, j) => (
                <div
                  key={j}
                  className="absolute w-2 h-2 rounded-full"
                  style={{
                    backgroundColor: ["#FF3B8F", "#00E5FF", "#C4FF2B", "#FFD700"][j % 4],
                    animation: `firework-particle 1s ease-out forwards`,
                    animationDelay: `${i * 0.2}s`,
                    transform: `rotate(${j * 30}deg) translateY(-${50 + Math.random() * 50}px)`,
                    boxShadow: `0 0 10px ${["#FF3B8F", "#00E5FF", "#C4FF2B", "#FFD700"][j % 4]}`,
                  }}
                />
              ))}
            </div>
          ))}
        </div>
      )}

      {/* Confetti Particles */}
      {confetti.map((c, i) => (
        <div
          key={c.id}
          className="absolute pointer-events-none z-[100]"
          style={{
            left: c.x,
            top: c.y,
            animation: `confetti-fall 3s ease-out forwards`,
            animationDelay: `${i * 0.02}s`,
          }}
        >
          <div 
            className="w-3 h-3"
            style={{ 
              backgroundColor: c.color,
              transform: `rotate(${c.angle * 180}deg)`,
              clipPath: i % 3 === 0 ? "polygon(50% 0%, 0% 100%, 100% 100%)" : i % 3 === 1 ? "circle(50%)" : "none",
              boxShadow: `0 0 5px ${c.color}`,
              animation: `confetti-spin 0.5s linear infinite`,
            }}
          />
        </div>
      ))}

      {/* Click Ripples */}
      {ripples.map(ripple => (
        <div
          key={ripple.id}
          className="absolute pointer-events-none z-[100]"
          style={{ left: ripple.x, top: ripple.y, transform: "translate(-50%, -50%)" }}
        >
          <div className="w-4 h-4 rounded-full bg-white/80 animate-ping" />
          <div className="absolute inset-0 w-[400px] h-[400px] rounded-full border-4 border-white/50 -translate-x-1/2 -translate-y-1/2 animate-ripple" />
        </div>
      ))}

      {/* Auto-Rickshaw Animation */}
      {autoRickshaw.active && (
        <div
          className="absolute bottom-32 z-[60] transition-none"
          style={{ left: autoRickshaw.x }}
        >
          <svg width="120" height="80" viewBox="0 0 120 80" className="drop-shadow-xl">
            {/* Body */}
            <rect x="20" y="20" width="80" height="45" rx="8" fill="#2ECC71" stroke="#1a1a1a" strokeWidth="2"/>
            {/* Roof */}
            <path d="M25 20 Q60 -5 95 20" fill="#C4FF2B" stroke="#1a1a1a" strokeWidth="2"/>
            {/* Front */}
            <rect x="85" y="25" width="20" height="35" rx="4" fill="#FFD700"/>
            {/* Wheels */}
            <circle cx="35" cy="70" r="12" fill="#1a1a1a" className="animate-spin" style={{ transformOrigin: "35px 70px", animationDuration: "0.5s" }}/>
            <circle cx="85" cy="70" r="12" fill="#1a1a1a" className="animate-spin" style={{ transformOrigin: "85px 70px", animationDuration: "0.5s" }}/>
            <circle cx="35" cy="70" r="4" fill="#ccc"/>
            <circle cx="85" cy="70" r="4" fill="#ccc"/>
            {/* Window */}
            <rect x="30" y="28" width="45" height="20" rx="2" fill="#87CEEB"/>
            {/* Headlight */}
            <circle cx="100" cy="50" r="5" fill="#FFD700">
              <animate attributeName="opacity" values="0.5;1;0.5" dur="0.3s" repeatCount="indefinite"/>
            </circle>
            {/* Exhaust smoke */}
            <circle cx="15" cy="55" r="5" fill="#ddd" opacity="0.6">
              <animate attributeName="cx" values="15;5;-5" dur="0.5s" repeatCount="indefinite"/>
              <animate attributeName="opacity" values="0.6;0.3;0" dur="0.5s" repeatCount="indefinite"/>
            </circle>
          </svg>
          <div className="text-xs font-bold text-center text-amber-500 mt-1 animate-bounce">BEEP BEEP!</div>
        </div>
      )}

      {/* Floating Music Notes */}
      <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute text-5xl"
            style={{
              left: `${5 + i * 8}%`,
              animation: `float-up ${6 + i * 1.5}s linear infinite`,
              animationDelay: `${i * 0.8}s`,
            }}
          >
            <span 
              style={{ 
                color: ["#FF3B8F", "#00E5FF", "#C4FF2B", "#FFD700", "#9B59B6", "#FF6B35"][i % 6],
                textShadow: `0 0 20px ${["#FF3B8F", "#00E5FF", "#C4FF2B", "#FFD700", "#9B59B6", "#FF6B35"][i % 6]}`,
              }}
            >
              {["♪", "♫", "♬", "♩", "🎵", "🎶"][i % 6]}
            </span>
          </div>
        ))}
      </div>

      {/* Sound Wave Visualizer */}
      <div className="absolute top-[12%] left-1/2 -translate-x-1/2 flex items-end gap-1.5 z-30 h-20">
        {[...Array(25)].map((_, i) => (
          <div
            key={i}
            className="w-2.5 rounded-full transition-all duration-100"
            style={{
              height: activeVinyl !== null ? `${20 + Math.abs(Math.sin(Date.now() / 100 + i * 0.4)) * 50}px` : "10px",
              backgroundColor: activeVinyl !== null ? celebrities[activeVinyl].color : "#444",
              boxShadow: activeVinyl !== null ? `0 0 15px ${celebrities[activeVinyl].color}, 0 0 30px ${celebrities[activeVinyl].color}` : "none",
              animation: activeVinyl !== null ? `equalizer ${0.2 + i * 0.03}s ease-in-out infinite alternate` : "none",
            }}
          />
        ))}
      </div>

      {/* VINYL RECORDS - Celebrity Section */}
      <div className="absolute bottom-[180px] left-1/2 -translate-x-1/2 flex items-end justify-center gap-10 z-40">
        {celebrities.map((celeb, index) => {
          const isCenter = index === 1
          const size = isCenter ? 280 : 210
          const rotation = index === 0 ? -12 : index === 2 ? 12 : 0
          const parallaxX = index === 0 ? -1 : index === 2 ? 1 : 0.3
          const parallaxY = index === 1 ? -0.7 : 0.6
          const isShaking = shakingVinyl === index

          return (
            <div
              key={index}
              className={`relative group cursor-pointer transition-all duration-300 ${isCenter ? "-mb-8" : ""}`}
              style={{
                transform: `
                  translate(${mousePos.x * parallaxX}px, ${mousePos.y * parallaxY}px) 
                  rotate(${rotation}deg) 
                  scale(${hoverIndex === index ? 1.15 : 1})
                  ${isShaking ? "translateX(" + Math.sin(Date.now() / 20) * 10 + "px)" : ""}
                `,
                zIndex: hoverIndex === index ? 60 : isCenter ? 50 : 40,
                filter: hoverIndex !== null && hoverIndex !== index ? "brightness(0.7)" : "brightness(1)",
              }}
              onMouseEnter={() => {
                setHoverIndex(index)
                setMagneticPull({ index, strength: 1 })
              }}
              onMouseLeave={() => {
                setHoverIndex(null)
                setMagneticPull(null)
              }}
              onClick={(e) => togglePlay(index, e)}
            >
              {/* Magnetic pull effect */}
              {magneticPull?.index === index && (
                <div 
                  className="absolute inset-0 rounded-full animate-ping"
                  style={{ 
                    backgroundColor: celeb.color, 
                    opacity: 0.2,
                    animationDuration: "1s",
                  }}
                />
              )}

              {/* Glow ring */}
              <div
                className="absolute -inset-6 rounded-full blur-2xl transition-all duration-500"
                style={{
                  backgroundColor: celeb.color,
                  opacity: hoverIndex === index || isPlaying[index] ? 0.7 : 0,
                  animation: isPlaying[index] ? "pulse-glow 1s ease-in-out infinite" : "none",
                }}
              />

              {/* Sound waves emanating from playing vinyl */}
              {isPlaying[index] && (
                <>
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute inset-0 rounded-full border-2 animate-ping"
                      style={{
                        borderColor: celeb.color,
                        animationDelay: `${i * 0.3}s`,
                        animationDuration: "1.5s",
                      }}
                    />
                  ))}
                </>
              )}

              {/* Vinyl Disc */}
              <div 
                className="relative transition-transform duration-500"
                style={{ 
                  width: size, 
                  height: size,
                  animation: isPlaying[index] ? "spin 1.5s linear infinite" : "none",
                  transform: hoverIndex === index && !isPlaying[index] ? "rotateY(15deg) rotateX(-10deg)" : "none",
                  transformStyle: "preserve-3d",
                }}
              >
                {/* Vinyl disc with grooves */}
                <div 
                  className="absolute inset-0 rounded-full shadow-2xl"
                  style={{
                    background: `
                      radial-gradient(circle at 30% 30%, rgba(255,255,255,0.1) 0%, transparent 50%),
                      radial-gradient(circle, #1a1a1a 0%, #2a2a2a 30%, #1a1a1a 31%, #2a2a2a 50%, #1a1a1a 51%, #2a2a2a 70%, #1a1a1a 100%)
                    `,
                  }}
                >
                  {/* Groove rings */}
                  {[...Array(isCenter ? 10 : 7)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute rounded-full border transition-all duration-300"
                      style={{
                        inset: `${(i + 2) * (isCenter ? 9 : 10)}px`,
                        borderColor: hoverIndex === index ? `${celeb.color}40` : i % 2 === 0 ? "#3a3a3a" : "#2a2a2a",
                      }}
                    />
                  ))}
                </div>

                {/* Center label with photo */}
                <div
                  className="absolute rounded-full overflow-hidden transition-all duration-500"
                  style={{
                    inset: isCenter ? "70px" : "55px",
                    borderWidth: "5px",
                    borderColor: celeb.color,
                    boxShadow: hoverIndex === index || isPlaying[index] 
                      ? `0 0 40px ${celeb.color}, 0 0 80px ${celeb.color}40, inset 0 0 30px rgba(0,0,0,0.5)` 
                      : "0 10px 40px rgba(0,0,0,0.4)",
                    transform: hoverIndex === index ? "scale(1.05)" : "scale(1)",
                  }}
                >
                  <Image src={celeb.image || "/placeholder.svg"} alt={celeb.name} fill className="object-cover" />

                  {/* Play/Pause overlay */}
                  <div className={`absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center transition-all duration-300 ${hoverIndex === index ? "opacity-100" : "opacity-0"}`}>
                    <div 
                      className="w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-125 active:scale-95"
                      style={{ 
                        backgroundColor: celeb.color,
                        boxShadow: `0 0 30px ${celeb.color}`,
                      }}
                    >
                      {isPlaying[index] ? (
                        <div className="flex gap-1.5">
                          <div className="w-2 h-6 bg-zinc-900 rounded" />
                          <div className="w-2 h-6 bg-zinc-900 rounded" />
                        </div>
                      ) : (
                        <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[16px] border-l-zinc-900 border-b-[10px] border-b-transparent ml-1.5" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Vinyl shine */}
                <div 
                  className="absolute inset-0 rounded-full pointer-events-none"
                  style={{
                    background: "linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 50%, rgba(0,0,0,0.1) 100%)",
                  }}
                />

                {/* Spinning light rays for center */}
                {isCenter && (
                  <div className="absolute -inset-6 -z-10">
                    <svg viewBox="0 0 100 100" className="w-full h-full" style={{ animation: isPlaying[1] ? "spin 2s linear infinite" : "spin 15s linear infinite" }}>
                      {[...Array(16)].map((_, i) => (
                        <line key={i} x1="50" y1="50" x2="50" y2="2" stroke={celeb.color} strokeWidth="1.5" transform={`rotate(${i * 22.5} 50 50)`} opacity={isPlaying[1] ? "0.9" : "0.5"} />
                      ))}
                    </svg>
                  </div>
                )}
              </div>

              {/* Name badge */}
              <div
                className="absolute -bottom-16 left-1/2 -translate-x-1/2 px-5 py-2.5 rounded transition-all duration-300"
                style={{
                  backgroundColor: celeb.color,
                  transform: `translateX(-50%) rotate(${-rotation}deg) scale(${hoverIndex === index ? 1.15 : 1})`,
                  boxShadow: hoverIndex === index ? `0 0 30px ${celeb.color}, 0 5px 20px rgba(0,0,0,0.4)` : "0 5px 20px rgba(0,0,0,0.3)",
                }}
              >
                <p className={`text-sm font-black tracking-wider whitespace-nowrap ${index === 2 || index === 1 ? "text-zinc-900" : "text-white"}`}>
                  {celeb.name}
                </p>
                <p className={`text-xs text-center font-semibold ${index === 2 || index === 1 ? "text-zinc-700" : "text-pink-100"}`}>
                  {celeb.title}
                </p>
              </div>

              {/* Now Playing badge */}
              {isPlaying[index] && (
                <div 
                  className="absolute -top-6 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full text-xs font-black tracking-wider animate-bounce"
                  style={{ 
                    backgroundColor: celeb.color, 
                    color: index === 0 ? "white" : "#1a1a1a",
                    boxShadow: `0 0 20px ${celeb.color}`,
                  }}
                >
                  NOW PLAYING
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Interactive Cassette Tapes */}
      <div
        className="absolute top-[28%] left-10 z-30 cursor-grab active:cursor-grabbing transition-all duration-300 hover:scale-125 hover:rotate-12"
        style={{ 
          transform: `rotate(-12deg) translate(${mousePos.x * 0.8}px, ${mousePos.y * 0.5}px)`,
          animation: "float-gentle 4s ease-in-out infinite",
        }}
        onClick={(e) => { e.stopPropagation(); launchConfetti(e.clientX - containerRef.current!.getBoundingClientRect().left, e.clientY - containerRef.current!.getBoundingClientRect().top) }}
      >
        <div className="w-[110px] h-[70px] bg-gradient-to-b from-[#E74C3C] to-[#C0392B] rounded-lg shadow-2xl border-2 border-zinc-800 hover:shadow-red-500/70 transition-shadow duration-300">
          <div className="mx-2 mt-2 h-[30px] bg-amber-100 rounded flex items-center justify-around">
            <div className={`w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center ${activeVinyl === 0 ? "animate-spin" : ""}`} style={{ animationDuration: "0.5s" }}>
              <div className="w-2 h-2 bg-amber-100 rounded-full" />
            </div>
            <div className={`w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center ${activeVinyl === 0 ? "animate-spin" : ""}`} style={{ animationDuration: "0.5s" }}>
              <div className="w-2 h-2 bg-amber-100 rounded-full" />
            </div>
          </div>
          <div className="mx-2 mt-1.5 h-5 bg-zinc-800 rounded flex items-center justify-center">
            <span className="text-amber-400 text-[7px] font-black tracking-wide">VIBRANCE 2026</span>
          </div>
        </div>
      </div>

      <div
        className="absolute top-[22%] right-14 z-30 cursor-grab active:cursor-grabbing transition-all duration-300 hover:scale-125 hover:-rotate-12"
        style={{ 
          transform: `rotate(10deg) translate(${mousePos.x * -0.6}px, ${mousePos.y * 0.4}px)`,
          animation: "float-gentle 5s ease-in-out infinite",
          animationDelay: "1s",
        }}
        onClick={(e) => { e.stopPropagation(); launchConfetti(e.clientX - containerRef.current!.getBoundingClientRect().left, e.clientY - containerRef.current!.getBoundingClientRect().top) }}
      >
        <div className="w-[100px] h-[65px] bg-gradient-to-b from-[#9B59B6] to-[#8E44AD] rounded-lg shadow-2xl border-2 border-zinc-800 hover:shadow-purple-500/70 transition-shadow duration-300">
          <div className="mx-2 mt-2 h-[26px] bg-amber-100 rounded flex items-center justify-around">
            <div className={`w-5 h-5 rounded-full bg-zinc-800 flex items-center justify-center ${activeVinyl === 2 ? "animate-spin" : ""}`} style={{ animationDuration: "0.5s" }}>
              <div className="w-1.5 h-1.5 bg-amber-100 rounded-full" />
            </div>
            <div className={`w-5 h-5 rounded-full bg-zinc-800 flex items-center justify-center ${activeVinyl === 2 ? "animate-spin" : ""}`} style={{ animationDuration: "0.5s" }}>
              <div className="w-1.5 h-1.5 bg-amber-100 rounded-full" />
            </div>
          </div>
          <div className="mx-2 mt-1 h-4 bg-zinc-800 rounded flex items-center justify-center">
            <span className="text-purple-300 text-[6px] font-black">INDIE MIXTAPE</span>
          </div>
        </div>
      </div>

      {/* Film Strip */}
      <div className="absolute top-5 left-0 right-0 flex justify-center z-30">
        <div 
          className="flex items-center bg-zinc-900 h-18 px-3 rounded-lg shadow-2xl transition-all duration-300 hover:scale-110 cursor-pointer"
          style={{ transform: `rotate(-2deg) translateX(${mousePos.x * 0.6}px)` }}
        >
          {[...Array(9)].map((_, i) => (
            <div key={i} className="flex flex-col items-center mx-1.5 group/frame">
              <div className="w-2.5 h-2.5 bg-zinc-700 rounded-sm mb-1" />
              <div 
                className="w-12 h-9 rounded overflow-hidden transition-all duration-300 group-hover/frame:scale-125 group-hover/frame:shadow-xl"
                style={{
                  background: `linear-gradient(135deg, ${["#FF3B8F", "#00E5FF", "#C4FF2B", "#FFD700", "#9B59B6", "#FF6B35", "#2ECC71", "#E74C3C", "#3498DB"][i]} 0%, ${["#FF3B8F", "#00E5FF", "#C4FF2B", "#FFD700", "#9B59B6", "#FF6B35", "#2ECC71", "#E74C3C", "#3498DB"][(i + 1) % 9]} 100%)`,
                  animation: `pulse ${1 + i * 0.15}s ease-in-out infinite`,
                }}
              />
              <div className="w-2.5 h-2.5 bg-zinc-700 rounded-sm mt-1" />
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Neon Beams */}
      <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250%] h-2 transition-all duration-200"
            style={{
              background: `linear-gradient(90deg, transparent 0%, ${["#00E5FF", "#FF3B8F", "#C4FF2B", "#00E5FF", "#FF3B8F", "#9B59B6"][i]}80 50%, transparent 100%)`,
              transform: `rotate(${(i * 30) + mousePos.x * (i % 2 === 0 ? 0.8 : -0.8) + mousePos.y * (i % 2 === 0 ? -0.5 : 0.5)}deg)`,
              boxShadow: `0 0 30px ${["#00E5FF", "#FF3B8F", "#C4FF2B", "#00E5FF", "#FF3B8F", "#9B59B6"][i]}60`,
              opacity: 0.7,
            }}
          />
        ))}
      </div>

      {/* Bottom Info Bar */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-10 z-50">
        <div 
          className="bg-zinc-900/95 backdrop-blur-md px-8 py-4 rounded-full border-2 border-amber-500/60 shadow-2xl hover:border-amber-400 hover:scale-110 transition-all duration-300 cursor-pointer group"
          onClick={(e) => { e.stopPropagation(); launchConfetti(720, 850) }}
        >
          <p className="text-amber-400 font-black text-2xl tracking-wider group-hover:animate-pulse">23-25 FEB</p>
        </div>

        <div className="relative group">
          <div 
            className="absolute -inset-1 rounded-full opacity-75 blur-sm animate-pulse"
            style={{ background: "linear-gradient(90deg, #FF3B8F, #00E5FF, #C4FF2B, #FF3B8F)" }}
          />
          <button 
            className="relative bg-zinc-900 hover:bg-zinc-800 px-10 py-4 rounded-full text-xl font-black tracking-wider text-white transition-all duration-300 hover:scale-110 active:scale-95"
            onClick={(e) => { 
              e.stopPropagation()
              launchConfetti(720, 850)
              setShowFireworks(true)
              setTimeout(() => setShowFireworks(false), 2000)
            }}
          >
            GET PASSES
          </button>
        </div>

        <div 
          className="bg-gradient-to-r from-amber-500 to-amber-600 px-8 py-4 rounded-full shadow-2xl hover:scale-110 transition-all duration-300 cursor-pointer hover:shadow-amber-500/50"
          onClick={(e) => { e.stopPropagation(); launchConfetti(720, 850) }}
        >
          <p className="text-zinc-900 font-black text-lg tracking-wider">PRIZES WORTH</p>
          <p className="text-zinc-900 font-black text-2xl -mt-1">12 LAC</p>
        </div>
      </div>

      {/* Click Counter Easter Egg */}
      {clickCount >= 5 && (
        <div className="absolute top-4 right-4 bg-zinc-900/90 backdrop-blur-sm px-4 py-2 rounded-full text-amber-400 font-bold text-sm z-50 animate-bounce">
          Clicks: {clickCount} {clickCount >= 10 ? "🎉" : clickCount >= 20 ? "🔥" : ""}
        </div>
      )}

      {/* Hint text */}
      <div className="absolute bottom-2 left-4 text-amber-500/60 text-xs font-medium z-50">
        Double-click for disco mode | Click elements for confetti | Every 10 clicks = fireworks
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes float-up {
          0% { transform: translateY(900px) rotate(0deg); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(-100px) rotate(360deg); opacity: 0; }
        }
        @keyframes equalizer {
          0% { transform: scaleY(0.3); }
          100% { transform: scaleY(1); }
        }
        @keyframes float-gentle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        @keyframes confetti-fall {
          0% { transform: translate(0, 0) rotate(0deg); opacity: 1; }
          100% { 
            transform: translate(
              calc((var(--random, 0.5) - 0.5) * 400px), 
              300px
            ) rotate(720deg); 
            opacity: 0; 
          }
        }
        @keyframes confetti-spin {
          to { transform: rotate(360deg); }
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.1); }
        }
        @keyframes disco-ray {
          0% { transform: rotate(0deg); opacity: 0.6; }
          100% { transform: rotate(360deg); opacity: 0.6; }
        }
        @keyframes firework-particle {
          0% { transform: scale(1) translateY(0); opacity: 1; }
          100% { transform: scale(0) translateY(-100px); opacity: 0; }
        }
        @keyframes animate-ripple {
          to { transform: translate(-50%, -50%) scale(4); opacity: 0; }
        }
        .animate-ripple {
          animation: animate-ripple 1s ease-out forwards;
        }
        .animate-glitch {
          animation: glitch 0.2s ease-in-out;
        }
        @keyframes glitch {
          0%, 100% { transform: translate(0); filter: hue-rotate(0deg); }
          25% { transform: translate(-5px, 5px); filter: hue-rotate(90deg); }
          50% { transform: translate(5px, -5px); filter: hue-rotate(180deg); }
          75% { transform: translate(-5px, -5px); filter: hue-rotate(270deg); }
        }
      `}</style>
    </div>
  )
}