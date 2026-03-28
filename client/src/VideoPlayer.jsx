import { useEffect, useRef } from 'react'
import videojs from 'video.js'
import 'video.js/dist/video-js.css'
import 'videojs-youtube'

function normalizeYouTubeUrl(url) {
  if (!url) return url
  const embedMatch = url.match(/youtube\.com\/embed\/([^?&]+)/)
  if (embedMatch) return `https://www.youtube.com/watch?v=${embedMatch[1]}`
  return url
}

function isYouTube(url) {
  return url?.includes('youtube.com') || url?.includes('youtu.be')
}

export default function VideoPlayer({ src }) {
  const containerRef = useRef(null)
  const playerRef = useRef(null)

  useEffect(() => {
    if (!containerRef.current || !src) return

    const normalizedSrc = normalizeYouTubeUrl(src)
    const youtube = isYouTube(normalizedSrc)

    const videoEl = document.createElement('video')
    videoEl.className = 'video-js'
    containerRef.current.innerHTML = ''
    containerRef.current.appendChild(videoEl)

    playerRef.current = videojs(videoEl, {
      controls: true,
      fluid: true,
      preload: 'auto',
      techOrder: youtube ? ['youtube', 'html5'] : ['html5'],
      sources: [{ src: normalizedSrc, type: youtube ? 'video/youtube' : 'video/mp4' }],
      youtube: { ytControls: 0, rel: 0, modestbranding: 1 },
      controlBar: {
        skipButtons: { backward: 10, forward: 10 },
        volumePanel: { inline: true },
        pictureInPictureToggle: false,
        remainingTimeDisplay: false,
        playbackRateMenuButton: true,
      },
      playbackRates: [0.5, 1, 1.25, 1.5, 2],
      userActions: { hotkeys: true },
    })

    return () => {
      if (playerRef.current && !playerRef.current.isDisposed()) {
        playerRef.current.dispose()
        playerRef.current = null
      }
    }
  }, [src])

  return <div ref={containerRef} className="vp-wrapper" />
}
