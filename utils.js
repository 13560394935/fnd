const keyMap = require('./keyMap.js')
const config = require('./config.js')


//点击窗口 聚焦
exports.focusWindow = async function (windowsBot, hwnd, x = 30, y = 55) {

    await windowsBot.sleep(300)
    await windowsBot.clickMouse(hwnd, x, y, 1)
    await windowsBot.sleep(300)
}

function getPosX(x) {
    return x - config.WINDOW_LEFT
}
exports.getPosX = getPosX

function getPosY(y) {
    return y - config.WINDOW_TOP
}
exports.getPosY = getPosY

exports.resetWindow = async function (windowsBot, hwnd) {
    console.log('设置窗口大小位置')
    let res = await windowsBot.setWindowTop(hwnd, true);
    console.log('置顶结果', res)

    let res1 = await windowsBot.setWindowPos(hwnd, config.WINDOW_LEFT, config.WINDOW_TOP, config.WINDOW_WIDTH, config.WINDOW_HEIGHT);
    console.log('设置大小结果', res1)

    await windowsBot.setWindowTop(hwnd, false);
    console.log('取消置顶',)
}

exports.suffleArray = function (array) {
    let opera = [...array]
    //打乱opera 
    let len = opera.length, index; // index: 随机数
    for (let point = len - 1; point >= 0; point--) {
        index = Math.floor(Math.random() * point);
        opera[index] = [opera[point], opera[point] = opera[index]][0];
    }

    return opera
}


exports.move = async function (windowsBot, direction, ms) {
    await windowsBot.sendVk(direction, 2);
    await windowsBot.sleep(ms);
    await windowsBot.sendVk(direction, 3);
}


exports.run = async function (windowsBot, direction, ms) {
    await windowsBot.sendVk(direction, 1);
    await windowsBot.sleep(150);
    await windowsBot.sendVk(direction, 2);
    await windowsBot.sleep(ms);
    await windowsBot.sendVk(direction, 3);
}

exports.runGoOn = async function (windowsBot, direction) {
    await windowsBot.sendVk(direction, 1);
    await windowsBot.sleep(100);
    await windowsBot.sendVk(direction, 2);
}



exports.stopRun = async function (windowsBot, direction) {
    await windowsBot.sendVk(direction, 3);
}


exports.moveUntilPassRoom = async function (windowsBot, hwnd, direction, timeout = 3000) {

    await windowsBot.sendVk(direction, 2);

    let passResult = await doUntilPassRoom(windowsBot, hwnd, timeout, async () => {
        await windowsBot.sleep(100);
    })

    await windowsBot.sendVk(direction, 3);

    return passResult

}

exports.runUntilPassRoom = async function (windowsBot, hwnd, direction, timeout = 5000) {

    await windowsBot.sendVk(direction, 1);
    await windowsBot.sleep(100);
    await windowsBot.sendVk(direction, 1);
    await windowsBot.sleep(100);

    await windowsBot.sendVk(direction, 2);

    let passResult = await doUntilPassRoom(windowsBot, hwnd, timeout, async () => {
        await windowsBot.sleep(100);
    })

    await windowsBot.sendVk(direction, 3);

    return passResult

}

async function doUntilCanNext(windowsBot, hwnd, timeout, func,cb) {
    console.log('doUntilCanNext')

    let code = 0;//0 寻找中 1通过 2错误
    let startTime = +new Date()

    //先判断一次 避免一开始就是打完
    // let res = await windowsBot.findImage(hwnd, __dirname + '\\images\\can-next1.png', { sim: 0.8 })
    // console.log('判断是否打完',res)

    // if(!res){
        findCanNext(windowsBot, hwnd, startTime, timeout).then((result) => {
            code = result
        })
    // }else{
    //     code = 1
    // }


    while (code === 0) {
        await func()
        await windowsBot.sleep(50);
    }

    return code
}

exports.doUntilCanNext = doUntilCanNext


async function doUntilEnd(windowsBot, hwnd, timeout, func) {
    console.log('doUntilEnd')

    let code = 0;//0 寻找中 1通过 2错误
    let startTime = +new Date()

    findEnd(windowsBot, hwnd, startTime, timeout).then((result) => {
        console.log('chulaile')
        code = result
    })


    while (code === 0) {
        await func()
        await windowsBot.sleep(50);
    }

    console.log('-----执行到这里了----')


    return code
}

exports.doUntilEnd = doUntilEnd

async function doUntilPassRoom(windowsBot, hwnd, timeout, func) {
    console.log('doUntilPassRoom')

    let code = 0; //0 寻找中 1通过 2错误

    let startTime = +new Date()

    ifPassRoom(windowsBot, hwnd, startTime, timeout).then((result) => {
        code = result
    })

    while (code === 0) {
        await func()
        await windowsBot.sleep(50);
    }

    return code
}


exports.doUntilPassRoom = doUntilPassRoom

exports.doUntilFindImage = doUntilFindImage

async function doUntilFindImage(windowsBot, hwnd,path, timeout, func) {
    console.log('doUntilFindImage',path)
    let code = 0; //0 寻找中 1通过 2错误

    let startTime = +new Date()

    //   先判断一次 避免一开始就是
    let res = await windowsBot.findImage(hwnd, path, { sim: 0.8 })
    console.log('判断是否找到图片',res)

    if(!res){
        ifFindImage(windowsBot, hwnd,path, startTime, timeout).then((result) => {
            code = result
        })
    }else{
        return res
    }


  

    while (code === 0) {
        await func()
        await windowsBot.sleep(50);
    }

    return code
}

async function ifFindImage(windowsBot, hwnd,path, startTime, timeout) {

    let time = +new Date() - startTime
    console.log('time', time)
    if (time > timeout) return 2

    //1480 1155
    let res = await windowsBot.findImage(hwnd, path, { sim: 0.9 })
    console.log('检测是否找到图片', res)
    await windowsBot.sleep(100);
    //#144
    if (res) {
        return res
    } else {
        return ifFindImage(windowsBot, hwnd, path, startTime, timeout,path)
    }
}


    // let res = await windowsBot.findImage(hwnd, __dirname + '\\images\\pass-room1.png', { sim: 0.8 })


async function ifPassRoom(windowsBot, hwnd, startTime, timeout) {

    let time = +new Date() - startTime
    console.log('time', time)
    if (time > timeout) return 2

    //1480 1155
    let color = await windowsBot.getColor(hwnd, getPosX(498), getPosY(774), false);
    // let res = await windowsBot.findImage(hwnd, __dirname + '\\images\\pass-room1.png', { sim: 0.8 })
    console.log('检测是否过图', color)
    await windowsBot.sleep(100);
    //#144
    if (!color.startsWith('#144')) {
        return 1
    } else {
        return ifPassRoom(windowsBot, hwnd, startTime, timeout)
    }
}




async function findCanNext(windowsBot, hwnd, startTime, timeout) {

    if (+new Date() - startTime > timeout) return 2

    let res = await windowsBot.findImage(hwnd, __dirname + '\\images\\can-next1.png', { sim: 0.8 })
    console.log('检测是否打完', res)
    await windowsBot.sleep(300);
    if (res) {
        return 1
    } else {
        return findCanNext(windowsBot, hwnd, startTime, timeout)
    }
}


async function findEnd2(windowsBot, hwnd, startTime, timeout, confirm = 0) {

    let time = +new Date() - startTime
    console.log('time', time, timeout)
    if (time > timeout) {
        console.log('超时了', timeout)
        return 2
    }
    // let res = await windowsBot.findImage(hwnd, __dirname + '\\images\\dnf-end3.png', { sim: 0.8 })
    // console.log('检测是否打完Boss', res)


    let color = await windowsBot.getColor(hwnd, getPosX(1843), getPosY(309), false);

    let color1 = await windowsBot.getColor(hwnd, getPosX(1843), getPosY(318), false);

    let color2 = await windowsBot.getColor(hwnd, getPosX(1855), getPosY(305), false);


    await windowsBot.sleep(800);
    console.log('color-02b5e5', color, 'color1-0106d8', color1, 'color2-025ce7', color2);


    if (color != '#02b5e5' && color1 != '#0106d8' && color2 != '#025ce7') {
        //确认判断到两次结束才确认为结束
        console.log('判断到结束了', confirm)
        confirm++
        if (confirm === 2) {
            console.log('结束了')
            return 1
        } else {
            return findEnd(windowsBot, hwnd, startTime, timeout, confirm)
        }

    } else {
        return findEnd(windowsBot, hwnd, startTime, timeout, confirm)
    }


    // if(res){
    //     console.log('结束了')
    // // if(color==='#ffffff'){
    //     return 1
    // }else{
    //     return findEnd(windowsBot,hwnd,startTime,timeout)
    // }
}

async function findEnd(windowsBot, hwnd, startTime, timeout, confirm = 0) {
    while (true) {
        let time = +new Date() - startTime;
        console.log('time1', time, timeout)

        console.log('zuo b ?')

        if (time > timeout) {
            console.log('zuoc?')

            console.log('超时了', timeout);
            return 2;
        }

        console.log('zuo a ?')
        let color = await windowsBot.getColor(hwnd, getPosX(1258), getPosY(70), false);
        let color1 = await windowsBot.getColor(hwnd, getPosX(1267), getPosY(67), false);
        let color2 = await windowsBot.getColor(hwnd, getPosX(1258), getPosY(77), false);

        await windowsBot.sleep(800);
        console.log('color-02b5e5', color, 'color1-0106d8', color1, 'color2-025ce7', color2);

        if (color != '#02b5e5' && color1 != '#0106d8' && color2 != '#025ce7') {
            // 确认判断到两次结束才确认为结束
            console.log('jinlaile');
            console.log('判断到结束了', confirm);
            confirm++;
            if (confirm === 2) {
                console.log('结束了');
                return 1;
            } else {
                console.log('no confirm');
            }
        } else {
            confirm = 0;
        }
    }
}

exports.findEnd = findEnd


exports.classifyColor = function (color) {
    const match = color.match(/#?([a-f\d]{2})([a-’\d]{2})([a-f\d]{2})/i);
    if (match) {
        const red = parseInt(match[1], 16);
        const green = parseInt(match[2], 16);
        const blue = parseInt(match[3], 16);

        //添加更多的颜色分类条件
        if (red > 200 && green > 200 && blue < 100) {
            return "浅蓝色";
        } else if (red > 200 && green < 100 && blue < 100) {
            return "暗红色";
        } else if (red < 100 && green > 200 && blue < 100) {
            return "浅绿色";
        } else if (red < 100 && green < 100 && blue < 100) {
            return "黑色";
        } else if (red > 200 && green > 200 && blue > 200) {
            return "白色";
        } else if (red < 100 && green > 200 && blue > 200) {
            return "天蓝色";
        } else if (red > 200 && green < 100 && blue > 200) {
            return "粉红色";
        } else if (red > 200 && green > 100 && blue < 100) {
            return "橙色";
        } else if (red > 100 && green > 200 && blue < 100) {
            return "黄色";
        } else if (red < 100 && green > 100 && blue > 200) {
            return "紫色";
        } else {
            return "其他颜色";
        }
    } else {
        return "无效的颜色值";
    }
}

