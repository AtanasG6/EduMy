import { createPlayer } from '@videojs/react'
import { VideoSkin, Video, videoFeatures } from '@videojs/react/video'
import '@videojs/react/video/skin.css'

const Player = createPlayer({ features: videoFeatures })

function toEmbedUrl(url) {
  if (!url) return null
  const m = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([^?&]+)/)
  return m ? `https://www.youtube.com/embed/${m[1]}?rel=0&modestbranding=1` : null
}

export default function VideoPlayer({ src }) {
  const embedUrl = toEmbedUrl(src)

  if (embedUrl) {
    return (
      <div className="vp-youtube">
        <iframe
          src={embedUrl}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="video"
        />
      </div>
    )
  }

  return (
    <Player.Provider>
      <VideoSkin>
        <Video src={src} playsInline />
      </VideoSkin>
    </Player.Provider>
  )
}
