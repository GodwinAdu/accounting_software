"use client"

import Image from 'next/image'
import { useEffect, useState } from 'react'

const images = ['/login/1.jpg', '/login/2.jpg', '/login/3.jpg', '/login/4.jpg', '/login/5.jpg']

export default function LoginCarousel() {
    const [current, setCurrent] = useState(0)

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % images.length)
        }, 10000)
        return () => clearInterval(timer)
    }, [])

    return (
        <div className="relative h-screen w-full overflow-hidden">
            {images.map((src, index) => (
                <Image
                    key={src}
                    src={src}
                    alt="Accounting workspace"
                    fill
                    className={`object-cover transition-opacity duration-1000 ${
                        index === current ? 'opacity-100' : 'opacity-0'
                    }`}
                    priority={index === 0}
                />
            ))}
            <div className="absolute inset-0 bg-black/60" />
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
                {images.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrent(index)}
                        className={`h-2 rounded-full transition-all ${
                            index === current ? 'w-8 bg-white' : 'w-2 bg-white/50'
                        }`}
                    />
                ))}
            </div>
        </div>
    )
}
