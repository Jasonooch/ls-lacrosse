'use client'

import { useState } from 'react'
import styles from './rsvp.module.css'

type Status = 'idle' | 'submitting' | 'error'
type Saved = null | 'going' | 'notGoing'

const MAX_GUESTS = 20

export default function RsvpForm() {
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState<null | string>(null)
  const [saved, setSaved] = useState<Saved>(null)
  const [attending, setAttending] = useState<'going' | 'notGoing'>('going')
  const [bringingGuests, setBringingGuests] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const going = attending === 'going'

    // Bots fill every field; people never see this one
    if (data.get('website')) {
      setSaved(going ? 'going' : 'notGoing')
      return
    }

    const firstName = String(data.get('firstName') ?? '').trim()
    const lastName = String(data.get('lastName') ?? '').trim()
    const email = String(data.get('email') ?? '').trim().toLowerCase()
    const guests = going && bringingGuests ? Number(data.get('guestCount')) : 0
    if (going && bringingGuests && !(Number.isInteger(guests) && guests >= 1 && guests <= MAX_GUESTS)) {
      setError(`Please enter how many guests you are bringing (1 to ${MAX_GUESTS}).`)
      return
    }

    setStatus('submitting')
    setError(null)
    try {
      const res = await fetch('/api/form-submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formName: 'ando-day-rsvp',
          name: `${firstName} ${lastName}`.trim(),
          email,
          payload: {
            firstName,
            lastName,
            email,
            attending: going ? 'Going' : 'Not going',
            guests,
            totalAttending: going ? 1 + guests : 0,
          },
          sourcePage: '/events/ando-day/rsvp',
        }),
      })
      if (!res.ok) throw new Error('Submission failed')
      setStatus('idle')
      setSaved(going ? 'going' : 'notGoing')
    } catch {
      setStatus('error')
      setError('Something went wrong saving your RSVP. Please try again.')
    }
  }

  if (saved) {
    return (
      <div className={styles.done} role="status">
        <h2>{saved === 'going' ? 'You’re on the list' : 'Thanks for letting us know'}</h2>
        <p>
          {saved === 'going'
            ? 'We’ve got your RSVP. To change it, just fill out this form again.'
            : 'We’re sorry you can’t make it. If your plans change, fill out this form again.'}
        </p>
        <button type="button" onClick={() => setSaved(null)}>
          Change my answer
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.row}>
        <label className={styles.field}>
          First name
          <input name="firstName" autoComplete="given-name" required />
        </label>
        <label className={styles.field}>
          Last name
          <input name="lastName" autoComplete="family-name" required />
        </label>
      </div>
      <label className={styles.field}>
        Email
        <input name="email" type="email" autoComplete="email" required />
      </label>

      <fieldset>
        <legend>Will you be attending?</legend>
        <div className={styles.choices}>
          <label className={styles.choice}>
            <input
              type="radio"
              name="attending"
              checked={attending === 'going'}
              onChange={() => setAttending('going')}
            />
            Yes, I’ll be there
          </label>
          <label className={styles.choice}>
            <input
              type="radio"
              name="attending"
              checked={attending === 'notGoing'}
              onChange={() => setAttending('notGoing')}
            />
            No, I can’t make it
          </label>
        </div>
      </fieldset>

      {attending === 'going' && (
        <fieldset>
          <legend>Are you bringing guests?</legend>
          <div className={`${styles.choices} ${styles.inline}`}>
            <label className={styles.choice}>
              <input type="radio" name="bringingGuests" checked={bringingGuests} onChange={() => setBringingGuests(true)} />
              Yes
            </label>
            <label className={styles.choice}>
              <input
                type="radio"
                name="bringingGuests"
                checked={!bringingGuests}
                onChange={() => setBringingGuests(false)}
              />
              No
            </label>
          </div>
        </fieldset>
      )}

      {attending === 'going' && bringingGuests && (
        <label className={`${styles.field} ${styles.count}`}>
          How many guests?
          <input name="guestCount" type="number" min={1} max={MAX_GUESTS} inputMode="numeric" required />
          <small>Not counting yourself.</small>
        </label>
      )}

      {/* Honeypot: hidden from people, filled in by bots */}
      <div className={styles.hp} aria-hidden="true">
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}
      <button type="submit" className={styles.submit} disabled={status === 'submitting'}>
        {status === 'submitting' ? 'Sending…' : 'Send RSVP'}
      </button>
    </form>
  )
}
