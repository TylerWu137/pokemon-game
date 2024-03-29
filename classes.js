// Sprite class -> background, foreground, + other objects (player, etc.)
// change attacks to be more general and not switch cases
class Sprite {
    constructor({ 
        position, 
        velocity, 
        image, 
        frames = {max: 1, hold: 10}, 
        sprites = [], 
        animate = false,
        rotation = 0
    }) {
        this.position = position
        this.image = new Image()
        this.frames = {...frames, val: 0, elapsed: 0};
        this.image.onload = () => {
            this.width = this.image.width / this.frames.max
            this.height = this.image.height
        }
        this.image.src = image.src
        this.animate = animate
        this.sprites = sprites
        this.opacity = 1
        this.rotation = rotation
    }

    draw(spriteSheet) {
        c.save()  // using global canvas properties only affect code inside here
        c.translate(
            this.position.x + this.width / 2, 
            this.position.y + this.height / 2
        )
        c.rotate(this.rotation)
        c.translate(
            - this.position.x - this.width / 2, 
            - this.position.y - this.height / 2
        )
        c.globalAlpha = this.opacity
        c.drawImage (
            spriteSheet,    // object
            this.frames.val * this.width,              // cropping x1
            0,              // cropping y1
            spriteSheet.width / this.frames.max,    // cropping x2
            spriteSheet.height,     // cropping y2
            this.position.x,
            this.position.y,
            spriteSheet.width / this.frames.max,    // image width  
            spriteSheet.height      // image height
        )
        c.restore()
        
        // displaying different movement frames
        if (!this.animate) return

        if (this.frames.max > 1) {
            this.frames.elapsed++
        }

        if (this.frames.elapsed % this.frames.hold === 0) {
            if (this.frames.val < this.frames.max-1) this.frames.val++
            else this.frames.val = 0
        }
    }
}

class Monster extends Sprite {
    constructor({
        position = { x: 0, y: 0},
        velocity, 
        image, 
        backImage,
        frames = {max: 1, hold: 10}, 
        sprites = [], 
        animate = false,
        rotation = 0,
        isEnemy = false,
        name,
        type,
        attacks
    }) {
        super({
            position,
            velocity, 
            image, 
            frames,
            sprites, 
            animate,
            rotation,
        })
        this.backImage = new Image()
        this.backImage.onload = () => {
            this.width = this.backImage.width / this.frames.max
            this.height = this.backImage.height
        }
        this.backImage.src = backImage.src
        this.health = 100
        this.isEnemy = isEnemy
        this.name = name
        this.type = type
        this.attacks = attacks
    }

    faint() {
        document.querySelector('#dialogueBox').innerHTML = 
            this.name + ' fainted'
        gsap.to(this.position, {
            y: this.position.y + 20
        })
        gsap.to(this.position, {
            y: this.position.y
        })
        gsap.to(this.position, {
            x: this.position.x
        })
        gsap.to(this, {
            opacity: 0
        })
        audio.battle.stop()
        audio.victory.play()
    }

    attack({attack, recipient, renderedSprites}) {
        document.querySelector('#dialogueBox').style.display = 'block'
        document.querySelector('#dialogueBox').innerHTML = 
            this.name + ' used ' + attack.name
        document.querySelector('#attacksBox').style.display = 'none'
        // updates health bar of recipient
        let healthBar = '#enemyHealthBar'
        if(this.isEnemy) healthBar = '#playerHealthBar'
        recipient.health -= attack.damage

        let rotation = 1
        if (this.isEnemy) rotation = -2.2

        switch (attack.name) {
            case 'Tackle':   // attack = tackle
            const tl = gsap.timeline()

            let movementDistance = 20
            if(this.isEnemy) movementDistance = -20
    
            tl.to(this.position, {
                x: this.position.x - movementDistance
            }).to(this.position, {
                x: this.position.x + movementDistance * 2,
                duration: .1,
                onComplete: () => {
                    // enemy actually hit
                    audio.tackleHit.play()
                    gsap.to(healthBar, {
                        width: recipient.health + '%'
                    })
    
                    gsap.to(recipient.position, {
                        x: recipient.position.x + 10,
                        yoyo: true,
                        repeat: 3,
                        duration: .08
                    })
                    gsap.to(recipient, {
                        opacity: 0,
                        repeat: 3,
                        yoyo: true,
                        duration: .08
                    })
                }
            }).to(this.position, {
                x: this.position.x
            })
            break

            case 'Fireball':    // attack = fireball
            audio.initFireball.play()
                const fireballImage = new Image()
                fireballImage.src = './img/fireball.png'
                const fireball = new Sprite( {
                    position: {
                        x: this.position.x,
                        y: this.position.y
                    },
                    image: fireballImage,
                    frames: {
                        max: 4,
                        hold: 10
                    },
                    animate: true,
                    rotation
                })
                renderedSprites.splice(1, 0, fireball)

                gsap.to(fireball.position, {
                    x: recipient.position.x,
                    y: recipient.position.y,
                    onComplete: () => {
                        // enemy actually hit
                        audio.fireballHit.play()
                        gsap.to(healthBar, {
                            width: recipient.health + '%'
                        })
        
                        gsap.to(recipient.position, {
                            x: recipient.position.x + 10,
                            yoyo: true,
                            repeat: 3,
                            duration: .08
                        })
                        gsap.to(recipient, {
                            opacity: 0,
                            repeat: 3,
                            yoyo: true,
                            duration: .08
                        })
                        renderedSprites.splice(1, 1)
                    }
                })
            break

            default:
            gsap.to(healthBar, {
                width: recipient.health + '%'
            })
            break
        }
    }
}

class Boundary {
    static width = 48;
    static height = 48
    constructor({position}) {
        this.position = position
        this.width = 48
        this.height = 48
    }

    draw() {
        c.fillStyle = 'rgba(255, 0, 0, 0.0)'
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
}