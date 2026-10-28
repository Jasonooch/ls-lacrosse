import type { Metadata } from 'next'
import PageTitle from '@/components/ui/PageTitle/PageTitle'
import RsvpForm from './RsvpForm'
import styles from './rsvp.module.css'

/** One-off RSVP page for Ando Day. Answers are saved to Form Submissions as "ando-day-rsvp". */
const EVENT = {
  title: 'Ando Day',
  when: 'Friday, November 27, 2026 at 10:00 AM',
  where: 'Lincoln-Sudbury Regional High School',
  // Untick to stop taking RSVPs
  open: true,
}

export const metadata: Metadata = {
  title: `RSVP: ${EVENT.title} | LS Lacrosse`,
  description: `RSVP for ${EVENT.title}, ${EVENT.when} at ${EVENT.where}.`,
}

export default function AndoDayRsvp() {
  return (
    <section className="pt-[var(--item-gap)] pb-20">
      <div className="container">
        <div className={styles.titleWrap}>
          <PageTitle animateUnderline>{EVENT.title} RSVP</PageTitle>
          <p className={styles.when}>
            {EVENT.when} · {EVENT.where}
          </p>
        </div>

        <div className={styles.body}>
          <div className={styles.main}>
            {EVENT.open ? <RsvpForm /> : <p className={styles.closed}>RSVPs for {EVENT.title} are now closed.</p>}
          </div>

          <aside className={styles.aside}>
            <h2>{EVENT.title}</h2>
            <dl>
              <div>
                <dt>When</dt>
                <dd>{EVENT.when}</dd>
              </div>
              <div>
                <dt>Where</dt>
                <dd>{EVENT.where}</dd>
              </div>
            </dl>
          </aside>
        </div>
      </div>
    </section>
  )
}
