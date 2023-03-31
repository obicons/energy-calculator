import Head from 'next/head'
import Link from 'next/link'
import styles from '@/styles/Home.module.css'
import siteName from '@/sitename';


export default function Home() {
    return (
        <>
            <Head>
            <title>Thanks</title>
                <meta name="description" content={`${siteName} -- which energy supplier is right for me?`} />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className={styles.main}>
                <div className={styles.contentwrapper}>
                    <div className={styles.question}>
                        Icon Credits:
                    </div>
                    <div className={styles.description}>
                        Icon by <a href="https://freeicons.io/profile/722">Fasil</a> on <a href="https://freeicons.io">freeicons.io</a>
                        <br/>
                        Icon by <a href="https://freeicons.io/profile/730">Anu Rocks</a> on <a href="https://freeicons.io">freeicons.io</a>
                        <br/>
                        Icon by <a href="https://freeicons.io/profile/3">icon king1</a> on <a href="https://freeicons.io">freeicons.io</a>
                        <br/>
                        Icon by <a href="https://freeicons.io/profile/104110">Sumit-7080</a> on <a href="https://freeicons.io">freeicons.io</a>
                    </div>
                </div>
                <div className={styles.footer}>
                Made by <a href="https://maxtaylor.dev" target="_blank">Max Taylor</a>.
                Copyright 2023.
                <div className={styles.credits}>
                    <Link href="/credits">Credits</Link>
                </div>
                </div>
            </main>
        </>
    );
}