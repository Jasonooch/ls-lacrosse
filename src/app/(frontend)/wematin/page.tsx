import styles from './wematin.module.css';
import PageTitle from '@/components/ui/PageTitle/PageTitle';
import Image from 'next/image';
import WematinLogo from '@/public/images/WematinLogo.png';
import andoDay from '@/public/images/andoDay.webp';

const coreValueParagraphs = [
  '“WEMATIN” is the Algonquin word for brotherhood; at LS, it is a one-word synonym for our value of character, community and culture.',
  'The LS Lacrosse brotherhood embodies more than just the players on the current team’s roster. It embodies the shared commitment of the high school players, the youth program, the alumni and the families of the players.',
  'On the field, with the support of families and alumni, players strive for excellence and put the team first. Off the field, players are first to serve in the youth program and through various community services endeavors.',
  'The spirit of “WEMATIN” is the shared commitment of everyone in the LS Lacrosse program- the present, the past and the future.',
];

export default function Wematin() {
  return (
    <section className={'pt-[var(--item-gap)] pb-20'}>
        <div className='container'>
            <div className={styles.main}>
                <div className={styles.titleWrap}>
                  <PageTitle animateUnderline>Wematin</PageTitle>
                </div>
                <div className="contain">
                    <div className={styles.grid}>
                        <div className={styles.leftCol}>
                            <div className={styles.textWrapper}>
                              {coreValueParagraphs.map((paragraph) => (
                                <p key={paragraph}>{paragraph}</p>
                              ))}
                            </div>
                            <div className={styles.logoWrapper}>
                                <Image src={WematinLogo} alt="Wematin Logo" height={80} className={styles.logo}/>
                            </div>
                        </div>
                        <div className={styles.rightCol}>
                            <div className={styles.mediaWrapper}>
                                <Image src={andoDay} alt="Ando Day" fill className={styles.media} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
  );
}
