import { useEffect, useRef } from "react"

export const CanvasBackground = () => {
    const canvasRef = useRef(null)
    let effect
    let ctx
    let lastTime = 0
    let fps = 10
    let nextFrame = 1000 / fps
    let timer = 0

    useEffect(() => {
        if (canvasRef.current) {
            ctx = canvasRef.current.getContext('2d')
            canvasRef.current.width = window.innerWidth
            canvasRef.current.height = window.innerHeight
            effect = new Effect(canvasRef.current.width, canvasRef.current.height)
        }
    }, [canvasRef.current])

    class Symbol {
        constructor(x, y, fontSize, canvasHeight) {
            // this.characters = 'ァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ❅'
            this.characters = 'אבגדהוזחטיכלמנספצקרשת'
            this.x = x
            this.y = y
            this.fontSize = fontSize
            this.text = ''
            this.canvasHeight = canvasHeight
        }
        draw(context) {
            this.text = this.characters.charAt(Math.floor(Math.random() * this.characters.length))
            context.fillStyle = '#0aff0a'
            context.fillText(this.text, this.x * this.fontSize, this.y * this.fontSize)
            if (this.y * this.fontSize > this.canvasHeight && Math.random() > 0.98) {
                this.y = 0
            } else {
                this.y += 1
            }
        }
    }

    class Effect {
        constructor(canvasWidth, canvasHeight) {
            this.canvasWidth = canvasWidth
            this.canvasHeight = canvasHeight
            this.fontSize = 20
            this.columns = this.canvasWidth / this.fontSize
            this.symbols = []
            this.#initialize()
        }
        #initialize() {
            for (let i = 0; i < this.columns; i++) {
                this.symbols[i] = new Symbol(i, 0, this.fontSize, this.canvasHeight);
            }
        }
    }

    const renderFrame = (timeStamp) => {
        const deltaTime = timeStamp - lastTime
        lastTime = timeStamp
        if (timer > nextFrame) {
            ctx.fillStyle = 'rgba(0,0,0,0.07)'
            ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height)
            ctx.font = effect.fontSize + 'px monospace'
            effect.symbols.forEach(symbol => symbol.draw(ctx))
            timer = 0
        } else {

            timer += deltaTime
        }

    };

    const tick = (timeStamp) => {
        if (!canvasRef.current) return;
        renderFrame(timeStamp);
        requestAnimationFrame(tick);
    };

    useEffect(() => {
        requestAnimationFrame(tick);
    }, []);

    return (
        <canvas ref={canvasRef} id="canvas"></canvas>
    )
}