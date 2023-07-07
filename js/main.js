(() => {

  let yOffset = 0; // window.pageYOffset 대신 쓸 변수
  let prevScrollHeight = 0; // 현재 스크롤 위치(yOffset)보다 이전에 위치한 스크롤 섹션들의 스크롤 높이값의 합
	let currentScene = 0; // 현재 활성화된(눈 앞에 보고있는) 씬(scroll-section)
  let enterNewScene = false; // 새로운 scene이 시작된 순가 false
  let acc = 0.1; //가속도
  let delayedYOffset = 0;
  let rafId;
  let rafState;

  const sceneInfo = [
    {
      // 0
			type: 'sticky',
			heightNum: 4, // 브라우저 높이의 5배로 scrollHeight 세팅
			scrollHeight: 0,
      objs: {
        container: document.querySelector('#scroll-section-0'),
        messageA: document.querySelector('#scroll-section-0 .main-message.a'),
        messageB: document.querySelector('#scroll-section-0 .main-message.b'),
        messageC: document.querySelector('#scroll-section-0 .main-message.c'),
        messageD: document.querySelector('#scroll-section-0 .main-message.d'),
        canvas: document.querySelector('#video-canvas-0'),//캔버스 사용 기본 1
				context: document.querySelector('#video-canvas-0').getContext('2d'),//캔버스 사용 기본 2
				videoImages: [] //배열객체 여기에 이미지 수백장 넣을것임
      },
      values: {
        videoImageCount: 83,//비디오 이미지 총 갯수
        imageSequence: [0, 82], //스크롤에 따른 이미지 순서
        canvas_opacity: [1, 0, { start:0.9, end: 1 }], //캔버스 이미지 자연스럽게 사라지는 방법
				messageA_opacity_in: [0, 1, { start: 0.1, end: 0.2 }],
				messageB_opacity_in: [0, 1, { start: 0.3, end: 0.4 }],
				messageC_opacity_in: [0, 1, { start: 0.5, end: 0.6 }],
				messageD_opacity_in: [0, 1, { start: 0.7, end: 0.8 }],
				messageA_translateY_in: [20, 0, { start: 0.1, end: 0.2 }],
				messageB_translateY_in: [20, 0, { start: 0.3, end: 0.4 }],
				messageC_translateY_in: [20, 0, { start: 0.5, end: 0.6 }],
				messageD_translateY_in: [20, 0, { start: 0.7, end: 0.8 }],
				messageA_opacity_out: [1, 0, { start: 0.25, end: 0.3 }],
				messageB_opacity_out: [1, 0, { start: 0.45, end: 0.5 }],
				messageC_opacity_out: [1, 0, { start: 0.65, end: 0.7 }],
				messageD_opacity_out: [1, 0, { start: 0.85, end: 0.9 }],
				messageA_translateY_out: [0, -20, { start: 0.25, end: 0.3 }],
				messageB_translateY_out: [0, -20, { start: 0.45, end: 0.5 }],
				messageC_translateY_out: [0, -20, { start: 0.65, end: 0.7 }],
				messageD_translateY_out: [0, -20, { start: 0.85, end: 0.9 }]
      }
    },
    {
      // 1
			type: 'normal',
			// heightNum: 5, type normal에서는 필요 없음
			scrollHeight: 0,
      objs: {
        container: document.querySelector('#scroll-section-1')
      }
    },
    {
      // 2
      type: 'sticky',
      heightNum: 5,
      scrollHeight: 0,
      objs: {
        container: document.querySelector('#scroll-section-2'),
        messageA: document.querySelector('#scroll-section-2 .a'),
        messageB: document.querySelector('#scroll-section-2 .b'),
        messageC: document.querySelector('#scroll-section-2 .c'),
        pinB: document.querySelector('#scroll-section-2 .b .pin'),
        pinC: document.querySelector('#scroll-section-2 .c .pin'),
        canvas: document.querySelector('#video-canvas-1'),//캔버스 사용 기본 1
				context: document.querySelector('#video-canvas-1').getContext('2d'),//캔버스 사용 기본 2
				videoImages: [] //배열객체 여기에 이미지 수백장 넣을것임
      },
      values: {
        videoImageCount: 260,//비디오 이미지 총 갯수
        imageSequence: [0, 259], //스크롤에 따른 이미지 순서
        canvas_opacity_in: [0, 1, { start:0, end: 0.1 }], //캔버스 이미지 자연스럽게 사라지는 방법
        canvas_opacity_out: [1, 0, { start:0.95, end: 1 }], //캔버스 이미지 자연스럽게 사라지는 방법
        messageA_translateY_in: [20, 0, { start: 0.15, end: 0.2 }],
        messageB_translateY_in: [30, 0, { start: 0.5, end: 0.55 }],
        messageC_translateY_in: [30, 0, { start: 0.72, end: 0.77 }],
        messageA_opacity_in: [0, 1, { start: 0.15, end: 0.2 }],
        messageB_opacity_in: [0, 1, { start: 0.5, end: 0.55 }],
        messageC_opacity_in: [0, 1, { start: 0.72, end: 0.77 }],
        messageA_translateY_out: [0, -20, { start: 0.3, end: 0.35 }],
        messageB_translateY_out: [0, -20, { start: 0.58, end: 0.63 }],
        messageC_translateY_out: [0, -20, { start: 0.85, end: 0.9 }],
        messageA_opacity_out: [1, 0, { start: 0.3, end: 0.35 }],
        messageB_opacity_out: [1, 0, { start: 0.58, end: 0.63 }],
        messageC_opacity_out: [1, 0, { start: 0.85, end: 0.9 }],
        pinB_scaleY: [0.5, 1, { start: 0.5, end: 0.55 }],
        pinC_scaleY: [0.5, 1, { start: 0.72, end: 0.77 }],
        pinB_opacity_in: [0, 1, { start: 0.5, end: 0.55 }],
        pinC_opacity_in: [0, 1, { start: 0.72, end: 0.77 }],
        pinB_opacity_out: [1, 0, { start: 0.58, end: 0.63 }],
        pinC_opacity_out: [1, 0, { start: 0.85, end: 0.9 }]
      }
    },
    {
      // 3
      type: 'sticky',
      heightNum: 5,
      scrollHeight: 0,
      objs: {
        container: document.querySelector('#scroll-section-3'),
        canvasCaption: document.querySelector('.canvas-caption'),
        canvas: document.querySelector('.image-blend-canvas'),
        context: document.querySelector('.image-blend-canvas').getContext('2d'),
        imagesPath: [
          './images/blend-image-1.jpg',
          './images/blend-image-2.jpg'
        ],
        images: []
      },
      values: {
        rect1X: [ 0, 0, { start: 0, end: 0 } ],
				rect2X: [ 0, 0, { start: 0, end: 0 } ],
        blendHeight: [ 0, 0, { start: 0, end: 0 } ],
        canvas_scale: [0, 0, { start: 0, end: 0 }],
        canvasCaption_opacity: [0, 1, { start: 0, end: 0 }],
        canvasCaption_translateY: [20, 0, { start: 0, end: 0 }],
        rectStartY: 0
      }
    }
  ];

  //캔버스영역
  function setCanvasImages() {
    let imgElem;
		for (let i = 0; i < sceneInfo[0].values.videoImageCount; i++) {
			imgElem = new Image();
			imgElem.src = `./video/001/${1 + i}.JPG`;
			sceneInfo[0].objs.videoImages.push(imgElem);
		}

    let imgElem2;
		for (let i = 0; i < sceneInfo[2].values.videoImageCount; i++) {
			imgElem2 = new Image();
			imgElem2.src = `./video/002/${1 + i}.JPG`;
			sceneInfo[2].objs.videoImages.push(imgElem2);
		}

    let imgElem3;
    for (let i = 0; i < sceneInfo[3].objs.imagesPath.length; i++) {
      imgElem3 = new Image();
			imgElem3.src = sceneInfo[3].objs.imagesPath[i];
			sceneInfo[3].objs.images.push(imgElem3);
    }
  }
  

  //네비게이션
  function checkMenu() {
    if (yOffset > 44) {
      document.body.classList.add('local-nav-sticky');
    }else {
      document.body.classList.remove('local-nav-sticky');
    }
  }

  function setLayout() {
    //각 스크롤 센셕의 높이 세팅
    for (let i = 0; i < sceneInfo.length; i++) {
      if (sceneInfo[i].type === 'sticky') {
        sceneInfo[i].scrollHeight = sceneInfo[i].heightNum * window.innerHeight;
      } else if (sceneInfo[i].type === 'normal') {
        sceneInfo[i].scrollHeight = sceneInfo[i].objs.container.offsetHeight;
      }
      sceneInfo[i].objs.container.style.height = `${sceneInfo[i].scrollHeight}px`;
    }

    yOffset = window.pageYOffset;
    let totalScrollHeight = 0;//각 씬에 스크롤하이트를 더해서 넣어주고 스크롤하이트에 들어간 값과 현재 와이스크롤 위치를 비교해서 현재 스크롤 위치보다 토탈하이트가 더 커지면 현재 i를 커런트씬으로 세팅하고 fot문을 멈추고 빠져 나오는것
    for (let i = 0; i < sceneInfo.length; i++) {
      totalScrollHeight += sceneInfo[i].scrollHeight;
      if (totalScrollHeight >= yOffset) {
        currentScene = i;
        break;
      }
    }
    document.body.setAttribute('id', `show-scene-${currentScene}`);

    //캔버스 영역
    const heightRatio = window.innerHeight / 1080; //윈도우의 이너하이트/1080
    sceneInfo[0].objs.canvas.style.transform = `translate3d(-50%, -50%, 0) scale(${1})`;
    sceneInfo[2].objs.canvas.style.transform = `translate3d(-50%, -50%, 0) scale(${1})`; 
    // sceneInfo[0].objs.canvas.style.transform = `translate3d(-50%, -50%, 0) scale(${heightRatio})`;
  
  }

  function calcValues(values, currentYOffset) {
    let rv;
    //현재 씬(스크롤섹션)에서 스크롤된 범위를 비율로 구하기
    const scrollHeight = sceneInfo[currentScene].scrollHeight;
    const scrollRatio = currentYOffset / scrollHeight;
  
    if (values.length === 3) {
      //start ~ end 사이에 애니메이션 실행
      const partScrollStart = values[2].start * scrollHeight;
      const partScrollEnd = values[2].end * scrollHeight;
      const partScrollHeight = partScrollEnd - partScrollStart;

      if (currentYOffset >= partScrollStart && currentYOffset <= partScrollEnd) {
        rv =  (currentYOffset - partScrollStart) / partScrollHeight* (values[1] - values[0]) + values[0];
      } else if (currentYOffset < partScrollStart ) {
        rv = values[0];
      }else if (currentYOffset > partScrollEnd) {
        rv = values[1];
      }
    }else {
      rv = scrollRatio * (values[1] - values[0]) + values[0];
    }
    
    return rv;
  }

  function playAnimation() {
    const objs = sceneInfo[currentScene].objs;
    const values = sceneInfo[currentScene].values;
    const currentYOffset = yOffset - prevScrollHeight;
    const scrollHeight = sceneInfo[currentScene].scrollHeight;
    const scrollRatio = currentYOffset / scrollHeight; //yoffset /현재 씬의 scrillHeight
    

    switch (currentScene) {
      case 0:
        // console.log('0 play');
        // let sequence = Math.round(calcValues(values.imageSequence, currentYOffset));
        // objs.context.drawImage(objs.videoImages[sequence], 0, 0);
        objs.canvas.style.opacity = calcValues(values.canvas_opacity, currentYOffset);

        if (scrollRatio <= 0.22) {
          // in
          objs.messageA.style.opacity = calcValues(values.messageA_opacity_in, currentYOffset);
          objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_in, currentYOffset)}%, 0)`;
        } else {
          // out
          objs.messageA.style.opacity = calcValues(values.messageA_opacity_out, currentYOffset);
          objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_out, currentYOffset)}%, 0)`;
        }

        if (scrollRatio <= 0.42) {
          // in
          objs.messageB.style.opacity = calcValues(values.messageB_opacity_in, currentYOffset);
          objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_in, currentYOffset)}%, 0)`;
        } else {
          // out
          objs.messageB.style.opacity = calcValues(values.messageB_opacity_out, currentYOffset);
          objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_out, currentYOffset)}%, 0)`;
        }

        if (scrollRatio <= 0.62) {
          // in
          objs.messageC.style.opacity = calcValues(values.messageC_opacity_in, currentYOffset);
          objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_in, currentYOffset)}%, 0)`;
        } else {
          // out
          objs.messageC.style.opacity = calcValues(values.messageC_opacity_out, currentYOffset);
          objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_out, currentYOffset)}%, 0)`;
        }

        if (scrollRatio <= 0.82) {
          // in
          objs.messageD.style.opacity = calcValues(values.messageD_opacity_in, currentYOffset);
          objs.messageD.style.transform = `translate3d(0, ${calcValues(values.messageD_translateY_in, currentYOffset)}%, 0)`;
        } else {
          // out
          objs.messageD.style.opacity = calcValues(values.messageD_opacity_out, currentYOffset);
          objs.messageD.style.transform = `translate3d(0, ${calcValues(values.messageD_translateY_out, currentYOffset)}%, 0)`;
        }

        break;

    case 2:
        // console.log('2 play');
        // let sequence2 = Math.round(calcValues(values.imageSequence, currentYOffset));
        // objs.context.drawImage(objs.videoImages[sequence2], 0, 0);

        if (scrollRatio <= 0.5) {
          //in
          objs.canvas.style.opacity = calcValues(values.canvas_opacity_in, currentYOffset);
        } else {
          //out
          objs.canvas.style.opacity = calcValues(values.canvas_opacity_out, currentYOffset);
        }

        if (scrollRatio <= 0.25) {
          // in
          objs.messageA.style.opacity = calcValues(values.messageA_opacity_in, currentYOffset);
          objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_in, currentYOffset)}%, 0)`;
        } else {
          // out
          objs.messageA.style.opacity = calcValues(values.messageA_opacity_out, currentYOffset);
          objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_out, currentYOffset)}%, 0)`;
        }

        if (scrollRatio <= 0.67) { //0.57
          // in
          objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_in, currentYOffset)}%, 0)`;
          objs.messageB.style.opacity = calcValues(values.messageB_opacity_in, currentYOffset);
          objs.pinB.style.transform = `scaleY(${calcValues(values.pinB_scaleY, currentYOffset)})`;
        } else {
          // out
          objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_out, currentYOffset)}%, 0)`;
          objs.messageB.style.opacity = calcValues(values.messageB_opacity_out, currentYOffset);
          objs.pinB.style.transform = `scaleY(${calcValues(values.pinB_scaleY, currentYOffset)})`;
        }

        if (scrollRatio <= 0.83) { //0.83
          // in
          objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_in, currentYOffset)}%, 0)`;
          objs.messageC.style.opacity = calcValues(values.messageC_opacity_in, currentYOffset);
          objs.pinC.style.transform = `scaleY(${calcValues(values.pinC_scaleY, currentYOffset)})`;
        } else {
          // out
          objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_out, currentYOffset)}%, 0)`;
          objs.messageC.style.opacity = calcValues(values.messageC_opacity_out, currentYOffset);
          objs.pinC.style.transform = `scaleY(${calcValues(values.pinC_scaleY, currentYOffset)})`;
        }

        // currentScene 3에서 쓰는 캔버스를 미리 그려주기 시작
        if (scrollRatio > 0.9) {
          const objs = sceneInfo[3].objs;
          const values = sceneInfo[3].values;
          const widthRatio = window.innerWidth / objs.canvas.width;
          const heightRatio = window.innerHeight / objs.canvas.height;
          let cancasScaleRatio;

          if (widthRatio <= heightRatio) {
            cancasScaleRatio = heightRatio;
          }else {
            cancasScaleRatio = widthRatio;
          }

          objs.canvas.style.transform = `scale(${cancasScaleRatio})`;
          objs.context.fillStyle = 'white';
          objs.context.drawImage(objs.images[0], 0, 0);
          
          //캔버스 사이즈에 맞워 가정한 innerWith와 innerHeight
          const recalculatedInnerWidth = document.body.offsetWidth / cancasScaleRatio;
          const recalculatedInnerHeight = window.innerHeight / cancasScaleRatio;

          const whiteRectWidth = recalculatedInnerWidth * 0.15;
          values.rect1X[0] = (objs.canvas.width - recalculatedInnerWidth) / 2; //캔 버스사이즈 빼기 현재 리사이징되는 widgh값 나누기 2하면 사각형 값
          values.rect1X[1] = values.rect1X[0] - whiteRectWidth; 
          values.rect2X[0] = values.rect1X[0] + recalculatedInnerWidth - whiteRectWidth;
          values.rect2X[1] = values.rect2X[0] + whiteRectWidth;

          // 좌우 흰색 박스 그리기 x, y, (정수처리)width, height(꽉채우기)
          objs.context.fillRect(
            parseInt(values.rect1X[0]),
            0,
            parseInt(whiteRectWidth),
            objs.canvas.height
          );
          objs.context.fillRect(
            parseInt(values.rect2X[0]),
            0,
            parseInt(whiteRectWidth),
            objs.canvas.height
          );
        }

        break;

    case 3:
        // console.log('3 play');
        let strp = 0;
        // 가로/세로 모두 꽉 차게 하기 위해 여기서 세팅(계산 필요)
        const widthRatio = window.innerWidth / objs.canvas.width; // 원래 캔버스 가로 나누기 브라우저의 가로
        const heightRatio = window.innerHeight / objs.canvas.height; // 원래 캔버스 세로 나누기 브라우저의 세로
        let cancasScaleRatio;

        if (widthRatio <= heightRatio) {
          cancasScaleRatio = heightRatio;
          // 캔버스보다 브라우저 창이 홀쭉한 경우
          // console.log('heightRatio로 결정');
        }else {
          cancasScaleRatio = widthRatio;
          // 캔버스보다 브라우저 창이 납작한 경우
          // console.log('widthRatio로 결정');
        }

        objs.canvas.style.transform = `scale(${cancasScaleRatio})`;
        objs.context.fillStyle = 'white';
        objs.context.drawImage(objs.images[0], 0, 0);
        
        //캔버스 사이즈에 맞워 가정한 innerWith와 innerHeight
        const recalculatedInnerWidth = document.body.offsetWidth / cancasScaleRatio;
        const recalculatedInnerHeight = window.innerHeight / cancasScaleRatio;

        const whiteRectWidth = recalculatedInnerWidth * 0.15;
				values.rect1X[0] = (objs.canvas.width - recalculatedInnerWidth) / 2; //캔 버스사이즈 빼기 현재 리사이징되는 widgh값 나누기 2하면 사각형 값
				values.rect1X[1] = values.rect1X[0] - whiteRectWidth; 
				values.rect2X[0] = values.rect1X[0] + recalculatedInnerWidth - whiteRectWidth;
				values.rect2X[1] = values.rect2X[0] + whiteRectWidth;

        if (!values.rectStartY) {
          // 화면상에 있는 오브젝트에 크기와 위치를 가져올 수 있는 메서드
          // values.rectStartY = objs.canvas.getBoundingClientRect().top;
          values.rectStartY = objs.canvas.offsetTop + (objs.canvas.height - objs.canvas.height * cancasScaleRatio) / 2;
          values.rect1X[2].start = (window.innerHeight / 2) / scrollHeight;
          values.rect2X[2].start = (window.innerHeight / 2) / scrollHeight;
          values.rect1X[2].end = values.rectStartY /scrollHeight;
          values.rect2X[2].end = values.rectStartY /scrollHeight;
        }
        

        // 좌우 흰색 박스 그리기 x, y, (정수처리)width, height(꽉채우기)
					objs.context.fillRect(
						parseInt(calcValues(values.rect1X, currentYOffset)),
						0,
						parseInt(whiteRectWidth),
						objs.canvas.height
					);
					objs.context.fillRect(
						parseInt(calcValues(values.rect2X, currentYOffset)),
						0,
						parseInt(whiteRectWidth),
						objs.canvas.height
					);
          
          // 캔버스가 브라우저 상단에 닿지 않았다면
          if (scrollRatio < values.rect1X[2].end) {
            step = 1;
            // console.log('캔버스 닿기 전');
            objs.canvas.classList.remove('sticky');
          }else {
            step = 2;
            // console.log('캔버스 닿기 후');
            // 이미지 블렌드
            // imageBlendY: [0, 0, { start: 0. end: 0}]
            values.blendHeight[0] = 0;
            values.blendHeight[1] = objs.canvas.height;
            values.blendHeight[2].start = values.rect1X[2].end;
            values.blendHeight[2].end = values.blendHeight[2].start + 0.2;
            const blendHeight = calcValues(values.blendHeight, currentYOffset);


            objs.context.drawImage(objs.images[1],
              0, objs.canvas.height - blendHeight, objs.canvas.width, blendHeight,
              0, objs.canvas.height - blendHeight, objs.canvas.width, blendHeight
            );

            objs.canvas.classList.add('sticky');
            objs.canvas.style.top = `${-(objs.canvas.height - objs.canvas.height * cancasScaleRatio) / 2}px`;

            if (scrollRatio > values.blendHeight[2].end) {
              values.canvas_scale[0] = cancasScaleRatio;
              values.canvas_scale[1] = document.body.offsetWidth /(1.5 * objs.canvas.width);
              values.canvas_scale[2].start = values.blendHeight[2].end;
              values.canvas_scale[2].end = values.canvas_scale[2].start + 0.2;

              objs.canvas.style.transform = `scale(${calcValues(values.canvas_scale, currentYOffset)})`;
              objs.canvas.style.marginTop = `${scrollHeight * 0}`;
            }

            if (scrollRatio > values.canvas_scale[2].end && values.canvas_scale[2].end > 0 ) {
              // console.log('스크롤 시작');
              objs.canvas.classList.remove('sticky');
              objs.canvas.style.marginTop = `${scrollHeight * 0.4}px`;

              values.canvasCaption_opacity[2].start = values.canvas_scale[2].end;
              values.canvasCaption_opacity[2].end = values.canvasCaption_opacity[2].start + 0.1;
              values.canvasCaption_translateY[2].start = values.canvasCaption_opacity[2].start;
              values.canvasCaption_translateY[2].end = values.canvasCaption_opacity[2].end;
              objs.canvasCaption.style.opacity = calcValues(values.canvasCaption_opacity, currentYOffset);
              objs.canvasCaption.style.transform = `translate3d(0, ${calcValues(values.canvasCaption_translateY, currentYOffset)}%, 0)`;
            }

          
        }

        break;
    }
  }

  function scrollLoop() {
    enterNewScene = false; //씬이 바뀌는 순간, 순간적으로 오차가 생기는 것 때문에 씬이 바뀌는 순간만큼은 플레이애니메이션을 실해을 패스하겠끔 리턴해주는것 기본은 false
    prevScrollHeight = 0;
    for (let i = 0; i < currentScene; i++) {
      prevScrollHeight += sceneInfo[i].scrollHeight;
    }
    if (delayedYOffset < prevScrollHeight + sceneInfo[currentScene].scrollHeight) {
        document.body.classList.remove('scroll-effect-end');
    }
    if (delayedYOffset > prevScrollHeight + sceneInfo[currentScene].scrollHeight) {
      enterNewScene = true;
      if (currentScene === sceneInfo.length - 1) {
        document.body.classList.add('scroll-effect-end');
      }
      if (currentScene < sceneInfo.length - 1) {
        currentScene++;
      }
      document.body.setAttribute('id', `show-scene-${currentScene}`);
    }

    if (delayedYOffset < prevScrollHeight) {
      if (currentScene === 0) return; //브라우저 바운스 효과로 인해 마이너스가 되는 것을 방지(모바일)
      enterNewScene = true;
      currentScene--;
      document.body.setAttribute('id', `show-scene-${currentScene}`);
    }
    if (enterNewScene) return;

    playAnimation();

  }

  function loop() {
    //속도 감속식 
    delayedYOffset = delayedYOffset + (yOffset - delayedYOffset) * acc;

    if (!enterNewScene) {
      if (currentScene === 0 || currentScene === 2) {
        const currentYOffset = delayedYOffset - prevScrollHeight;
        const objs = sceneInfo[currentScene].objs;
        const values = sceneInfo[currentScene].values
        let sequence = Math.round(calcValues(values.imageSequence, currentYOffset));
        if (objs.videoImages[sequence]) {
          objs.context.drawImage(objs.videoImages[sequence], 0, 0);
        }
      }
    }

    rafId = requestAnimationFrame(loop);

		if (Math.abs(yOffset - delayedYOffset) < 1) {
			cancelAnimationFrame(rafId);
			rafState = false;
		}
  }


  // window.addEventListener('DOMContnetLoaded', setLayout);//html구조가 로딩이 끝나면 바로 실행된다 실행 시점이 빠름
  window.addEventListener('load', () => {
  setLayout();
    document.body.classList.remove('before-load');
    setLayout(); //sceneInfo배열에 있는 각 씬의 스크롤 하이트를 잡아주고 그 값으로 스크롤센션 높이를 세팅해주는 기능
    sceneInfo[0].objs.context.drawImage(sceneInfo[0].objs.videoImages[0], 0, 0);

    let tempYOffset = yOffset;
    let tempScrollCount = 0; // 5px씩 몇번했는지 체크할 기능
    if (tempYOffset  > 0) {
      let siId = setInterval(() => {
        scrollTo(0, tempYOffset);
        tempYOffset += 5;
  
        if (tempScrollCount > 20) {
          clearInterval(siId);
        }
        tempScrollCount++;
      }, 20); //계속 반복
    }
    

    window.addEventListener('scroll', () => {
      yOffset = window.pageYOffset;
      scrollLoop();
      checkMenu();

      if (!rafState) {
        rafId = requestAnimationFrame(loop);
        rafState = true;
      }
    });

    window.addEventListener('resize', () => {
      //만약에 윈도우의 이너위스가 900보다 클 경우에만 실행
      if (window.innerWidth > 900) {
        window.location.reload();
      }
    });

    //이벤트 추가 모바일기기를 가로세로 변경 이벤트를 작동 시켜라
    window.addEventListener('orientationchange', () => {
      scrollTo(0, 0);
      setTimeout( () => {
        window.location.reload();
      }, 500);
    });

    document.querySelector('.loading').addEventListener('transitionend', (e) => {
      document.body.removeChild(e.currentTarget);
    });
  });

  setCanvasImages();

})();