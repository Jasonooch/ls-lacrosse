'use client'

import { useState } from 'react'
import Image from 'next/image'
import styles from './sticks.module.css'

export default function WematinSticksForm() {
  const [success, setSuccess] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    const form = e.currentTarget
    const data = Object.fromEntries(new FormData(form))

    try {
      const res = await fetch('/api/form-submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formName: 'wematin-sticks',
          name: `${data.First_Name} ${data.Last_Name}`.trim(),
          email: data.Email_Address,
          payload: data,
          sourcePage: '/wematin/wematin-sticks',
        }),
      })

      if (!res.ok) throw new Error('Submission failed')
      setSuccess(true)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {success ? (
        <div className={styles.formSuccess} style={{ display: 'flex' }}>
          <Image
            src="https://global.divhunt.com/b132c3ca1269550cac0d6f5ebe06cdf5_2464.svg"
            alt="Success"
            width={64}
            height={64}
            className={styles.successIcon}
          />
          <p className={styles.successTitle}>Success!</p>
          <p className={styles.successMessage}>
            We have received your message and will get back to you as soon as possible.
          </p>
        </div>
      ) : (
        <div className={styles.formFields}>
          <div className={styles.twoFields}>
            <div className={styles.inputField}>
              <label htmlFor="First_Name" className={styles.label}>First Name</label>
              <input type="text" name="First_Name" id="First_Name" placeholder="First Name" required className={styles.input} />
            </div>
            <div className={styles.inputField}>
              <label htmlFor="Last_Name" className={styles.label}>Last Name</label>
              <input type="text" name="Last_Name" id="Last_Name" placeholder="Last Name" required className={styles.input} />
            </div>
          </div>

          <div className={styles.inputField}>
            <label htmlFor="Email_Address" className={styles.label}>Email Address</label>
            <input type="email" name="Email_Address" id="Email_Address" placeholder="Email Address" required className={styles.input} />
          </div>

          <div className={styles.twoFields}>
            <div className={styles.inputField}>
              <label htmlFor="LS_Grad_Year" className={styles.label}>LS Grad Year</label>
              <input type="text" name="LS_Grad_Year" id="LS_Grad_Year" placeholder="YYYY" required className={styles.input} />
            </div>
          </div>

          <div className={styles.inputField}>
            <label htmlFor="College_Attended" className={styles.label}>College Attended</label>
            <input type="text" name="College_Attended" id="College_Attended" placeholder="College" required className={styles.input} />
          </div>

          <div className={styles.twoFields}>
            <div className={styles.inputField}>
              <label htmlFor="Job_Title" className={styles.label}>Job Title</label>
              <input type="text" name="Job_Title" id="Job_Title" placeholder="Job Title" required className={styles.input} />
            </div>
            <div className={styles.inputField}>
              <label htmlFor="Company_Name" className={styles.label}>Company Name</label>
              <input type="text" name="Company_Name" id="Company_Name" placeholder="Company Name" required className={styles.input} />
            </div>
          </div>

          <div className={styles.inputField}>
            <label htmlFor="Phone_Number" className={styles.label}>Phone Number</label>
            <input type="tel" name="Phone_Number" id="Phone_Number" placeholder="( _ _ _ ) _ _ _ - _ _ _ _" required className={styles.input} />
          </div>

          <div className={styles.twoFields}>
            <div className={styles.inputField}>
              <label htmlFor="Contacted_By" className={styles.label}>I Prefer To Be Contacted By...</label>
              <select name="Contacted_By" id="Contacted_By" required className={styles.select}>
                <option value="" disabled>Select Method</option>
                <option value="Email">Email</option>
                <option value="Phone Call">Phone Call</option>
                <option value="Text">Text</option>
              </select>
            </div>
            <div className={styles.inputField}>
              <label htmlFor="Best_Time" className={styles.label}>Best Time of Day to be Contacted</label>
              <select name="Best_Time" id="Best_Time" required className={styles.select}>
                <option value="" disabled>Select Time</option>
                <option value="Morning (9AM - 12PM)">Morning (9AM - 12PM)</option>
                <option value="Afternoon (12PM - 5PM)">Afternoon (12PM - 5PM)</option>
                <option value="Evening (5PM - 9PM)">Evening (5PM - 9PM)</option>
              </select>
            </div>
          </div>

          {error && <p style={{ color: 'var(--color-error)', fontSize: '14px' }}>{error}</p>}

          <div className={styles.submitWrapper}>
            <button type="submit" disabled={submitting} className={styles.submitButton}>
              {submitting ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </div>
      )}
    </form>
  )
}
