import styles from './sticks.module.css';
import PageTitle from '@/components/ui/PageTitle/PageTitle';

export default function WematinSticks() {
  return (
    <section className={'pt-[var(--item-gap)] pb-20'}>
      <div className='container'>
        <div className={styles.main}>
          <div className="contain">
            <div className={styles.content}>
              {/* Page Title */}
              <div className={styles.titleWrap}>
                <PageTitle animateUnderline>Wematin Sticks</PageTitle>
              </div>
              {/* Introduction */}
              <div className={styles.intro}>
                <p>
                  The Wematin Sticks is a group of LS lacrosse alumni and community members that was created to serve individuals through the power of networking.
                </p>
                <p>
                  Young LS lacrosse alumni are paired with mentors to help them through the career development process, while all members of Wematin Sticks have a platform to connect with other passionate LS lacrosse alumni interested in helping each other personally and professionally.
                </p>
              </div>

              {/* Process Section */}
              <div className={styles.section}>
                <h2 className={styles.sectionHeading}>PROCESS</h2>
                <div className={styles.sectionContent}>
                  <p>
                    All members of the LS lacrosse family interested in being a mentor should fill out the form below.
                  </p>
                  <p>
                    There will be grade representatives that will handle initial conversations with young alumni. The grade representatives will serve as a link between the young alumni, and the appropriate mentors based on the Young Alumni's goals/preferences.
                  </p>
                  <p>
                    A group platform will be created so that all members can efficiently connect with each other.
                  </p>
                </div>
              </div>

              {/* Criteria Section */}
              <div className={styles.section}>
                <h2 className={styles.sectionHeading}>CRITERIA</h2>
                <div className={styles.sectionContent}>
                  <ul className={styles.criteriaList}>
                    <li>A passion to serve members of the LS lacrosse community</li>
                    <li>
                      Willingness to give their time and take a 15-30 minute phone call with a member of the community that has been paired with you (current college player, or alumni out of school).
                    </li>
                    <li>
                      The objective of brainstorming in any way they can be of service. Must have a "How can I help?" mentality
                    </li>
                    <li>
                      An ability and desire to take action by opening their network, creating introductions, and making recommendations on behalf of the community member.
                    </li>
                  </ul>

                  <div className={styles.menteeSection}>
                    <h3 className={styles.subsectionHeading}>Mentee should be:</h3>
                    <ul className={styles.criteriaList}>
                      <li>Young alumni of the community</li>
                      <li>
                        Willing to take on the responsibility of being diligent throughout the mentor/mentee process
                      </li>
                      <li>
                        Passionate about putting their best forward in all opportunities that are created for them
                      </li>
                      <li>
                        A beacon of the LS lacrosse community, representing the Wematin mentality
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Sign Up Section */}
              <div className={styles.signUpSection}>
                <h2 className={styles.signUpHeading}>Sign Up</h2>
                <div className={styles.signUpContent}>
                  <div className={styles.signUpText}>
                    <p>
                      If you're an LS lacrosse alum or community member passionate about mentorship and networking, we invite you to join Wematin Sticks. Sign up today to connect, support, and grow with fellow LS lacrosse alumni.
                    </p>
                  </div>
                  <div className={styles.formContainer}>
                    <form method="POST" className={styles.form}>
                      {/* Success State */}
                      <div className={styles.formSuccess}>
                        <img
                          src="https://global.divhunt.com/b132c3ca1269550cac0d6f5ebe06cdf5_2464.svg"
                          alt="Success"
                          className={styles.successIcon}
                        />
                        <p className={styles.successTitle}>Success!</p>
                        <p className={styles.successMessage}>
                          We have received your message and will get back to you as soon as possible.
                        </p>
                      </div>

                      {/* Form Fields */}
                      <div className={styles.formFields}>
                        {/* First Name and Last Name */}
                        <div className={styles.twoFields}>
                          <div className={styles.inputField}>
                            <label htmlFor="First_Name" className={styles.label}>First Name</label>
                            <input
                              type="text"
                              name="First_Name"
                              id="First_Name"
                              placeholder="First Name"
                              className={styles.input}
                            />
                          </div>
                          <div className={styles.inputField}>
                            <label htmlFor="Last_Name" className={styles.label}>Last Name</label>
                            <input
                              type="text"
                              name="Last_Name"
                              id="Last_Name"
                              placeholder="Last Name"
                              className={styles.input}
                            />
                          </div>
                        </div>

                        {/* Email Address */}
                        <div className={styles.inputField}>
                          <label htmlFor="Email_Address" className={styles.label}>Email Address</label>
                          <input
                            type="email"
                            name="Email_Address"
                            id="Email_Address"
                            placeholder="Email Address"
                            className={styles.input}
                          />
                        </div>

                        {/* LS Grad Year */}
                        <div className={styles.twoFields}>
                          <div className={styles.inputField}>
                            <label htmlFor="LS_Grad_Year" className={styles.label}>LS Grad Year</label>
                            <input
                              type="text"
                              name="LS_Grad_Year"
                              id="LS_Grad_Year"
                              placeholder="YYYY"
                              className={styles.input}
                            />
                          </div>
                        </div>

                        {/* College Attended */}
                        <div className={styles.inputField}>
                          <label htmlFor="College_Attended" className={styles.label}>College Attended</label>
                          <input
                            type="text"
                            name="College_Attended"
                            id="College_Attended"
                            placeholder="College"
                            className={styles.input}
                          />
                        </div>

                        {/* Job Title and Company Name */}
                        <div className={styles.twoFields}>
                          <div className={styles.inputField}>
                            <label htmlFor="Job_Title" className={styles.label}>Job Title</label>
                            <input
                              type="text"
                              name="Job_Title"
                              id="Job_Title"
                              placeholder="Job Title"
                              required
                              className={styles.input}
                            />
                          </div>
                          <div className={styles.inputField}>
                            <label htmlFor="Company_Name" className={styles.label}>Company Name</label>
                            <input
                              type="text"
                              name="Company_Name"
                              id="Company_Name"
                              placeholder="Company Name"
                              required
                              className={styles.input}
                            />
                          </div>
                        </div>

                        {/* Phone Number */}
                        <div className={styles.inputField}>
                          <label htmlFor="Phone_Number" className={styles.label}>Phone Number</label>
                          <input
                            type="tel"
                            name="Phone_Number"
                            id="Phone_Number"
                            placeholder="( _ _ _ ) _ _ _ - _ _ _ _"
                            required
                            className={styles.input}
                          />
                        </div>

                        {/* Contact Preferences */}
                        <div className={styles.twoFields}>
                          <div className={styles.inputField}>
                            <label htmlFor="Contacted_By" className={styles.label}>I Prefer To Be Contacted By...</label>
                            <select
                              name="Contacted_By"
                              id="Contacted_By"
                              required
                              className={styles.select}
                            >
                              <option value="" disabled selected>Select Method</option>
                              <option value="Email">Email</option>
                              <option value="Phone Call">Phone Call</option>
                              <option value="Text">Text</option>
                            </select>
                          </div>
                          <div className={styles.inputField}>
                            <label htmlFor="Best_Time" className={styles.label}>Best Time of Day to be Contacted</label>
                            <select
                              name="Best_Time"
                              id="Best_Time"
                              className={styles.select}
                            >
                              <option value="" disabled selected>Select Method</option>
                              <option value="Morning (9AM - 12PM)">Morning (9AM - 12PM)</option>
                              <option value="Afternoon (12PM - 5PM)">Afternoon (12PM - 5PM)</option>
                              <option value="Evening (5PM - 9PM)">Evening (5PM - 9PM)</option>
                            </select>
                          </div>
                        </div>

                        {/* Submit Button */}
                        <div className={styles.submitWrapper}>
                          <button type="submit" className={styles.submitButton}>
                            Submit
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
