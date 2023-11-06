module.exports  = async function fighting(windowsBot,plCount,exitToRole){

    plCount--

    let found = false
    let error = false
    setTimeout(()=>{
         if(!found){
            error = true
            found = true
        }
    },currentRole.level===1?65000:60000)

    console.log('fighting')

    console.log('-----------一图------------')

    let sBuff = utils.suffleArray(buff)

    console.log('随机放buff')
    for(let i =0;i<sBuff.length;i++){
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

    if(currentRole.level===1){
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


    if(currentRole.level===1){
        console.log('等一会')
        await windowsBot.sleep(1000);
    }

    console.log('等一会')
    await windowsBot.sleep(1000);


    console.log('往上走')
    await windowsBot.sendVk(keyMap.up, 2);
    await windowsBot.sleep(1000);


    console.log('往右走')
    await windowsBot.sendVk(keyMap.right, 2);
    await windowsBot.sleep(1000);
    await windowsBot.sendVk(keyMap.right, 3);


   
    await windowsBot.sendVk(keyMap.up, 3);
    await windowsBot.sleep(1000);


    console.log('-----------四图------------')


    console.log('往上走')
    await windowsBot.sendVk(keyMap.up, 2);

    await windowsBot.sleep(600);
    await windowsBot.sendVk(keyMap.up, 3);

    console.log('放小冰、邪光斩、小火')
    await windowsBot.sendVk(keyMap.d, 1);
    await windowsBot.sleep(500); 
    await windowsBot.sendVk(keyMap.s, 1);
    await windowsBot.sleep(500);

    if(currentRole.level===1){
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

    if(currentRole.level===1){
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
    
    // if(currentRole.level===1){
    console.log('等一会')
    await windowsBot.sleep(1500);
    // }

    console.log('捡东西')
    await windowsBot.sendVk(keyMap.capsLk, 1);
    await windowsBot.sleep(200);
    await windowsBot.sendVk(keyMap.x, 1);
    await windowsBot.sleep(200);
    await windowsBot.sendVk(keyMap.x, 1);
    await windowsBot.sleep(200);




；
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

    if(currentRole.level===1){
        console.log('放阵')
        await windowsBot.sendVk(keyMap.alt, 1);
        await windowsBot.sleep(500);
        console.log('放无为斩、大冰并且爆炸')
        await windowsBot.sendVk(keyMap.y, 1);
        await windowsBot.sleep(1500);
        console.log('放3觉')
        await windowsBot.sendVk(keyMap.t, 1);
        await windowsBot.sleep(6000);
    }else{
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
    while(!found){
        await windowsBot.sleep(1000); 
        count ++
        if(canShibie){
            console.log('进得来识别')
 
            canShibie = false
            windowsBot.findImage(hwnd,  __dirname + '\\images\\dnf-end1.png', {sim:0.8}).then((res)=>{
                console.log('canShibie',canShibie)
                canShibie = true
                if(res){
                    found = true
                    console.log('结束了')
                }else{
                    console.log('没识别到')
                }
            });
        }
    }


    if(error){
        console.log('错误了返回角色选择,还是选当前角色')
        await windowsBot.sleep(1000); 
        roleState --
        await exitToRole(windowsBot,true)
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


    if(plCount % 10 ===0){
        await sell(windowsBot)
    }

    console.log('点击下商店x以防万一')
    await windowsBot.sendVk(keyMap.esc, 1);
    await windowsBot.sleep(500);

    // await windowsBot.clickMouse(hwnd, 1060, 830, 1);
    // await windowsBot.sleep(500);

    // let result =  await ifNopl(windowsBot)
    //次数超过17次 没疲劳了
    if(plCount <=0 ){
        console.log('没疲劳了')
        await windowsBot.sendVk(keyMap.f12, 1);
        await windowsBot.sleep(5000);
        
        plCount = 27;
        await exitToRole(windowsBot)
        return
    }
     

 

    console.log('F10继续战斗')
    await windowsBot.sendVk(keyMap.f10, 1);
    await windowsBot.sleep(5000);

}