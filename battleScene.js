// animate battle sequence
const battleBackgroundImage = new Image()
battleBackgroundImage.src = './img/battleBackground.png'
const battleBackground = new Sprite({
    position: {
        x: 0,
        y:0
    },
    image: battleBackgroundImage
})

// create monsters
let emby
let draggle
let renderedSprites
let battleAnimationId
let queue


function initBattle() { // initialize battle
    // resetting all html aspects (clean slate)
    document.querySelector('#userInterface').style.display = 'block'
    document.querySelector('#dialogueBox').style.display = 'none'
    document.querySelector('#enemyHealthBar').style.width = '100%'
    document.querySelector('#playerHealthBar').style.width = '100%'
    document.querySelector('#attacksBox').style.display = 'grid'
    document.querySelector('#attacksBox').replaceChildren()
    
    
    emby = new Monster(monsters.Emby)
    draggle = new Monster(monsters.Draggle)
    renderedSprites = [draggle, emby]
    queue = []


    emby.attacks.forEach((attack) => {
        const button = document.createElement('button')
        button.innerHTML = attack.name;
        button.style.backgroundColor = attack.color
        document.querySelector('#attacksBox').append(button)
        const divider = document.createElement('div')
        divider.style = 'height: 10px'
        document.querySelector('#attacksBox').append(divider)

    })

    // battle sequence
    document.querySelectorAll('button').forEach(button => {

        // Attacks when clicking buttons
        button.addEventListener('click', (e) => {
            // emby's attack
            const selectedAttack = attacks[e.currentTarget.innerHTML]
            emby.attack({
                attack: selectedAttack,
                recipient: draggle,
                renderedSprites
            })

            // if draggle faints, draggle stops attacking/disappears
            // CHANGE INTO FUNCTION
            if(draggle.health <= 0) {
                queue.push(() => {
                    draggle.faint()
                })
                queue.push(() => {
                    gsap.to('#overlappingDiv', {
                        opacity: 1,
                        onComplete: () => {
                            cancelAnimationFrame(battleAnimationId)
                            animate()
                            document.querySelector('#userInterface').style.display = 'none'
                            gsap.to('#overlappingDiv', {
                                opacity: 0
                            })
                            battle.initiated = false
                            audio.map.play()
                        }
                    })
                })
                return
            }

            // randomizing draggle's attack
            const randomAttack = draggle.attacks[Math.floor(Math.random() * draggle.attacks.length)]

            queue.push(() => {
                draggle.attack({
                    attack: randomAttack,
                    recipient: emby,
                    renderedSprites
                })
            })

            // if emby faints, emby stops attacking/disappears
            // CHANGE INTO FUNCTION
            if(emby.health <= 0) {
                queue.push(() => {
                    emby.faint()
                })
                queue.push(() => {
                    gsap.to('#overlappingDiv', {
                        opacity: 1,
                        onComplete: () => {
                            cancelAnimationFrame(battleAnimationId)
                            animate()
                            document.querySelector('#userInterface').style.display = 'none'
                            gsap.to('#overlappingDiv', {
                                opacity: 0
                            })
                            battle.initiated = false
                            audio.map.play()
                        }
                    })
                })
                return
            }
        })
    })
}

// animate battle
function animateBattle() {
    battleAnimationId = window.requestAnimationFrame(animateBattle)
    battleBackground.draw()

    renderedSprites.forEach((sprite) => {
        sprite.draw()
    })
}

// for working on battle sequence
// initBattle()
// animateBattle()

document.querySelector('#dialogueBox').addEventListener('click', (e) => {
    if(queue.length > 0) {
        queue[0]()  //  turn
        queue.shift()   // removes turn
    } else {
        e.currentTarget.style.display = 'none'
        document.querySelector('#attacksBox').style.display = 'grid'
    }
})