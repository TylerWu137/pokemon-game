// audio alert
alert("click game to enable audio effects")

// access html element in js
const canvas = document.querySelector('canvas')
// allows drawing anything on canvas (c is short for context)
const c = canvas.getContext('2d')

// creating collision blocks
const offset = {
    x: -256,
    y: -450
}

const collisionsMap = []
for (let i = 0; i < collisions.length; i+=70) {
    collisionsMap.push(collisions.slice(i,70 + i))
}

const boundaries = []

collisionsMap.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if (symbol === 1025) {
            boundaries.push(new Boundary({position: {
                x: j * Boundary.width + offset.x,
                y: i * Boundary.height + offset.y
            }
        }))
    }})
})

// creating battle zones
const battleZonesMap = []
for (let i = 0; i < battleZonesData.length; i+=70) {
    battleZonesMap.push(battleZonesData.slice(i,70 + i))
}

const battleZones = []

battleZonesMap.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if (symbol === 1025) {
            battleZones.push(new Boundary({position: {
                x: j * Boundary.width + offset.x,
                y: i * Boundary.height + offset.y
            }
        }))
    }})
})

// changing canvas dimensions + location for prettiness
canvas.width = 1024
canvas.height = 576
canvas.style = "position: absolute; top: 100px; left: 0px; right: 0px; bottom: 100px; margin: auto"

// creating pellet town background + player images
const image = new Image()
image.src = './img/Pellet Town.png'

const foregroundImage = new Image()
foregroundImage.src = './img/foregroundObjects.png'

const playerDownImage = new Image()
playerDownImage.src = './img/playerDown.png'

const playerUpImage = new Image()
playerUpImage.src = './img/playerUp.png'

const playerLeftImage = new Image()
playerLeftImage.src = './img/playerLeft.png'

const playerRightImage = new Image()
playerRightImage.src = './img/playerRight.png'

// player Sprite
const player = new Sprite({
    position: {
        x: canvas.width/2 - 192/8,   // x location
        y: canvas.height/2 - 68/4,  // y location
    },
    image: playerDownImage,
    frames: {
        max: 4,
        hold: 10
    },
    sprites: {
        up: playerUpImage,
        left: playerLeftImage,
        right: playerRightImage,
        down: playerDownImage
    }
})

// background Sprite
const background = new Sprite({
    position: {
        x: offset.x,
        y: offset.y
    },
    image: image
})

// foreground objects Sprite
const foreground = new Sprite({
    position: {
        x: offset.x,
        y: offset.y
    },
    image: foregroundImage
})

// using keys to "move player"
const keys = {
    w: {
        pressed: false
    },
    a: {
        pressed: false
    },
    s: {
        pressed: false
    },
    d: {
        pressed: false
    }
}

// collision detection
const movables = [background, ...boundaries, foreground, ...battleZones]    // ... -> spread operator - returns all elements in array
function rectangularCollision({rectangle1, rectangle2}) {
    // rectangle1 = player; reactangle2 = boundary
    return (
        rectangle1.position.x + rectangle1.width >= rectangle2.position.x && 
        rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
        rectangle1.position.y <= rectangle2.position.y + rectangle2.height &&
        rectangle1.position.y + rectangle1.height >= rectangle2.position.y
    )
}

const battle = {
    initiated: false
}

// animation
function animate() {
    const animationId = window.requestAnimationFrame(animate)
    // display background
    background.draw()

    // display boundaries
    boundaries.forEach(boundary => {
        boundary.draw()
    })
    battleZones.forEach(battleZone => {
        battleZone.draw()
    })
    // display player
    player.draw()

    // display foreground objects
    foreground.draw()

    let moving = true
    player.animate = false

    if (battle.initiated) return

    // battle activation
    if(keys.w.pressed || keys.a.pressed || keys.s.pressed || keys.d.pressed) {
        for(let i = 0; i < battleZones.length; i++) {
            // detect for collision
            const battleZone = battleZones[i]
            // ensure battle initiates if most of player if on battle zone
            const overlappingArea = 
                (Math.min(
                    player.position.x + player.width,
                    battleZone.position.x + battleZone.width
                ) -
                    Math.max(player.position.x, battleZone.position.x)) *
                (Math.min(
                    player.position.y + player.height,
                    battleZone.position.y + battleZone.height
                ) -
                    Math.max(player.position.y, battleZone.position.y))                    
            if (
                rectangularCollision({
                    rectangle1: player,
                    rectangle2: battleZone
                }) &&
                overlappingArea > (player.width * player.height) / 2 &&
                Math.random() < 0.01
            ) {
                // deactivate current animation loop
                window.cancelAnimationFrame(animationId)

                // battle music
                audio.map.stop()
                audio.initBattle.play()
                audio.battle.play()

                battle.initiated = true
                // Creates the battle flashing
                gsap.to('#overlappingDiv', {
                    opacity: 1,
                    repeat: 4,
                    yoyo: true,
                    duration: 0.3,
                    onComplete() {
                        gsap.to('#overlappingDiv', {
                            opacity: 1,
                            duration: 0.3,
                            onComplete() {
                                // activate a new animation loop
                                initBattle()
                                animateBattle()
                                gsap.to('#overlappingDiv', {
                                    opacity: 0,
                                    duration: 0.3
                                })
                            }
                        })   
                    }
                })
                break
            }
        }
    }

    // moving player
    //up
    if (keys.w.pressed && lastKey === 'w') {
        player.animate = true
        player.image = player.sprites.up
        for(let i = 0; i < boundaries.length; i++) {
            // detect for collision
            const boundary = boundaries[i]
            if (
                rectangularCollision({
                    rectangle1: player,
                    rectangle2: {...boundary, position: {
                        x: boundary.position.x,
                        y: boundary.position.y+3
                    }}
                })
            ) {
                moving = false
                break
            }
        }
        if (moving)
            movables.forEach((movable) => {
                movable.position.y += 3
            })
    // left
    } else if (keys.a.pressed && lastKey === 'a') {
        player.animate = true
        player.image = player.sprites.left
        for(let i = 0; i < boundaries.length; i++) {
            // detect for collision
            const boundary = boundaries[i]
            if (
                rectangularCollision({
                    rectangle1: player,
                    rectangle2: {...boundary, position: {
                        x: boundary.position.x+3,
                        y: boundary.position.y
                    }}
                })
            ) {
                moving = false
                break
            }
        }
        if (moving)
            movables.forEach((movable) => {
                movable.position.x += 3
            })
    }
    // down
    else if (keys.s.pressed && lastKey === 's') {
        player.animate = true
        player.image = player.sprites.down
        for(let i = 0; i < boundaries.length; i++) {
            // detect for collision
            const boundary = boundaries[i]
            if (
                rectangularCollision({
                    rectangle1: player,
                    rectangle2: {...boundary, position: {
                        x: boundary.position.x,
                        y: boundary.position.y-3
                    }}
                })
            ) {
                moving = false
                break
            }
        }
        if (moving)
            movables.forEach((movable) => {
                movable.position.y -= 3
            })
    }
    // right
    else if (keys.d.pressed && lastKey === 'd') {
        player.animate = true
        player.image = player.sprites.right
        for(let i = 0; i < boundaries.length; i++) {
            // detect for collision
            const boundary = boundaries[i]
            if (
                rectangularCollision({
                    rectangle1: player,
                    rectangle2: {...boundary, position: {
                        x: boundary.position.x-3,
                        y: boundary.position.y
                    }}
                })
            ) {
                moving = false
                break
            }
        }
        if (moving)
            movables.forEach((movable) => {
                movable.position.x -= 3
            })
    }
}
animate()

// stuff for player movement
let lastKey = ''
window.addEventListener('keydown', (e) => { // e stands for event
    switch (e.key) {
        case 'w':
            keys.w.pressed = true
            lastKey = 'w'
            break
        case 'a':
            keys.a.pressed = true
            lastKey = 'a'
            break
        case 's':
            keys.s.pressed = true
            lastKey = 's'
            break
        case 'd':
            keys.d.pressed = true
            lastKey = 'd'
            break
    }
})

window.addEventListener('keyup', (e) => { // e stands for event
    switch (e.key) {
        case 'w':
            keys.w.pressed = false
            break
        case 'a':
            keys.a.pressed = false
            break
        case 's':
            keys.s.pressed = false
            break
        case 'd':
            keys.d.pressed = false
            break
    }
})

// map audio
let clicked = false
addEventListener('click', () => {
    if(!clicked) {
        audio.map.play()
        clicked = true
    }
})