import Image from 'next/image'
import { authAsidePanel } from './authStyles'

function cld(publicId: string) {
  return `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/f_auto,q_auto/${publicId}`
}

type AuthAsideProps = {
  imagePublicId: string
  eyebrow: string
  quote: string
}

export default function AuthAside({ imagePublicId, eyebrow, quote }: AuthAsideProps) {
  return (
    <div className={authAsidePanel}>
      <div className="relative h-full w-full overflow-hidden rounded-2xl">
        <Image
          src={cld(imagePublicId)}
          alt="Travel experience"
          fill
          priority
          className="object-cover"
        />
        <div className="pointer-events-none absolute inset-0 z-10 bg-linear-to-t from-black/50 via-black/20 to-transparent" />
        <div className="absolute bottom-12 left-12 right-12 z-20 text-white">
          <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.4em] text-white/70">{eyebrow}</p>
          <h3 className="text-3xl font-light italic leading-tight">&quot;{quote}&quot;</h3>
        </div>
      </div>
    </div>
  )
}
