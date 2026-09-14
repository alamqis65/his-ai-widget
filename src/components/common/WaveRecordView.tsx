import { useEffect, useRef } from 'preact/hooks'

export function RecorderVisualizer({ isRecording }: { isRecording: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!isRecording) return

    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!

    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()

    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.scale(dpr, dpr)

    const W = rect.width
    const H = rect.height
    const CY = H / 2

    //------------------------------------------
    // Audio
    //------------------------------------------

    const audioCtx = new AudioContext()
    const analyser = audioCtx.createAnalyser()

    analyser.fftSize = 1024

    const data = new Uint8Array(analyser.fftSize)

    //------------------------------------------
    // Signal processing tuning
    //------------------------------------------

    // Ignore mic self-noise / room hiss below this RMS. This is the main fix
    // for "bar is full even when not talking" — without a gate, ambient noise
    // alone keeps feeding a nonzero level into the peak-hold below.
    const NOISE_GATE_THRESHOLD = 0.025
    const NOISE_GATE_KNEE = 0.05 // soft ramp-in above the threshold, avoids a hard click

    // Perceptual curve: makes quiet speech visible without letting normal
    // speech immediately look "maxed out". value < 1 lifts small values more
    // than large ones (e.g. 0.1 -> 0.32, 0.5 -> 0.68, 1.0 -> 1.0).
    const GAMMA_EXPONENT = 0.55

    // Proper attack/release instead of an instant snap-to-peak. Attack is
    // fast so transients still register; release is slow-but-finite so bars
    // actually come back down between words instead of staying pinned near
    // the last loud moment for seconds.
    const ATTACK_RATE = 0.45
    const RELEASE_RATE = 0.08

    // Bar height is clamped as a fraction of the *half*-height (CY), so a
    // maxed-out value fills most but not all of the track — leaving visual
    // headroom to actually distinguish "loud" from "clipping".
    const MAX_BAR_HALF_HEIGHT_RATIO = 0.85
    const MIN_BAR_HEIGHT = 2 // silence still shows a tiny sliver, never fully flat
    const VISUAL_GAIN = 1.8

    //------------------------------------------
    // Wave History
    //------------------------------------------

    const BAR_WIDTH = 3
    const GAP = 2

    const BAR_SPACE = BAR_WIDTH + GAP

    const HISTORY_SIZE = Math.floor(W / BAR_SPACE)

    const history = new Array<number>(HISTORY_SIZE).fill(0)

    let displayLevel = 0

    //------------------------------------------

    let stream: MediaStream
    let animId = 0

    navigator.mediaDevices.getUserMedia({ audio: true }).then(s => {
      stream = s

      const source = audioCtx.createMediaStreamSource(stream)
      source.connect(analyser)

      let lastPush = performance.now()

      const draw = () => {
        animId = requestAnimationFrame(draw)

        analyser.getByteTimeDomainData(data)

        //--------------------------------------
        // RMS
        //--------------------------------------

        let sum = 0

        for (let i = 0; i < data.length; i++) {
          const v = (data[i] - 128) / 128
          sum += v * v
        }

        const rms = Math.sqrt(sum / data.length)

        //--------------------------------------
        // Noise gate — reject mic/room noise floor
        //--------------------------------------

        let gated = 0

        if (rms > NOISE_GATE_THRESHOLD) {
          const knee = Math.min(1, (rms - NOISE_GATE_THRESHOLD) / NOISE_GATE_KNEE)
          gated = rms * knee
        }

        //--------------------------------------
        // Gamma correction — lift quiet voices, don't let loud ones clip early
        //--------------------------------------

        const corrected = Math.pow(gated, GAMMA_EXPONENT)

        //--------------------------------------
        // Smooth — real attack/release, not instant peak-hold
        //--------------------------------------

        const rate = corrected > displayLevel ? ATTACK_RATE : RELEASE_RATE
        displayLevel += (corrected - displayLevel) * rate

        //--------------------------------------
        // Push history
        //--------------------------------------

        const now = performance.now()

        if (now - lastPush > 28) {
          lastPush = now

          history.shift()

          history.push(displayLevel)
        }

        //--------------------------------------
        // Draw
        //--------------------------------------

        ctx.clearRect(0, 0, W, H)

        // baseline
        ctx.beginPath()
        ctx.strokeStyle = '#dce8e4'
        ctx.lineWidth = 1
        ctx.moveTo(0, CY)
        ctx.lineTo(W, CY)
        ctx.stroke()

        //--------------------------------------

        const maxHalfHeight = CY * MAX_BAR_HALF_HEIGHT_RATIO

        history.forEach((level, i) => {
          const x = i * BAR_SPACE
          const visualLevel = Math.min(level * VISUAL_GAIN, 1)

          const halfHeight = Math.max(MIN_BAR_HEIGHT / 2, visualLevel * maxHalfHeight)
          // const halfHeight = Math.max(MIN_BAR_HEIGHT / 2, level * maxHalfHeight)
          const h = halfHeight * 2

          // fade kiri -> kanan
          const alpha = 0.25 + (i / HISTORY_SIZE) * 0.75

          ctx.globalAlpha = alpha

          ctx.fillStyle = '#16A085'

          ctx.beginPath()

          ctx.roundRect(x, CY - halfHeight, BAR_WIDTH, h, BAR_WIDTH)

          ctx.fill()
        })

        ctx.globalAlpha = 1
      }

      draw()
    })

    return () => {
      cancelAnimationFrame(animId)

      stream?.getTracks().forEach(t => t.stop())

      audioCtx.close()
    }
  }, [isRecording])

  return <canvas ref={canvasRef} class="recorder-visualizer" />
}
