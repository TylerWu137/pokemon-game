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
let allyMon
let enemyMon
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
    
    const keys = Object.keys(monsters)
    allyMon = new Monster(monsters[keys[Math.floor(Math.random() * keys.length)]])
    document.querySelector('#allyName').innerHTML = allyMon.name
    allyMon.position = {x:280,y:325}
    enemyMon = new Monster(monsters[keys[Math.floor(Math.random() * keys.length)]])
    document.querySelector('#enemyName').innerHTML = enemyMon.name
    enemyMon.position = {x:795,y:100}
    enemyMon.isEnemy = true
    renderedSprites = [enemyMon, allyMon]
    queue = []


    allyMon.attacks.forEach((attack) => {
        const button = document.createElement('button')
        button.innerHTML = attack.name
        button.style.backgroundColor = attack.type.color
        document.querySelector('#attacksBox').append(button)
        const divider = document.createElement('div')
        divider.style = 'height: 10px'
        document.querySelector('#attacksBox').append(divider)

    })

    // battle sequence
    document.querySelectorAll('button').forEach(button => {

        // Attacks when clicking buttons
        button.addEventListener('click', (e) => {
            // allyMon's attack
            const selectedAttack = attacks[e.currentTarget.innerHTML]
            allyMon.attack({
                attack: selectedAttack,
                recipient: enemyMon,
                renderedSprites
            })

            // if enemyMon faints, enemyMon stops attacking/disappears
            // CHANGE INTO FUNCTION
            if(enemyMon.health <= 0) {
                queue.push(() => {
                    enemyMon.faint()
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

            // randomizing enemyMon's attack
            const randomAttack = enemyMon.attacks[Math.floor(Math.random() * enemyMon.attacks.length)]

            queue.push(() => {
                enemyMon.attack({
                    attack: randomAttack,
                    recipient: allyMon,
                    renderedSprites
                })
            })

            // if allyMon faints, allyMon stops attacking/disappears
            // CHANGE INTO FUNCTION
            if(allyMon.health <= 0) {
                queue.push(() => {
                    allyMon.faint()
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
    battleBackground.draw(battleBackground.image)
    allyMon.draw(allyMon.backImage)
    enemyMon.draw(enemyMon.image)
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