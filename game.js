kaboom({
global: true,
fullscreen: true,
scale: 3,
debug: true,
clearColor: [0,0,0,1]
})

const ENEMY_SPEED = 30
const MOVE_SPEED  = 120
const JUMP_FORCE = 360
let CURRENT_JUMP_FORCE = JUMP_FORCE
const BIG_JUMP_FORCE = 550
let isJumping = true
const FALLDEATH = 350


loadRoot('https://i.imgur.com/')
loadSprite('coin','wbKxhcd.png')
loadSprite('memowee-flag','noe95cR.png')
loadSprite('evil-shroom','KPO3fR9.png')
loadSprite('apple','gZKZYQf.png')
loadSprite('brick','pogC9x5.png')
loadSprite('block','M6rwarW.png')
loadSprite('memowee','oTK3R7Y.png')
loadSprite('memowee-reverse','zaUEn1o.png')
loadSprite('memowee-jump','7tncs1b.png')
loadSprite('mushroom','0wMd92p.png')
loadSprite('surprise','gesQ1KP.png')
loadSprite('unboxed','bdrLpi6.png')
loadSprite('pipe-top-left','ReTPiWY.png')
loadSprite('pipe-top-right','hj2GK4n.png')
loadSprite('pipe-bottom-left','c1cYSbt.png')
loadSprite('pipe-bottom-right','nqQ79eI.png')
loadSprite('bg','pFTA78x.png')


scene("game", ({level, score}) => {

    layers(['bg','obj','ui'], 'obj')
    add(sprite("bg"), layer ("bg"))
const map = [
    '                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      ',
    '                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      ',
    '                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      ',
    '                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      ',
    '                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      ',
    '                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      ',
    '                                       =================================     % %   *   =======================                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               ',
    '        %                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              ',
    '                          ^     ^   ^     ^  ^                                                                                                                          ^                              ^                              ^                     ^                                                                               ^                      ^                                                                                                                                                                                                                                                                                                                                                                                                                                   ^             ^                   ^                                    ^                     ^                                                                       ',
    '============================= ================================================================================   ===========================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================   =============================================================================',
    
]

const levelCfg = {
    width: 20,
    height: 20,
    '=': [sprite('block'), solid()],
    '$': [sprite('coin'), "coin"],
    '%':[sprite('surprise'), solid(), 'coin-surprise'],
    '*':[sprite('surprise'), solid(), 'mushroom-surprise'],
    '}':[sprite('unboxed', solid())],
    '(':[sprite('pipe-bottom-left'), solid(), scale(0.5)],
    ')':[sprite('pipe-bottom-right'), solid(), scale(0.5)],
    '-':[sprite('pipe-top-left'), solid(), scale(0.5)  , "pipe"],
    '+':[sprite('pipe-top-right'), solid(), scale(0.5)  , "pipe"],
    '^': [sprite('evil-shroom'), solid(), "dangerous"],
    '#': [sprite('mushroom')], 

}
const gameLevel = addLevel(map, levelCfg)
let points
const scoreLabel = add([
   
    text(score),
    pos (30,6),
    layer("ui"),
    {
        value: score,
    }
])


add([text("level " + parseInt(level +1)), pos(60,6)])

function big() {
let timer = 0
let isBig = false
return {
    update() {
        if(isBig){
        timer -= dt()
        if(timer <= 0){
            this.smallify()
        }
        }
    },
    isBig() {
        return isBig
    },
    smallify() {
        CURRENT_JUMP_FORCE = JUMP_FORCE
        this.scale = vec2(1)
        timer = 0
        isBig = false
    },
    biggify(time) {
        this.scale = vec2(2)
        CURRENT_JUMP_FORCE = BIG_JUMP_FORCE
        timer = time
        isBig = false
    },
}

}

let player = add([

sprite('memowee'), 
solid(),
pos(30, 0), 
body(), 
big(),
origin('bot'),
scale(0.1),

])


player.on("headbump", (obj) => {
    if(obj.is('coin-surprise')) {
        gameLevel.spawn('$', obj.gridPos.sub(0, 1))
        destroy(obj)
        gameLevel.spawn('}', obj.gridPos.sub(0,0))
    }
    if(obj.is('mushroom-surprise')) {
        gameLevel.spawn('#', obj.gridPos.sub(0, 1))
        destroy(obj)
        gameLevel.spawn('}', obj.gridPos.sub(0,0))
    }
    
})
action("mushroom", (m) => {
    m.move(25,0)  
  })
 // action("apple", (a) => {
 //   a.move(25,0)  
//  })
  
player.collides("pipe", () => {
    keyDown("down", () => {
      go("game", { 
    level: (level + 1),     
     score: scoreLabel.value,
        })
     
    })
})

  player.collides("mushroom", (m) => {
      destroy(m)
      player.biggify(10)
  })

  player.collides("dangerous", (d) => {
   if(isJumping)
   {
       destroy(d)
   }   
   else {  
go("lose", {score: scoreLabel.value}
)}

})

player.action(() => {
camPos(player.pos)
if(player.pos.y >= FALLDEATH)
{
go("lose", {score: scoreLabel.value}
)
}

})

  action("dangerous", (d) => {
      d.move(-ENEMY_SPEED, 0)
  })
  
  player.collides("coin", (c) => {
      destroy(c)
      scoreLabel.value += 1
      scoreLabel.text += scoreLabel.value
    })
function shootFruit(p) {
   const obj = add([sprite('apple'), pos(p)])
}
keyDown("left", ()=>{
    player.move(-MOVE_SPEED, 0)
    player.changeSprite("memowee-reverse")
})

keyDown("right", ()=>{
    player.move(MOVE_SPEED, 0)
    player.changeSprite("memowee")
})

player.action(() => {
    if(player.grounded()) {
    isJumping= false
    player.changeSprite("memowee") 
 
}})


keyPress("space", ()=>{
    if(player.grounded())
    {   isJumping = true
        player.jump(JUMP_FORCE)
        player.changeSprite("memowee-jump") 
}

keyPress("b", ()=>{
 
        player.changeSprite("memowee-flag") 
})




})})

scene("lose", ({ score }) => {
add ([text(score, 32), origin("center"), pos(width()/2, height()/2)])
})

start("game", {level: 0, score: 0})


