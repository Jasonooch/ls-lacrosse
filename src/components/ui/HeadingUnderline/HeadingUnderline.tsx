import type { ReactNode } from 'react'
import styles from './HeadingUnderline.module.css'
import { Separator } from '../separator'

interface HeadingUnderlineProps {
  children: ReactNode
}

const HeadingUnderline = ({ children }: HeadingUnderlineProps) => {
  return (
    <div className="w-full flex flex-col items-start mb-4">
      <h2 className={styles.heading}>{children}</h2>
      <Separator />
    </div>
  )
}

export default HeadingUnderline
