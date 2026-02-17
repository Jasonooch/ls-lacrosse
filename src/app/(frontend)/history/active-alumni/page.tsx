import styles from '../../under-construction/underConstruction.module.css'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function ActiveAlumni() {
    return (
        <section className={styles.main}>
            <div className={styles.overlay}></div>
            <div className='container h-full'>
               <div className={styles.flexWrap}>
                    <div className={styles.contentWrapper}>
                        <h1 className={styles.heading}>Under Construction</h1>
                        <span className={styles.text}>We are in the process of updating our website and records. Please check back later!</span>
                        <Link href='/'>
                            <Button
                            children='Go Back'
                            size='lg' />
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    )
}
