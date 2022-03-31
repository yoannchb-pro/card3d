'use strict';

function initCard3d(elements){
    elements.forEach(e => {
        let focus = e;
        const config = e.dataset;

        const fullPage = config.card3dFullPageListening && JSON.parse(config.card3dFullPageListening);
        if(fullPage) focus = document.body;

        const perspective = config.card3dPerspective && parseFloat(config.card3dPerspective) ? parseFloat(config.card3dPerspective) : 500;

        const startPositionX = config.card3dStartX && parseFloat(config.card3dStartX) ? parseFloat(config.card3dStartX) : 0;
        const startPositionY = config.card3dStartY && parseFloat(config.card3dStartY) ? parseFloat(config.card3dStartY) : 0;

        //glare element
        const glare = config.card3dGlare != null && config.card3dGlare != undefined;
        const glareOpacity = glare && parseFloat(config.card3dGlare) ? parseFloat(config.card3dGlare) : 0.5;
        const gl = document.createElement('span');
        gl.style = `
        will-change: transform;
        position: absolute;
        background-image: linear-gradient(0deg, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 100%);
        pointer-event: none; 
        transform-origin: 0% 0%;
        transform: translate(-50%, -50%) rotate(180deg);
        opacity: 0;
        z-index: 999;
        `;
        e.appendChild(gl);

        const mousemove = (event) => {
            //config
            const stop = config.card3dStop && JSON.parse(config.card3dStop);

            if(stop) {
                stopFn();
                return;
            }
            
            const reverse = config.card3dReverse && JSON.parse(config.card3dReverse) ? 1 : -1;
            const axis = config.card3dAxis ? config.card3dAxis : 'all';
            const scale = config.card3dScale && parseFloat(config.card3dScale) ? parseFloat(config.card3dScale) : 1;
            const delta = config.card3dDelta && parseFloat(config.card3dDelta) ? parseFloat(config.card3dDelta) : 10;
            //end
            
            e.style.transition = "";
    
            const rect = e.getBoundingClientRect();

            const middleWidth = rect.width / 2;
            const middleHeight = rect.height / 2;
            const middleX = rect.left + middleWidth;
            const middleY = rect.top + middleHeight;
    
            const x = (middleX - event.clientX) * -1;
            const y = middleY - event.clientY;

            let finalX = (x/(focus != e ? window.innerWidth/2 : rect.width/2))*delta;
            let finalY = (y/(focus != e ? window.innerHeight/2 : rect.height/2))*delta;
    
            if(axis.toLowerCase() == 'x'){
                finalY = 0;
            } else if(axis.toLowerCase() == 'y'){
                finalX = 0;
            }

            //glare
            if(glare){
                const angle = Math.atan2(event.clientX - middleX, -(event.clientY - middleY)) * (180 / Math.PI);
                const glareSize = (rect.width > rect.height ? rect.width : rect.height) * 2;
                gl.style.opacity = glareOpacity;
                gl.style.left = "50%";
                gl.style.top = "50%";
                gl.style.width = glareSize + "px";
                gl.style.height = glareSize + "px";
                gl.style.transform = `rotate(${angle}deg) translate(-50%, -50%)`;
                gl.style.display = "block";
            }

            e.style.transform = `
            perspective(${perspective}px) 
            rotateX(${finalY*reverse}deg) 
            rotateY(${finalX*reverse}deg)
            scale(${scale})
            `;
        }

        const mouseout = () => {
            e.style.transition = "0.5s ease";
            e.style.transform = "";
            gl.style.opacity = "0";
        }

        const stopFn = () => {
            focus.removeEventListener('mousemove', mousemove);
            focus.removeEventListener('mouseout', mouseout);
        }

        //event setup
        focus.addEventListener('mousemove', mousemove);
        const reset = config.card3dReset && JSON.parse(config.card3dReset);
        if(reset || config.card3dReset == null || config.card3dReset == undefined) focus.addEventListener('mouseout', mouseout);

        e.style.overflow = "hidden";
        e.style.willChange = "transform";
        e.style.transform = `
        perspective(500px) 
        rotateX(${startPositionY}deg) 
        rotateY(${startPositionX}deg)
        `
    });
};

document.addEventListener('DOMContentLoaded', () => initCard3d(document.querySelectorAll('[data-card3d]')));

if (typeof exports == "object") module.exports = initCard3d;