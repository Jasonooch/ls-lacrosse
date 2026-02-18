import styles from './sticks.module.css';
import PageTitle from '@/components/ui/PageTitle/PageTitle';
import WematinSticksForm from './WematinSticksForm';

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
                    There will be grade representatives that will handle initial conversations with young alumni. The grade representatives will serve as a link between the young alumni, and the appropriate mentors based on the Young Alumni&apos;s goals/preferences.
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
                      The objective of brainstorming in any way they can be of service. Must have a &quot;How can I help?&quot; mentality
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
                      If you&apos;re an LS lacrosse alum or community member passionate about mentorship and networking, we invite you to join Wematin Sticks. Sign up today to connect, support, and grow with fellow LS lacrosse alumni.
                    </p>
                  </div>
                  <div className={styles.formContainer}>
                    <WematinSticksForm />
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
