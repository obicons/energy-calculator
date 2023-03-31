import Link from 'next/link';
import styles from '@/styles/Home.module.css';


export const Footer = (): JSX.Element => (
    <div className={styles.footer}>
    Made by <a href="https://maxtaylor.dev" target="_blank">Max Taylor</a>.
    Contact: <a href="mailto:contact@ohioenergyrx.com">contact@ohioenergyrx.com</a>.
    Copyright 2023.
    <div className={styles.credits}>
      <Link href="/credits">Credits</Link>
    </div>
  </div>
);
