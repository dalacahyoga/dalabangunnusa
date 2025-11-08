import { useEffect, useRef, useState } from 'react'

const AnimateBox = ({ children, effect = 'fadeInUp', className = '' }) => {
  const [isVisible, setIsVisible] = useState(false)
  const elementRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
          }
        })
      },
      { threshold: 0.15 }
    )

    if (elementRef.current) {
      observer.observe(elementRef.current)
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current)
      }
    }
  }, [])

  return (
    <div
      ref={elementRef}
      className={`animate-box ${className} ${
        isVisible ? `${effect} animated-fast` : ''
      }`}
    >
      {children}
    </div>
  )
}

export default AnimateBox

