const keyMap = require('./keyMap.js')



module.exports = {
    WINDOW_NAME: '地下城与勇士：创新世纪',
    WINDOW_WIDTH: 1280,
    WINDOW_HEIGHT: 800,
    WINDOW_TOP: 0,
    WINDOW_LEFT: 0,

    PLPOS: {
        x: 985,
        y: 778,
    },

    changeRolePos: { x: 617, y: 675 },
    backTownPos: { x: 769, y: 673 },



    ROLE: {
        '剑魂': {
            buffs: [keyMap.h, keyMap.y],
            map2Sk: [keyMap.s, keyMap.d],
            map2BackupSk: null,
            map3Sk: keyMap.w,
            map3BackupSk: null,
            map4Sk: [keyMap.s, keyMap.r, keyMap.e],
            map4BackupSk: null,
            map5Sk: keyMap.q,
            map5BackupSk: keyMap.s,
            map6Sk: [keyMap.f, keyMap.s, keyMap.a],
            map6BackupSk: keyMap.s,
            map7Sks: [keyMap.t, keyMap.skip, keyMap.skip, keyMap.e, keyMap.d, keyMap.s, keyMap.f],
            runSpeed: 50,
        },
        '阿修罗': {
            buffs: [keyMap.r, keyMap.h],
            map2Sk: keyMap.e,
            map2BackupSk: null,
            map3Sk: keyMap.d,
            map3BackupSk: null,
            map4Sk: [keyMap.w, keyMap.w],
            map4BackupSk: null,
            map5Sk: [keyMap.a, keyMap.s],
            map5BackupSk: null,
            map6Sk: keyMap.y,
            map6BackupSk: null,
            map7Sks: [keyMap.q, keyMap.t, keyMap.w, keyMap.e, keyMap.a, keyMap.s, keyMap.d, keyMap.f],
            runSpeed: 50,
        },
        '旅人': {
            buffs: [keyMap.h],
            map2Sk: [keyMap.w, keyMap.r],
            map2BackupSk: null,
            map3Sk: [keyMap.q],
            map3BackupSk: keyMap.f,
            map4Sk: [keyMap.a, keyMap.g],
            map4BackupSk: keyMap.f,
            map5Sk: [keyMap.e],
            map5BackupSk: keyMap.f,
            map6Sk: [keyMap.d, keyMap.skip, keyMap.r],
            map6BackupSk: keyMap.f,
            map7Sks: [keyMap.f, keyMap.t, keyMap.skip, keyMap.skip, keyMap.a, keyMap.g, keyMap.r, keyMap.w, keyMap.q],
            runSpeed: 50,
            runFirst: 'right',
        },
        '缪斯': {
            buffs: [keyMap.h],
            map2Sk: [[keyMap.e, keyMap.a], [keyMap.e, keyMap.a]],
            map2BackupSk: null,
            map3Sk: [[keyMap.e, keyMap.a], [keyMap.e, keyMap.a]],
            map3BackupSk: null,
            map4Sk: [[keyMap.e, keyMap.a], [keyMap.e, keyMap.a]],
            map4BackupSk: null,
            map5Sk: [keyMap.s],
            map5BackupSk: null,
            map6Sk: [[keyMap.r, keyMap.d]],
            map6BackupSk: null,
            map7Sks: [keyMap.g, keyMap.t, keyMap.skip, keyMap.skip, keyMap.y, keyMap.skip, keyMap.j, keyMap.skip, [keyMap.e, keyMap.a], [keyMap.e, keyMap.a], [keyMap.e, keyMap.a]],
            runSpeed: 50,
            runFirst: 'right',
        },
        '刃影': {
            buffs: [keyMap.h],
            map2Sk: [keyMap.s, keyMap.f],
            map2BackupSk: null,
            map3Sk: [keyMap.y, keyMap.skip, keyMap.skip, keyMap.a],
            map3BackupSk: null,
            map4Sk: [keyMap.r, keyMap.g],
            map4BackupSk: null,
            map5Sk: [keyMap.ctrl],
            map5BackupSk: null,
            map6Sk: [keyMap.q, keyMap.skip, keyMap.f],
            map6BackupSk: null,
            map7Sks: [keyMap.w, keyMap.d, keyMap.t, keyMap.skip, keyMap.skip, keyMap.ctrl, keyMap.d, keyMap.s, keyMap.e, keyMap.f],
            runSpeed: 50,
            runFirst: 'right',
        },
        '鬼泣': {
            buffs: [keyMap.h],
            map2Sk: [keyMap.s, keyMap.d],
            map2BackupSk: null,
            map3Sk: [keyMap.f, keyMap.q],
            map3BackupSk: null,
            map4Sk: [keyMap.e, keyMap.g],
            map4BackupSk: null,
            map5Sk: [keyMap.w],
            map5BackupSk: null,
            map6Sk: [keyMap.s, keyMap.y],
            map6BackupSk: null,
            map7Sks: [keyMap.t, keyMap.skip, keyMap.skip, keyMap.f, keyMap.s, keyMap.d, keyMap.e, keyMap.r, keyMap.ctrl],
            runSpeed: 50,
        },
        '狂战士': {
            buffs: [keyMap.h],
            map2Sk: [keyMap.s, keyMap.a],
            map2BackupSk: null,
            map3Sk: [keyMap.r, keyMap.y, keyMap.d],
            map3BackupSk: null,
            map4Sk: [keyMap.e, keyMap.skip, keyMap.g],
            map4BackupSk: null,
            map5Sk: [keyMap.w],
            map5BackupSk: null,
            map6Sk: [keyMap.q, keyMap.skip, keyMap.d],
            map6BackupSk: null,
            map7Sks: [keyMap.ctrl, keyMap.skip, keyMap.t, keyMap.skip, keyMap.skip, keyMap.a, keyMap.y, keyMap.d, keyMap.r, keyMap.s],
            runSpeed: 50,
        },
        '气功': {
            buffs: [keyMap.h, keyMap.ctrl, keyMap.j],
            map2Sk: [keyMap.a, keyMap.f],
            map2BackupSk: null,
            map3Sk: [keyMap.r, keyMap.q],
            map3BackupSk: null,
            map4Sk: [keyMap.g, keyMap.skip, keyMap.skip, keyMap.s],
            map4BackupSk: null,
            map5Sk: [keyMap.a, keyMap.e],
            map5BackupSk: null,
            map6Sk: [keyMap.d, keyMap.w, keyMap.s],
            map6BackupSk: null,
            map7Sks: [keyMap.t, keyMap.skip, keyMap.skip, keyMap.y, keyMap.skip, keyMap.a, keyMap.r, keyMap.g, keyMap.e, keyMap.q, keyMap.f],
            runSpeed: 50,
        },
        '流浪武士': {
            buffs: [keyMap.h],
            map2Sk: [keyMap.d, keyMap.f, keyMap.d],
            map2BackupSk: null,
            map3Sk: [keyMap.g, keyMap.skip, keyMap.w],
            map3BackupSk: null,
            map4Sk: [keyMap.q, keyMap.e],
            map4BackupSk: null,
            map5Sk: [keyMap.y],
            map5BackupSk: null,
            map6Sk: [keyMap.w, keyMap.t, keyMap.skip],
            map6BackupSk: null,
            map7Sks: [keyMap.r, keyMap.skip, keyMap.ctrl, keyMap.d, keyMap.ctrl, keyMap.s, keyMap.e, keyMap.a, keyMap.w, keyMap.s, keyMap.r],
            runSpeed: 50,
            runFirst: 'right',
        },
        '光明骑士': {
            buffs: [keyMap.h],
            map2Sk: [keyMap.f, keyMap.skip, keyMap.skip],
            map2BackupSk: null,
            map3Sk: [keyMap.g],
            map3BackupSk: null,
            map4Sk: [keyMap.y],
            map4BackupSk: null,
            map5Sk: [keyMap.w],
            map5BackupSk: null,
            map6Sk: [keyMap.d, keyMap.a, keyMap.q],
            map6BackupSk: null,
            map7Sks: [keyMap.s, keyMap.r, keyMap.d, keyMap.f, keyMap.e, keyMap.s, keyMap.g],
            runSpeed: 50,
            runFirst: 'right',
        },
        '合金战士': {
            buffs: [keyMap.h],
            map2Sk: [keyMap.r, keyMap.d, keyMap.a],
            map2BackupSk: null,
            map3Sk: [keyMap.q, keyMap.s],
            map3BackupSk: null,
            map4Sk: [keyMap.w],
            map4BackupSk: null,
            map5Sk: [keyMap.f],
            map5BackupSk: null,
            map6Sk: [keyMap.g, keyMap.skip, keyMap.d],
            map6BackupSk: null,
            map7Sks: [keyMap.t, keyMap.skip, keyMap.skip, keyMap.e, keyMap.d,keyMap.s, keyMap.f, keyMap.r, keyMap.w, keyMap.a],
            runSpeed: 50,
            runFirst: 'right',
        },
    },


    ROLE_POS: [{
        id: 1,
        x: 283,
        y: 374
    }, {
        id: 2,
        x: 466,
        y: 374,
    }, {
        id: 3,
        x: 651,
        y: 374,
    }, {
        id: 4,
        x: 846,
        y: 374,
    }, {
        id: 5,
        x: 1035,
        y: 374,
    }, {
        id: 6,
        x: 100,
        y: 536,
    }, {
        id: 7,
        x: 285,
        y: 533,
    }, {
        id: 8,
        x: 470,
        y: 533,
    }, {
        id: 9,
        x: 655,
        y: 533,
    }, {
        id: 10,
        x: 840,
        y: 533,
    }, {
        id: 11,
        x: 1020,
        y: 533
    }, {
        id: 12,
        x: 1190,
        y: 533
    }, {
        id: 13,
        x: 100,
        y: 536,
    }, {
        id: 14,
        x: 285,
        y: 533,
    }, {
        id: 15,
        x: 470,
        y: 533,
    }, {
        id: 16,
        x: 655,
        y: 533,
    }, {
        id: 17,
        x: 840,
        y: 533,
    }, {
        id: 18,
        x: 1020,
        y: 533
    }, {
        id: 19,
        x: 1190,
        y: 533
    }],

    ACCOUNT: {
        1: [{
            id: 1,
            type: '阿修罗',
            hasCapsLk: true
        }, {
            id: 2,
            type: '阿修罗',
            hasCapsLk: true
        }, {
            id: 3,
            type: '阿修罗',
            hasCapsLk: true
        }, {
            id: 4,
            type: '阿修罗',
            hasCapsLk: true
        }, {
            id: 5,
            type: '阿修罗',
            hasCapsLk: true
        }, {
            id: 6,
            type: '阿修罗',
            hasCapsLk: true
        }, {
            id: 7,
            type: '阿修罗',
            hasCapsLk: true
        }, {
            id: 8,
            type: '旅人',
            hasCapsLk: true
        }, {
            id: 9,
            type: '旅人',
            hasCapsLk: true
        }, {
            id: 10,
            type: '缪斯',
            hasCapsLk: true
        }],
        2: [{
            id: 1,
            type: '阿修罗',
            hasCapsLk: true
        }, {
            id: 2,
            type: '阿修罗',
            hasCapsLk: true
        }, {
            id: 3,
            type: '阿修罗',
            hasCapsLk: true
        }, {
            id: 4,
            type: '阿修罗',
            hasCapsLk: true

        }, {
            id: 5,
            type: '阿修罗',
            hasCapsLk: true

        }, {
            id: 6,
            type: '阿修罗',
            hasCapsLk: true

        }, {
            id: 7,
            type: '阿修罗',
            hasCapsLk: true

        }, {
            id: 8,
            type: '阿修罗',
            hasCapsLk: true

        }, {
            id: 9,
            type: '旅人',
            hasCapsLk: true

        }, {
            id: 10,
            type: '缪斯',
            hasCapsLk: true
        }],
        3: [{
            id: 1,
            type: '阿修罗',
            hasCapsLk: true
        }, {
            id: 2,
            type: '阿修罗',
            hasCapsLk: true
        }, {
            id: 3,
            type: '阿修罗',
            hasCapsLk: true
        }, {
            id: 4,
            type: '阿修罗',
            hasCapsLk: true
        }, {
            id: 5,
            type: '旅人',
            hasCapsLk: true
        }, {
            id: 6,
            type: '剑魂',
            hasCapsLk: true
        }, {
            id: 7,
            type: '刃影',
            hasCapsLk: true
        }, {
            id: 8,
            type: '刃影',
            hasCapsLk: true
        }, {
            id: 9,
            type: '鬼泣',
            hasCapsLk: true
        }, {
            id: 10,
            type: '鬼泣',
            hasCapsLk: true
        }, {
            id: 11,
            type: '狂战士',
            hasCapsLk: true
        }, {
            id: 12,
            type: '气功',
            hasCapsLk: true
        }, {
            id: 13,
            type: '流浪武士',
            hasCapsLk: true
        }, {
            id: 14,
            type: '光明骑士',
            hasCapsLk: true
        }, {
            id: 15,
            type: '合金战士',
            hasCapsLk: true
        }],
        4: [{
            id: 1,
            type: '狂战士',
        }, {
            id: 2,
            type: '阿修罗',
        }, {
            id: 3,
            type: '剑魂',
        }, {
            id: 4,
            type: '光明骑士',
        }, {
            id: 5,
            type: '气功',
        }, {
            id: 6,
            type: '气功',
        }, {
            id: 7,
            type: '气功',
        }, {
            id: 8,
            type: '刃影',
        }, {
            id: 9,
            type: '旅人',
        }]
    }
}




















async function fighting(windowsBot) {

    plCount--

    let found = false
    let error = false
    setTimeout(() => {
        if (!found) {
            error = true
            found = true
        }
    }, currentRole.level === 1 ? 65000 : 60000)

    console.log('fighting')

    console.log('-----------一图------------')

    let sBuff = utils.suffleArray(buff)

    console.log('随机放buff')
    for (let i = 0; i < sBuff.length; i++) {
        await windowsBot.sendVk(sBuff[i], 1);
        await windowsBot.sleep(700);
    }

    console.log('press up right')
    await windowsBot.sendVk(keyMap.up, 2);
    await windowsBot.sleep(200);
    await windowsBot.sendVk(keyMap.right, 2);
    await windowsBot.sleep(1500);

    console.log('松开右上')

    await windowsBot.sendVk(keyMap.right, 3);
    await windowsBot.sleep(200);
    await windowsBot.sendVk(keyMap.up, 3);


    console.log('-----------二图------------')

    await windowsBot.sleep(500);

    await windowsBot.sendVk(keyMap['句号'], 1);
    await windowsBot.sleep(200);

    console.log('放E技能')
    await windowsBot.sendVk(keyMap.e, 1);
    await windowsBot.sleep(500);

    // await windowsBot.sendVk(keyMap.e, 1);
    // await windowsBot.sleep(500);

    if (currentRole.level === 1) {
        await windowsBot.sleep(1000);
        await windowsBot.sendVk(keyMap.a, 1);
        await windowsBot.sleep(1000);
    }

    console.log('等一会')
    await windowsBot.sleep(2000);


    console.log('往右走')
    await windowsBot.sendVk(keyMap.right, 1);
    await windowsBot.sleep(100);

    await windowsBot.sendVk(keyMap.right, 2);

    await windowsBot.sleep(2000);
    await windowsBot.sendVk(keyMap.right, 3);

    await windowsBot.sleep(500);


    console.log('-----------三图------------')

    console.log('往右走一.5秒')

    await windowsBot.sendVk(keyMap.right, 1);
    await windowsBot.sleep(100);
    await windowsBot.sendVk(keyMap.right, 2);
    await windowsBot.sleep(600);
    await windowsBot.sendVk(keyMap.right, 3);

    console.log('放大冰并且爆炸')
    await windowsBot.sendVk(keyMap.w, 1);
    await windowsBot.sleep(1000);
    await windowsBot.sendVk(keyMap.w, 1);
    await windowsBot.sleep(500);


    console.log('往右走')
    await windowsBot.sendVk(keyMap.right, 1);
    await windowsBot.sleep(100);
    await windowsBot.sendVk(keyMap.right, 2);
    await windowsBot.sleep(800);
    await windowsBot.sendVk(keyMap.right, 3);
    await windowsBot.sleep(500);

    console.log('往上走')
    await windowsBot.sendVk(keyMap.up, 2);
    await windowsBot.sleep(800);
    await windowsBot.sendVk(keyMap.up, 3);

    console.log('往左走')
    await windowsBot.sendVk(keyMap.left, 1);
    await windowsBot.sleep(100);
    await windowsBot.sendVk(keyMap.left, 2);
    await windowsBot.sleep(600);
    await windowsBot.sendVk(keyMap.left, 3);
    await windowsBot.sleep(500);


    console.log('-----------四图------------')


    console.log('往上走')
    await windowsBot.sendVk(keyMap.up, 2);

    await windowsBot.sleep(600);
    await windowsBot.sendVk(keyMap.up, 3);

    await windowsBot.sleep(100);
    await windowsBot.sendVk(keyMap.right, 1);

    console.log('放小冰、邪光斩、小火')
    await windowsBot.sendVk(keyMap.d, 1);
    await windowsBot.sleep(500);
    await windowsBot.sendVk(keyMap.s, 1);
    await windowsBot.sleep(500);

    if (currentRole.level === 1) {
        console.log('等一会')
        await windowsBot.sleep(1000);
    }
    console.log('等一会')
    await windowsBot.sleep(1000);

    console.log('往右走')
    await windowsBot.sendVk(keyMap.right, 1);
    await windowsBot.sleep(100);
    await windowsBot.sendVk(keyMap.right, 2);
    await windowsBot.sleep(1000);
    await windowsBot.sendVk(keyMap.right, 3);
    await windowsBot.sleep(500);

    console.log('往上走')
    await windowsBot.sendVk(keyMap.up, 2);
    await windowsBot.sleep(800);
    await windowsBot.sendVk(keyMap.up, 3);

    console.log('往左走')
    await windowsBot.sendVk(keyMap.left, 1);
    await windowsBot.sleep(100);
    await windowsBot.sendVk(keyMap.left, 2);
    await windowsBot.sleep(800);
    await windowsBot.sendVk(keyMap.left, 3);
    await windowsBot.sleep(500);




    console.log('-----------五图------------')
    console.log('往上走')
    await windowsBot.sendVk(keyMap.up, 2);
    await windowsBot.sleep(900);
    await windowsBot.sendVk(keyMap.up, 3);


    // console.log('放天雷 e')
    // await windowsBot.sendVk(keyMap.e, 1);
    // await windowsBot.sleep(500);

    if (currentRole.level === 1) {
        console.log('等一会')
        await windowsBot.sleep(1000);
    }
    console.log('等一会')
    await windowsBot.sleep(1000);

    console.log('往右走')

    await windowsBot.sendVk(keyMap.right, 1);
    await windowsBot.sleep(100);
    await windowsBot.sendVk(keyMap.right, 2);
    await windowsBot.sleep(3000);
    await windowsBot.sendVk(keyMap.right, 3);
    await windowsBot.sleep(500);


    console.log('-----------六图------------')


    console.log('继续往右走')

    await windowsBot.sendVk(keyMap.q, 1);
    await windowsBot.sleep(500);




    console.log('往上走')
    await windowsBot.sendVk(keyMap.up, 2);
    await windowsBot.sleep(1500);
    await windowsBot.sendVk(keyMap.up, 3);
    await windowsBot.sleep(100);

    console.log('往xia走')
    await windowsBot.sendVk(keyMap.down, 2);
    await windowsBot.sleep(500);
    await windowsBot.sendVk(keyMap.down, 3);
    await windowsBot.sleep(100);


    console.log('捡东西')
    await windowsBot.sendVk(keyMap.capsLk, 1);
    await windowsBot.sleep(200);
    await windowsBot.sendVk(keyMap.x, 1);
    await windowsBot.sleep(200);
    await windowsBot.sendVk(keyMap.x, 1);
    await windowsBot.sleep(200);






    await windowsBot.sendVk(keyMap.right, 1);
    await windowsBot.sleep(200);
    await windowsBot.sendVk(keyMap.right, 2);
    await windowsBot.sleep(2400);
    await windowsBot.sendVk(keyMap.right, 3);
    await windowsBot.sleep(500);


    console.log('-----------七图------------')

    console.log('往右走')
    await windowsBot.sendVk(keyMap.right, 2);
    await windowsBot.sleep(500);
    await windowsBot.sendVk(keyMap.right, 3);





    // await windowsBot.sendVk(keyMap.w, 1);
    // await windowsBot.sleep(1000);
    // await windowsBot.sendVk(keyMap.w, 1);
    // await windowsBot.sleep(500);

    if (currentRole.level === 1) {
        console.log('放阵')
        await windowsBot.sendVk(keyMap.alt, 1);
        await windowsBot.sleep(500);
        console.log('放无为斩、大冰并且爆炸')
        await windowsBot.sendVk(keyMap.y, 1);
        await windowsBot.sleep(1500);
        console.log('放3觉')
        await windowsBot.sendVk(keyMap.t, 1);
        await windowsBot.sleep(6000);
    } else {
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
    }


    console.log('邪光斩、小火')
    await windowsBot.sendVk(keyMap.s, 1);
    await windowsBot.sleep(500);
    await windowsBot.sendVk(keyMap.d, 1);
    await windowsBot.sleep(500);
    await windowsBot.sendVk(keyMap.a, 1);
    await windowsBot.sleep(500);


    let count = 0

    let canShibie = true
    console.log('一直识别')
    while (!found) {
        await windowsBot.sleep(1000);
        count++
        if (canShibie) {
            console.log('进得来识别')

            canShibie = false
            windowsBot.findImage(hwnd, __dirname + '\\images\\dnf-end2.png', { sim: 0.7 }).then((res) => {
                console.log('canShibie', canShibie)
                canShibie = true
                if (res) {
                    found = true
                    console.log('结束了')
                } else {
                    console.log('没识别到')
                }
            });
        }
    }


    if (error) {
        console.log('错误了返回角色选择,还是选当前角色')
        await windowsBot.sleep(1000);
        roleState--
        await exitToRole(windowsBot, true)
        return
    }


    console.log('聚集物品')
    await windowsBot.sendVk(keyMap['/?'], 1);
    await windowsBot.sleep(200);
    await windowsBot.sendVk(keyMap.x, 1);
    await windowsBot.sleep(200);
    await windowsBot.sendVk(keyMap.x, 1);
    await windowsBot.sleep(200);
    await windowsBot.sendVk(keyMap.x, 1);
    await windowsBot.sleep(200);
    await windowsBot.sendVk(keyMap.x, 1);
    await windowsBot.sleep(200);
    await windowsBot.sendVk(keyMap.x, 1);
    await windowsBot.sleep(200);
    await windowsBot.sendVk(keyMap.x, 1);
    await windowsBot.sleep(200);

    await windowsBot.sleep(2600);


    console.log('跳过')
    await windowsBot.sendVk(keyMap.esc, 1);
    await windowsBot.sleep(2000);


    if (plCount % 10 === 0) {
        await sell(windowsBot)
    }

    console.log('点击下商店x以防万一')
    await windowsBot.sendVk(keyMap.esc, 1);
    await windowsBot.sleep(500);

    // await windowsBot.clickMouse(hwnd, 1060, 830, 1);
    // await windowsBot.sleep(500);

    let result = await ifNoplNew(windowsBot)


    if (result) {
        console.log('没疲劳了')
        await windowsBot.sendVk(keyMap.f12, 1);
        await windowsBot.sleep(5000);

        await backTown(windowsBot)

        await exitToRole(windowsBot)
        return
    }

    // //次数超过17次 没疲劳了
    // if(plCount <=0 ){
    //     console.log('没疲劳了')
    //     await windowsBot.sendVk(keyMap.f12, 1);
    //     await windowsBot.sleep(5000);

    //     plCount = 27;
    //     await exitToRole(windowsBot)
    //     return
    // }




    console.log('F10继续战斗')
    await windowsBot.sendVk(keyMap.f10, 1);
    await windowsBot.sleep(5000);

}
