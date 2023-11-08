const WindowsBot = require('WindowsBot');//引用WindowsBot模块
const moment = require('moment')
const utils = require('./utils')
const keyMap = require('./keyMap.js')
const config =  require('./config.js');
// const config = require('./config.json')

const tesseract = require('tesseract.js')

//注册主函数
WindowsBot.registerMain(windowsMain, "127.0.0.1", 26678);

/**用作代码提示，windowsMain函数会被多次调用，注意使用全局变量
* @param {WindowsBot} windowsBot
*/

const ocrServer = 'ocr.ai-bot.net'
const ocrServerPort = 9528
const args = process.argv.slice(2);


const globalMode = false // true back-end false front-end


//状态 0 未进游戏 1 选择账号界面  
let state = 1
let roleState = 1

// let randomArr = [getShip,getWelfare,getDouble]
let randomArr = []


let mapState = {
    0: '未进游戏',
    1: '选择账号界面',
    2: '随机界面操作',
    3: '战斗中',
    '-1': 'test'
}
let hwnd
let qqhwnd

let finishAll = false

const clickMouseOffset = 10
const sleepOffset = 20

const DAYS = moment().days()

let plCount = 0

let roles=[{
    fast:false,
    level:2
},{
    fast:false,
    level:1
}]

// let newRoles=['剑魂','阿修罗']
let newRoles=[]



let currentRole = {}

let ocrWorker

let newVer = true

let capsLkCount = 0

async function windowsMain(windowsBot) {

    ocrWorker = await tesseract.createWorker('eng')

    //hack windowbot.clickMouse加入随机数
    let originClickMouse = windowsBot.clickMouse
    windowsBot.clickMouse = function (hwnd, x, y, msg, options = {}) {

        let random = Math.floor(Math.random() * clickMouseOffset) * (Math.random() > 0.5 ? 1 : -1)
        let random1 = Math.floor(Math.random() * clickMouseOffset) * (Math.random() > 0.5 ? 1 : -1)


        return originClickMouse.call(this, hwnd, x - config.WINDOW_LEFT + random , y - config.WINDOW_TOP  + random1, msg, options)
    }


    //hack windowbot.sleep加入随机数
    let originSleep = windowsBot.sleep
    windowsBot.sleep = function (ms) {

        let random = Math.floor(Math.random() * clickMouseOffset) * (Math.random() > 0.5 ? 1 : -1)
        return originSleep.call(this, ms + random)
    }
    

    //设置隐式等待
    await windowsBot.setImplicitTimeout(5000);
    // console.log('--------------config--------------',config)

    console.log('cmd params', args + '')
    let isTest = args.find(item => item.includes('test'))


    let account = args.find(item => item.includes('account'))

    if (account) {
        accountState = account.split('=')[1] 
        console.log('第几个账号', accountState)
        newRoles = config.ACCOUNT[accountState]
    }

    let role = args.find(item => item.includes('role'))

    if (role) {
        roleState = role.split('=')[1] 
        console.log('从第几个角色开始', roleState)
    }

    


    if (isTest) {
        console.log('--------test---------')
       await test(windowsBot)
       return
    } 

    await init(windowsBot)


    console.log('state', state, mapState[state])
    while (!finishAll) {
        console.log('loop,state', state)

        switch (state) {
            // case 0: await enterGame(windowsBot); break;
            case 1: await selectRole(windowsBot); break;
            case 2: await toMap(windowsBot); break;
            case 3: newVer? await fightingStable(windowsBot) :await fighting(windowsBot); break;
        }

    }


    await ocrWorker.terminate();

    console.log('结束')
}


async function init(windowsBot) {

    hwnd = await getCurrentHwnd(windowsBot)

    console.log('找到主窗口句柄', hwnd)

    await utils.resetWindow(windowsBot,hwnd)

    await utils.focusWindow(windowsBot,hwnd)


    // await windowsBot.initOcr(ocrServer, ocrServerPort);
    // console.log('ocr初始化完毕')
}


async function selectRole(windowsBot){

    if(newVer){
        currentRole =  {...newRoles[roleState - 1],...config.ROLE[newRoles[roleState - 1].type]}
    }else{
        currentRole = roles[roleState - 1]
    }
    
    currentRole.x = config.ROLE_POS[roleState - 1].x
    currentRole.y = config.ROLE_POS[roleState - 1].y

    console.log('currentRole',currentRole)

    if(!currentRole){
        finishAll = true
        process.exit()
    }

    let x = 600
    let y = 545


    console.log('select role ' + roleState)

    if(roleState>=13){
        await windowsBot.sendVk(keyMap.down, 1);
        await windowsBot.sleep(200);
        await windowsBot.sendVk(keyMap.down, 1);
        await windowsBot.sleep(200);
    }else{
        await windowsBot.sendVk(keyMap.up, 1);
        await windowsBot.sleep(200);
        await windowsBot.sendVk(keyMap.up, 1);
        await windowsBot.sleep(200);
    }

    await windowsBot.clickMouse(hwnd, currentRole.x, currentRole.y, 1);
    await windowsBot.sleep(500);

    console.log('start')

    await windowsBot.clickMouse(hwnd, 649, 756, 1);

    // await windowsBot.sendVk(keyMap.space, 1);
    // await windowsBot.sleep(2000);

    
    // await utils.resetWindow(windowsBot,hwnd) 
    await windowsBot.sleep(2000);


    roleState++
    state = 2;
    plCount = 0;

}

async function getCurrentHwnd(windowsBot){
    let res =  await windowsBot.findWindow(null, config.WINDOW_NAME);
    console.log('getCurrentHwnd',res)
    return res
}

async function ifNoplNew(windowsBot){
 
    let color =  await windowsBot.getColor(hwnd, utils.getPosX(config.PLPOS.x), utils.getPosY(config.PLPOS.y), false);
    // let res = await windowsBot.findImage(hwnd, __dirname + '\\images\\pass-room1.png', { sim: 0.8 })
    console.log('检测是否没疲劳', color)
    await windowsBot.sleep(200);
    // if(!color.startsWith('#d3af00')){ 

    if(!(color.startsWith('#dec') || color.startsWith('#002'))){
        console.log('颜色判断没pl了')
        //ocr再次确认
        let ocrResult= await ifNoplOCR(windowsBot)
        if(ocrResult){
            return true
        }else{
            console.log('还有疲劳')
            return false
        }
    }else{
        console.log('还有疲劳')
        return false
    }

}


async function ifNoplOCR(windowsBot){
    console.log('检测是否没疲劳OCR')

    const path =  __dirname + '\\images\\screenshot\\plocr.png'
    
    //1460, 1195, 1508, 1205
    //1431 1150 1570 1195

    // let x = utils.getPosX(1494)
    // let y = utils.getPosY(1158)
    // let x1 = utils.getPosX(1545)
    // let y1 = utils.getPosY(1175)


    
    let x = utils.getPosX(1091)
    let y = utils.getPosY(733)
    let x1 = utils.getPosX(1149)
    let y1 = utils.getPosY(752)

    // await windowsBot.moveMouse(hwnd, utils.getPosX(1488) , utils.getPosY(1196), options = {});
    // await windowsBot.clickMouse(hwnd, 1479 , 1204, 1, options = {});
    // await windowsBot.sleep(1000)

    await windowsBot.moveMouse(hwnd, 1076, 780, options = {});
    await windowsBot.sleep(500)

    //截图保存
    let saveRes = await windowsBot.saveScreenshot(hwnd, path , {region:[x,y,x1,y1]});
     console.log('saveRes',saveRes)
    if(saveRes){
        await windowsBot.sleep(100)
        const ret = await ocrWorker.recognize(path);
        console.log('ocr-result',ret.data.text);

        if(ret.data.text){
            let pl = ret.data.text.split('/')[0]
            if(pl > 0){
                console.log('还有疲劳')
                return false
            }else{
                if(pl==0){
                    console.log('OCR确认没pl了')
                    return true
                }else{
                    return false
                }

            }
        }
    }

    return false
   

}


async function toMap(windowsBot){
    console.log('---------tomap--------')

    console.log('关闭公告')
    await windowsBot.clickMouse(hwnd, 647, 470, 1);
    await windowsBot.sleep(500);

    let result =  await ifNoplNew(windowsBot)

    if(result){
        console.log('没疲劳了')        
        await exitToRole(windowsBot)
        return
    }


    console.log('press down',keyMap.down)

    await windowsBot.sendVk(keyMap.down, 2);
    await windowsBot.sleep(1200);
    await windowsBot.sendVk(keyMap.down, 3);

    console.log('press right')

    await utils.runUntilPassRoom(windowsBot,hwnd,keyMap.right,13000)

    // let res = await windowsBot.findImage(hwnd, __dirname + '\\images\\invite.png', { sim: 0.8 })
    // console.log('检测是否有人邀请', res)
    console.log('select map haibolun')
    await windowsBot.sleep(1000);

    await windowsBot.clickMouse(hwnd, 526, 318, 1);
    await windowsBot.sleep(500);


    console.log('进图');

    await windowsBot.clickMouse(hwnd, 526, 318, 1);
    await windowsBot.sleep(2000);

    // let res = await windowsBot.findImage(hwnd, __dirname + '\\images\\emeng1.png', { sim: 0.8 })
    // console.log('检测是否海博伦', res)
    
    // if(!res){
    //     await windowsBot.sleep(500);
    //     await windowsBot.sendVk(keyMap.up, 1);

    // }
    // await windowsBot.sleep(500);

    // await windowsBot.clickMouse(hwnd, 920, 618, 1);
    // await windowsBot.sleep(500);

    // await windowsBot.sendVk(keyMap.space, 1);
    // await windowsBot.sleep(2000);

    state = 3

}

const operas = [keyMap.a,keyMap.s,keyMap.d,keyMap.f]
const buff = [keyMap.h,keyMap.r]


async function sell(windowsBot){
    await windowsBot.sleep(500);
    await windowsBot.sendVk(keyMap.a, 1);
    await windowsBot.sleep(500);
    await windowsBot.sendVk(keyMap.space, 1);
    await windowsBot.sleep(500);
    await windowsBot.sendVk(keyMap.left, 1);
    await windowsBot.sleep(500);
    await windowsBot.sendVk(keyMap.space, 1);
    await windowsBot.sleep(500);


}


async function errorFightAgain(windowsBot){

}

async function backTown(windowsBot){

    console.log('-------返回城镇-------')

    await windowsBot.sleep(1000); 

    await windowsBot.sendVk(keyMap.esc, 1);
    await windowsBot.sleep(500); 

    let color =  await windowsBot.getColor(hwnd, utils.getPosX(769),utils.getPosY(673), false);
    console.log('backtowncolor',color)
    if(color!=='#3d88aa'){
        await windowsBot.sendVk(keyMap.esc, 1);
        await windowsBot.sleep(500); 
        let color1 =  await windowsBot.getColor(hwnd, utils.getPosX(769),utils.getPosY(673), false);
        if(color1!=='#3d88aa'){
            await windowsBot.sendVk(keyMap.esc, 1);
            await windowsBot.sleep(500); 
        }
    }

    await windowsBot.clickMouse(hwnd, config.backTownPos.x, config.backTownPos.y, 1);
    await windowsBot.sleep(1000);

    await windowsBot.clickMouse(hwnd, 598, 427, 1);
    await windowsBot.sleep(500);

    // console.log('兼容虚弱')
    // await windowsBot.clickMouse(hwnd, 1035, 795, 1);
    // await windowsBot.sleep(4000);

    // console.log('兼容虚弱契约恢复')
    // await windowsBot.clickMouse(hwnd, 1073, 804, 1);
    // await windowsBot.sleep(500);

    // await windowsBot.clickMouse(hwnd, 1126, 899, 1);
    // await windowsBot.sleep(500);

}

async function exitToRole(windowsBot,isError = false){

    console.log('-------返回选择角色-------')

    state = 1

    await windowsBot.sleep(1000); 

    await windowsBot.sendVk(keyMap.esc, 1);
    await windowsBot.sleep(1000); 

    await windowsBot.clickMouse(hwnd, config.changeRolePos.x, config.changeRolePos.y, 1);
    await windowsBot.sleep(500);
}



//健壮版战斗
async function fightingStable(windowsBot){

   plCount++

   await windowsBot.sleep(1000);

   let rooms =  [firstRoom,secondRoom,thirdRoom,fourRoom,fiveRoom,sixRoom,sevenRoom]

   let plResult

   for(let i =0;i<rooms.length;i++){
        if(i === 6){
            setTimeout(async () => {
             plResult =  await ifNoplNew(windowsBot)
            }, 1000);
        }
        try{
            await rooms[i](windowsBot)
        } catch(error) {
            console.log('--------------error---------------')
            console.log('房间'+ (i+1) + '出错')
            return
        }   
   }

   await windowsBot.sleep(1000); 

    console.log('聚集物品')


   if(currentRole.hasCapsLk){
        console.log('第一次capsLkCount',capsLkCount)
        if(capsLkCount>=30){
            console.log('capslk时间够了，聚集物品')
            await windowsBot.sleep(200); 
            await windowsBot.sendVk(keyMap.capsLk, 1);
            capsLkCount = 0
        }
   }else{
         await windowsBot.sendVk(keyMap['/?'], 1);
   }

 

    let pass = await utils.doUntilPassRoom(windowsBot,hwnd,5000,async ()=>{
        await windowsBot.sleep(200); 
        await windowsBot.sendVk(keyMap.x, 1);
     })

     await windowsBot.sendVk(keyMap.x, 1);
     await windowsBot.sleep(200); 
     await windowsBot.sendVk(keyMap.x, 1);
     await windowsBot.sleep(200); 
     await windowsBot.sendVk(keyMap.x, 1);
     await windowsBot.sleep(200); 
     await windowsBot.sendVk(keyMap.x, 1);
     await windowsBot.sleep(200); 

    console.log('跳过')
    await windowsBot.sendVk(keyMap.esc, 1);
    await windowsBot.sleep(2000); 

    console.log('plcount',plCount)

    if(plResult || plCount === 9 || plCount === 18 ){
        await sell(windowsBot)
    }



    console.log('点击下商店x以防万一')
    await windowsBot.sendVk(keyMap.esc, 1);
    await windowsBot.sleep(200);


    if(currentRole.hasCapsLk){
        console.log('capsLkCount',capsLkCount)
        if(capsLkCount >= 30){
            console.log('capslk聚集物品')
            await windowsBot.sendVk(keyMap.capsLk, 1);
            await windowsBot.sleep(100); 
            await windowsBot.sendVk(keyMap.x, 1);
            await windowsBot.sleep(100); 
            await windowsBot.sendVk(keyMap.x, 1);
            await windowsBot.sleep(100); 
            await windowsBot.sendVk(keyMap.x, 1);
            await windowsBot.sleep(100); 
            await windowsBot.sendVk(keyMap.x, 1);
            await windowsBot.sleep(100); 
            await windowsBot.sendVk(keyMap.x, 1);
            await windowsBot.sleep(100); 
            await windowsBot.sendVk(keyMap.x, 1);
            await windowsBot.sleep(100); 
            await windowsBot.sendVk(keyMap.x, 1);
            await windowsBot.sleep(100); 
            await windowsBot.sendVk(keyMap.x, 1);
            await windowsBot.sleep(100); 
            await windowsBot.sendVk(keyMap.x, 1);
            await windowsBot.sleep(100); 
            await windowsBot.sendVk(keyMap.x, 1);
            await windowsBot.sleep(100); 
        }else if(capsLkCount >15 && capsLkCount < 30){
            let second = (30 - capsLkCount)
            console.log(second+'秒后'+'capslk聚集物品')
            await windowsBot.sleep( second * 1000)
            await windowsBot.sleep(500)
            await windowsBot.sendVk(keyMap.capsLk, 1);
            await windowsBot.sleep(100); 
            await windowsBot.sendVk(keyMap.x, 1);
            await windowsBot.sleep(100); 
            await windowsBot.sendVk(keyMap.x, 1);
            await windowsBot.sleep(100); 
            await windowsBot.sendVk(keyMap.x, 1);
            await windowsBot.sleep(100); 
            await windowsBot.sendVk(keyMap.x, 1);
            await windowsBot.sleep(100); 
            await windowsBot.sendVk(keyMap.x, 1);
            await windowsBot.sleep(100); 
            await windowsBot.sendVk(keyMap.x, 1);
            await windowsBot.sleep(100); 
            await windowsBot.sendVk(keyMap.x, 1);
            await windowsBot.sleep(100); 
            await windowsBot.sendVk(keyMap.x, 1);
            await windowsBot.sleep(100); 
            await windowsBot.sendVk(keyMap.x, 1);
            await windowsBot.sleep(100); 
            await windowsBot.sendVk(keyMap.x, 1);
            await windowsBot.sleep(100); 
        }else{
            console.log('capslk过了，不需要了')
        }

    }else{
        await windowsBot.sleep(1000); 
    }

    if(plResult){
        console.log('没疲劳了')

        await windowsBot.sendVk(keyMap.f12, 1);
        await windowsBot.sleep(5000);
        
        await exitToRole(windowsBot)
        return
    }

    await windowsBot.sendVk(keyMap.x, 1);

    setTimeout(() => {
         windowsBot.sendVk(keyMap.x, 1);   
    }, 500);


    console.log('F10继续战斗')
    await windowsBot.sendVk(keyMap.f10, 1);





    
   let result = await utils.doUntilPassRoom(windowsBot,hwnd,5000,async ()=>{
       await windowsBot.sleep(300);
        //以防万一，反正按了也没事
       await windowsBot.sendVk(keyMap.capsLk, 1);
    })



    if(result===2){
        await windowsBot.sendVk(keyMap.esc, 1);
        await windowsBot.sleep(500);
        await windowsBot.sendVk(keyMap.f10, 1);
        let resul1t = await utils.doUntilPassRoom(windowsBot,hwnd,5000,async ()=>{
            await windowsBot.sleep(300);
         })
     
         if(resul1t===2){
            try{
                 await handleError(windowsBot,'重新战斗过图错误')
            }catch(e){
                console.log('重新战斗过图错误')
            }
            return
         }
    }
}


async function firstRoom(windowsBot){
    
    console.log('-----------普通一图------------')

    // let sBuff = utils.suffleArray(currentRole.buffs)

    for(let i =0;i<currentRole.buffs.length;i++){
        await windowsBot.sendVk(currentRole.buffs[i], 1);
        await windowsBot.sleep(700);
    }

    if(currentRole.runSpeed<=50){

        console.log('press up right')
        await windowsBot.sendVk(keyMap.up, 2);
        await windowsBot.sleep(100);
        await windowsBot.sendVk(keyMap.right, 2);

        let pass = await utils.doUntilPassRoom(windowsBot,hwnd,4000,async ()=>{
            await windowsBot.sleep(200); 
         })
        console.log('松开右上')
        
    
        await windowsBot.sendVk(keyMap.right, 3);
        await windowsBot.sendVk(keyMap.up, 3); 

        if(pass ===2){
            await handleError(windowsBot,'一图过图错误')
            return
        }

    }else{

        await utils.run(windowsBot,keyMap.right,1000)

        await utils.move(windowsBot,keyMap.up,1000)

        let pass =  await utils.runUntilPassRoom(windowsBot,hwnd,keyMap.left,1000)

        if(pass ===2){
            await handleError(windowsBot,'一图过图错误')
            return
        }
    }


    // await utils.run(windowsBot,keyMap.left,1500)
}



async function secondRoom(windowsBot){

    console.log('-----------普通二图------------')
    await windowsBot.sleep(500);
    //调整方向
    await utils.move(windowsBot,keyMap.right,100)


    
    await windowsBot.sendVk(keyMap['句号'], 1);
    await windowsBot.sleep(200);

    console.log('放E技能')


    if(Array.isArray(currentRole.map2Sk)){
        for(let i=0;i<currentRole.map2Sk.length;i++){

            let skill = currentRole.map2Sk[i]
            if(Array.isArray(skill)){
                for(let i = 0;i<skill.length;i++){
                    await windowsBot.sendVk(skill[i], 1);
                    await windowsBot.sleep(500);
                }
            }else{
                await windowsBot.sendVk(skill, 1);
            }
            await windowsBot.sleep(1000);
        }
    }else{
        await windowsBot.sendVk(currentRole.map2Sk, 1);
        await windowsBot.sleep(500);
    }






    let time = +new Date()

    let result = await utils.doUntilCanNext(windowsBot,hwnd,10000,async ()=>{

        await windowsBot.sleep(200);
        await windowsBot.sendVk(keyMap.x, 2);
        await windowsBot.sleep(1000);
        await windowsBot.sendVk(keyMap.x, 3);

        if(currentRole.map2BackupSk){
            //补一个小技能
            if( + new Date() - time > 2000){
                await windowsBot.sendVk(currentRole.map2BackupSk, 1);
                await windowsBot.sleep(200);
            }
        }
    })
    await windowsBot.sleep(200);

    if(currentRole.hasCapsLk){
        console.log('捡东西，开始计时')
        await windowsBot.sendVk(keyMap.capsLk, 1);
        await windowsBot.sleep(200);
        await windowsBot.sendVk(keyMap.x, 1);
        await windowsBot.sleep(200);
        await windowsBot.sendVk(keyMap.x, 1);
        await windowsBot.sleep(200);
        capsLkCount = 0

        let interval = setInterval(() => {
            capsLkCount ++
        }, 1000);

        setTimeout(() => {
            clearInterval(interval)
        }, 35000)  ;
    }

    //超时
    if(result === 2){
        await handleError(windowsBot,'二图打怪错误')
        return
    }


    let passResult =  await utils.runUntilPassRoom(windowsBot,hwnd,keyMap.right)

    if(passResult === 2){
        // utils.run(windowsBot,keyMap.left,500)
        // utils.run(windowsBot,keyMap.right,500)
        console.log('捡东西')
        await windowsBot.sendVk(keyMap['/?'], 1);
        await windowsBot.sleep(200);
        await windowsBot.sendVk(keyMap.x, 1);
        await windowsBot.sleep(200);
        await windowsBot.sendVk(keyMap.x, 1);
        await windowsBot.sleep(200);
        
        await handleError(windowsBot,'二图过图错误')
    }

}




async function thirdRoom(windowsBot){

    console.log('-----------普通三图------------')
    await windowsBot.sleep(500);

    await utils.run(windowsBot,keyMap.right,500)


    if(currentRole.threeRoomFix){
        await utils.run(windowsBot,keyMap.down,100)
    }


    if(Array.isArray(currentRole.map3Sk)){
        for(let i=0;i<currentRole.map3Sk.length;i++){

            let skill = currentRole.map3Sk[i]
            if(Array.isArray(skill)){
                for(let i = 0;i<skill.length;i++){
                    await windowsBot.sendVk(skill[i], 1);
                    await windowsBot.sleep(500);
                }
            }else{
                await windowsBot.sendVk(skill, 1);
            }
            await windowsBot.sleep(1000);
        }
    }else{
        await windowsBot.sendVk(currentRole.map3Sk, 1);
        await windowsBot.sleep(500);
    }

    let time = +new Date()
    let result = await utils.doUntilCanNext(windowsBot,hwnd,6000,async ()=>{
        
        await utils.move(windowsBot,keyMap.right,300)
        await windowsBot.sendVk(keyMap.x, 2);
        await windowsBot.sleep(500);
        await windowsBot.sendVk(keyMap.x, 3);

        //补一个小技能
        if( + new Date() - time > 3000){
            await windowsBot.sendVk(currentRole.map3BackupSk, 1);
            await windowsBot.sleep(1000);
        }
    })

    //超时
    if(result === 2){
        currentRole.threeRoomFix = true
        await handleError(windowsBot,'三图打怪错误')
        return
    }


    //先往上走，再往左走

    let passs,pass,pas,pa;

     passs = await utils.moveUntilPassRoom(windowsBot,hwnd,keyMap.up,1000)
    if(passs===2){
        if(currentRole.runFirst==='right'){
            pass = 2
        }else{
            pass =  await utils.runUntilPassRoom(windowsBot,hwnd,keyMap.left,600)
        }
        if(pass===2){
              pas =  await utils.runUntilPassRoom(windowsBot,hwnd,keyMap.right,800)
              if(pas === 2){
                pa = await utils.runUntilPassRoom(windowsBot,hwnd,keyMap.left,3000)
              }
        }
    }

    if(pa === 2){

        console.log('捡东西')
        await windowsBot.sendVk(keyMap['/?'], 1);
        await windowsBot.sleep(200);
        await windowsBot.sendVk(keyMap.x, 1);
        await windowsBot.sleep(200);
        await windowsBot.sendVk(keyMap.x, 1);
        await windowsBot.sleep(200);

        await handleError(windowsBot,'三图过图错误')
        // utils.run(windowsBot,keyMap.left,500)
        // utils.run(windowsBot,keyMap.right,500)
    }

}



async function fourRoom(windowsBot){

    console.log('-----------普通四图------------')
    await windowsBot.sleep(500);

    await utils.move(windowsBot,keyMap.right,100)


    await utils.move(windowsBot,keyMap.up,600)

    if(Array.isArray(currentRole.map4Sk)){
        for(let i=0;i<currentRole.map4Sk.length;i++){

            let skill = currentRole.map4Sk[i]
            if(Array.isArray(skill)){
                for(let i = 0;i<skill.length;i++){
                    await windowsBot.sendVk(skill[i], 1);
                    await windowsBot.sleep(500);
                }
            }else{
                await windowsBot.sendVk(skill, 1);
            }
            await windowsBot.sleep(1000);

        }
    }else{
        await windowsBot.sendVk(currentRole.map4Sk, 1);
        await windowsBot.sleep(500);
    }

    let time = +new Date()
    let result = await utils.doUntilCanNext(windowsBot,hwnd,10000,async ()=>{

        await utils.move(windowsBot,keyMap.right,300)
        await windowsBot.sendVk(keyMap.x, 2);
        await windowsBot.sleep(500);
        await windowsBot.sendVk(keyMap.x, 3);

        //往右走一点 补一个小技能
        if( + new Date() - time > 2000){
            await windowsBot.sendVk(currentRole.map4BackupSk, 1);
            await windowsBot.sleep(200);
        }
    })

    //超时
    if(result === 2){
        await handleError(windowsBot,'四图打怪错误')
        return
    }

    //先往上走，再往左走

    let passs,pass,pas,pa;

     passs = await utils.moveUntilPassRoom(windowsBot,hwnd,keyMap.up,1000)
    if(passs===2){
        if(currentRole.runFirst==='right'){
            pass = 2
        }else{
            pass =  await utils.runUntilPassRoom(windowsBot,hwnd,keyMap.left,600)
        }
        if(pass===2){
              pas =  await utils.runUntilPassRoom(windowsBot,hwnd,keyMap.right,800)
              if(pas === 2){
                pa =  await utils.runUntilPassRoom(windowsBot,hwnd,keyMap.left,3000)
              }
        }
    }

    if(pa === 2){

        console.log('捡东西')
        await windowsBot.sendVk(keyMap['/?'], 1);
        await windowsBot.sleep(200);
        await windowsBot.sendVk(keyMap.x, 1);
        await windowsBot.sleep(200);
        await windowsBot.sendVk(keyMap.x, 1);
        await windowsBot.sleep(200);

        await handleError(windowsBot,'四图过图错误')
        // utils.run(windowsBot,keyMap.left,500)
        // utils.run(windowsBot,keyMap.right,500)
    }

}





async function fiveRoom(windowsBot){

    console.log('-----------普通五图------------')
    await windowsBot.sleep(500);


    await utils.move(windowsBot,keyMap.up,700)
    
    await utils.move(windowsBot,keyMap.right,100)


    if(Array.isArray(currentRole.map5Sk)){
        for(let i=0;i<currentRole.map5Sk.length;i++){
            let skill = currentRole.map5Sk[i]
            if(Array.isArray(skill)){
                for(let i = 0;i<skill.length;i++){
                    await windowsBot.sendVk(skill[i], 1);
                    await windowsBot.sleep(500);
                }
            }else{
                await windowsBot.sendVk(skill, 1);
            }
            await windowsBot.sleep(1000);
        }
    }else{
        await windowsBot.sendVk(currentRole.map5Sk, 1);
        await windowsBot.sleep(500);
    
    }

    let time = +new Date()
    let result = await utils.doUntilCanNext(windowsBot,hwnd,10000,async ()=>{


        await utils.move(windowsBot,keyMap.right,300)
        await windowsBot.sendVk(keyMap.x, 2);
        await windowsBot.sleep(500);
        await windowsBot.sendVk(keyMap.x, 3);

        //往右走一点 补一个小技能
        if( + new Date() - time > 2000){
            await windowsBot.sendVk(currentRole.map5BackupSk, 1);
            await windowsBot.sleep(200);
        }
    })
    await windowsBot.sleep(200);

    //超时
    if(result === 2){
        await handleError(windowsBot,'五图打怪错误')
        return
    }

    let passResult =  await utils.runUntilPassRoom(windowsBot,hwnd,keyMap.right)

    if(passResult === 2){
        // utils.run(windowsBot,keyMap.left,500)
        // utils.run(windowsBot,keyMap.right,500)

        console.log('捡东西')
        await windowsBot.sendVk(keyMap['/?'], 1);
        await windowsBot.sleep(200);
        await windowsBot.sendVk(keyMap.x, 1);
        await windowsBot.sleep(200);
        await windowsBot.sendVk(keyMap.x, 1);
        await windowsBot.sleep(200);

        await handleError(windowsBot,'五图过图错误')
    }

}


async function sixRoom(windowsBot){

    console.log('-----------普通六图------------')
    await windowsBot.sleep(500);


    await utils.run(windowsBot,keyMap.right,500)

    if(Array.isArray(currentRole.map6Sk)){
        for(let i=0;i<currentRole.map6Sk.length;i++){
            let skill = currentRole.map6Sk[i]
            if(Array.isArray(skill)){
                for(let i = 0;i<skill.length;i++){
                    await windowsBot.sendVk(skill[i], 1);
                    await windowsBot.sleep(500);
                }
            }else{
                await windowsBot.sendVk(skill, 1);
            }
            await windowsBot.sleep(1000);
        }
    }else{
        await windowsBot.sendVk(currentRole.map6Sk, 1);
        await windowsBot.sleep(500);
    }

    //放3觉，多等一会
    if(currentRole.map6Sk === keyMap.t){
        console.log('放3觉，多等一会',currentRole.map6Sk,keyMap.t)
        await windowsBot.sleep(4000);
    }

    let time = +new Date()
    let result = await utils.doUntilCanNext(windowsBot,hwnd,15000,async ()=>{


        await utils.move(windowsBot,keyMap.right,300)
        await windowsBot.sendVk(keyMap.x, 2);
        await windowsBot.sleep(500);
        await windowsBot.sendVk(keyMap.x, 3);

        //往右走一点 补一个小技能
        if( + new Date() - time > 2000){
            await windowsBot.sendVk(currentRole.map6BackupSk, 1);
            await windowsBot.sleep(200);
        }
    })
    await windowsBot.sleep(200);

    //超时
    if(result === 2){
        await handleError(windowsBot,'六图打怪错误')
        return
    }



    // console.log('往上走')
    // await windowsBot.sendVk(keyMap.up, 2);
    // await windowsBot.sleep(1500);
    // await windowsBot.sendVk(keyMap.up, 3);
    // await windowsBot.sleep(100);

    // console.log('往xia走')
    // await windowsBot.sendVk(keyMap.down, 2);
    // await windowsBot.sleep(500);
    // await windowsBot.sendVk(keyMap.down, 3);
    // await windowsBot.sleep(100);


    console.log('捡东西')
    if(currentRole.hasCapsLk){
        await windowsBot.sendVk(keyMap['/?'], 1);
    }else{
        await windowsBot.sendVk(keyMap.capsLk, 1);
    }

    await windowsBot.sleep(200);
    await windowsBot.sendVk(keyMap.x, 1);
    await windowsBot.sleep(200);
    await windowsBot.sendVk(keyMap.x, 1);
    await windowsBot.sleep(200);

    

    let passResult 
    if(currentRole.sixRoomFix){
        let passRe = await utils.runUntilPassRoom(windowsBot,hwnd,keyMap.right,500)

        if(passRe===2){
            await utils.run(windowsBot,keyMap.up,100)
            passResult = await utils.runUntilPassRoom(windowsBot,hwnd,keyMap.right,4000)
        }

    }else{
        passResult = await utils.runUntilPassRoom(windowsBot,hwnd,keyMap.right)
    }


    if(passResult === 2){

        await utils.runUntilPassRoom(windowsBot,hwnd,keyMap.left,500)

        await utils.move(windowsBot,keyMap.up,200)

        let fixResult = await utils.moveUntilPassRoom(windowsBot,hwnd,keyMap.right)
        
        if(fixResult ===1){
            currentRole.sixRoomFix = true
        }else{
            await handleError(windowsBot,'六图过图错误')
            return
        }
    }

}


async function sevenRoom(windowsBot){

    console.log('-----------普通七图------------')
    await windowsBot.sleep(500);

    await utils.run(windowsBot,keyMap.right,300)

    let skills = [...currentRole.map7Sks]

    let endResult = await utils.doUntilEnd(windowsBot,hwnd,40000,async ()=>{
        let skill = skills.shift()
        if(skill){
            if(Array.isArray(skill)){
                for(let i = 0;i<skill.length;i++){
                    await windowsBot.sendVk(skill[i], 1);
                    await windowsBot.sleep(500);
                }
            }else{
                await windowsBot.sendVk(skill, 1);
                await windowsBot.sleep(200);
                await windowsBot.sendVk(skill, 1);
            }
            await windowsBot.sleep(200);
            await windowsBot.sendVk(keyMap.x, 2);
            await windowsBot.sleep(2000);
            await windowsBot.sendVk(keyMap.x, 3);
            await windowsBot.sleep(300);
        }else{
            await windowsBot.sendVk(keyMap.x, 2);
            await windowsBot.sleep(2000);
            await windowsBot.sendVk(keyMap.x, 3);
            await windowsBot.sleep(300);
        }
    })

    //超时
    if(endResult === 2){
        console.log('boss error')
        await handleError(windowsBot,'七图boss超时')
        return
    }

}





async function handleError(windowsBot,msg){
    console.log('错误了回城重进')
    await windowsBot.sleep(1000); 

    await backTown(windowsBot)

    await windowsBot.setClipboardText(currentRole.type + currentRole.id + ':' + msg);

    console.log('向QQ发送通知出错了');
    if(!qqhwnd){
        qqhwnd = await windowsBot.findWindow(null, '朝日');
        console.log('qqhwnd',qqhwnd)
        await windowsBot.sleep(500);
    }

    // await windowsBot.clickMouse(qqhwnd, 2520, 733, 1);
    await windowsBot.clickMouse(qqhwnd, 241, 315, 1);
    await windowsBot.sleep(500);
    // await windowsBot.sendVk(keyMap.x, 1);
    // await windowsBot.sleep(500);
    // await windowsBot.sendVk(keyMap.enter, 1);w
    // await windowsBot.sleep(200);
    // await windowsBot.sendVk(keyMap.enter, 1);
    // await windowsBot.sleep(200);

    await windowsBot.sendVk(keyMap.ctrl, 2);
    await windowsBot.sleep(200);

    await windowsBot.sendVk(keyMap.v, 1);
    await windowsBot.sleep(200);

    await windowsBot.sendVk(keyMap.ctrl, 3);
    await windowsBot.sleep(200);

    await windowsBot.sendVk(keyMap.enter, 1);
    await windowsBot.sleep(200);
  
    await windowsBot.setClipboardText('');

    await utils.focusWindow(windowsBot,hwnd)
    await windowsBot.sleep(500);



    await utils.move(windowsBot,keyMap.left,1000)

    let passResult =  await utils.runUntilPassRoom(windowsBot,hwnd,keyMap.right,3000)

    if(passResult===2){
        roleState --
        await exitToRole(windowsBot)

    }

    console.log('select map haibolun')
    await windowsBot.sleep(1000);

    await windowsBot.clickMouse(hwnd, 526, 318, 1);
    await windowsBot.sleep(500);


    console.log('进图');

    await windowsBot.clickMouse(hwnd, 526, 318, 1);
    await windowsBot.sleep(2000);





    //用于外部调用捕获 不再执行接下来的代码
    throw new Error('战斗出错')
}

async function test(windowsBot) {
    
    await windowsBot.sleep(500)
    await init(windowsBot)

    await windowsBot.sleep(500)
    await  utils.focusWindow(windowsBot,hwnd)
    await windowsBot.sleep(500)

    console.log('-------startTest--------')

    // await exitToRole(windowsBot)
    // await utils.findEnd(windowsBot, hwnd, new Date, 10000)

    // await ifNoplOCR(windowsBot)
    // await ifNoplNew(windowsBot)
    await handleError(windowsBot,'测试错误')

    // let endResult = await utils.doUntilEnd(windowsBot,hwnd,5000,async ()=>{

    //         await windowsBot.sleep(300);
    // })

    // console.log('endResult','endResult',endResult)

    // await utils.findEnd(windowsBot,hwnd,+new Date(),50000)
    // await ifNoplNew(windowsBot)
    // let color =  await windowsBot.getColor(hwnd, utils.getPosX(1234),utils.getPosY(1060), false);

    // console.log('color',color)

    // await backTown(windowsBot)

    process.exit()




    await windowsBot.sleep(2000)

}


async function autoDecompose(windowsBot){
   
}





