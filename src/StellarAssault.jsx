import React, { useState, useEffect, useRef, useCallback } from "react";
import { Rocket, Zap, Shield, Target, Trophy, Star } from "lucide-react";
import "./StellarAssault.css";
import { saveHighScoreToFirebase, subscribeToHighScores } from "./firebase";

const GAME_WIDTH = 600;
const GAME_HEIGHT = 800;
const PLAYER_SIZE = 120; // Increased to 120x120 - LARGE!
const ENEMY_SIZE = 35;
const BULLET_SIZE = 8;
const POWERUP_SIZE = 25;

const StellarAssault = () => {
  const [gameState, setGameState] = useState("nameEntry"); // nameEntry, playing, paused, gameOver
  const [playerName, setPlayerName] = useState("");
  const [score, setScore] = useState(0);
  const [highScores, setHighScores] = useState([]);
  const [lives, setLives] = useState(3);
  const [credits, setCredits] = useState(0);
  const [scoreSaved, setScoreSaved] = useState(false);

  const [player, setPlayer] = useState({ x: 300, y: 700, speed: 5 });
  const [bullets, setBullets] = useState([]);
  const [enemies, setEnemies] = useState([]);
  const [powerups, setPowerups] = useState([]);
  const [particles, setParticles] = useState([]);

  const [fireRate, setFireRate] = useState(300);
  const [bulletDamage, setBulletDamage] = useState(1);
  const [shieldActive, setShieldActive] = useState(false);
  const [bombAvailable, setBombAvailable] = useState(false);
  const [specialWeapon, setSpecialWeapon] = useState(null); // 'triple', 'dual', 'surround'
  const [specialWeaponTimer, setSpecialWeaponTimer] = useState(0);

  const gameLoopRef = useRef();
  const keysPressed = useRef({});
  const isTouchDevice = useRef(
    "ontouchstart" in window || navigator.maxTouchPoints > 0,
  );
  const mousePosition = useRef({ x: 300, y: 700 });
  const touchPosition = useRef(null);
  const autoShootInterval = useRef(null);
  const playerRef = useRef(player);
  const bulletDamageRef = useRef(bulletDamage);
  const specialWeaponRef = useRef(specialWeapon);
  const playerElementRef = useRef(null); // NEW: Direct DOM reference

  // Keep refs in sync
  useEffect(() => {
    playerRef.current = player;
  }, [player]);

  useEffect(() => {
    bulletDamageRef.current = bulletDamage;
  }, [bulletDamage]);

  useEffect(() => {
    specialWeaponRef.current = specialWeapon;
  }, [specialWeapon]);

  // Load high scores from Firestore (real-time updates)
  useEffect(() => {
    console.log('🔥 Attempting to connect to Firebase...');
    
    try {
      const unsubscribe = subscribeToHighScores((scores) => {
        console.log('📊 Received scores from Firebase:', scores.length);
        // Only update if scores actually changed
        setHighScores(prevScores => {
          if (JSON.stringify(prevScores) === JSON.stringify(scores)) {
            return prevScores; // No change, don't re-render
          }
          return scores;
        });
      });
      
      console.log('✅ Firebase subscription active');
      return () => {
        console.log('🔌 Disconnecting from Firebase');
        unsubscribe();
      };
    } catch (error) {
      console.error('❌ Firebase connection error:', error);
      // Fallback to localStorage if Firebase fails
      const saved = localStorage.getItem("stellarAssaultScores");
      if (saved) {
        console.log('📦 Loading from localStorage as fallback');
        setHighScores(JSON.parse(saved));
      }
    }
  }, []); // Empty dependency array - only run once on mount

  // Save high score to Firebase
  const saveHighScore = useCallback(async () => {
    // Prevent duplicate saves
    if (scoreSaved) {
      console.log('⏭️ Score already saved, skipping...');
      return;
    }
    
    if (playerName && score > 0) {
      console.log('💾 Attempting to save score:', { playerName, score });
      setScoreSaved(true); // Mark as saved immediately
      
      try {
        const success = await saveHighScoreToFirebase(playerName, score);
        
        if (success) {
          console.log('✅ Score saved to Firebase successfully!');
        } else {
          console.warn('⚠️ Firebase save returned false');
        }
      } catch (error) {
        console.error('❌ Error saving to Firebase:', error);
      }
    }
  }, [playerName, score, scoreSaved]); // Removed highScores dependency!

  // Save high score when game ends (only once)
  useEffect(() => {
    if (gameState === 'gameOver') {
      console.log('🎮 Game Over - saving score...');
      saveHighScore();
    }
  }, [gameState, saveHighScore]);

  // Start game
  const startGame = () => {
    if (playerName.trim()) {
      const startWidth = isTouchDevice.current ? window.innerWidth : GAME_WIDTH;
      const startHeight = isTouchDevice.current
        ? window.innerHeight
        : GAME_HEIGHT;

      setGameState("playing");
      setScore(0);
      setLives(3);
      setCredits(0);
      setScoreSaved(false); // Reset score saved flag
      const newPlayer = { x: startWidth / 2, y: startHeight - 80, speed: 5 };
      setPlayer(newPlayer);
      playerRef.current = newPlayer;
      mousePosition.current = { x: startWidth / 2, y: startHeight - 80 };
      setBullets([]);
      setEnemies([]);
      setPowerups([]);
      setParticles([]);
      setFireRate(300);
      setBulletDamage(1);
      setShieldActive(false);
      setSpecialWeapon(null); // Reset special weapon
      setSpecialWeaponTimer(0); // Reset timer
      setBombAvailable(false); // Reset bomb
    }
  };

  // Shoot bullet - uses refs to avoid stale closure
  const shootBullet = () => {
    const currentPlayer = playerRef.current;
    const currentDamage = bulletDamageRef.current;
    const currentWeapon = specialWeaponRef.current;

    const newBullets = [];

    if (currentWeapon === "triple") {
      // Triple shot - front, left diagonal, right diagonal
      newBullets.push(
        {
          id: Math.random(),
          x: currentPlayer.x, // Center bullet
          y: currentPlayer.y - 20,
          vx: 0,
          vy: -8,
          speed: 8,
          damage: currentDamage,
        },
        {
          id: Math.random(),
          x: currentPlayer.x - 25, // Left bullet
          y: currentPlayer.y - 20,
          vx: -2,
          vy: -8,
          speed: 8,
          damage: currentDamage,
        },
        {
          id: Math.random(),
          x: currentPlayer.x + 25, // Right bullet
          y: currentPlayer.y - 20,
          vx: 2,
          vy: -8,
          speed: 8,
          damage: currentDamage,
        },
      );
    } else if (currentWeapon === "dual") {
      // Dual side shots
      newBullets.push(
        {
          id: Math.random(),
          x: currentPlayer.x - 30, // Left side
          y: currentPlayer.y - 10,
          vx: 0,
          vy: -8,
          speed: 8,
          damage: currentDamage,
        },
        {
          id: Math.random(),
          x: currentPlayer.x + 30, // Right side
          y: currentPlayer.y - 10,
          vx: 0,
          vy: -8,
          speed: 8,
          damage: currentDamage,
        },
      );
    } else if (currentWeapon === "surround") {
      // Surround fire - front, back, left, right
      newBullets.push(
        {
          id: Math.random(),
          x: currentPlayer.x, // Front (center)
          y: currentPlayer.y - 30,
          vx: 0,
          vy: -8,
          speed: 8,
          damage: currentDamage,
        },
        {
          id: Math.random(),
          x: currentPlayer.x, // Back (center)
          y: currentPlayer.y + 30,
          vx: 0,
          vy: 8,
          speed: 8,
          damage: currentDamage,
        },
        {
          id: Math.random(),
          x: currentPlayer.x - 30, // Left
          y: currentPlayer.y,
          vx: -8,
          vy: 0,
          speed: 8,
          damage: currentDamage,
        },
        {
          id: Math.random(),
          x: currentPlayer.x + 30, // Right
          y: currentPlayer.y,
          vx: 8,
          vy: 0,
          speed: 8,
          damage: currentDamage,
        },
      );
    } else {
      // Normal single shot - straight up from CENTER
      newBullets.push({
        id: Math.random(),
        x: currentPlayer.x, // Perfectly centered
        y: currentPlayer.y - 20,
        vx: 0,
        vy: -8,
        speed: 8,
        damage: currentDamage,
      });
    }

    setBullets((prev) => [...prev, ...newBullets]);
  };

  // Keyboard controls
  useEffect(() => {
    if (isTouchDevice.current) return;

    const handleKeyDown = (e) => {
      keysPressed.current[e.key] = true;

      // Pause/Resume with ESC or P key
      if (
        (e.key === "Escape" || e.key === "p" || e.key === "P") &&
        (gameState === "playing" || gameState === "paused")
      ) {
        e.preventDefault();
        setGameState((prev) => (prev === "playing" ? "paused" : "playing"));
      }
    };
    const handleKeyUp = (e) => {
      keysPressed.current[e.key] = false;
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [gameState]);

  // Mouse controls
  useEffect(() => {
    if (isTouchDevice.current || gameState !== "playing") return;

    const gameCanvas = document.querySelector(".game-canvas");
    if (!gameCanvas) return;

    const handleMouseMove = (e) => {
      const rect = gameCanvas.getBoundingClientRect();
      mousePosition.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    gameCanvas.addEventListener("mousemove", handleMouseMove);

    return () => {
      gameCanvas.removeEventListener("mousemove", handleMouseMove);
    };
  }, [gameState]);

  // Touch controls
  useEffect(() => {
    if (!isTouchDevice.current || gameState !== "playing") return;

    const gameCanvas = document.querySelector(".game-canvas");
    if (!gameCanvas) return;

    const handleTouchStart = (e) => {
      // Check if touch is on UI elements (buttons, shop, HUD)
      const target = e.target;
      if (
        target.closest('.shop-btn') ||
        target.closest('.bomb-button') ||
        target.closest('.pause-btn') ||
        target.closest('.top-panel') ||
        target.closest('.hud')
      ) {
        // Don't move player if touching UI - but don't prevent default either
        touchPosition.current = null;
        return;
      }
      
      e.preventDefault();
      const rect = gameCanvas.getBoundingClientRect();
      const touch = e.touches[0];
      touchPosition.current = {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      };
    };

    const handleTouchMove = (e) => {
      // If touch started on UI, ignore movement
      if (!touchPosition.current) {
        return;
      }
      
      const target = e.target;
      if (
        target.closest('.shop-btn') ||
        target.closest('.bomb-button') ||
        target.closest('.pause-btn') ||
        target.closest('.top-panel') ||
        target.closest('.hud')
      ) {
        touchPosition.current = null;
        return;
      }
      
      e.preventDefault();
      const rect = gameCanvas.getBoundingClientRect();
      const touch = e.touches[0];
      touchPosition.current = {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      };
    };

    const handleTouchEnd = (e) => {
      e.preventDefault();
      touchPosition.current = null;
    };

    gameCanvas.addEventListener("touchstart", handleTouchStart, {
      passive: false,
    });
    gameCanvas.addEventListener("touchmove", handleTouchMove, {
      passive: false,
    });
    gameCanvas.addEventListener("touchend", handleTouchEnd, { passive: false });

    return () => {
      gameCanvas.removeEventListener("touchstart", handleTouchStart);
      gameCanvas.removeEventListener("touchmove", handleTouchMove);
      gameCanvas.removeEventListener("touchend", handleTouchEnd);
    };
  }, [gameState]);

  // Auto-shoot
  useEffect(() => {
    if (gameState !== "playing") {
      if (autoShootInterval.current) {
        clearInterval(autoShootInterval.current);
        autoShootInterval.current = null;
      }
      return;
    }

    autoShootInterval.current = setInterval(shootBullet, fireRate);

    return () => {
      if (autoShootInterval.current) {
        clearInterval(autoShootInterval.current);
        autoShootInterval.current = null;
      }
    };
  }, [gameState, fireRate]);

  // Create particle explosion
  const createExplosion = (x, y, color) => {
    const newParticles = [];
    // Reduced from 12 to 8 particles for better performance
    for (let i = 0; i < 8; i++) {
      newParticles.push({
        id: Math.random(),
        x,
        y,
        vx: (Math.random() - 0.5) * 6,
        vy: (Math.random() - 0.5) * 6,
        life: 25, // Reduced from 30 to 25 for faster cleanup
        color,
      });
    }
    setParticles((prev) => [...prev, ...newParticles]);
  };

  // Use bomb - destroys all enemies on screen
  const useBomb = () => {
    if (!bombAvailable) return;

    // Destroy all enemies with explosions
    enemies.forEach((enemy) => {
      createExplosion(enemy.x, enemy.y, "#ffff00");
      setScore(
        (s) =>
          s +
          (enemy.type === "elite" ? 250 : enemy.type === "fast" ? 150 : 100),
      );
      setCredits(
        (c) =>
          c + (enemy.type === "elite" ? 25 : enemy.type === "fast" ? 15 : 10),
      );
    });

    setEnemies([]);
    setBombAvailable(false);
  };

  // Game loop
  useEffect(() => {
    if (gameState !== "playing") return;

    // Cache dimensions outside the interval
    const currentWidth = isTouchDevice.current ? window.innerWidth : GAME_WIDTH;
    const currentHeight = isTouchDevice.current ? window.innerHeight : window.innerHeight;
    const topPanelHeight = 120;

    gameLoopRef.current = setInterval(() => {
      // Move player - DIRECT DOM MANIPULATION (bypass React)
      const updatePlayerPosition = () => {
        let newX = playerRef.current.x;
        let newY = playerRef.current.y;

        if (isTouchDevice.current && touchPosition.current) {
          newX = touchPosition.current.x;
          newY = touchPosition.current.y;
        } else if (!isTouchDevice.current) {
          newX = mousePosition.current.x;
          newY = mousePosition.current.y;

          // Keyboard overrides
          const speed = 5;
          if (keysPressed.current["ArrowLeft"] || keysPressed.current["a"])
            newX = playerRef.current.x - speed;
          if (keysPressed.current["ArrowRight"] || keysPressed.current["d"])
            newX = playerRef.current.x + speed;
          if (keysPressed.current["ArrowUp"] || keysPressed.current["w"])
            newY = playerRef.current.y - speed;
          if (keysPressed.current["ArrowDown"] || keysPressed.current["s"])
            newY = playerRef.current.y + speed;
        }

        // Clamp position - adjusted for mobile HUD and panels
        const topBoundary = isTouchDevice.current ? 140 : 20; // HUD + top panel space
        const bottomBoundary = currentHeight - topPanelHeight - 20;
        
        newX = Math.max(20, Math.min(currentWidth - 20, newX));
        newY = Math.max(topBoundary, Math.min(bottomBoundary, newY));

        // Update ref
        playerRef.current.x = newX;
        playerRef.current.y = newY;

        // Update DOM directly with transform (GPU accelerated!)
        if (playerElementRef.current) {
          const translateX = newX - PLAYER_SIZE / 2;
          const translateY = newY - PLAYER_SIZE / 2;
          playerElementRef.current.style.transform = `translate3d(${translateX}px, ${translateY}px, 0)`;
        }
      };

      updatePlayerPosition();

      setBullets((prev) =>
        prev
          .map((b) => ({
            ...b,
            x: b.x + (b.vx || 0),
            y: b.y + (b.vy || -b.speed),
          }))
          .filter((b) => b.y > -20 && b.y < currentHeight + 20),
      );

      setEnemies((prev) => {
        const moved = prev.map((e) => ({
          ...e,
          y: e.y + e.speed,
          x: e.x + Math.sin(e.y * 0.02) * e.wobble,
        }));

        // Enemies disappear well before the bottom panel (150px buffer)
        return moved.filter((e) => e.y < currentHeight - topPanelHeight - 150);
      });

      setPowerups((prev) => {
        const currentHeight = isTouchDevice.current
          ? window.innerHeight
          : GAME_HEIGHT;
        return prev
          .map((p) => ({ ...p, y: p.y + 2 }))
          .filter((p) => p.y < currentHeight + 50);
      });

      setParticles((prev) =>
        prev
          .map((p) => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            life: p.life - 1,
          }))
          .filter((p) => p.life > 0),
      );

      // Spawn enemies with progressive difficulty
      const spawnRate = score > 30000 ? 0.05 : 0.03;

      if (Math.random() < spawnRate) {
        const difficulty = Math.floor(score / 1000);
        const isEliteWave = score > 30000 && Math.random() < 0.3;

        let enemySpeed, enemyHP, enemyType;

        if (isEliteWave) {
          enemySpeed = 2.5 + Math.random() * 2 + difficulty * 0.4;
          enemyHP = 3 + Math.floor(score / 1000);
          enemyType = "elite";
        } else {
          enemySpeed = 1.5 + Math.random() * 1.5 + difficulty * 0.3;
          enemyHP = 1 + Math.floor(score / 500);
          enemyType = Math.random() > 0.7 ? "fast" : "normal";
        }

        setEnemies((prev) => [
          ...prev,
          {
            id: Math.random(),
            x: Math.random() * (currentWidth - 60) + 30,
            y: -40,
            speed: enemySpeed,
            wobble: Math.random() * 2,
            hp: enemyHP,
            maxHp: enemyHP,
            type: enemyType,
          },
        ]);
      }

      // Multi-spawn waves after 30k score
      if (score > 30000 && Math.random() < 0.02) {
        const waveSize = 2 + Math.floor(Math.random() * 3);

        for (let i = 0; i < waveSize; i++) {
          const difficulty = Math.floor(score / 1000);
          const spacing = currentWidth / (waveSize + 1);

          setEnemies((prev) => [
            ...prev,
            {
              id: Math.random(),
              x: spacing * (i + 1),
              y: -40 - i * 50,
              speed: 2 + Math.random() * 1.5 + difficulty * 0.3,
              wobble: Math.random() * 2,
              hp: 2 + Math.floor(score / 1000),
              maxHp: 2 + Math.floor(score / 1000),
              type: Math.random() > 0.5 ? "elite" : "fast",
            },
          ]);
        }
      }

      // Bullet vs enemy collision - OPTIMIZED
      setBullets((prevBullets) => {
        const remainingBullets = [...prevBullets];
        let bulletsChanged = false;

        setEnemies((prevEnemies) => {
          let enemiesChanged = false;
          
          const remainingEnemies = prevEnemies
            .map((enemy) => {
              // Skip if enemy already dead
              if (enemy.hp <= 0) return enemy;
              
              for (let bIndex = 0; bIndex < remainingBullets.length; bIndex++) {
                const bullet = remainingBullets[bIndex];
                if (!bullet) continue;

                const dx = bullet.x - enemy.x;
                const dy = bullet.y - enemy.y;
                
                // Quick distance check first (avoid sqrt)
                if (Math.abs(dx) < ENEMY_SIZE && Math.abs(dy) < ENEMY_SIZE) {
                  const distance = Math.sqrt(dx * dx + dy * dy);
                  
                  if (distance < ENEMY_SIZE) {
                    enemy.hp -= bullet.damage;
                    remainingBullets[bIndex] = null;
                    bulletsChanged = true;
                    break; // Exit loop after hit
                  }
                }
              }

              return enemy;
            })
            .filter((enemy) => {
              if (enemy.hp <= 0) {
                createExplosion(enemy.x, enemy.y, "#ff6b35");
                setScore(
                  (s) =>
                    s +
                    (enemy.type === "elite"
                      ? 250
                      : enemy.type === "fast"
                        ? 150
                        : 100),
                );
                setCredits(
                  (c) =>
                    c +
                    (enemy.type === "elite"
                      ? 25
                      : enemy.type === "fast"
                        ? 15
                        : 10),
                );

                // Powerup drop - 15%
                if (Math.random() < 0.15) {
                  const rand = Math.random();
                  let powerupType;

                  if (rand < 0.05) powerupType = "bomb";
                  else if (rand < 0.15) powerupType = "shield";
                  else if (rand < 0.45) powerupType = "triple";
                  else if (rand < 0.75) powerupType = "dual";
                  else powerupType = "surround";

                  setPowerups((prev) => [
                    ...prev,
                    {
                      id: Math.random(),
                      x: enemy.x,
                      y: enemy.y,
                      type: powerupType,
                    },
                  ]);
                }
                enemiesChanged = true;
                return false;
              }
              return true;
            });

          return enemiesChanged ? remainingEnemies : prevEnemies;
        });

        return bulletsChanged ? remainingBullets.filter((b) => b !== null) : prevBullets;
      });

      // Player vs enemy collision
      setEnemies((prevEnemies) => {
        return prevEnemies.filter((enemy) => {
          const dx = playerRef.current.x - enemy.x;
          const dy = playerRef.current.y - enemy.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < PLAYER_SIZE) {
            if (shieldActive) {
              createExplosion(enemy.x, enemy.y, "#4ecdc4");
              setShieldActive(false);
              return false;
            } else {
              createExplosion(
                playerRef.current.x,
                playerRef.current.y,
                "#ff006e",
              );
              setLives((l) => {
                const newLives = l - 1;
                if (newLives <= 0) {
                  setGameState("gameOver");
                  // Don't call saveHighScore here - will be called in useEffect
                }
                return newLives;
              });
              return false;
            }
          }
          return true;
        });
      });

      // Player vs powerup collision
      setPowerups((prevPowerups) => {
        return prevPowerups.filter((powerup) => {
          const dx = playerRef.current.x - powerup.x;
          const dy = playerRef.current.y - powerup.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < PLAYER_SIZE) {
            if (powerup.type === "shield") {
              setShieldActive(true);
              setTimeout(() => setShieldActive(false), 5000);
            } else if (powerup.type === "bomb") {
              setBombAvailable(true);
            } else if (
              powerup.type === "triple" ||
              powerup.type === "dual" ||
              powerup.type === "surround"
            ) {
              setSpecialWeapon(powerup.type);
              setSpecialWeaponTimer(10); // 10 seconds
            }
            createExplosion(powerup.x, powerup.y, "#00ff88");
            return false;
          }
          return true;
        });
      });

      // Special weapon timer countdown
      if (specialWeaponTimer > 0) {
        setSpecialWeaponTimer((prev) => {
          const newTime = prev - 1 / 60;
          if (newTime <= 0) {
            setSpecialWeapon(null);
            return 0;
          }
          return newTime;
        });
      }
    }, 1000 / 60);

    return () => clearInterval(gameLoopRef.current);
  }, [gameState, score, shieldActive]); // Removed saveHighScore dependency!

  // Upgrades
  const upgradeFireRate = () => {
    if (credits >= 100 && fireRate > 100) {
      setCredits((c) => c - 100);
      setFireRate((f) => Math.max(100, f - 30));
    }
  };

  const upgradeDamage = () => {
    if (credits >= 150) {
      setCredits((c) => c - 150);
      setBulletDamage((d) => d + 1);
    }
  };

  const buyShield = () => {
    if (credits >= 200 && !shieldActive) {
      setCredits((c) => c - 200);
      setShieldActive(true);
      setTimeout(() => setShieldActive(false), 8000);
    }
  };

  // Canvas dimensions - calculate once for all screens
  const canvasWidth = isTouchDevice.current
    ? window.innerWidth
    : Math.min(600, window.innerWidth - 40);
  const canvasHeight = isTouchDevice.current
    ? window.innerHeight
    : window.innerHeight;

  // Name Entry Screen
  if (gameState === "nameEntry") {
    return (
      <div className="game-container name-entry">
        <div className="stars-bg"></div>
        <div className="title-screen">
          <div className="title-glow">
            <h1 className="game-title">
              <span className="title-word">OUR</span>
              <span className="title-word assault">UNIVERSE</span>
            </h1>
          </div>
          <div className="subtitle">// YOU CAN SAVE US!! //</div>

          <div className="name-input-container">
            <label className="input-label">START FIGHT</label>
            <input
              type="text"
              value={playerName}
              onChange={(e) =>
                setPlayerName(e.target.value.toUpperCase().slice(0, 12))
              }
              onKeyPress={(e) => e.key === "Enter" && startGame()}
              className="name-input"
              placeholder="PILOT"
              maxLength={12}
              autoFocus
            />
            <button
              onClick={startGame}
              className="start-button"
              disabled={!playerName.trim()}
            >
              <Rocket size={20} />
              LAUNCH MISSION
            </button>
          </div>

          {highScores.length > 0 && (
            <div className="preview-scores">
              <div className="preview-title">
                <Trophy size={16} />
                TOP ACES
              </div>
              {highScores.slice(0, 5).map((hs, i) => (
                <div key={i} className="preview-score">
                  <span className="rank">#{i + 1}</span>
                  <span className="name">{hs.name}</span>
                  <span className="score">{hs.score.toLocaleString()}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Pause Screen
  if (gameState === "paused") {
    return (
      <div className="game-wrapper">
        <div
          className="game-canvas"
          style={{ width: canvasWidth, height: canvasHeight }}
        >
          <div className="pause-overlay">
            <div className="pause-content">
              <h1 className="pause-title">⏸ PAUSED</h1>
              <div className="pause-stats">
                <div className="stat-item">
                  <span className="stat-label">SCORE:</span>
                  <span className="stat-value">{score.toLocaleString()}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">LIVES:</span>
                  <span className="stat-value">{lives} ♥</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">CREDITS:</span>
                  <span className="stat-value">{credits}</span>
                </div>
              </div>
              <button
                onClick={() => setGameState("playing")}
                className="resume-button"
              >
                ▶ RESUME
              </button>
              <button
                onClick={() => setGameState("nameEntry")}
                className="quit-button"
              >
                EXIT TO MENU
              </button>
              <div className="pause-hint">Press ESC or P to resume</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Game Over Screen
  if (gameState === "gameOver") {
    const playerRank =
      highScores.findIndex(
        (hs) => hs.name === playerName && hs.score === score,
      ) + 1;
    const totalPlayers = highScores.length;

    return (
      <div className="game-container game-over">
        <div className="stars-bg"></div>
        <div className="game-over-screen">
          <div className="game-over-title">MISSION FAILED</div>
          <div className="final-score">
            <div className="score-label">FINAL SCORE</div>
            <div className="score-value">{score.toLocaleString()}</div>
            {playerRank > 0 && (
              <div className="player-rank">
                🏆 RANK: #{playerRank} / {totalPlayers}
              </div>
            )}
          </div>

          <div className="high-scores-table">
            <div className="table-header">
              <Trophy size={24} />
              <span>HALL OF FAME</span>
              <span className="total-players">
                ({totalPlayers} {totalPlayers === 1 ? "PILOT" : "PILOTS"})
              </span>
            </div>
            {highScores.length === 0 ? (
              <div className="no-scores">No scores yet. Be the first!</div>
            ) : (
              <div className="scores-list">
                {highScores.map((hs, i) => (
                  <div
                    key={i}
                    className={`score-row ${hs.name === playerName && hs.score === score ? "current" : ""}`}
                  >
                    <span className="position">#{i + 1}</span>
                    <span className="player-name">{hs.name}</span>
                    <span className="player-score">
                      {hs.score.toLocaleString()}
                    </span>
                    {hs.name === playerName && hs.score === score && (
                      <Star size={16} className="new-badge" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => setGameState("nameEntry")}
            className="restart-button"
          >
            RETURN TO BASE
          </button>
        </div>
      </div>
    );
  }

  // Playing Screen
  return (
    <div className="game-wrapper">
      <div
        className="game-canvas"
        style={{ width: canvasWidth, height: canvasHeight }}
      >
        <div className="space-bg"></div>

        {/* Developer Watermark */}
        <div className="developer-watermark">
          Developed by Emirhan Büyükşenirli
        </div>

        {/* Top panel - Shop and Bomb (game ceiling/boundary) */}
        <div className="top-panel">
          <div className="shop">
            <div className="shop-title">⚡ UPGRADES ⚡</div>
            <div className="shop-buttons">
              <button
                onClick={upgradeFireRate}
                disabled={credits < 100 || fireRate <= 100}
                className="shop-btn"
              >
                <Zap size={20} />
                <div className="shop-info">
                  <span className="upgrade-name">FIRE RATE</span>
                  <span className="cost">100 CR</span>
                </div>
              </button>
              <button
                onClick={upgradeDamage}
                disabled={credits < 150}
                className="shop-btn"
              >
                <Target size={20} />
                <div className="shop-info">
                  <span className="upgrade-name">DAMAGE +1</span>
                  <span className="cost">150 CR</span>
                </div>
              </button>
              <button
                onClick={buyShield}
                disabled={credits < 200 || shieldActive}
                className="shop-btn"
              >
                <Shield size={20} />
                <div className="shop-info">
                  <span className="upgrade-name">SHIELD</span>
                  <span className="cost">200 CR</span>
                </div>
              </button>
            </div>
          </div>

          {/* Bomb button in top panel */}
          <button
            className={`bomb-button ${bombAvailable ? "available" : "disabled"}`}
            onClick={useBomb}
            disabled={!bombAvailable}
          >
            💣
          </button>
        </div>

        <div className="hud">
          <div className="hud-item">
            <span className="label">SCORE:</span>
            <span className="value">{score.toLocaleString()}</span>
          </div>
          <button className="pause-btn" onClick={() => setGameState("paused")}>
            ⏸
          </button>
          <div className="hud-item">
            <span className="label">CREDITS:</span>
            <span className="value credits">{credits}</span>
          </div>
          <div className="hud-item">
            <span className="label">LIVES:</span>
            <span className="value lives">
              {Array.from({ length: lives }).map((_, i) => (
                <span key={i}>♥</span>
              ))}
            </span>
          </div>
        </div>

        <div
          ref={playerElementRef}
          className="player"
          style={{
            left: 0,
            top: 0,
            transform: `translate3d(${player.x - PLAYER_SIZE / 2}px, ${player.y - PLAYER_SIZE / 2}px, 0)`,
          }}
        >
          <img 
            src="spaceship.png" 
            alt="Player Ship" 
            className="ship-icon"
            style={{
              width: PLAYER_SIZE + 'px',
              height: PLAYER_SIZE + 'px',
              imageRendering: 'pixelated'
            }}
          />
          {shieldActive && <div className="shield"></div>}
        </div>

        {bullets.map((bullet) => (
          <div
            key={bullet.id}
            className="bullet"
            style={{
              left: bullet.x - BULLET_SIZE / 2,
              top: bullet.y - BULLET_SIZE / 2,
            }}
          />
        ))}

        {enemies.map((enemy) => (
          <div
            key={enemy.id}
            className={`enemy ${enemy.type}`}
            style={{
              left: enemy.x - ENEMY_SIZE / 2,
              top: enemy.y - ENEMY_SIZE / 2,
            }}
          >
            <Target size={ENEMY_SIZE} />
            <div className="enemy-hp-bar">
              <div
                className="enemy-hp-fill"
                style={{ width: `${(enemy.hp / enemy.maxHp) * 100}%` }}
              />
            </div>
          </div>
        ))}

        {powerups.map((powerup) => (
          <div
            key={powerup.id}
            className={`powerup ${powerup.type}`}
            style={{
              left: powerup.x - POWERUP_SIZE / 2,
              top: powerup.y - POWERUP_SIZE / 2,
            }}
          >
            {powerup.type === "shield" ? (
              <Shield size={POWERUP_SIZE} />
            ) : powerup.type === "bomb" ? (
              <div className="bomb-icon">💣</div>
            ) : powerup.type === "triple" ? (
              <div className="weapon-icon">⫸</div>
            ) : powerup.type === "dual" ? (
              <div className="weapon-icon">⫷⫸</div>
            ) : powerup.type === "surround" ? (
              <div className="weapon-icon">✦</div>
            ) : (
              <Zap size={POWERUP_SIZE} />
            )}
          </div>
        ))}

        {particles.map((particle) => (
          <div
            key={particle.id}
            className="particle"
            style={{
              left: particle.x,
              top: particle.y,
              background: particle.color,
              opacity: particle.life / 30,
            }}
          />
        ))}

        {isTouchDevice.current && touchPosition.current && (
          <div
            className="touch-indicator"
            style={{
              left: touchPosition.current.x - 40,
              top: touchPosition.current.y - 40,
            }}
          />
        )}

        {/* Special weapon indicator */}
        {specialWeapon && (
          <div className="special-weapon-indicator">
            <div className="weapon-name">
              {specialWeapon === "triple" && "⫸ TRIPLE SHOT"}
              {specialWeapon === "dual" && "⫷⫸ DUAL SHOT"}
              {specialWeapon === "surround" && "✦ SURROUND FIRE"}
            </div>
            <div className="weapon-timer">{Math.ceil(specialWeaponTimer)}s</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StellarAssault;