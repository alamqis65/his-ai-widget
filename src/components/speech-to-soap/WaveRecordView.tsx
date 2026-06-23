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
    const CY = H / 2 // center Y axis

    const audioCtx = new AudioContext()
    const analyser = audioCtx.createAnalyser()
    analyser.fftSize = 256
    const bufferLength = analyser.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)

    let animId: number
    let stream: MediaStream

    navigator.mediaDevices.getUserMedia({ audio: true }).then(s => {
      stream = s
      const source = audioCtx.createMediaStreamSource(stream)
      source.connect(analyser)

      const gap = 2
      const barWidth = Math.max(2, (W - gap * (bufferLength - 1)) / bufferLength)

      const draw = () => {
        animId = requestAnimationFrame(draw)
        analyser.getByteFrequencyData(dataArray)
        ctx.clearRect(0, 0, W, H)

        for (let i = 0; i < bufferLength; i++) {
          const normalised = dataArray[i] / 255
          const halfBar = Math.max(2, normalised * CY * 0.9)
          const x = i * (barWidth + gap)

          // center → edge fade: bars near center slightly more opaque
          const centerFade = 1 - Math.abs(i / bufferLength - 0.5) * 0.6
          ctx.globalAlpha = (0.35 + normalised * 0.65) * centerFade

          // green → teal sweep
          const t = i / (bufferLength - 1)
          const r = Math.round(29 + t * (15 - 29))
          const g = Math.round(158 + t * (110 - 158))
          const b = Math.round(117 + t * (86 - 117))
          ctx.fillStyle = `rgb(${r},${g},${b})`

          // draw symmetric bar: up and down from center
          ctx.beginPath()
          ctx.roundRect(x, CY - halfBar, barWidth, halfBar * 2, 2)
          ctx.fill()
        }

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

  return (
    <canvas ref={canvasRef} style={{ width: '100%', height: '80px', display: 'block' }} class="recorder-visualizer" />
  )
}
