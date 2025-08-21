import React, { useState, useRef, useLayoutEffect } from 'react'

type AnimationType = 'infinite' | 'ping-pong'

interface MarqueeTextProps {
  children: React.ReactNode
  className?: string
  animationType?: AnimationType
  speed?: number
}

const MarqueeText: React.FC<MarqueeTextProps> = ({
  children,
  className,
  animationType = 'ping-pong',
  speed = 40
}) => {
  const [isOverflowing, setIsOverflowing] = useState(false)
  const [scrollDistance, setScrollDistance] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const container = containerRef.current
    if (container) {
      const isActuallyOverflowing =
        container.scrollWidth > container.clientWidth

      if (isActuallyOverflowing) {
        const distance = container.clientWidth - container.scrollWidth
        setScrollDistance(distance)
      }

      if (isActuallyOverflowing !== isOverflowing) {
        setIsOverflowing(isActuallyOverflowing)
      }
    }
  }, [children, isOverflowing])

  const duration = containerRef.current
    ? containerRef.current.scrollWidth / speed
    : 15

  const marqueeTextClass = {
    infinite: 'marquee-text',
    'ping-pong': 'marquee-ping-pong'
  }[animationType]

  const marqueeStyle = {
    '--marquee-scroll-distance': `${scrollDistance}px`,
    '--marquee-duration': `${duration}s`
  } as React.CSSProperties

  return (
    <div className={`marquee-wrapper ${className || ''}`}>
      <div
        ref={containerRef}
        className={`overflow-hidden whitespace-nowrap ${
          isOverflowing ? 'fade-edges' : ''
        }`}
      >
        <span
          className={`${
            isOverflowing ? marqueeTextClass : 'inline-block'
          } px-2`}
          style={isOverflowing ? marqueeStyle : {}}
        >
          {children}
        </span>
      </div>
    </div>
  )
}

export default MarqueeText
