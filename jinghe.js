const WindowsBot = require('WindowsBot');//引用WindowsBot模块
const moment = require('moment')
// const config = require('./config.json')

//注册主函数
WindowsBot.registerMain(windowsMain, "127.0.0.1", 26678);

/**用作代码提示，windowsMain函数会被多次调用，注意使用全局变量
* @param {WindowsBot} windowsBot
*/

const ocrServer = 'ocr.ai-bot.net'
const ocrServerPort = 9528
const args = process.argv.slice(2);
const windowWidth = 1600
const windowHeight = 900
const keyMap = {
    'alt': 0x12,
    'esc': 0x1b,
    'w': 0x57,
    'a': 0x41,
    'b': 0x42,
    's': 0x53,
    'd': 0x44,
    'e': 0x45,
    'f': 0x46,
    'm': 0x4D,
    'r': 0x52,
    'q': 0x51,
    'num5': 0x35,
    'num4': 0x34,
    'num3': 0x33,
    'num2': 0x32,
    'num1': 0x31,
    'shift': 0x10,
    'space': 0x20,
    'tab': 0x09
}
const globalMode = false // true back-end false front-end


//状态 0 未进游戏 1 选择账号界面  
let state = 0
let roleState = 0

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

let finishAll = false
let finishAfter = false

const clickMouseOffset = 10

const DAYS = moment().days()

let roleErrors = 0  //该角色出现进入战斗错误
let roleFirstEnterBattle = true  //该角色第一次进入战斗

let battleType = 'linjie'  //shneyuan anyu

let isDouble = false

let roleTimes = 6

async function windowsMain(windowsBot) {

    //hack windowbot.clickMouse加入随机数
    let originClickMouse = windowsBot.clickMouse
    windowsBot.clickMouse = function (hwnd, x, y, msg, options = {}) {

        let random = Math.floor(Math.random() * clickMouseOffset) * (Math.random() > 0.5 ? 1 : -1)
        let random1 = Math.floor(Math.random() * clickMouseOffset) * (Math.random() > 0.5 ? 1 : -1)

        return originClickMouse.call(this, hwnd, x + random, y + random1, msg, options)
    }


    //设置隐式等待
    await windowsBot.setImplicitTimeout(5000);
    // console.log('--------------config--------------',config)
    // roleState = config.role-1
    // console.log('设置配置参数')



    console.log('cmd params', args + '')
    let resumeArg = args.find(item => item.includes('resume'))

    let role = args.find(item => item.includes('role'))

    if (role) {
        roleState = role.split('=')[1] - 1
        console.log('从第几个角色开始', roleState + 1)
    }

    let battleTypeArgs = args.find(item => item.includes('battleType'))

    if (battleTypeArgs) {
        battleType = battleTypeArgs.split('=')[1]
        console.log('刷什么', battleType)
    }

    let doubleArgs = args.find(item => item.includes('double'))

    if (doubleArgs) {
        isDouble = true
    }
    console.log('isdouble', isDouble)


    let onceArgs = args.find(item => item.includes('once'))

    if (onceArgs) {
        roleTimes = 1
    }


    if (resumeArg) {
        state = Number(args[1])
        await resume(windowsBot)
    } else {
        await init(windowsBot)
    }






    console.log('state', state, mapState[state])
    while (!finishAll) {
        console.log('loop,state', state)
        // if(state===0){
        //     await enterGame(windowsBot)
        // }else if(state ===1){
        //     await selectAccount(windowsBot)
        // }else if(state ===2){
        //     await getRandomAction()(windowsBot)
        // }else if(state ===3){
        //     await fighting(windowsBot); 
        // }else if(state ===4){

        // }else if(state ===5){

        // }else if(state ===-1){
        //     await test(windowsBot)
        // }
        switch (state) {
            case 0: await enterGame(windowsBot); break;
            case 1: await selectAccount(windowsBot); break;
            case 2: await getRandomAction()(windowsBot); break; //随机操作，重复执行，最后调用enterBattle
            case 3: await fighting(windowsBot); break;
            case -1: await test(windowsBot); break;
        }

    }

    //    await enterGame(windowsBot)

    // await main()
    console.log('结束')

}

async function test(windowsBot) {
    // console.log('saveImage')
    // let savePath = ".\\images\\activity.png";
    // let res1 = await windowsBot.saveScreenshot(hwnd, savePath);
    // let res1 = await windowsBot.saveScreenshot(hwnd, __dirname + '\\images\\activity.png', {region:[10, 20, 100, 100]});

    // console.log('saveImage res1',res1)

    
    state = 3
    roleState = 0
    await windowsBot.sleep(3000)

    await focusWindow(windowsBot)
    console.log('__dirname', __dirname)

    // await juedou(windowsBot)

    await lingxiang(windowsBot)

    return
    // await focusWindow(windowsBot)
    // await toMap(windowsBot,'kuangshi')
    // await sellEquiqment(windowsBot)
    // await focusWindow(windowsBot)
    // await fighting(windowsBot)
    // await getManual(windowsBot)

    // await goldSheep(windowsBot)
    // await saveMoney(windowsBot)
    // await getDouble(windowsBot)
    // await getWelfare(windowsBot)

    // await exitToRole(windowsBot)
    // await enterBattleAgain(windowsBot)
    // await enterBattle(windowsBot)
    // await ifNoBattery(windowsBot,true)
    // await handleError(windowsBot)

    // let preStr = __dirname + '\\images\\activity.png'
    // console.log('findImage',preStr)
    // let res = await windowsBot.findImage(hwnd,  __dirname + '\\images\\again.png', {mode:globalMode});
    // console.log('findImage res', res)


    // return
    // let found = false
    // let count = 0

    // console.log('前往出口')
    // let lastOpera = []

    // while (!found && count < 10) {
    //     count++
    //     let res = await windowsBot.findImage(hwnd, __dirname + '\\images\\indicator1.png', options = { sim: 0.5 });
    //     console.log('寻找指示器方向', res)
    //     if (res && res.length) {
    //         //在左边
    //         let x = res[0].x
    //         let y = res[0].y
    //         let direction = calculateDirection(x, y)
    //         console.log('判断方向: ', direction)

    //         if(lastOpera<2){
    //             lastOpera.push(direction)
    //         }else{
    //             if(direction === lastOpera[0]){
    //                 //判断已经重复了 往上走200
    //                 await windowsBot.sendVk(keyMap.w, 2);
    //                 await windowsBot.sleep(1000)
    //                 await windowsBot.sendVk(keyMap.w, 3);
    //             }
    //         }

    //         if (direction.includes('左')) {
    //             await windowsBot.sendVk(keyMap.a, 2);
    //         }
    //         if (direction.includes('上')) {
    //             await windowsBot.sendVk(keyMap.w, 2);
    //         }
    //         if (direction.includes('右')) {
    //             await windowsBot.sendVk(keyMap.d, 2);
    //         }
    //         if (direction.includes('下')) {
    //             await windowsBot.sendVk(keyMap.s, 2);
    //         }

    //         if (direction === '中间') {
    //             await windowsBot.sendVk(keyMap.w, 2);
    //         }



    //         await windowsBot.sleep(3000)
    //         await windowsBot.sendVk(keyMap.w, 3);
    //         await windowsBot.sendVk(keyMap.a, 3);
    //         await windowsBot.sendVk(keyMap.s, 3);
    //         await windowsBot.sendVk(keyMap.d, 3);

    //     }


    //     let res1 = await windowsBot.findImage(hwnd, __dirname + '\\images\\again.png', options = { sim: 0.8 });
    //     console.log('判断是否碰到出口', res1)

    //     if (res1) {
    //         found = true
    //     }
    // }



}

async function init(windowsBot) {
    if (!hwnd) {
        hwnd = await windowsBot.findWindow(null, '晶核：魔导觉醒');
    }
    console.log('找到主窗口句柄', hwnd)

    console.log('设置窗口大小位置')
    let res = await windowsBot.setWindowTop(hwnd, true);
    console.log('置顶结果', res)

    let res1 = await windowsBot.setWindowPos(hwnd, 0, 0, windowWidth, windowHeight);
    console.log('设置大小结果', res1)

    await windowsBot.setWindowTop(hwnd, false);
    console.log('取消置顶', res)

    // await windowsBot.initOcr(ocrServer, ocrServerPort);
    // console.log('ocr初始化完毕')
}

async function resume(windowsBot) {
    //重新获取hwnd
    hwnd = await getCurrentHwnd(windowsBot)

    console.log('设置窗口大小位置')
    let res = await windowsBot.setWindowTop(hwnd, true);
    console.log('置顶结果', res)

    let res1 = await windowsBot.setWindowPos(hwnd, 0, 0, windowWidth, windowHeight);
    console.log('设置大小结果', res1)

    await windowsBot.setWindowTop(hwnd, false);
    console.log('取消置顶', res)

    await windowsBot.sleep(3000);
}


async function enterGame(windowsBot) {
    console.log('准备进入游戏')

    let xpath = 'Document/Text[6]'

    await focusWindow(windowsBot)
    await windowsBot.sleep(1000);

    // let clickResult = await windowsBot.clickElement(133348, xpath, 1);
    await windowsBot.clickMouse(hwnd, 1390, 796, 1, { mode: globalMode });
    console.log('点击开始游戏按钮',)

    console.log('进入游戏成功')
    state = 1
    await windowsBot.sleep(10000);

    //重新获取hwnd
    hwnd = await getCurrentHwnd(windowsBot)
    await windowsBot.sleep(500);

    console.log('设置窗口大小位置')
    let res = await windowsBot.setWindowTop(hwnd, true);
    console.log('置顶结果', res)
    let res2 = await windowsBot.getWindowPos(hwnd);
    console.log('res2', res2)
    let res1 = await windowsBot.setWindowPos(hwnd, 0, 0, 1600, 900);
    console.log('设置大小结果', res1)

    await windowsBot.setWindowTop(hwnd, false);
    console.log('取消置顶', res)

    await windowsBot.sleep(2000);

    await focusWindow(windowsBot)

    //关闭公告
    await windowsBot.clickMouse(hwnd, 1312, 194, 1, { mode: globalMode });
    await windowsBot.sleep(1000);

    await windowsBot.clickMouse(hwnd, 1312, 194, 1, { mode: globalMode });
    await windowsBot.sleep(1000);

    console.log('关闭公告成功')

    //任意处继续
    await windowsBot.clickMouse(hwnd, 1200, 250, 1, { mode: globalMode });
    await windowsBot.sleep(1000);
    console.log('点击任意处成功')


    // let result =  await windowsBot.getWords(hwnd, {})
    // console.log('找到开始游戏按钮',result)
}


function getRandomAction() {

    if (!randomArr.length) {
        state = 3
        return enterBattle
    }

    let index = Math.floor(Math.random() * randomArr.length)
    randomMethod = randomArr.splice(index, 1)[0]
    console.log('随机操作', index, randomMethod.name)

    return randomMethod
}



async function selectAccount(windowsBot) {
    console.log('选择账号环节')
    roleErrors = 0
    roleFirstEnterBattle = true




    if ( roleState >= 6) {
        finishAll = true
        return
    }

    roleTimes--

    // await windowsBot.moveMouse(hwnd, 221, 450);

    await windowsBot.sleep(2000);
    console.log('先点击一下，方便滚动')
    await windowsBot.clickMouse(hwnd, 188, 208, 1, { mode: globalMode });
    await windowsBot.sleep(1000);
    console.log('移动鼠标-滚动鼠标')
    await windowsBot.rollMouse(hwnd, 221, 450, 3000, false);
    await windowsBot.sleep(2000);
    if (roleState === 5) {
        await windowsBot.clickMouse(hwnd, 98, 816, 1, { mode: globalMode });
    } else {
        await windowsBot.clickMouse(hwnd, 188, 208 + roleState * 130, 1, { mode: globalMode });
    }
    console.log('选择角色' + roleState + '成功')

    await windowsBot.sleep(2000);
    await windowsBot.clickMouse(hwnd, 1304, 683, 1, { mode: globalMode });
    console.log('进入游戏成功')
    roleState++
    state = 2

    await windowsBot.sleep(8000);

    let res1 = await windowsBot.setWindowPos(hwnd, 0, 0, windowWidth, windowHeight);
    console.log('设置大小结果', res1)

    await windowsBot.clickMouse(hwnd, 555, 555, 1, { mode: globalMode });
    await windowsBot.sleep(1000);

    await windowsBot.clickMouse(hwnd, 555, 555, 1, { mode: globalMode });
    await windowsBot.sleep(500);

    console.log('多点两下屏幕，避免幻晶月令的干扰')

}


async function fighting(windowsBot) {

    console.log('进入战斗 判断是否成功进入战斗')
    let result = await confirmInBattle(windowsBot)
    if (!result) {
        console.log('还未进入战斗,再等等')
        await windowsBot.sleep(2000);
        let result1 = await confirmInBattle(windowsBot)
        if (!result1) {

            console.log('出现异常，无进入战斗')
            roleErrors++
            await handleError(windowsBot)

            return
        }
    }

    console.log('进入战斗')
    await windowsBot.sleep(1000);


    let operas = [keyMap.e,
    keyMap.e,
    keyMap.num2,
    keyMap.num3,
    keyMap.e,
    keyMap.e,
    keyMap.num4,
    keyMap.num4, keyMap.num3,
    keyMap.num3, keyMap.num2, keyMap.e,
    keyMap.num2, keyMap.num1, keyMap.num4,
    keyMap.num1,]

    let operas1 = [keyMap.num5, keyMap.q]


    let over = false
    let times = 0

    await windowsBot.sendVk(keyMap.w, 2);
    await windowsBot.sleep(500);

    if (battleType === 'linjie') {
        await windowsBot.sleep(3000);
    }

    await windowsBot.sendVk(keyMap.shift, 1);
    await windowsBot.sleep(500);

    if (battleType === 'anyu') {
        await windowsBot.sleep(2000);
    }

    let limit = battleType === 'anyu' ? 5 : 3
    //打完了或者五轮技能都放过了就不循环了
    while (!over && times < limit) {
        for (let i = 0; i < operas.length; i++) {
            if (over) break;

            let opera = operas[i]
            //模拟狂点
            console.log('操作', opera)

            for (let j = 0; j < 3; j++) {
                await windowsBot.sendVk(opera, 1);
                await windowsBot.sleep(222);
                await windowsBot.sendVk(operas1[0], 1);
                await windowsBot.sleep(100);
                await windowsBot.sendVk(operas1[1], 1);
            }

            console.log('操作', opera)

            //判断是否打完了
            if (times != 0 && i % 4 === 0) {
                windowsBot.findImage(hwnd, __dirname + '\\images\\score.png', { sim: 0.8 }).then((res) => {
                    console.log('战斗结束', res)
                    if (res) {
                        over = true
                    }
                })
            }
        }
        times++
    }

    //放了三轮技能了都没结束
    if (times >= limit && !over) {
        let result = await confirmInBattle(windowsBot)


        if (result) {
            //直接退出
            console.log(limit + '轮技能放完了还没好，还在战斗界面直接退出')

            await windowsBot.sleep(1000)

            await windowsBot.sendVk(keyMap.alt, 2);
            await windowsBot.sleep(200);

            await windowsBot.clickMouse(hwnd, 884, 83, 1, { mode: globalMode });
            await windowsBot.sleep(1000);

            await windowsBot.clickMouse(hwnd, 1015, 580, 1, { mode: globalMode });
            await windowsBot.sleep(1000);
            console.log('确定退出')

            await windowsBot.sendVk(keyMap.alt, 3);


            await windowsBot.sleep(6000);
            await enterBattleAgain(windowsBot)
            return
        } else {
            console.log('不在战斗界面')
            await enterBattle(windowsBot)
        }
        return
    }

    //
    await windowsBot.sendVk(keyMap.w, 3);
    await windowsBot.sleep(2000);

    //任意关闭结算界面
    // await windowsBot.moveMouse(hwnd, 400, 400);
    // await windowsBot.sleep(2000);

    await windowsBot.sendVk(keyMap.alt, 2);
    await windowsBot.sleep(500);
    console.log('alt1')


    await windowsBot.clickMouse(hwnd, 1220, 200, 1, { mode: globalMode });
    await windowsBot.sleep(1000);
    console.log('关闭结算界面')



    await windowsBot.sendVk(keyMap.alt, 3);
    await windowsBot.sleep(500);
    console.log('alt2')


    // await windowsBot.clickMouse(hwnd, 400, 500, 1, {mode:globalMode});
    // await windowsBot.sleep(1000);
    let found = false


    //直接设置2 退出不找了 兼容临渊
    let count = 2

    console.log('前往出口')
    // while (!found && count < 2) {
    //     count++

    //     // if( count!=0 && count%3 ===0){
    //     //     //三次就转一下鼠标 增强判断准确性
    //     //     await windowsBot.moveMouseRelative(hwnd, 100, 0,false);
    //     //     await windowsBot.sleep(100)

    //     //     await windowsBot.moveMouseRelative(hwnd, 100, 0,false);
    //     //     await windowsBot.sleep(100)

    //     //     await windowsBot.moveMouseRelative(hwnd, 100, 0,false);
    //     //     await windowsBot.sleep(100)

    //     //     await windowsBot.moveMouseRelative(hwnd, 100, 0,false);
    //     //     await windowsBot.sleep(100)

    //     // }



    //     // let res = await windowsBot.findImage(hwnd, __dirname + '\\images\\indicator1.png', options = { sim: 0.5 });
    //     // console.log('寻找指示器方向', res)
    //     // // let reshp = await windowsBot.findImage(hwnd, __dirname + '\\images\\hpbar.png', options = { sim: 0.8 });
    //     // // console.log('寻找角色血条',reshp)

    //     // if (res && res.length) {
    //     //     let x = res[0].x
    //     //     let y = res[0].y

    //     //     let roleX = 800
    //     //     let roleY = 700 - Math.floor(Math.random() * 100)

    //     //     let direction = calculateDirectionPoint2Point(roleX,roleY,x, y,30)
    //     //         //  direction = calculateDirection(x, y)
    //     //     //在左边

    //     //     // let direction = calculateDirection(x, y)
    //     //     console.log('判断方向: ', direction)



    //     //     if (direction.includes('左')) {
    //     //         await windowsBot.sendVk(keyMap.a, 2);
    //     //     }
    //     //     if (direction.includes('上')) {
    //     //         await windowsBot.sendVk(keyMap.w, 2);
    //     //     }
    //     //     if (direction.includes('右')) {
    //     //         await windowsBot.sendVk(keyMap.d, 2);
    //     //     }
    //     //     if (direction.includes('下')) {
    //     //         await windowsBot.sendVk(keyMap.s, 2);
    //     //     }

    //     //     await windowsBot.sleep(300)
    //     //     await windowsBot.sendVk(keyMap.shift, 1);


    //     //     // if (direction === '中间') {
    //     //     //     await windowsBot.sendVk(keyMap.w, 2);
    //     //     // }



    //     //     await windowsBot.sleep(2000)
    //     //     await windowsBot.sendVk(keyMap.w, 3);
    //     //     await windowsBot.sendVk(keyMap.a, 3);
    //     //     await windowsBot.sendVk(keyMap.s, 3);
    //     //     await windowsBot.sendVk(keyMap.d, 3);

    //     // }


    //     //单纯的往前往后冲一下算了 不判断方向了 不行就退出 还更高效
    //     if(count === 1){
    //         await windowsBot.sendVk(keyMap.w, 2);
    //         await windowsBot.sleep(300)
    //         await windowsBot.sendVk(keyMap.shift, 1);
    //         await windowsBot.sleep(2000)
    //         await windowsBot.sendVk(keyMap.w, 3);

    //     }else{
    //         await windowsBot.sendVk(keyMap.s, 2);
    //         await windowsBot.sleep(300)
    //         await windowsBot.sendVk(keyMap.shift, 1);
    //         await windowsBot.sleep(3000)
    //         await windowsBot.sendVk(keyMap.s, 3);
    //     }



    //     let res1 = await windowsBot.findImage(hwnd, __dirname + '\\images\\again.png',{ sim: 0.8 });
    //     console.log('判断是否碰到出口', res1)

    //     if (res1) {
    //         found = true
    //     }
    // }
    //动了2次都找不到出口
    if (count >= 2 && !found) {
        await windowsBot.sleep(1000)

        if (battleType === 'shenyuan' || battleType === 'anyu') {
            let res = await windowsBot.findImage(hwnd, __dirname + '\\images\\again.png', { sim: 0.8 });
            console.log('判断是否碰到出口', res)

            if (res) {
                await windowsBot.sendVk(keyMap.e, 1);
                await windowsBot.sleep(1000);
                console.log('按e再次挑战')

                await windowsBot.clickMouse(hwnd, 1015, 580, 1, { mode: globalMode });
                console.log('确定再次挑战')
                await windowsBot.sleep(2000);

                await ifNoBattery(windowsBot)

                return
            }

        }


        await windowsBot.sendVk(keyMap.alt, 2);
        await windowsBot.sleep(200);

        await windowsBot.clickMouse(hwnd, 884, 83, 1, { mode: globalMode });
        await windowsBot.sleep(1000);


        console.log('找不到出口直接退出')

        await windowsBot.clickMouse(hwnd, 1015, 580, 1, { mode: globalMode });
        await windowsBot.sleep(1000);
        console.log('确定退出')

        await windowsBot.sendVk(keyMap.alt, 3);


        await windowsBot.sleep(6000);
        await enterBattleAgain(windowsBot)
        return
    }

    await windowsBot.sleep(2000);


    await windowsBot.sendVk(keyMap.e, 1);
    await windowsBot.sleep(1000);
    console.log('按e再次挑战')

    await windowsBot.clickMouse(hwnd, 1015, 580, 1, { mode: globalMode });
    console.log('确定再次挑战')
    await windowsBot.sleep(2000);

    await ifNoBattery(windowsBot)



    // await windowsBot.sendVk(keyMap.d, 2);
}
//判断是否没体力了 
async function ifNoBattery(windowsBot, isAgain = false) {
    await windowsBot.sleep(500);

    let res2 = await windowsBot.findImage(hwnd, __dirname + '\\images\\battery.png', { sim: 0.7 });
    console.log('判断是否还能正常继续挑战', res2)
    if (res2) {
        await windowsBot.sleep(1000);
        console.log('没体力了')


        await windowsBot.sendVk(keyMap.esc, 1);
        await windowsBot.sleep(1000);

        //在外面
        if (isAgain) {
            await windowsBot.sendVk(keyMap.esc, 1);
            await windowsBot.sleep(500);

            await windowsBot.sendVk(keyMap.esc, 1);
            await windowsBot.sleep(500);


        } else {
            //在里面 先出来
            await windowsBot.sendVk(keyMap.alt, 2);
            await windowsBot.sleep(200);

            await windowsBot.clickMouse(hwnd, 884, 83, 1, { mode: globalMode });
            await windowsBot.sleep(1000);


            console.log('直接退出')

            await windowsBot.clickMouse(hwnd, 1015, 580, 1, { mode: globalMode });
            await windowsBot.sleep(1000);
            console.log('确定退出')

            await windowsBot.sendVk(keyMap.alt, 3);

            await windowsBot.sleep(6000);

        }


        await afterFinish(windowsBot)
        await windowsBot.sleep(1000);

        await windowsBot.sendVk(keyMap.esc, 1);
        await windowsBot.sleep(1000);

        console.log('打开设置界面')
        await exitToRole(windowsBot)
        return false
    }

    return true

    // await windowsBot.clickMouse(hwnd, 1015, 580, 1, {mode:globalMode});
    // await windowsBot.sleep(6000);

}

async function exitToRole(windowsBot) {


    await windowsBot.clickMouse(hwnd, 1483, 710, 1, { mode: globalMode });
    await windowsBot.sleep(1000);

    console.log('点击设置按钮')



    await windowsBot.clickMouse(hwnd, 1485, 780, 1, { mode: globalMode });
    await windowsBot.sleep(3000);
    console.log('点击切换角色')

    state = 1
}

async function handleError(windowsBot) {


    await windowsBot.sendVk(keyMap.esc, 1);
    await windowsBot.sleep(1000);
    console.log('按下一次esc后再判断')

    let res = await windowsBot.findImage(hwnd, __dirname + '\\images\\zhanling.png', { sim: 0.6 });
    console.log('判断是否在外面界面', res)

    if (!res) {
        await windowsBot.sleep(500);

        await windowsBot.sendVk(keyMap.esc, 1);
        await windowsBot.sleep(1000);
        console.log('按下两次esc后再判断')

        let res1 = await windowsBot.findImage(hwnd, __dirname + '\\images\\zhanling.png', { sim: 0.6 });
        console.log('判断是否在外面界面', res)

        if (!res1) {
            await windowsBot.sleep(500);

            await windowsBot.sendVk(keyMap.esc, 1);
            await windowsBot.sleep(1000);
            console.log('按下三次esc后再判断')

            let res2 = await windowsBot.findImage(hwnd, __dirname + '\\images\\zhanling.png', { sim: 0.6 });
            console.log('判断是否在外面界面', res)
            if (!res2) {

                await windowsBot.sleep(500);
                await windowsBot.sendVk(keyMap.esc, 1);
                await windowsBot.sleep(1000);
            }
        }
    }

    //以上操作确保在默认界面

    if (roleErrors >= 2) {
        console.log('处理错误：切换角色')

        await windowsBot.sendVk(keyMap.esc, 1);
        await windowsBot.sleep(1000);
        console.log('打开设置界面')
        await exitToRole(windowsBot)

    } else {
        console.log('处理错误：重新进入战斗流程')
        await enterBattle(windowsBot)
    }

}

async function enterBattle(windowsBot) {

    console.log('type', battleType)

    switch (battleType) {
        case 'linjie': await enterLinjie(windowsBot); break;
        case 'shenyuan': await enterShenyuan(windowsBot); break;
        case 'anyu': await enterAnyu(windowsBot); break;
    }
}


async function enterAnyu(windowsBot) {
    //先点击下界面聚焦下窗口
    await focusWindow(windowsBot)
    await windowsBot.sleep(1000);

    //做两次 使得其自动旋转镜头生效 比自己转的 健壮性高
    for (let i = 0; i < 2; i++) {
        await toMap(windowsBot, 'lumi')

        console.log('准备进入战斗')


        await windowsBot.sendVk(keyMap.tab, 1);
        await windowsBot.sleep(500);
        console.log('活动')


        await windowsBot.clickMouse(hwnd, 456, 335, 1, { mode: globalMode });
        await windowsBot.sleep(500);
        console.log('冒险')

        await windowsBot.clickMouse(hwnd, 119, 620, 1, { mode: globalMode });
        await windowsBot.sleep(500);
        console.log('点击深渊暗域')

        if (isDouble) {
            await windowsBot.clickMouse(hwnd, 758, 814, 1, { mode: globalMode });
            await windowsBot.sleep(500);
            console.log('点击双倍')
        }

        await windowsBot.clickMouse(hwnd, 1425, 818, 1, { mode: globalMode });
        await windowsBot.sleep(500);
        console.log('点击挑战')

        let result = await ifNoBattery(windowsBot, true)

        if (!result) return

        await windowsBot.sleep(8000);
    }

    await windowsBot.sendVk(keyMap.w, 2);
    await windowsBot.sleep(5000);
    console.log('前进5秒')

    await windowsBot.clickMouse(hwnd, 995, 590, 1, { mode: globalMode });
    await windowsBot.sleep(500);
    console.log('点击确认')

    await windowsBot.sendVk(keyMap.w, 3);



    let result = await ifNoBattery(windowsBot, true)

    if (!result) return

    await windowsBot.sleep(7000);

}

async function enterLinjie(windowsBot) {
    //先点击下界面聚焦下窗口
    await focusWindow(windowsBot)
    await windowsBot.sleep(1000);

    //做两次 使得其自动旋转镜头生效 比自己转的 健壮性高
    for (let i = 0; i < 2; i++) {
        await toMap(windowsBot, 'lumi')

        console.log('准备进入战斗')


        await windowsBot.sendVk(keyMap.tab, 1);
        await windowsBot.sleep(500);
        console.log('活动')


        await windowsBot.clickMouse(hwnd, 921, 595, 1, { mode: globalMode });
        await windowsBot.sleep(500);
        console.log('挑战')

        await windowsBot.clickMouse(hwnd, 171, 548, 1, { mode: globalMode });
        await windowsBot.sleep(500);
        console.log('点击临界')

        await windowsBot.clickMouse(hwnd, 1211, 466, 1, { mode: globalMode });
        await windowsBot.sleep(500);
        console.log('点击临界3')


        if (isDouble) {
            await windowsBot.clickMouse(hwnd, 1128, 563, 1, { mode: globalMode });
            await windowsBot.sleep(500);
            console.log('点击双倍')
        }

        await windowsBot.clickMouse(hwnd, 1180, 648, 1, { mode: globalMode });
        await windowsBot.sleep(500);
        console.log('点击挑战')

        let result = await ifNoBattery(windowsBot, true)

        if (!result) return

        await windowsBot.sleep(8000);
    }

    await windowsBot.sendVk(keyMap.w, 2);
    await windowsBot.sleep(3000);
    console.log('前进三秒')

    await windowsBot.clickMouse(hwnd, 1211, 466, 1, { mode: globalMode });
    await windowsBot.sleep(500);
    console.log('点击临界3')



    if (isDouble) {
        await windowsBot.clickMouse(hwnd, 1128, 563, 1, { mode: globalMode });
        await windowsBot.sleep(500);
        console.log('点击双倍')
    }

    await windowsBot.clickMouse(hwnd, 1180, 648, 1, { mode: globalMode });
    await windowsBot.sleep(500);
    console.log('点击挑战')

    let result = await ifNoBattery(windowsBot, true)

    if (!result) return

    await windowsBot.sleep(8000);

}

//开始战斗
async function enterShenyuan(windowsBot) {

    //先点击下界面聚焦下窗口
    await focusWindow(windowsBot)
    await windowsBot.sleep(1000);

    await toMap(windowsBot, 'laiyin')

    console.log('准备进入战斗')

    // await toLaiyin(windowsBot)



    // await windowsBot.clickMouse(hwnd, 1521, 340, 1, {mode:globalMode});
    // await windowsBot.sleep(2000);

    // console.log('聚焦')
    //按下alt
    await windowsBot.sendVk(keyMap.alt, 2);
    await windowsBot.sleep(300);
    console.log('按下alt')

    await windowsBot.clickMouse(hwnd, 1521, 340, 1, { mode: globalMode });
    await windowsBot.sleep(1000);

    await windowsBot.sendVk(keyMap.alt, 3);
    await windowsBot.sleep(300);
    console.log('按下alt')

    console.log('按下战斗按钮')

    await windowsBot.clickMouse(hwnd, 425, 343, 1, { mode: globalMode });
    await windowsBot.sleep(1000);

    console.log('按下冒险')


    await windowsBot.clickMouse(hwnd, 146, 540, 1, { mode: globalMode });
    await windowsBot.sleep(1000);

    console.log('按下克罗姆军工厂')

    await windowsBot.clickMouse(hwnd, 1408, 858, 1, { mode: globalMode });
    await windowsBot.sleep(1000);

    console.log('按下机械巨塔')



    if (isDouble) {
        await windowsBot.clickMouse(hwnd, 646, 815, 1, { mode: globalMode });
        await windowsBot.sleep(1000);
        console.log('按下双倍')
    }



    await windowsBot.clickMouse(hwnd, 1433, 820, 1, { mode: globalMode });

    let result = await ifNoBattery(windowsBot, true)

    if (!result) return

    await windowsBot.sleep(10000);

    console.log('按下单人挑战,并切换地图')

    if (roleFirstEnterBattle) {
        roleFirstEnterBattle = false
        console.log('角色第一次进入不会自动转镜头，去一次鲁米村再回来')

        await toMap(windowsBot, 'lumi')


        console.log('准备进入战斗')

        // await toLaiyin(windowsBot)



        // await windowsBot.clickMouse(hwnd, 1521, 340, 1, {mode:globalMode});
        // await windowsBot.sleep(2000);

        // console.log('聚焦')
        //按下alt
        await windowsBot.sendVk(keyMap.alt, 2);
        await windowsBot.sleep(300);
        console.log('按下alt')

        await windowsBot.clickMouse(hwnd, 1521, 340, 1, { mode: globalMode });
        await windowsBot.sleep(1000);

        await windowsBot.sendVk(keyMap.alt, 3);
        await windowsBot.sleep(300);
        console.log('按下alt')

        console.log('按下战斗按钮')

        await windowsBot.clickMouse(hwnd, 425, 343, 1, { mode: globalMode });
        await windowsBot.sleep(1000);

        console.log('按下冒险')


        await windowsBot.clickMouse(hwnd, 146, 540, 1, { mode: globalMode });
        await windowsBot.sleep(1000);

        console.log('按下克罗姆军工厂')

        await windowsBot.clickMouse(hwnd, 1408, 858, 1, { mode: globalMode });
        await windowsBot.sleep(1000);

        console.log('按下机械巨塔')



        if (isDouble) {
            await windowsBot.clickMouse(hwnd, 646, 815, 1, { mode: globalMode });
            await windowsBot.sleep(1000);
            console.log('按下双倍')
        }


        await windowsBot.clickMouse(hwnd, 1433, 820, 1, { mode: globalMode });

        let result = await ifNoBattery(windowsBot, true)

        if (!result) return

        await windowsBot.sleep(10000);

        console.log('按下单人挑战,并切换地图')

    }

    //向前移动

    console.log('开始移动')

    await windowsBot.sendVk(keyMap.w, 2);
    await windowsBot.sleep(10000);
    // await windowsBot.sendVk(keyMap.a, 2);
    // await windowsBot.sleep(2000);
    // await windowsBot.sendVk(keyMap.a,3);

    // await windowsBot.sleep(3000);
    await windowsBot.sendVk(keyMap.w, 3);

    // let res = await windowsBot.findImage(hwnd, __dirname + '\\images\\confirm.png', { sim: 0.6 });
    // console.log('判断是否碰到npc', res)

    // if(!res){
    //     //没碰到 再往左移动3秒
    //     await windowsBot.sendVk(keyMap.a, 2);
    //     await windowsBot.sleep(3000);

    //     await windowsBot.sendVk(keyMap.a, 3);

    // }

    console.log('结束移动')
    await windowsBot.sleep(2000);


    await windowsBot.clickMouse(hwnd, 1000, 580, 1, { mode: globalMode });
    await windowsBot.sleep(5000);
    console.log('点击确认挑战进入战斗')


    // state = 3

    // //alt
    // await windowsBot.sendVk(keyMap.alt, 3);

}

async function enterBattleAgain(windowsBot) {

    console.log('type', battleType)

    switch (battleType) {
        case 'linjie': await enterBattlelinjieAgain(windowsBot); break;
        case 'shenyuan': await enterBattleShenyuanAgain(windowsBot); break;
        case 'anyu': await enterBattleAnyuAgain(windowsBot); break;
    }
}

async function enterLinjie(windowsBot) {
    //先点击下界面聚焦下窗口
    await focusWindow(windowsBot)
    await windowsBot.sleep(1000);

    //做两次 使得其自动旋转镜头生效 比自己转的 健壮性高
    for (let i = 0; i < 2; i++) {
        await toMap(windowsBot, 'lumi')

        console.log('准备进入战斗')


        await windowsBot.sendVk(keyMap.tab, 1);
        await windowsBot.sleep(500);
        console.log('活动')


        await windowsBot.clickMouse(hwnd, 921, 595, 1, { mode: globalMode });
        await windowsBot.sleep(500);
        console.log('挑战')

        await windowsBot.clickMouse(hwnd, 171, 548, 1, { mode: globalMode });
        await windowsBot.sleep(500);
        console.log('点击临界')

        await windowsBot.clickMouse(hwnd, 1211, 466, 1, { mode: globalMode });
        await windowsBot.sleep(500);
        console.log('点击临界3')


        if (isDouble) {
            await windowsBot.clickMouse(hwnd, 1128, 563, 1, { mode: globalMode });
            await windowsBot.sleep(500);
            console.log('点击双倍')
        }

        await windowsBot.clickMouse(hwnd, 1180, 648, 1, { mode: globalMode });
        await windowsBot.sleep(500);
        console.log('点击挑战')

        let result = await ifNoBattery(windowsBot, true)

        if (!result) return

        await windowsBot.sleep(8000);
    }

    await windowsBot.sendVk(keyMap.w, 2);
    await windowsBot.sleep(3000);
    console.log('前进三秒')

    await windowsBot.clickMouse(hwnd, 1211, 466, 1, { mode: globalMode });
    await windowsBot.sleep(500);
    console.log('点击临界3')



    if (isDouble) {
        await windowsBot.clickMouse(hwnd, 1128, 563, 1, { mode: globalMode });
        await windowsBot.sleep(500);
        console.log('点击双倍')
    }

    await windowsBot.clickMouse(hwnd, 1180, 648, 1, { mode: globalMode });
    await windowsBot.sleep(500);
    console.log('点击挑战')

    let result = await ifNoBattery(windowsBot, true)

    if (!result) return

    await windowsBot.sleep(8000);

}



async function enterBattlelinjieAgain(windowsBot) {
    await focusWindow(windowsBot)
    //先点击下界面聚焦下窗口
    await windowsBot.sleep(1000);

    await windowsBot.sendVk(keyMap.f, 1);
    await windowsBot.sleep(2000);

    await windowsBot.clickMouse(hwnd, 1213, 460, 1, { mode: globalMode });
    await windowsBot.sleep(1000);

    await windowsBot.clickMouse(hwnd, 1211, 458, 1, { mode: globalMode });
    await windowsBot.sleep(1000);


    if (isDouble) {
        await windowsBot.clickMouse(hwnd, 1128, 563, 1, { mode: globalMode });
        await windowsBot.sleep(500);
        console.log('点击双倍')
    }

    await windowsBot.clickMouse(hwnd, 1189, 645, 1, { mode: globalMode });
    await windowsBot.sleep(500);
    console.log('单人挑战')

    let result = await ifNoBattery(windowsBot, true)

    if (!result) return

    await windowsBot.sleep(5000);
}


async function enterBattleAnyuAgain(windowsBot) {
    await focusWindow(windowsBot)
    //先点击下界面聚焦下窗口
    await windowsBot.sleep(1000);

    await windowsBot.sendVk(keyMap.f, 1);
    await windowsBot.sleep(2000);

    await windowsBot.clickMouse(hwnd, 1245, 460, 1, { mode: globalMode });
    await windowsBot.sleep(1000);

    if (isDouble) {
        await windowsBot.clickMouse(hwnd, 1128, 563, 1, { mode: globalMode });
        await windowsBot.sleep(1000);
        console.log('点击双倍')
    }

    await windowsBot.clickMouse(hwnd, 1429, 815, 1, { mode: globalMode });
    await windowsBot.sleep(1000);
    console.log('单人挑战')

    let result = await ifNoBattery(windowsBot, true)

    if (!result) return

    await windowsBot.sleep(5000);
}

async function enterBattleShenyuanAgain(windowsBot) {
    await focusWindow(windowsBot)
    //先点击下界面聚焦下窗口
    await windowsBot.sleep(1000);
    await windowsBot.sendVk(keyMap.d, 2);
    await windowsBot.sleep(1800);
    await windowsBot.sendVk(keyMap.d, 3);
    await windowsBot.sleep(100);
    console.log('往右走2秒')

    await windowsBot.sendVk(keyMap.w, 2);
    await windowsBot.sleep(500);
    await windowsBot.sendVk(keyMap.w, 3);
    await windowsBot.sleep(500);


    await windowsBot.sendVk(keyMap.f, 1);
    await windowsBot.sleep(1000);

    await windowsBot.sendVk(keyMap.w, 2);
    await windowsBot.sleep(500);
    await windowsBot.sendVk(keyMap.w, 3);
    await windowsBot.sleep(500);

    await windowsBot.sendVk(keyMap.f, 1);
    await windowsBot.sleep(1000);

    console.log('往上走0.5秒')

    await windowsBot.sendVk(keyMap.f, 1);
    await windowsBot.sleep(2000);

    console.log('按f')


    await windowsBot.clickMouse(hwnd, 1408, 858, 1, { mode: globalMode });
    await windowsBot.sleep(500);

    console.log('按下机械巨塔')


    if (isDouble) {
        await windowsBot.clickMouse(hwnd, 646, 815, 1, { mode: globalMode });
        await windowsBot.sleep(500);
        console.log('按下双倍')
    }



    await windowsBot.clickMouse(hwnd, 1433, 820, 1, { mode: globalMode });
    console.log('按下单人挑战')
    await windowsBot.sleep(1000);


    await ifNoBattery(windowsBot, true)

    await windowsBot.sleep(5000);

    console.log('按下单人挑战')

}

//确保在战斗中
async function confirmInBattle(windowsBot) {

    await windowsBot.sleep(1000);

    let res = await windowsBot.findImage(hwnd, __dirname + '\\images\\outdoor.png', { sim: 0.8 });

    if (res) {
        console.log('确认还在战斗中')
        return true
    } else {
        return false
    }
}


async function main() {

}

async function getCurrentHwnd(windowsBot) {
    let newhwnd = await windowsBot.findWindow(null, '晶核：魔导觉醒  ');
    console.log('新hwnd', newhwnd)
    return newhwnd
}

let goldCount = 0

//金羊毛
async function goldSheep(windowsBot) {

    console.log('今天星期' + DAYS)

    if (DAYS !== 1 && DAYS !== 3 && DAYS !== 5) {
        return
    }

    console.log('挑战金羊毛 临渊')

    if(goldCount>2) return

    await focusWindow(windowsBot)


    await windowsBot.sleep(500);

    await toMap(windowsBot, 'lumi')

    await windowsBot.sendVk(keyMap.tab, 1);
    await windowsBot.sleep(500);
    console.log('活动')


    await windowsBot.clickMouse(hwnd, 921, 595, 1, { mode: globalMode });
    await windowsBot.sleep(500);
    console.log('挑战')

    await windowsBot.clickMouse(hwnd, 158, 481, 1, { mode: globalMode });
    await windowsBot.sleep(500);
    console.log('点击金羊毛挑战')


    await windowsBot.clickMouse(hwnd, 534, 353, 1, { mode: globalMode });
    await windowsBot.sleep(500);
    console.log('点击临渊')


    await windowsBot.clickMouse(hwnd, 1304, 815, 1, { mode: globalMode });
    await windowsBot.sleep(6000);
    console.log('前往入口')


    await windowsBot.sendVk(keyMap.w, 2);
    await windowsBot.sleep(9000);
    await windowsBot.sendVk(keyMap.w, 3);

    console.log('向前走')


    await windowsBot.clickMouse(hwnd, 1310, 815, 1, { mode: globalMode });

    await windowsBot.sleep(1000);
    console.log('开始挑战')


    await windowsBot.clickMouse(hwnd, 1014, 583, 1, { mode: globalMode });

    console.log('确认')

    await windowsBot.sleep(9000);



    await windowsBot.sendVk(keyMap.w, 2);
    await windowsBot.sleep(3000);
    await windowsBot.sendVk(keyMap.w, 3);

    console.log('开始进入战斗')


    await windowsBot.sendVk(keyMap.w, 2);

    let operas = [keyMap.e,
    keyMap.e,
    keyMap.e,
    keyMap.num5, keyMap.num4,
    keyMap.num4, keyMap.num3,
    keyMap.num3, keyMap.num2,
    keyMap.num2, keyMap.num1,
    keyMap.num1]

    let operas1 = [keyMap.num5, keyMap.q]

    let seconds = 0

    let interval = setInterval(() => {
        seconds++
        console.log('seconds', seconds)
    }, 1000)


    //计时打1分半
    while (seconds < 75) {
        for (let i = 0; i < operas.length; i++) {

            console.log('seconds--', seconds)

            if (seconds >= 80) break;

            let opera = operas[i]
            //模拟狂点
            console.log('操作', opera)

            for (let j = 0; j < 2; j++) {
                await windowsBot.sendVk(opera, 1);
                await windowsBot.sleep(222);
                await windowsBot.sendVk(operas1[0], 1);
                await windowsBot.sleep(100);
            }

            await windowsBot.sendVk(operas1[1], 1);

            console.log('操作', opera)
        }
        console.log('seconds', seconds)
    }

    clearInterval(interval)

    console.log('打够75秒了 退出战斗')
    await windowsBot.sleep(500);
    await windowsBot.sendVk(keyMap.esc, 1);
    await windowsBot.sleep(1000);

    console.log('点退出')

    await windowsBot.clickMouse(hwnd, 1010, 588, 1, { mode: globalMode });
    await windowsBot.sleep(500);

    await windowsBot.sendVk(keyMap.w, 3);

    console.log('确认')
    await windowsBot.sleep(1000);



    await windowsBot.clickMouse(hwnd, 543, 379, 1, { mode: globalMode });
    await windowsBot.sleep(500);

    await windowsBot.clickMouse(hwnd, 543, 379, 1, { mode: globalMode });
    await windowsBot.sleep(500);


    await windowsBot.sleep(5000);
    console.log('金羊毛临渊结束')

    goldCount++

}

//舰队 投票和换证
async function getShip(windowsBot) {

    await focusWindow(windowsBot)
    await windowsBot.sleep(500);

    //按下alt
    // await windowsBot.sendVk(keyMap.alt, 2);
    await windowsBot.sendVk(keyMap.esc, 1);
    await windowsBot.sleep(500);
    // await windowsBot.clickMouse(hwnd, 1520, 419, 1, {mode:globalMode});
    console.log('点击设置界面')
    await windowsBot.sleep(500);
    await windowsBot.clickMouse(hwnd, 1469, 375, 1, { mode: globalMode });
    console.log('点击舰队')
    await windowsBot.sleep(500);
    await windowsBot.clickMouse(hwnd, 365, 801, 1, { mode: globalMode });
    console.log('点击集会所')
    await windowsBot.sleep(500);
    await windowsBot.clickMouse(hwnd, 330, 265, 1, { mode: globalMode });
    console.log('点击签到处')
    await windowsBot.sleep(500);
    await windowsBot.clickMouse(hwnd, 1140, 666, 1, { mode: globalMode });
    console.log('点击打卡')
    await windowsBot.sleep(2000);
    await windowsBot.clickMouse(hwnd, 565, 585, 1, { mode: globalMode });
    console.log('点击任意或取消')
    await windowsBot.sleep(500);
    await windowsBot.clickMouse(hwnd, 1325, 195, 1, { mode: globalMode });
    console.log('点击关闭x')
    await windowsBot.sleep(500);
    await windowsBot.clickMouse(hwnd, 440, 809, 1, { mode: globalMode });
    console.log('舰队商店')
    await windowsBot.sleep(500);

    let res = await windowsBot.findImage(hwnd, __dirname + '\\images\\zheng.png', { sim: 0.7 });
    console.log('识别狩猎许可', res)
    if (res) {
        await windowsBot.sleep(500);
        await windowsBot.clickMouse(hwnd, res[0].x, res[0].y, 1, { mode: globalMode });
        console.log('狩猎许可')
    }

    await windowsBot.sleep(500);
    await windowsBot.clickMouse(hwnd, 1381, 740, 1, { mode: globalMode });
    await windowsBot.sleep(500);

    await windowsBot.clickMouse(hwnd, 1381, 740, 1, { mode: globalMode });
    await windowsBot.sleep(500);

    await windowsBot.clickMouse(hwnd, 1381, 740, 1, { mode: globalMode });
    await windowsBot.sleep(500);


    await windowsBot.clickMouse(hwnd, 1381, 740, 1, { mode: globalMode });
    await windowsBot.sleep(500);

    await windowsBot.clickMouse(hwnd, 1381, 740, 1, { mode: globalMode });
    await windowsBot.sleep(500);

    console.log('选择5次')

    await windowsBot.clickMouse(hwnd, 1247, 821, 1, { mode: globalMode });
    await windowsBot.sleep(500);

    console.log('购买按钮')

    await windowsBot.clickMouse(hwnd, 1009, 590, 1, { mode: globalMode });
    await windowsBot.sleep(500);

    console.log('确认购买')

    await windowsBot.clickMouse(hwnd, 34, 85, 1, { mode: globalMode });
    await windowsBot.sleep(500);
    console.log('任意处')

    await windowsBot.clickMouse(hwnd, 34, 85, 1, { mode: globalMode });
    await windowsBot.sleep(500);
    await windowsBot.clickMouse(hwnd, 34, 85, 1, { mode: globalMode });
    await windowsBot.sleep(500);

    console.log('返回')

    await windowsBot.sleep(500);
    // //按下alt
    // await windowsBot.sendVk(0x12, 3);
    console.log('舰队操作结束')

}



//福利
async function getWelfare(windowsBot) {
    console.log('领取福利')
    await focusWindow(windowsBot)
    await windowsBot.sleep(1000);

    //按下alt
    await windowsBot.sendVk(keyMap.alt, 2);
    await windowsBot.sleep(300);

    await windowsBot.clickMouse(hwnd, 1245, 95, 1, { mode: globalMode });
    await windowsBot.sleep(1000);

    await windowsBot.sendVk(keyMap.alt, 3);
    await windowsBot.sleep(300);

    console.log('点击福利')

    await windowsBot.clickMouse(hwnd, 270, 245, 1, { mode: globalMode });
    await windowsBot.sleep(500);

    for (let i = 0; i < 7; i++) {
        await windowsBot.clickMouse(hwnd, 480 + 150 * i, 645, 1, { mode: globalMode });
        await windowsBot.sleep(300);
        await windowsBot.clickMouse(hwnd, 480 + 150 * i, 645, 1, { mode: globalMode });
        await windowsBot.sleep(300);
        await windowsBot.clickMouse(hwnd, 480 + 150 * i, 645, 1, { mode: globalMode });
        await windowsBot.sleep(300);
    }
    console.log('七日签到')

    await windowsBot.clickMouse(hwnd, 250, 348, 1, { mode: globalMode });
    await windowsBot.sleep(500);


    await windowsBot.clickMouse(hwnd, 890, 443, 1, { mode: globalMode });
    await windowsBot.sleep(4000);

    await windowsBot.clickMouse(hwnd, 1135, 414, 1, { mode: globalMode });
    await windowsBot.sleep(500);
    await windowsBot.clickMouse(hwnd, 1200, 450, 1, { mode: globalMode });
    await windowsBot.sleep(500);

    console.log('夏娜赠礼')



    await windowsBot.clickMouse(hwnd, 264, 424, 1, { mode: globalMode });
    await windowsBot.sleep(500);

    for (let i = 0; i < 5; i++) {
        await windowsBot.clickMouse(hwnd, 465, 600, 1, { mode: globalMode });
        await windowsBot.sleep(300);

        await windowsBot.clickMouse(hwnd, 465, 600, 1, { mode: globalMode });
        await windowsBot.sleep(300);

        await windowsBot.clickMouse(hwnd, 465, 600, 1, { mode: globalMode });
        await windowsBot.sleep(300);
    }


    console.log('在线好礼')



    // if(DAYS === 0 || DAYS === 6){
    //     await windowsBot.clickMouse(hwnd, 235, 485, 1, {mode:globalMode});
    //     await windowsBot.sleep(500);
    //     console.log('点击怪奇愿望树')

    //     await windowsBot.clickMouse(hwnd, 1275, 600, 1, {mode:globalMode});
    //     await windowsBot.sleep(5000);
    //     console.log('点击许愿切图')

    // }
    await windowsBot.sendVk(keyMap.esc, 1);
    console.log('领取福利结束')


}

async function getDouble(windowsBot) {

    if (roleState === 0) {
        console.log('第一个角色不用制作双倍药水')
        return
    }
    await focusWindow(windowsBot)
    await windowsBot.sleep(1000);

    console.log('制作双倍药水')
    await toMap(windowsBot, 'kuangshi')

    await windowsBot.sendVk(keyMap.w, 2);
    await windowsBot.sleep(4500);
    await windowsBot.sendVk(keyMap.w, 3);
    await windowsBot.sleep(300);
    console.log('往上走4秒')


    await windowsBot.sendVk(keyMap.a, 2);
    await windowsBot.sleep(1100);
    await windowsBot.sendVk(keyMap.a, 3);
    console.log('往左走1秒')


    await windowsBot.sendVk(keyMap.f, 1);
    await windowsBot.sleep(500);
    await windowsBot.sendVk(keyMap.f, 1);
    await windowsBot.sleep(500);
    console.log('制作双倍药水')



    await windowsBot.clickMouse(hwnd, 1215, 423, 1, { mode: globalMode });
    await windowsBot.sleep(500);



    // await windowsBot.clickMouse(hwnd, 905, 460, 1, {mode:globalMode});
    // await windowsBot.sleep(500);
    // console.log('点击黑矿')




    await windowsBot.clickMouse(hwnd, 1256, 731, 1, { mode: globalMode });
    await windowsBot.sleep(500);
    console.log('点击数字栏')


    await windowsBot.clickMouse(hwnd, 1315, 435, 1, { mode: globalMode });
    await windowsBot.sleep(500);
    console.log('点击数字3')


    await windowsBot.clickMouse(hwnd, 1238, 658, 1, { mode: globalMode });
    await windowsBot.sleep(500);

    console.log('点击数字0')

    await windowsBot.clickMouse(hwnd, 1245, 813, 1, { mode: globalMode });
    await windowsBot.sleep(500);
    console.log('点击购买')


    await windowsBot.clickMouse(hwnd, 1011, 581, 1, { mode: globalMode });
    await windowsBot.sleep(500);
    console.log('点击确认')

    //确认
    await windowsBot.clickMouse(hwnd, 1011, 581, 1, { mode: globalMode });
    await windowsBot.sleep(500);
    console.log('点击任意')


    await windowsBot.sendVk(keyMap.esc, 1);
    await windowsBot.sleep(2000);

    console.log('购买完毕')


    await windowsBot.sendVk(keyMap.s, 2);
    await windowsBot.sleep(400);
    await windowsBot.sendVk(keyMap.s, 3);
    console.log('往后走0.5秒')

    await windowsBot.sendVk(keyMap.a, 2);

    await windowsBot.sendVk(keyMap.w, 2);
    await windowsBot.sleep(1000);
    await windowsBot.sendVk(keyMap.a, 3);
    await windowsBot.sendVk(keyMap.w, 3);

    console.log('往左上走0.5秒')

    await windowsBot.sendVk(keyMap.f, 1);
    await windowsBot.sleep(500);
    await windowsBot.sendVk(keyMap.f, 1);
    await windowsBot.sleep(500);
    console.log('工作台')

    let res = await windowsBot.findImage(hwnd, __dirname + '\\images\\double.png', { sim: 0.6 });
    console.log('识别双倍药水', res)
    if (res) {
        await windowsBot.clickMouse(hwnd, res[0].x, res[0].y, 1, { mode: globalMode });
        await windowsBot.sleep(500);
        console.log('点击双倍药剂')

        await windowsBot.clickMouse(hwnd, 1400, 755, 1, { mode: globalMode });
        await windowsBot.sleep(500);
        console.log('点击数字栏')

        await windowsBot.clickMouse(hwnd, 1400, 545, 1, { mode: globalMode });
        await windowsBot.sleep(500);

        console.log('点击数字5')

        await windowsBot.clickMouse(hwnd, 1409, 838, 1, { mode: globalMode });
        await windowsBot.sleep(3000);
        //确认
        console.log('点击制造')

        await windowsBot.clickMouse(hwnd, 1011, 581, 1, { mode: globalMode });
        await windowsBot.sleep(500);
        console.log('点击确认')
    }



    await windowsBot.sendVk(keyMap.esc, 1);
    await windowsBot.sleep(300);

    await windowsBot.sendVk(keyMap.esc, 1);
    await windowsBot.sleep(300);

    await windowsBot.sendVk(keyMap.esc, 1);
    await windowsBot.sleep(300);

    console.log('关闭工作台')

    console.log('制作双倍药水结束')

}

//手册
async function getManual(windowsBot) {
    console.log('领取手册')
    await focusWindow(windowsBot)
    //按下alt
    await windowsBot.sendVk(keyMap.alt, 2);
    await windowsBot.sleep(300);

    await windowsBot.clickMouse(hwnd, 1521, 264, 1, { mode: globalMode });
    await windowsBot.sleep(1000);

    await windowsBot.sendVk(keyMap.alt, 3);
    await windowsBot.sleep(300);

    console.log('点击手册')

    await windowsBot.clickMouse(hwnd, 671, 284, 1, { mode: globalMode });
    await windowsBot.sleep(500);

    console.log('点击今日')


    let res = true
    while (res) {
        res = await windowsBot.findImage(hwnd, __dirname + '\\images\\reward.png', { sim: 0.8 });
        console.log('识别到的领取', res)

        if (res) {
            for (let i = 0; i < res.length; i++) {
                await windowsBot.sleep(500);
                await windowsBot.clickMouse(hwnd, res[i].x, res[i].y, 1, { mode: globalMode });
                await windowsBot.sleep(500);
                await windowsBot.clickMouse(hwnd, 921, 460, 1, { mode: globalMode });
                console.log('点击领取')
            }
        }
    }
    await windowsBot.sleep(500);

    await windowsBot.clickMouse(hwnd, 890, 730, 1, { mode: globalMode });

    for (let i = 0; i < 5; i++) {
        await windowsBot.clickMouse(hwnd, 890 + 160 * i, 730, 1, { mode: globalMode });
        await windowsBot.sleep(300);

        await windowsBot.clickMouse(hwnd, 890 + 160 * i, 730, 1, { mode: globalMode });
        await windowsBot.sleep(300);

    }
    console.log('点击冒险点')


    await windowsBot.clickMouse(hwnd, 855, 281, 1, { mode: globalMode });
    await windowsBot.sleep(500);

    console.log('点击本周')


    let res1 = true
    while (res1) {
        res1 = await windowsBot.findImage(hwnd, __dirname + '\\images\\reward.png', { sim: 0.8 });
        console.log('识别到的领取', res1)

        if (res1) {
            for (let i = 0; i < res1.length; i++) {
                await windowsBot.sleep(500);
                await windowsBot.clickMouse(hwnd, res1[i].x, res1[i].y, 1, { mode: globalMode });
                await windowsBot.sleep(500);
                await windowsBot.clickMouse(hwnd, 921, 460, 1, { mode: globalMode });
                console.log('点击领取')
            }
        }
    }

    await windowsBot.sleep(500);

    await windowsBot.clickMouse(hwnd, 60, 480, 1, { mode: globalMode });
    await windowsBot.sleep(1000);
    console.log('点击奖励')


    await windowsBot.clickMouse(hwnd, 1460, 721, 1, { mode: globalMode });
    await windowsBot.sleep(500);
    console.log('一键领取')

    await windowsBot.clickMouse(hwnd, 1036, 739, 1, { mode: globalMode });
    await windowsBot.sleep(500);
    console.log('点击确认')


    await windowsBot.sendVk(keyMap.esc, 1);
    await windowsBot.sleep(1000);

    // console.log('领取福利结束')

}





function calculateDirectionPoint2Point(x1, y1, x2, y2, offset) {
    if (x1 === x2 && y1 === y2) {
        return '位置相同';
    }

    //指示器在下
    if (y2 > 450) {

    }

    const deltaX = x2 - x1;
    const deltaY = y2 - y1;




    if ((Math.abs(deltaX) < offset)) {
        if (deltaY > 0) {
            return '下';
        } else {
            return '上';
        }
    } else if (Math.abs(deltaY) < offset) {
        if (deltaX > 0) {
            return '右';
        } else {
            return '左';
        }
    } else {
        if (deltaX > 0) {
            if (deltaY > 0) {
                return '右下';
            } else {
                return '右上';
            }
        } else {
            if (deltaY > 0) {
                return '左下';
            } else {
                return '左上';
            }
        }
    }
}

function calculateDirection(x, y) {

    const centerX = windowWidth / 2;
    const centerY = windowHeight / 2;

    if (x < 0 || x > windowWidth || y < 0 || y > windowHeight) {

        return 'Coordinate is out of screen range';
    }
    let offset = 75

    if (x < centerX - offset) {
        if (y < centerY - offset) {
            return '左上';
        } else if (y > centerY + offset) {
            return '左下';
        } else {
            return '左';
        }
    } else if (x > centerX + offset) {
        if (y < centerY - offset) {
            return '右上';
        } else if (y > centerY + offset) {
            return '右下';
        } else {
            return '右';
        }
    } else {
        //中间
        if (y < centerY) {
            return '上';
        } else if (y > centerY) {
            return '下';
        } else {
            return '中间';
        }
    }
}


//点击窗口 聚焦
async function focusWindow(windowsBot) {

    await windowsBot.sleep(300)
    await windowsBot.sendVk(keyMap.alt, 2);
    await windowsBot.sleep(300)
    await windowsBot.clickMouse(hwnd, 360, 63, 1)
    await windowsBot.sleep(300)
    await windowsBot.sendVk(keyMap.alt, 3);
}

//去莱茵城
async function toMap(windowsBot, name) {


    await windowsBot.sleep(500)

    await focusWindow(windowsBot)


    let x = 0
    let y = 0

    switch (name) {
        case 'laiyin': x = 788; y = 445; break;
        case 'kuangshi': x = 1235; y = 578; break;
        case 'lumi': x = 911; y = 676; break;
        case 'jungongchang': x = 713; y = 215; break;
    }

    await windowsBot.sendVk(keyMap.m, 1);
    await windowsBot.sleep(1000);
    console.log('打开地图')

    await windowsBot.clickMouse(hwnd, 1368, 785, 1, { mode: globalMode });
    await windowsBot.sleep(1000);

    console.log('点击世界地图')


    await windowsBot.clickMouse(hwnd, x, y, 1, { mode: globalMode });
    console.log('点击' + name)
    await windowsBot.sleep(2000);

    await windowsBot.clickMouse(hwnd, 70, 78, 1, { mode: globalMode });
    console.log('如果已在当前页面点击返回')

    await windowsBot.sleep(6000);

}



async function afterFinish(windowsBot) {
    await windowsBot.sleep(300)
    console.log('所有战斗结束，处理收尾工作')

    await sellEquiqment(windowsBot)

    await saveMoney(windowsBot)

    await getShip(windowsBot)

    await getWelfare(windowsBot)


    await getManual(windowsBot)

    await goldSheep(windowsBot)

    await getDouble(windowsBot)

    await windowsBot.sleep(1000)
    console.log('收尾工作结束')

}

async function sellEquiqment(windowsBot) {
    console.log('处理装备')

    await windowsBot.sleep(300)

    await windowsBot.sendVk(keyMap.b, 1);
    console.log('打开背包')

    await windowsBot.sleep(1000)
    await windowsBot.clickMouse(hwnd, 1475, 830, 1)
    await windowsBot.sleep(500)

    //出售
    await windowsBot.clickMouse(hwnd, 915, 830, 1)
    await windowsBot.sleep(500)

    //分解
    await windowsBot.clickMouse(hwnd, 1059, 465, 1)
    await windowsBot.sleep(500)

    console.log('点击出售、分解')


    await windowsBot.clickMouse(hwnd, 1015, 588, 1)
    await windowsBot.sleep(500)

    console.log('点击确定')

    await windowsBot.clickMouse(hwnd, 336, 55, 1)
    await windowsBot.sleep(500)

    console.log('点击任意')

    await windowsBot.clickMouse(hwnd, 1531, 820, 1)
    await windowsBot.sleep(500)

    console.log('切换按钮')

    await windowsBot.clickMouse(hwnd, 1475, 830, 1)
    await windowsBot.sleep(500)

    //出售
    await windowsBot.clickMouse(hwnd, 915, 830, 1)
    await windowsBot.sleep(500)

    //分解
    await windowsBot.clickMouse(hwnd, 1059, 465, 1)
    await windowsBot.sleep(500)

    console.log('点击出售、分解')


    await windowsBot.clickMouse(hwnd, 1015, 588, 1)
    await windowsBot.sleep(500)

    console.log('点击确定')

    await windowsBot.clickMouse(hwnd, 300, 400, 1)
    await windowsBot.sleep(500)

    console.log('点击任意')


    await windowsBot.sendVk(keyMap.b, 1);
    await windowsBot.sleep(500)

    console.log('关闭背包')

    console.log('处理装备结束')

}

async function saveMoney(windowsBot) {
    console.log('自动存钱开始')
    await windowsBot.sleep(500)

    await windowsBot.sendVk(keyMap.b, 1);
    await windowsBot.sleep(500)
    console.log('打开背包')

    await windowsBot.clickMouse(hwnd, 1204, 835, 1)
    await windowsBot.sleep(500)
    console.log('打开仓库')


    await windowsBot.clickMouse(hwnd, 801, 826, 1)
    await windowsBot.sleep(500)
    console.log('存入金币')

    await windowsBot.clickMouse(hwnd, 935, 406, 1)
    await windowsBot.sleep(500)
    console.log('拉满现金')

    await windowsBot.clickMouse(hwnd, 801, 826, 1)
    await windowsBot.sleep(500)
    console.log('存入金币')

    await windowsBot.clickMouse(hwnd, 815, 458, 1)
    await windowsBot.sleep(500)
    console.log('点击绑金')

    await windowsBot.clickMouse(hwnd, 824, 175, 1)
    await windowsBot.sleep(500)

    await windowsBot.clickMouse(hwnd, 835, 390, 1)
    await windowsBot.sleep(500)
    await windowsBot.clickMouse(hwnd, 835, 390, 1)
    await windowsBot.sleep(500)
    await windowsBot.clickMouse(hwnd, 835, 390, 1)
    await windowsBot.sleep(500)
    await windowsBot.clickMouse(hwnd, 835, 390, 1)
    await windowsBot.sleep(500)
    await windowsBot.clickMouse(hwnd, 835, 390, 1)
    await windowsBot.sleep(500)

    await windowsBot.clickMouse(hwnd, 900, 400, 1)
    await windowsBot.sleep(500)
    console.log('存入20w绑金')


    await windowsBot.clickMouse(hwnd, 878, 585, 1)
    await windowsBot.sleep(500)
    console.log('确认存入')

    await windowsBot.sendVk(keyMap.esc, 1);
    await windowsBot.sleep(500)
    console.log('关闭仓库')

    await windowsBot.sendVk(keyMap.esc, 1);
    await windowsBot.sleep(500)
    console.log('关闭背包')
}

async function lingxiang(windowsBot) {

    await focusWindow(windowsBot)

    while (true) {
        await windowsBot.sleep(1000)
        let res = await windowsBot.findImage(hwnd, __dirname + '\\images\\invite.png', { sim: 0.8 })
        console.log('检测是否有人邀请', res)
        let next = null
        await windowsBot.sleep(500)


        if (res) {
            await windowsBot.sendVk(keyMap.alt, 2);

            await windowsBot.sleep(1000)

            await windowsBot.clickMouse(hwnd, res[0].x, res[0].y, 1, {});
            await windowsBot.sleep(1000);
            console.log('点击组队')

            await windowsBot.clickMouse(hwnd, 954, 633, 1, {});
            await windowsBot.sleep(1000);
            console.log('点击同意')

            await windowsBot.sendVk(keyMap.alt, 3);

            next = 'invited'
        }

        let resR = await windowsBot.findImage(hwnd, __dirname + '\\images\\ready.png', { sim: 0.8 })
        console.log('识别准备按钮', resR)
        if (resR) {
            await windowsBot.sleep(1000);
            await windowsBot.clickMouse(hwnd, resR[0].x, resR[0].y, 1, {});
            next = 'ready'
        }


        while (next === 'invited') {
            await windowsBot.sleep(1000)

            let res1 = await windowsBot.findImage(hwnd, __dirname + '\\images\\zhanling.png', { sim: 0.8 })
            console.log('判断是否在外面', res1)
            if (res1) {
                next = 'out'
            }

            let res2 = await windowsBot.findImage(hwnd, __dirname + '\\images\\ready.png', { sim: 0.8 })
            console.log('识别准备按钮', res2)
            if (res2) {
                await windowsBot.sleep(1000);
                await windowsBot.clickMouse(hwnd, res2[0].x, res2[0].y, 1, {});
                next = 'ready'
            }
        }


        if (next === 'ready') {
            while (next === 'ready') {
                await windowsBot.findImage(hwnd, __dirname + '\\images\\outdoor.png', { sim: 0.8 }).then((res1) => {
                    console.log('判断进入了战斗了', res1)
                    if (res1) {
                        next = 'battle'
                    }
                })

                await windowsBot.findImage(hwnd, __dirname + '\\images\\zhanling.png', { sim: 0.8 }).then((res1) => {
                    console.log('判断是否在外面', res1)
                    if (res1) {
                        next = 'out'
                    }
                })
            }
        }

        if (next === 'battle') {

            let operas = [keyMap.e,
            keyMap.e,
            keyMap.num2,
            keyMap.num3,
            keyMap.e,
            keyMap.e,
            keyMap.num4,
            keyMap.num4, keyMap.num3,
            keyMap.num3, keyMap.num2, keyMap.e,
            keyMap.num2, keyMap.num1, keyMap.num4,
            keyMap.num1,]

            let operas1 = [keyMap.num5, keyMap.q, keyMap.r]


            let over = false
            let needReborn = false
            let count = 0
            while (!over) {
                count++
                for (let i = 0; i < operas.length; i++) {

                    if (over) break

                    let opera = operas[i]
                    //模拟狂点
                    console.log('操作', opera)

                    for (let j = 0; j < 2; j++) {
                        await windowsBot.sendVk(opera, 1);
                        await windowsBot.sleep(222);
                        await windowsBot.sendVk(operas1[0], 1);
                        await windowsBot.sleep(100);
                    }

                    if (i % 8 === 0) {
                        windowsBot.findImage(hwnd, __dirname + '\\images\\reborn.png', { sim: 0.8 }).then(async (res) => {
                            console.log('需要复活', res)
                            if (res) {
                                needReborn = true
                            }
                        })
                    }


                    if (needReborn) {
                        await windowsBot.sendVk(keyMap.alt, 2);
                        await windowsBot.sleep(1000)

                        await windowsBot.clickMouse(hwnd, 1045, 675, 1, {});
                        await windowsBot.sleep(1000);

                        await windowsBot.sendVk(keyMap.alt, 3);
                        console.log('点击复活')
                        needReborn = false
                    }


                    await windowsBot.sendVk(operas1[1], 1);
                    await windowsBot.sendVk(operas1[2], 1);

                    console.log('操作', opera)

                    if (count >= 5 && i % 8 === 0) {
                        windowsBot.findImage(hwnd, __dirname + '\\images\\victory.png', { sim: 0.8 }).then((res) => {
                            console.log('战斗结束', res)
                            if (res) {
                                over = true
                            }
                        })

                        // windowsBot.findImage(hwnd, __dirname + '\\images\\fail.png', { sim: 0.8 }).then((res) => {
                        //     console.log('战斗失败', res)
                        //     if (res) {
                        //         over = true
                        //     }
                        // })
                    }
                }

                if (over) break;
            }

            await windowsBot.sleep(2000);
            await windowsBot.clickMouse(hwnd, 785, 695, 1, {});
            await windowsBot.sleep(1000);
            console.log('点击屏幕退出战斗')


            await windowsBot.sleep(3000);

            await windowsBot.sendVk(keyMap.alt, 2);
            await windowsBot.sleep(500);

            await windowsBot.clickMouse(hwnd, 60, 335, 1, {});

            console.log('点击退出队伍')

            await windowsBot.sendVk(keyMap.alt, 3);


            await windowsBot.clickMouse(hwnd, 1005, 598, 1, {});
            console.log('确认退队')


            await windowsBot.sleep(1000);

            console.log('打完一轮')

        }

    }

}


async function juedou(windowsBot) {

    await focusWindow(windowsBot)

    windowsBot.sleep(5000)


    while (true) {


        windowsBot.sleep(100)

        let operas = [keyMap.e,
        keyMap.e,
        keyMap.num2,
        keyMap.num3,
        keyMap.e,
        keyMap.e,
        keyMap.num4,
        keyMap.num4, keyMap.num3,
        keyMap.num3, keyMap.num2, keyMap.e,
        keyMap.num2, keyMap.num1, keyMap.num4,
        keyMap.num1,]

        let operas1 = [keyMap.num5, keyMap.q, keyMap.r]


        let over = false

        while (!over) {


            for (let i = 0; i < operas.length; i++) {

                let opera = operas[i]
                //模拟狂点
                console.log('操作', opera)

                await windowsBot.clickMouse(hwnd, 844, 774, 1)

                for (let j = 0; j < 2; j++) {
                    await windowsBot.sendVk(opera, 1);
                    await windowsBot.sleep(222);
                    await windowsBot.sendVk(operas1[0], 1);
                    await windowsBot.sleep(100);
                }
                await windowsBot.sendVk(operas1[1], 1);
                await windowsBot.sendVk(operas1[2], 1);

                console.log('操作', opera)
            }

        }


        await windowsBot.sleep(5000);


    }

}


