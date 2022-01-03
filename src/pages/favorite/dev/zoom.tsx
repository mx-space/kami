import Zoom from 'react-medium-image-zoom'
export default function ZoomT() {
  return (
    <Zoom overlayBgColorEnd={'var(--light-bg)'} zoomMargin={50}>
      <img src={'https://cdn.innei.ren/bed/2021/0831125052.JPG'} />
    </Zoom>
  )
}
