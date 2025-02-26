"use client";
import { useEffect, useRef, useState } from 'react';
import styles from './posts.module.css';
import cnx from '@/components/cnx';
import ucfirst from '@/components/ucfirst';
import Link from 'next/link';

export default function Posts({ initialPosts }) {
    const [posts, setPosts] = useState(initialPosts);
    const [showPC, setShowPC] = useState(false);
    const [posted, setPosted] = useState(posts.length > 0);
    const [cookiesbox, setCB] = useState(false);
    const pcTimeoutRef = useRef(null);
    const blogAPI = '/api/blog';

    useEffect(() => {
        if (!localStorage.getItem('cookies')) {
            setTimeout(() => {
                setCB(true);
            }, 1000);
        }
    }, []);

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            const form = e.target;
            const formData = new FormData(form);

            const res = await fetch(blogAPI, {
                method: 'POST',
                body: formData
            });
            const data = await res.json();

            setPosts(prevPosts => [data, ...prevPosts]);
            setPosted(true);

            setShowPC(true);
            if (pcTimeoutRef.current) {
                clearTimeout(pcTimeoutRef.current);
            }
            pcTimeoutRef.current = setTimeout(() => {
                setShowPC(false);
            }, 2000);
        } catch (error) {
            console.error(error);
        }
    }

    function truncateTable() {
        const formData = new FormData();
        formData.append('truncate', true);

        fetch(blogAPI, {
            method: 'POST',
            body: formData
        })
            .then(res => res.json())
            .then(data => {
                console.log(data.msg);
                setPosts([]);
            })
            .catch(err => console.error(err));
    }

    function acceptCookies() {
        localStorage.setItem('cookies', true);
        setCB(false);
    }

    const noPostsHTML = <div className={cnx(styles.post, styles.noposts)}>No posts yet.</div>;
    const postsHTML = posts.map(({ id, name, title, body, created_at }) => (
        <Link href={'/blog/' + id} className={styles.post} key={id}>
            <div className={styles.postheader}>
                <h2>{title}</h2>
                <p>Posted by {ucfirst(name)}</p>
                <p>{new Date(created_at).toLocaleDateString()} | {new Date(created_at).toLocaleTimeString()}</p>
            </div>
            <p className={styles.postbody}>{body}</p>
        </Link>
    ));

    const outputHTML = posts.length === 0 ? noPostsHTML : postsHTML;

    const pcStyles = showPC ? styles.postcreated : cnx(styles.hidepc, styles.postcreated);

    return (
        <div className={styles.blog}>
            <div className={styles.blogheader}>
                <h1 className={styles.welcome}>Welcome to NextBlog</h1>
                <p className={styles.nextproject}>Built using <img src='/next.svg' className={styles.nextlogo} alt="Next.js Logo" /></p>

                <div className={styles.techstack}>
                    <p>Responsive full-stack blog developed using:</p>
                    <ul className={styles.techlist}>
                        <li>Next.js 15</li>
                        <li>React 19</li>
                        <li>Powered by a PostgreSQL backend.</li>
                        <li>Authentication is excluded for demo purposes.</li>
                    </ul>
                </div>
            </div>

            <form className={styles.blogform} onSubmit={handleSubmit}>
                <h3>Create your first post</h3>
                <input type="text" name="name" placeholder="Full Name" autoComplete='name' />
                <input type='text' name='title' placeholder='Blog Title' required />
                <textarea name='body' placeholder='Blog Post' required></textarea>

                <div className={styles.formbtns}>
                    <button className={styles.formbtn} type='button' onClick={truncateTable} title='This button permanently deletes all posts.'>Delete All</button>
                    <button className={styles.formbtn} type='reset' title='Clears the form'>Reset</button>
                    <button className={styles.formbtn} type='submit' title='Submit your post'>Post</button>
                </div>
            </form>

            <div className={posted ? styles.postscont : styles.hide}>
                <div>
                    <h1>Blog Posts</h1>
                    <small>This data comes from a PostgreSQL database.</small>
                </div>
                <div className={styles.posts}>
                    {outputHTML}
                </div>
            </div>

            <span className={pcStyles}>Post created</span>

            <div className={cookiesbox ? styles.cookiebox : cnx(styles.cookiebox, styles.hidepc)}>
                This website uses cookies to ensure you get the best experience.
                <div className={styles.acceptbtns}>
                    <button className={cnx(styles.acceptbtn, styles.denybtn)} onClick={acceptCookies}>Deny</button>
                    <button className={styles.acceptbtn} onClick={acceptCookies}>Accept</button>
                </div>
            </div>
        </div>
    );
}
