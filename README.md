# Noobish Procyon Games

A collection of small browser games and interactive prototypes. The projects
range from quick arcade and arena games to strategy, exploration, and collection
experiences. The repository homepage links to the featured games, and each game
can also be opened from its own project folder.

## Getting Started

No root-level build step is required. Open `index.html` in a browser to browse
the collection, or serve the repository with any static web server. For example:

```sh
python3 -m http.server 8000
```

Then visit `http://localhost:8000`. To launch a game directly, open its linked
`index.html` below. Controls vary by game; follow the instructions shown on its
start screen or in-game interface.

## Game Collection

### Clean Up.io

An arcade collection game built around a growing black hole. Drag geometric
shapes into the hole to collect points; different shapes and rare mutations are
worth different amounts. Spend points to expand the hole, increase scoring, or
draw nearby shapes in automatically.

Launch: [`clean-up.io/index.html`](clean-up.io/index.html)

### Shape Summoner

An arena survival game where you move, fire projectiles, and summon shape allies.
Choose a shape, combine summons, earn upgrades, and face increasingly dangerous
bosses.

Launch: [`shapesummoner/index.html`](shapesummoner/index.html)

### Fusion Lab

Build and fuse a fighter, then take it into battle. The game separates its
battle, enemy, fusion, and save systems into small JavaScript modules.

Launch: [`FusionLab/index.html`](FusionLab/index.html)

### Shape Summoner Legacy

The earlier Shape Summoner edition: a real-time arena game with shape selection,
summoning, upgrades, and boss fights. It is kept alongside the newer version as
a separate playable project.

Launch: [`shapesummonerlegacy/index.html`](shapesummonerlegacy/index.html)

### Orbital Defense

Protect the central core from incoming enemy waves. Place radial sentries around
the orbit and manage your defenses as the swarm presses inward.

Launch: [`orbit-defenders/index.html`](orbit-defenders/index.html)

### Orbfront

A small tactical battlefield game. Spend energy to deploy units with different
roles, push across the front line, and destroy the opposing citadel while
defending your own.

Launch: [`tbs/index.html`](tbs/index.html)

### Starfall Academy

A fantasy learning adventure with a journey through multiple locations, spell
choices, companions, and turn-based encounters. Solve challenges to advance your
quest and improve your performance.

Launch: [`starfall-academy/index.html`](starfall-academy/index.html)

### Shape Summoner Remastered

A refreshed arena-survival take on Shape Summoner. Fight through escalating
waves, collect shards, fire at threats, and place temporary barriers; choose
upgrades between waves to strengthen your build.

Launch: [`shapesummonerremastered/index.html`](shapesummonerremastered/index.html)

### HyperFighters

Survive enemy waves in a fast arena combat game. Use a roster of special attacks,
including dashes, shields, projectiles, and transformations, and spend earned
rewards on upgrades. The game offers both computer and mobile controls.

Launch: [`hyperfighters/index.html`](hyperfighters/index.html)

### Circlebound Dungeon Run

Descend through connected dungeon rooms, fight enemies, and collect relics.
Choose a class, gain upgrades, and use a movement joystick and dash control on
mobile or keyboard controls on a computer.

Launch: [`dungeoncrawlers/index.html`](dungeoncrawlers/index.html)

### Orb Trading

A collection and market game centered on gacha-style orb pulls. Compare rarity
odds, build an inventory, trade for higher-rarity finds, and explore additional
market and progression systems. Collection data is saved in the browser.

Launch: [`orb-trading/index.html`](orb-trading/index.html)

### Shape Portal Maze

A compact maze exploration prototype. Move through enclosed rooms and use
portals to navigate loops, reach new areas, and find the end of the route.

Launch: [`shapeportals/index.html`](shapeportals/index.html)

## Project Notes

- Each project is a standalone browser experience with its own entry page and
	game code.
- Most projects use plain HTML, CSS, and JavaScript; some keep their gameplay in
	a single page, while others split it across files.
- There is no shared package manager or build configuration at the repository
	root.
- Browser support, controls, and saved progress vary between projects.

