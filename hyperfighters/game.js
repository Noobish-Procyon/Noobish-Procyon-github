const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Game state
const game = {
    running: true,
    paused: false,
    score: 0,
    wave: 1,
    gold: 100,
    kills: 0,
    waveKills: 0,
    
    // Player properties
    player: {
        x: canvas.width / 2,
        y: canvas.height / 2,
        radius: 20,
        maxHealth: 100,
        health: 100,
        speed: 5,
        fireRate: 0.1, // bullets per frame
        bulletSpeed: 8,
        damage: 10,
        ultimatePower: 1,
        transformCooldown: 0,
        transformActive: false,
        transformDuration: 0,
        novaCooldown: 0,
        novaCharge: 0,
        novaCharging: false,
        shieldCooldown: 0,
        shieldTime: 0,
        dashCooldown: 0,
        laserCooldown: 0,
        laserCharge: 0,
        laserCharging: false,
        xMoveCooldown: 0,
        cProjectileCooldown: 0,
        vx: 0,
        vy: 0
    },
    
    // Upgrade levels
    upgrades: {
        fireRate: 1,
        damage: 1,
        health: 1,
        speed: 1,
        transform: 1
    },
    
    // Game entities
    enemies: [],
    bullets: [],
    particles: [],
    projectiles: [],
    laserBeams: [],
    barriers: [],
    trails: [],
    explosions: [],
    
    // Visual effects
    screenShakeIntensity: 0,
    screenFlashAlpha: 0,
    killCombo: 0,
    lastKillTime: 0,
    
    // Shooting
    bulletCounter: 0,
    
    // Wave management
    waveStartTime: 0,
    waveEnemyCount: 0,
    spawnedInWave: 0,
    maxEnemiesPerWave: 5,
    
    init() {
        this.waveStartTime = Date.now();
        this.spawnWave();
    },
    
    spawnWave() {
        this.maxEnemiesPerWave = 5 + this.wave * 2;
        this.waveKills = 0;
        this.spawnedInWave = 0;
        this.waveEnemyCount = 0;
    },
    
    spawnEnemy() {
        if (this.spawnedInWave >= this.maxEnemiesPerWave) {
            return;
        }
        
        const angle = Math.random() * Math.PI * 2;
        const distance = 400;
        const x = this.player.x + Math.cos(angle) * distance;
        const y = this.player.y + Math.sin(angle) * distance;
        
        const speed = 0.8 + this.wave * 0.2;
        const size = 8 + this.wave * 1.5;
        
        // Spawn boss every 5 waves
        const isBoss = this.wave > 1 && this.wave % 5 === 0 && Math.random() < 0.15;
        
        // Random enemy type
        const types = ['normal', 'fast', 'tank'];
        const type = isBoss ? 'boss' : types[Math.floor(Math.random() * types.length)];
        
        let health = 20 + this.wave * 5;
        let enemySpeed = speed;
        let enemySize = size;
        let color = '#FF0000';
        
        // Enemy type variations
        if (type === 'fast') {
            enemySpeed *= 1.5;
            health *= 0.7;
            color = '#FF6600';
        } else if (type === 'tank') {
            enemySpeed *= 0.6;
            health *= 2.5;
            color = '#CC0000';
            enemySize *= 1.3;
        } else if (type === 'boss') {
            enemySpeed *= 0.5;
            health *= 8;
            color = '#FF00FF';
            enemySize *= 2.5;
        }
        
        this.enemies.push({
            x: x,
            y: y,
            vx: 0,
            vy: 0,
            radius: enemySize,
            speed: enemySpeed,
            health: health,
            maxHealth: health,
            type: type,
            color: color
        });
        
        this.spawnedInWave++;
        this.waveEnemyCount++;
    },
    
    togglePause() {
        if (this.running) {
            this.paused = !this.paused;
            document.getElementById('pauseMenu').classList.toggle('hidden');
            if (!this.paused) {
                this.updateUpgradeDisplay();
            }
        }
    },
    
    buyUpgrade(type) {
        const costs = {
            fireRate: 50 * this.upgrades.fireRate,
            damage: 75 * this.upgrades.damage,
            health: 100 * this.upgrades.health,
            speed: 60 * this.upgrades.speed,
            transform: 150 * this.upgrades.transform,
            heal: 80
        };
        
        if (this.gold >= costs[type]) {
            this.gold -= costs[type];
            
            if (type === 'fireRate') {
                this.upgrades.fireRate++;
                this.player.fireRate *= 1.15;
            } else if (type === 'damage') {
                this.upgrades.damage++;
                this.player.damage *= 1.2;
            } else if (type === 'health') {
                this.upgrades.health++;
                this.player.maxHealth += 25;
                this.player.health = this.player.maxHealth;
            } else if (type === 'speed') {
                this.upgrades.speed++;
                this.player.speed *= 1.15;
            } else if (type === 'transform') {
                this.upgrades.transform++;
            } else if (type === 'heal') {
                this.player.health = Math.min(this.player.maxHealth, this.player.health + this.player.maxHealth * 0.25);
            }
            
            this.updateUpgradeDisplay();
        }
    },
    
    updateUpgradeDisplay() {
        document.getElementById('fireCost').textContent = Math.floor(50 * this.upgrades.fireRate);
        document.getElementById('damageCost').textContent = Math.floor(75 * this.upgrades.damage);
        document.getElementById('healthCost').textContent = Math.floor(100 * this.upgrades.health);
        document.getElementById('speedCost').textContent = Math.floor(60 * this.upgrades.speed);
        document.getElementById('transformCost').textContent = Math.floor(150 * this.upgrades.transform);
        document.getElementById('gold').textContent = this.gold;
        document.getElementById('kills').textContent = this.kills;
        document.getElementById('level').textContent = this.wave;
    },
    
    update() {
        if (this.paused) return;
        
        // Player movement
        const keys = this.keysPressed;
        const moveSpeedX = (keys['ArrowLeft'] || keys['a'] ? -1 : 0) + (keys['ArrowRight'] || keys['d'] ? 1 : 0);
        const moveSpeedY = (keys['ArrowUp'] || keys['w'] ? -1 : 0) + (keys['ArrowDown'] || keys['s'] ? 1 : 0);
        
        if (moveSpeedX !== 0 || moveSpeedY !== 0) {
            const length = Math.sqrt(moveSpeedX * moveSpeedX + moveSpeedY * moveSpeedY);
            this.player.vx = (moveSpeedX / length) * this.player.speed;
            this.player.vy = (moveSpeedY / length) * this.player.speed;
        } else {
            this.player.vx *= 0.9;
            this.player.vy *= 0.9;
        }
        
        this.player.x += this.player.vx;
        this.player.y += this.player.vy;
        
        // Keep player in bounds
        this.player.x = Math.max(this.player.radius, Math.min(canvas.width - this.player.radius, this.player.x));
        this.player.y = Math.max(this.player.radius, Math.min(canvas.height - this.player.radius, this.player.y));
        
        // Spawn enemies gradually
        if (Math.random() < 0.02 + this.wave * 0.01) {
            this.spawnEnemy();
        }
        
        // Auto-shoot towards nearest enemy
        if (this.enemies.length > 0) {
            this.bulletCounter += this.player.fireRate;
            if (this.bulletCounter >= 1) {
                this.bulletCounter -= 1;
                const nearest = this.findNearestEnemy();
                if (nearest) {
                    this.shoot(nearest);
                }
            }
        }
        
        // Update bullets
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            const bullet = this.bullets[i];
            bullet.x += bullet.vx;
            bullet.y += bullet.vy;
            
            // Add trail
            this.addTrail(bullet.x, bullet.y, bullet.vx, bullet.vy, '#FFD700', 2);
            
            // Check collision with enemies
            let hit = false;
            for (let j = this.enemies.length - 1; j >= 0; j--) {
                const enemy = this.enemies[j];
                const dist = Math.sqrt((bullet.x - enemy.x) ** 2 + (bullet.y - enemy.y) ** 2);
                if (dist < bullet.radius + enemy.radius) {
                    enemy.health -= this.player.damage;
                    this.createParticles(bullet.x, bullet.y, 8, '#FFD700');
                    this.flashScreen(0.1);
                    hit = true;
                    
                    if (enemy.health <= 0) {
                        this.enemies.splice(j, 1);
                        this.score += 10;
                        this.gold += 10;
                        this.kills++;
                        this.waveKills++;
                        
                        // Combo system
                        const now = Date.now();
                        if (now - this.lastKillTime < 500) {
                            this.killCombo++;
                        } else {
                            this.killCombo = 1;
                        }
                        this.lastKillTime = now;
                        
                        // Bigger explosions for combos and bosses
                        const multiplier = enemy.type === 'boss' ? 3 : enemy.type === 'tank' ? 1.5 : 1;
                        const comboBonus = Math.min(this.killCombo * 0.3, 2);
                        this.createExplosion(enemy.x, enemy.y, '#00FF00', 15 * multiplier * comboBonus, 25 * multiplier);
                        this.screenShake(10 * multiplier * comboBonus);\n                    }\n                    break;
                }
            }
            
            if (hit || bullet.x < -50 || bullet.x > canvas.width + 50 || bullet.y < -50 || bullet.y > canvas.height + 50) {
                this.bullets.splice(i, 1);
            }
        }
        
        // Update projectiles (Nova)
        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            const proj = this.projectiles[i];
            proj.x += proj.vx;
            proj.y += proj.vy;
            
            // Add trail
            this.addTrail(proj.x, proj.y, proj.vx, proj.vy, proj.color, 4);
            
            let hit = false;
            for (let j = this.enemies.length - 1; j >= 0; j--) {
                const enemy = this.enemies[j];
                const dist = Math.hypot(proj.x - enemy.x, proj.y - enemy.y);
                if (dist < proj.radius + enemy.radius) {
                    enemy.health -= proj.damage;
                    this.createParticles(proj.x, proj.y, 20, proj.color);
                    this.flashScreen(0.15);
                    hit = true;
                    
                    // Shatter mechanic - create shards on hit
                    if (proj.canShatter) {
                        for (let k = 0; k < 5; k++) {
                            const angle = (k * Math.PI * 2 / 5);
                            this.projectiles.push({
                                x: proj.x,
                                y: proj.y,
                                vx: Math.cos(angle) * 5,
                                vy: Math.sin(angle) * 5,
                                radius: 6,
                                damage: proj.damage * 0.5,
                                color: '#FFD700'
                            });
                        }
                    }
                    
                    if (enemy.health <= 0) {
                        this.enemies.splice(j, 1);
                        this.score += 20;
                        this.gold += 15;
                        this.kills++;
                        this.waveKills++;
                        
                        // Combo system
                        const now = Date.now();
                        if (now - this.lastKillTime < 500) {
                            this.killCombo++;
                        } else {
                            this.killCombo = 1;
                        }
                        this.lastKillTime = now;
                        
                        // Massive explosions for powerful projectiles and bosses
                        const multiplier = enemy.type === 'boss' ? 4 : enemy.type === 'tank' ? 2 : 1;
                        const comboBonus = Math.min(this.killCombo * 0.3, 2);
                        this.createExplosion(enemy.x, enemy.y, proj.color, 20 * multiplier * comboBonus, 35 * multiplier);
                        this.screenShake(15 * multiplier * comboBonus);\n                    }\n                    break;
                }
            }
            
            if (hit || proj.x < -100 || proj.x > canvas.width + 100 || proj.y < -100 || proj.y > canvas.height + 100) {
                this.projectiles.splice(i, 1);
            }
        }
        
        // Update laser beams
        for (let i = this.laserBeams.length - 1; i >= 0; i--) {
            const laser = this.laserBeams[i];
            laser.life--;
            
            for (let j = this.enemies.length - 1; j >= 0; j--) {
                const enemy = this.enemies[j];
                const ex = enemy.x - laser.x;
                const ey = enemy.y - laser.y;
                const dist = Math.abs(ex * laser.dy - ey * laser.dx);
                
                if (dist < enemy.radius + 3 && (ex * laser.dx + ey * laser.dy >= 0 && ex * laser.dx + ey * laser.dy <= laser.length)) {
                    enemy.health -= laser.damage / 20;
                    if (enemy.health <= 0) {
                        this.enemies.splice(j, 1);
                        this.score += 20;
                        this.gold += 15;
                        this.kills++;
                        this.waveKills++;
                        this.createParticles(enemy.x, enemy.y, 15, '#00FF00');
                    }
                }
            }
            
            if (laser.life <= 0) {
                this.laserBeams.splice(i, 1);
            }
        }
        
        // Update barriers
        for (let i = this.barriers.length - 1; i >= 0; i--) {
            const barrier = this.barriers[i];
            barrier.life--;
            barrier.angle += 0.05;
            
            for (let j = this.enemies.length - 1; j >= 0; j--) {
                const enemy = this.enemies[j];
                const d = Math.hypot(enemy.x - barrier.x, enemy.y - barrier.y);
                if (d < barrier.radius + enemy.radius + 20) {
                    enemy.health -= barrier.damage / 20;
                    if (enemy.health <= 0) {
                        this.enemies.splice(j, 1);
                        this.score += 20;
                        this.gold += 15;
                        this.kills++;
                        this.waveKills++;
                        this.createParticles(enemy.x, enemy.y, 15, '#FF00FF');
                    }
                }
            }
            
            if (barrier.life <= 0) {
                this.barriers.splice(i, 1);
            }
        }
        
        // Charge nova while key held
        if (this.keysPressed['q'] || this.keysPressed['Q']) {
            this.chargeNova();
        }
        
        // Charge laser while key held
        if (this.keysPressed['z'] || this.keysPressed['Z']) {
            this.chargeLaser();
        }
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const enemy = this.enemies[i];
            
            // Chase player
            const dx = this.player.x - enemy.x;
            const dy = this.player.y - enemy.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance > 0) {
                enemy.vx = (dx / distance) * enemy.speed;
                enemy.vy = (dy / distance) * enemy.speed;
            }
            
            enemy.x += enemy.vx;
            enemy.y += enemy.vy;
            
            // Check collision with player
            const playerDist = Math.sqrt((enemy.x - this.player.x) ** 2 + (enemy.y - this.player.y) ** 2);
            if (playerDist < enemy.radius + this.player.radius) {
                if (this.player.shieldTime <= 0) this.player.health -= 0.5;
                this.createParticles(enemy.x, enemy.y, 8, '#FF0000');
            }
        }
        
        // Update particles
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.1; // gravity
            p.life--;
            
            if (p.life <= 0) {
                this.particles.splice(i, 1);
            }
        }
        
        // Ultimate cooldown
        if (this.player.transformCooldown > 0) this.player.transformCooldown--;
        if (this.player.transformDuration > 0) this.player.transformDuration--;
        if (this.player.novaCooldown > 0) this.player.novaCooldown--;
        if (this.player.shieldCooldown > 0) this.player.shieldCooldown--;
        if (this.player.dashCooldown > 0) this.player.dashCooldown--;
        if (this.player.laserCooldown > 0) this.player.laserCooldown--;
        if (this.player.xMoveCooldown > 0) this.player.xMoveCooldown--;
        if (this.player.cProjectileCooldown > 0) this.player.cProjectileCooldown--;
        if (this.player.shieldTime > 0) this.player.shieldTime--;
        
        // Handle transform end
        if (this.player.transformDuration <= 0 && this.player.transformActive) {
            this.player.transformActive = false;
            this.player.radius = 20;
            this.player.speed = 5 * Math.pow(1.15, this.upgrades.speed - 1);
            this.createParticles(this.player.x, this.player.y, 30, '#FFD700');
        }
        
        // Check wave completion
        if (this.waveKills >= this.maxEnemiesPerWave && this.enemies.length === 0) {
            this.wave++;
            this.spawnWave();
        }
        
        // Check game over
        if (this.player.health <= 0) {
            this.gameOver();
        }
        
        // Update UI
        document.getElementById('score').textContent = this.score;
        document.getElementById('wave').textContent = this.wave;
        document.getElementById('enemyCount').textContent = this.enemies.length;
        document.getElementById('health').textContent = Math.ceil(this.player.health);
        this.updateAbilityDisplay();
    },

    updateAbilityDisplay() {
        const status = (cooldown, label) => cooldown > 0 ? `${label} ${Math.ceil(cooldown / 60)}s` : `${label} READY`;
        document.getElementById('novaStatus').textContent = this.player.novaCharging ? `Q NOVA CHARGING ${Math.ceil(this.player.novaCharge)}%` : status(this.player.novaCooldown, 'Q NOVA');
        document.getElementById('shieldStatus').textContent = this.player.shieldTime > 0 ? `E SHIELD ${Math.ceil(this.player.shieldTime / 60)}s` : status(this.player.shieldCooldown, 'E SHIELD');
        document.getElementById('dashStatus').textContent = status(this.player.dashCooldown, 'SHIFT DASH');
        document.getElementById('transformStatus').textContent = this.player.transformActive ? `V TRANSFORM ${Math.ceil(this.player.transformDuration / 60)}s` : status(this.player.transformCooldown, 'V TRANSFORM');
        document.getElementById('laserStatus').textContent = this.player.laserCharging ? `Z LASER CHARGING ${Math.ceil(this.player.laserCharge)}%` : status(this.player.laserCooldown, 'Z LASER');
        document.getElementById('xMoveStatus').textContent = status(this.player.xMoveCooldown, 'X MOVE');
        document.getElementById('cProjectileStatus').textContent = status(this.player.cProjectileCooldown, 'C PROJECTILE');
    },
    
    shoot(target) {
        const dx = target.x - this.player.x;
        const dy = target.y - this.player.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 0) {
            this.bullets.push({
                x: this.player.x + (dx / distance) * this.player.radius,
                y: this.player.y + (dy / distance) * this.player.radius,
                vx: (dx / distance) * this.player.bulletSpeed,
                vy: (dy / distance) * this.player.bulletSpeed,
                radius: 5
            });
        }
    },
    
    findNearestEnemy() {
        let nearest = null;
        let minDist = Infinity;
        
        for (const enemy of this.enemies) {
            const dist = Math.sqrt((enemy.x - this.player.x) ** 2 + (enemy.y - this.player.y) ** 2);
            if (dist < minDist) {
                minDist = dist;
                nearest = enemy;
            }
        }
        
        return nearest;
    },

    startNovaCharge() {
        if (this.player.novaCooldown > 0 || this.paused || !this.running) return;
        this.player.novaCharging = true;
        this.player.novaCharge = 0;
    },

    chargeNova() {
        if (!this.player.novaCharging || this.paused || !this.running) return;
        this.player.novaCharge = Math.min(100, this.player.novaCharge + 5);
    },

    launchNovaProjectile() {
        if (!this.player.novaCharging) return;
        this.player.novaCharging = false;
        const power = Math.max(1, this.player.novaCharge / 100);
        const nearest = this.findNearestEnemy();
        if (!nearest) {
            this.player.novaCharge = 0;
            return;
        }
        const dx = nearest.x - this.player.x;
        const dy = nearest.y - this.player.y;
        const distance = Math.hypot(dx, dy);
        this.projectiles.push({
            x: this.player.x + (dx / distance) * this.player.radius,
            y: this.player.y + (dy / distance) * this.player.radius,
            vx: (dx / distance) * (6 + power * 8),
            vy: (dy / distance) * (6 + power * 8),
            radius: 12 + power * 8,
            damage: this.player.damage * (2 + power * 3),
            color: power > 0.7 ? '#FF0000' : '#FF7A00'
        });
        this.createParticles(this.player.x, this.player.y, 20, '#FF7A00');
        this.player.novaCooldown = 240;
        this.player.novaCharge = 0;
    },

    shieldAbility() {
        if (this.player.shieldCooldown > 0 || this.paused || !this.running) return;
        this.player.shieldTime = 300;
        this.player.shieldCooldown = 600;
        this.createParticles(this.player.x, this.player.y, 25, '#4D9CFF');
    },

    dashAbility() {
        if (this.player.dashCooldown > 0 || this.paused || !this.running) return;
        let dx = (this.keysPressed['ArrowRight'] || this.keysPressed['d'] ? 1 : 0) - (this.keysPressed['ArrowLeft'] || this.keysPressed['a'] ? 1 : 0);
        let dy = (this.keysPressed['ArrowDown'] || this.keysPressed['s'] ? 1 : 0) - (this.keysPressed['ArrowUp'] || this.keysPressed['w'] ? 1 : 0);
        if (!dx && !dy) dy = -1;
        const length = Math.hypot(dx, dy);
        this.player.x = Math.max(this.player.radius, Math.min(canvas.width - this.player.radius, this.player.x + dx / length * 150));
        this.player.y = Math.max(this.player.radius, Math.min(canvas.height - this.player.radius, this.player.y + dy / length * 150));
        this.player.dashCooldown = 180;
        this.createParticles(this.player.x, this.player.y, 20, '#00FFFF');
    },

    transformAbility() {
        if (this.player.transformCooldown > 0 || this.paused || !this.running) return;
        this.player.transformActive = true;
        this.player.transformDuration = 420;
        this.player.transformCooldown = 720;
        this.player.radius = 35;
        this.player.speed *= 1.3;
        this.createParticles(this.player.x, this.player.y, 50, '#FF00FF');
    },

    startLaserCharge() {
        if (this.player.laserCooldown > 0 || this.paused || !this.running) return;
        this.player.laserCharging = true;
        this.player.laserCharge = 0;
        this.laserFireCounter = 0;
    },

    chargeLaser() {
        if (!this.player.laserCharging || this.paused || !this.running) return;
        this.player.laserCharge = Math.min(100, this.player.laserCharge + 2);
        
        // Fire continuous laser beams while holding
        this.laserFireCounter++;
        if (this.laserFireCounter >= 8) {  // Fire every ~8 frames
            const nearest = this.findNearestEnemy();
            if (nearest) {
                const dx = nearest.x - this.player.x;
                const dy = nearest.y - this.player.y;
                const distance = Math.hypot(dx, dy);
                this.laserBeams.push({
                    x: this.player.x,
                    y: this.player.y,
                    dx: dx / distance,
                    dy: dy / distance,
                    length: 600,
                    damage: this.player.damage * 1.5,
                    life: 20
                });
                this.createParticles(this.player.x, this.player.y, 10, '#00FF00');
            }
            this.laserFireCounter = 0;
        }
    },

    releaseLaserProjectile() {
        if (!this.player.laserCharging) return;
        this.player.laserCharging = false;
        
        // Fire projectile based on charge time
        if (this.player.laserCharge > 0) {
            const power = Math.max(1, this.player.laserCharge / 100);
            const nearest = this.findNearestEnemy();
            if (nearest) {
                const dx = nearest.x - this.player.x;
                const dy = nearest.y - this.player.y;
                const distance = Math.hypot(dx, dy);
                this.projectiles.push({
                    x: this.player.x + (dx / distance) * this.player.radius,
                    y: this.player.y + (dy / distance) * this.player.radius,
                    vx: (dx / distance) * (7 + power * 8),
                    vy: (dy / distance) * (7 + power * 8),
                    radius: 10 + power * 8,
                    damage: this.player.damage * (2 + power * 2),
                    color: '#00FF00'
                });
                this.createParticles(this.player.x, this.player.y, 30, '#00FF00');
            }
        }
        
        this.player.laserCooldown = 240;
        this.player.laserCharge = 0;
        this.laserFireCounter = 0;
    },

    xMove() {
        if (this.player.xMoveCooldown > 0 || this.paused || !this.running) return;
        let dx = (this.keysPressed['ArrowRight'] || this.keysPressed['d'] ? 1 : 0) - (this.keysPressed['ArrowLeft'] || this.keysPressed['a'] ? 1 : 0);
        let dy = (this.keysPressed['ArrowDown'] || this.keysPressed['s'] ? 1 : 0) - (this.keysPressed['ArrowUp'] || this.keysPressed['w'] ? 1 : 0);
        if (!dx && !dy) dy = -1;
        const length = Math.hypot(dx, dy);
        this.player.x = Math.max(this.player.radius, Math.min(canvas.width - this.player.radius, this.player.x + dx / length * 200));
        this.player.y = Math.max(this.player.radius, Math.min(canvas.height - this.player.radius, this.player.y + dy / length * 200));
        this.player.xMoveCooldown = 150;
        this.createParticles(this.player.x, this.player.y, 25, '#FF00FF');
    },

    cProjectile() {
        if (this.player.cProjectileCooldown > 0 || this.paused || !this.running) return;
        const nearest = this.findNearestEnemy();
        if (!nearest) return;
        
        // Shoot 3 projectiles in a spread
        for (let i = -1; i <= 1; i++) {
            const baseAngle = Math.atan2(nearest.y - this.player.y, nearest.x - this.player.x);
            const angle = baseAngle + (i * 0.3);
            const dx = Math.cos(angle);
            const dy = Math.sin(angle);
            
            this.projectiles.push({
                x: this.player.x + dx * this.player.radius,
                y: this.player.y + dy * this.player.radius,
                vx: dx * 7,
                vy: dy * 7,
                radius: 8,
                damage: this.player.damage * 1.5,
                color: '#FF69B4'
            });
        }
        this.createParticles(this.player.x, this.player.y, 20, '#FF69B4');
        this.player.cProjectileCooldown = 200;
    },

    // Transformed Moveset
    voidBurst() {
        if (this.player.novaCooldown > 0 || this.paused || !this.running) return;
        // Fire projectiles in 6 directions
        for (let i = 0; i < 6; i++) {
            const angle = (i * Math.PI * 2 / 6);
            const dx = Math.cos(angle);
            const dy = Math.sin(angle);
            this.projectiles.push({
                x: this.player.x + dx * this.player.radius,
                y: this.player.y + dy * this.player.radius,
                vx: dx * 8,
                vy: dy * 8,
                radius: 12,
                damage: this.player.damage * 2.5,
                color: '#9D00FF'
            });
        }
        this.createParticles(this.player.x, this.player.y, 40, '#9D00FF');
        this.player.novaCooldown = 180;
    },

    reflectBarrier() {
        if (this.player.shieldCooldown > 0 || this.paused || !this.running) return;
        this.player.shieldTime = 300;
        this.player.shieldCooldown = 600;
        // Damage enemies nearby while shield is active
        this.barriers = this.barriers || [];
        this.barriers.push({
            x: this.player.x,
            y: this.player.y,
            radius: 50,
            damage: this.player.damage * 1.5,
            life: 300,
            angle: 0
        });
        this.createParticles(this.player.x, this.player.y, 50, '#FF00FF');
    },

    blinkStrike() {
        if (this.player.dashCooldown > 0 || this.paused || !this.running) return;
        let dx = (this.keysPressed['ArrowRight'] || this.keysPressed['d'] ? 1 : 0) - (this.keysPressed['ArrowLeft'] || this.keysPressed['a'] ? 1 : 0);
        let dy = (this.keysPressed['ArrowDown'] || this.keysPressed['s'] ? 1 : 0) - (this.keysPressed['ArrowUp'] || this.keysPressed['w'] ? 1 : 0);
        if (!dx && !dy) dy = -1;
        const length = Math.hypot(dx, dy);
        this.player.x = Math.max(this.player.radius, Math.min(canvas.width - this.player.radius, this.player.x + dx / length * 200));
        this.player.y = Math.max(this.player.radius, Math.min(canvas.height - this.player.radius, this.player.y + dy / length * 200));
        
        // Leave shockwave behind
        this.createParticles(this.player.x, this.player.y, 40, '#FF00FF');
        for (let enemy of this.enemies) {
            const d = Math.hypot(enemy.x - this.player.x, enemy.y - this.player.y);
            if (d < 120) {
                enemy.health -= this.player.damage * 2;
            }
        }
        
        this.player.dashCooldown = 120;
    },

    laserBarrage() {
        if (this.player.laserCooldown > 0 || this.paused || !this.running) return;
        // Fire lasers in 4 directions
        const directions = [[0, -1], [1, 0], [0, 1], [-1, 0]];
        for (let [dx, dy] of directions) {
            this.laserBeams.push({
                x: this.player.x,
                y: this.player.y,
                dx: dx,
                dy: dy,
                length: 800,
                damage: this.player.damage * 2,
                life: 25
            });
        }
        this.createParticles(this.player.x, this.player.y, 50, '#00FF00');
        this.player.laserCooldown = 180;
    },

    phaseJump() {
        if (this.player.xMoveCooldown > 0 || this.paused || !this.running) return;
        let dx = (this.keysPressed['ArrowRight'] || this.keysPressed['d'] ? 1 : 0) - (this.keysPressed['ArrowLeft'] || this.keysPressed['a'] ? 1 : 0);
        let dy = (this.keysPressed['ArrowDown'] || this.keysPressed['s'] ? 1 : 0) - (this.keysPressed['ArrowUp'] || this.keysPressed['w'] ? 1 : 0);
        if (!dx && !dy) dy = -1;
        const length = Math.hypot(dx, dy);
        this.player.x = Math.max(this.player.radius, Math.min(canvas.width - this.player.radius, this.player.x + dx / length * 300));
        this.player.y = Math.max(this.player.radius, Math.min(canvas.height - this.player.radius, this.player.y + dy / length * 300));
        this.createParticles(this.player.x, this.player.y, 50, '#00FFFF');
        this.player.xMoveCooldown = 100;
    },

    shatter() {
        if (this.player.cProjectileCooldown > 0 || this.paused || !this.running) return;
        const nearest = this.findNearestEnemy();
        if (!nearest) return;
        
        // Shoot 1 large projectile
        const dx = nearest.x - this.player.x;
        const dy = nearest.y - this.player.y;
        const distance = Math.hypot(dx, dy);
        
        this.projectiles.push({
            x: this.player.x + (dx / distance) * this.player.radius,
            y: this.player.y + (dy / distance) * this.player.radius,
            vx: (dx / distance) * 6,
            vy: (dy / distance) * 6,
            radius: 16,
            damage: this.player.damage * 3,
            color: '#FFD700',
            canShatter: true
        });
        this.createParticles(this.player.x, this.player.y, 30, '#FFD700');
        this.player.cProjectileCooldown = 150;
    },

    createParticles(x, y, count, color) {
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 3 + 1;
            this.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: 30,
                color: color,
                size: Math.random() * 4 + 2
            });
        }
    },
    
    screenShake(intensity = 5) {
        this.screenShakeIntensity = Math.max(this.screenShakeIntensity, intensity);
    },
    
    flashScreen(alpha = 0.3) {
        this.screenFlashAlpha = Math.max(this.screenFlashAlpha, alpha);
    },
    
    createExplosion(x, y, color = '#FF6600', size = 20, count = 30) {
        this.explosions.push({
            x: x,
            y: y,
            color: color,
            size: size,
            life: 40,
            maxLife: 40,
            count: count
        });
        this.createParticles(x, y, count, color);
        this.screenShake(size / 5);
    },
    
    addTrail(x, y, vx, vy, color, radius = 3) {
        this.trails.push({
            x: x,
            y: y,
            vx: vx * 0.8,
            vy: vy * 0.8,
            color: color,
            radius: radius,
            life: 20,
            maxLife: 20
        });
    },
    
    gameOver() {
        this.running = false;
        document.getElementById('gameOverScreen').classList.remove('hidden');
        document.getElementById('finalScore').textContent = this.score;
        document.getElementById('wavesSurvived').textContent = this.wave - 1;
        document.getElementById('enemiesDefeated').textContent = this.kills;
        document.getElementById('goldEarned').textContent = this.gold;
    },
    
    keysPressed: {}
};

// Input handling
document.addEventListener('keydown', (e) => {
    game.keysPressed[e.key] = true;
    
    if (e.key === ' ') {
        e.preventDefault();
        game.togglePause();
    }
    if (e.repeat) return;
    
    // Check if transformed for alternate moveset
    if (game.player.transformActive) {
        if (e.key.toLowerCase() === 'q') game.voidBurst();
        if (e.key.toLowerCase() === 'e') game.reflectBarrier();
        if (e.key === 'Shift') game.blinkStrike();
        if (e.key.toLowerCase() === 'z') game.laserBarrage();
        if (e.key.toLowerCase() === 'x') game.phaseJump();
        if (e.key.toLowerCase() === 'c') game.shatter();
        return;
    }
    
    // Normal moveset
    if (e.key.toLowerCase() === 'q') game.startNovaCharge();
    if (e.key.toLowerCase() === 'e') game.shieldAbility();
    if (e.key === 'Shift') game.dashAbility();
    if (e.key.toLowerCase() === 'v') game.transformAbility();
    if (e.key.toLowerCase() === 'z') game.startLaserCharge();
    if (e.key.toLowerCase() === 'x') game.xMove();
    if (e.key.toLowerCase() === 'c') game.cProjectile();
});

document.addEventListener('keyup', (e) => {
    game.keysPressed[e.key] = false;
    if (!game.player.transformActive) {
        if (e.key.toLowerCase() === 'q') game.launchNovaProjectile();
        if (e.key.toLowerCase() === 'z') game.releaseLaserProjectile();
    }
});

// Click to charge nova
document.addEventListener('click', () => {
    if (!game.paused && game.running) {
        game.startNovaCharge();
    }
});

document.addEventListener('mouseup', () => {
    if (!game.paused && game.running) {
        game.launchNovaProjectile();
    }
});

// Window resize
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// Render
function render() {
    // Draw background with gradient
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#0a0a15');
    gradient.addColorStop(0.5, '#1a1a2e');
    gradient.addColorStop(1, '#0a0a15');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid background
    ctx.strokeStyle = 'rgba(0, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += 50) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += 50) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }
    
    if (game.paused) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    
    // Draw player
    const player = game.player;
    const playerColor = player.transformActive ? '#FF00FF' : '#00FFFF';
    
    // Player outer glow (pulsing)
    const pulse = Math.sin(Date.now() / 150) * 0.3 + 0.7;
    ctx.fillStyle = `rgba(0, ${player.transformActive ? '255' : '255'}, ${player.transformActive ? '255' : '255'}, ${0.1 * pulse})`;
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.radius + 25 + pulse * 5, 0, Math.PI * 2);
    ctx.fill();
    
    // Player glow ring
    ctx.strokeStyle = `rgba(${player.transformActive ? '255, 0, 255' : '0, 255, 255'}, 0.6)`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.radius + 12, 0, Math.PI * 2);
    ctx.stroke();
    
    // Player core
    ctx.fillStyle = playerColor;
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw transform glow
    if (player.transformActive) {
        ctx.strokeStyle = 'rgba(255, 0, 255, 0.6)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(player.x, player.y, player.radius + 15, 0, Math.PI * 2);
        ctx.stroke();
    }
    
    // Draw shield effect
    if (player.shieldTime > 0) {
        ctx.strokeStyle = `rgba(77, 156, 255, ${player.shieldTime / 300})`;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(player.x, player.y, player.radius + 20, 0, Math.PI * 2);
        ctx.stroke();
    }
    
    // Draw health bar on player
    ctx.fillStyle = '#FF0000';
    ctx.fillRect(player.x - 25, player.y - 40, 50, 5);
    ctx.fillStyle = '#00FF00';
    const healthPercent = player.health / player.maxHealth;
    ctx.fillRect(player.x - 25, player.y - 40, 50 * healthPercent, 5);
    
    // Draw nova charge bar
    if (player.novaCharging) {
        ctx.fillStyle = '#FF7A00';
        ctx.fillRect(player.x - 35, player.y + 35, 70, 8);
        ctx.fillStyle = '#FFAA00';
        ctx.fillRect(player.x - 35, player.y + 35, 70 * (player.novaCharge / 100), 8);
    }
    
    // Draw laser charge bar
    if (player.laserCharging) {
        ctx.fillStyle = '#00AA00';
        ctx.fillRect(player.x - 35, player.y + 45, 70, 8);
        ctx.fillStyle = '#00FF00';
        ctx.fillRect(player.x - 35, player.y + 45, 70 * (player.laserCharge / 100), 8);
    }
    
    // Draw bullets with glow
    for (const bullet of game.bullets) {
        // Bullet glow
        ctx.fillStyle = 'rgba(255, 215, 0, 0.3)';
        ctx.beginPath();
        ctx.arc(bullet.x, bullet.y, bullet.radius * 2.5, 0, Math.PI * 2);
        ctx.fill();
        
        // Bullet core
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(bullet.x, bullet.y, bullet.radius, 0, Math.PI * 2);
        ctx.fill();
    }
    
    // Draw nova projectiles with enhanced glow
    for (const proj of game.projectiles) {
        // Projectile glow
        ctx.fillStyle = proj.color === '#FF0000' ? 'rgba(255, 0, 0, 0.2)' : 'rgba(255, 122, 0, 0.2)';
        ctx.beginPath();
        ctx.arc(proj.x, proj.y, proj.radius + 10, 0, Math.PI * 2);
        ctx.fill();
        
        // Projectile stroke
        ctx.strokeStyle = proj.color;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(proj.x, proj.y, proj.radius, 0, Math.PI * 2);
        ctx.stroke();
        
        // Projectile core (brighter)
        ctx.fillStyle = proj.color;
        ctx.beginPath();
        ctx.arc(proj.x, proj.y, proj.radius * 0.6, 0, Math.PI * 2);
        ctx.fill();
    }
    
    // Draw laser beams with enhanced glow
    for (const laser of game.laserBeams) {
        // Laser glow
        ctx.strokeStyle = 'rgba(0, 255, 0, 0.2)';
        ctx.lineWidth = 16;
        ctx.beginPath();
        ctx.moveTo(laser.x, laser.y);
        ctx.lineTo(laser.x + laser.dx * laser.length, laser.y + laser.dy * laser.length);
        ctx.stroke();
        
        // Laser core
        ctx.strokeStyle = 'rgba(0, 255, 0, 0.8)';
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.moveTo(laser.x, laser.y);
        ctx.lineTo(laser.x + laser.dx * laser.length, laser.y + laser.dy * laser.length);
        ctx.stroke();
        
        // Laser bright center
        ctx.strokeStyle = '#00FF00';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(laser.x, laser.y);
        ctx.lineTo(laser.x + laser.dx * laser.length, laser.y + laser.dy * laser.length);
        ctx.stroke();
    }
    
    // Draw barriers
    for (const barrier of game.barriers) {
        // Barrier glow
        ctx.fillStyle = `rgba(255, 0, 255, ${0.1 * (barrier.life / 300)})`;
        ctx.beginPath();
        ctx.arc(barrier.x, barrier.y, barrier.radius + 20, 0, Math.PI * 2);
        ctx.fill();
        
        // Barrier ring
        ctx.strokeStyle = `rgba(255, 0, 255, ${0.6 * (barrier.life / 300)})`;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(barrier.x, barrier.y, barrier.radius, 0, Math.PI * 2);
        ctx.stroke();
        
        // Spinning spikes
        ctx.strokeStyle = `rgba(255, 0, 255, ${0.8 * (barrier.life / 300)})`;
        ctx.lineWidth = 2;
        for (let i = 0; i < 8; i++) {
            const angle = barrier.angle + (i * Math.PI * 2 / 8);
            const x1 = barrier.x + Math.cos(angle) * barrier.radius;
            const y1 = barrier.y + Math.sin(angle) * barrier.radius;
            const x2 = barrier.x + Math.cos(angle) * (barrier.radius + 15);
            const y2 = barrier.y + Math.sin(angle) * (barrier.radius + 15);
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
        }
    }
    
    // Draw enemies with glow
    for (const enemy of game.enemies) {
        // Enemy outer glow
        ctx.fillStyle = 'rgba(255, 50, 50, 0.2)';
        ctx.beginPath();
        ctx.arc(enemy.x, enemy.y, enemy.radius + 12, 0, Math.PI * 2);
        ctx.fill();
        
        // Enemy glow ring
        ctx.strokeStyle = 'rgba(255, 100, 100, 0.5)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(enemy.x, enemy.y, enemy.radius + 5, 0, Math.PI * 2);
        ctx.stroke();
        
        // Enemy core
        ctx.fillStyle = '#FF3333';
        ctx.beginPath();
        ctx.arc(enemy.x, enemy.y, enemy.radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Enemy health bar background
        ctx.fillStyle = '#660000';
        ctx.fillRect(enemy.x - 16, enemy.y - 27, 32, 5);
        
        // Enemy health bar
        ctx.fillStyle = '#FF0000';
        ctx.fillRect(enemy.x - 15, enemy.y - 26, 30, 3);
        ctx.fillStyle = '#00FF00';
        const enemyHealthPercent = enemy.health / enemy.maxHealth;
        ctx.fillRect(enemy.x - 15, enemy.y - 26, 30 * enemyHealthPercent, 3);
    }
    
    // Draw particles
    for (const p of game.particles) {
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.life / 30;
        ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
        ctx.globalAlpha = 1;
    }
}

// Game loop
function gameLoop() {
    game.update();
    render();
    requestAnimationFrame(gameLoop);
}

// Initialize and start
game.init();
gameLoop();
