// Monsters
// add images for newly added monsters
// sprite sheet: per frame: 86x89 -> 344x89
const monsters = {
    Emby: {
        image: {
            src: './img/embySprite.png'
        },
        backImage: {
            src: './img/embySpriteBack.png'
        },
        frames: {
            max: 4,
            hold: 30
        },
        animate: true,
        name: 'Emby',
        type: types.Fire,
        attacks: [attacks.Tackle, attacks.Fireball]
    },

    Draggle: {
        image: {
            src: './img/draggleSprite.png'
        },
        backImage: {
            src: './img/draggleSprite.png'
        },
        frames: {
            max: 4,
            hold: 30
        },
        animate: true,
        name: 'Draggle',
        type: types.Fire,
        attacks: [attacks.Tackle, attacks.Fireball]
    },

    Mer: {
        image: {
            src: './img/merSprite.png'
        },
        backImage: {
            src: './img/merSpriteBack.png'
        },
        frames: {
            max: 4,
            hold: 30
        },
        animate: true,
        name: 'Mer',
        type: types.Aqua,
        attacks: [attacks.Tackle, attacks.Watergun]
    },

    Cumulus: {
        image: {
            src: './img/cumulusSprite.png'
        },
        backImage: {
            src: './img/cumulusSpriteBack.png'
        },
        frames: {
            max: 4,
            hold: 30
        },
        animate: true,
        name: 'Cumulus',
        type: types.Zephyr,
        attacks: [attacks.Gust]
    },

    Sprout: {
        image: {
            src: './img/sproutSprite.png'
        },
        backImage: {
            src: './img/sproutSpriteBack.png'
        },
        frames: {
            max: 4,
            hold: 30
        },
        animate: true,
        name: 'Sprout',
        type: types.Flora,
        attacks: [attacks.Tackle, attacks['Thorn Whip']]
    },

    Pebble: {
        image: {
            src: './img/pebbleSprite.png'
        },
        backImage: {
            src: './img/pebbleSpriteBack.png'
        },
        frames: {
            max: 4,
            hold: 30
        },
        animate: true,
        name: 'Pebble',
        type: types.Rock,
        attacks: [attacks.Tackle, attacks['Rock Throw']]
    },
    Alva: {
        image: {
            src: './img/alvaSprite.png'
        },
        backImage: {
            src: './img/alvaSpriteBack.png'
        },
        frames: {
            max: 4,
            hold: 30
        },
        animate: true,
        name: 'Alva',
        type: types.Electric,
        attacks: [attacks.Tackle, attacks.Shockwave]
    },
    Gloom: {
        image: {
            src: './img/gloomSprite.png'
        },
        backImage: {
            src: './img/gloomSpriteBack.png'
        },
        frames: {
            max: 4,
            hold: 30
        },
        animate: true,
        name: 'Gloom',
        type: types.Umbra,
        attacks: [attacks.Tackle, attacks['Shadow Claw']]
    },
    Ingor: {
        image: {
            src: './img/ingorSprite.png'
        },
        backImage: {
            src: './img/ingorSpriteBack.png'
        },
        frames: {
            max: 4,
            hold: 30
        },
        animate: true,
        name: 'Ingor',
        type: types.Iron,
        attacks: [attacks.Tackle, attacks['Iron Palm']]
    },
    Cranius: {
        image: {
            src: './img/craniusSprite.png'
        },
        backImage: {
            src: './img/craniusSpriteBack.png'
        },
        frames: {
            max: 4,
            hold: 30
        },
        animate: true,
        name: 'Cranius',
        type: types.Toxic,
        attacks: [attacks.Tackle, attacks['Acid Rain']]
    },
    Floe: {
        image: {
            src: './img/floeSprite.png'
        },
        backImage: {
            src: './img/floeSpriteBack.png'
        },
        frames: {
            max: 4,
            hold: 30
        },
        animate: true,
        name: 'Floe',
        type: types.Frost,
        attacks: [attacks.Tackle, attacks.Blizzard]
    },
    Lux: {
        image: {
            src: './img/luxSprite.png'
        },
        backImage: {
            src: './img/luxSpriteBack.png'
        },
        frames: {
            max: 4,
            hold: 30
        },
        animate: true,
        name: 'Lux',
        type: types.Lumen,
        attacks: [attacks.Tackle, attacks.Cleanse]
    }
}