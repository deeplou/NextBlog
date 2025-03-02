"use client";
import { useEffect, useRef, useState } from 'react';
import styles from './posts.module.css';
import cnx from '@/components/cnx';
import ucfirst from '@/components/ucfirst';
import Link from 'next/link';

export default function Posts({ initialPosts }) {
    const [posts, setPosts] = useState(initialPosts);
    const [showPC, setShowPC] = useState(false);
    const [posted, setPosted] = useState(initialPosts.length > 0);
    const [cookiesBox, setCB] = useState(false);
    const pcTimeoutRef = useRef(null);
    const blogAPI = '/api/blog';

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

            if (pcTimeoutRef.current) clearTimeout(pcTimeoutRef.current);
            pcTimeoutRef.current = setTimeout(() => setShowPC(false), 2000);
        } catch (error) {
            console.error(error);
        }
    }

    function truncateTable() {
        if (confirm('Are you sure you want to delete all posts? (Irreversible)')) {
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
    }

    function acceptCookies(e) {
        const btn = e.target;
        const btnOption = btn.innerText === 'Accept';

        localStorage.setItem('cookies', btnOption);
        setCB(false);
    }

    async function delPost(e, id) {
        e.preventDefault();

        if (confirm('Are you sure you want to delete this post?')) {
            const formData = new FormData();
            formData.append('deletePost', true);
            formData.append('postId', id);

            const res = await fetch(blogAPI, {
                method: 'POST',
                body: formData
            });
            const data = await res.json();

            console.log(data);

            const res2 = await fetch(blogAPI);
            const data2 = await res2.json();
            setPosts(data2);
        }
    }

    useEffect(() => {
        if (!localStorage.getItem('cookies')) {
            setTimeout(() => setCB(true), 500);
        }
    }, []);

    const outputHTML = posts.length === 0 ? <div className={cnx(styles.post, styles.noposts)}>No posts yet.</div> :
        posts.map(({ id, name, title, body, created_at }) => (
            <Link href={'/blog/' + id} className={styles.post} key={id}>
                <div className={styles.postheader}>
                    <h2>{title}</h2>
                    <p>Posted by {ucfirst(name)}</p>
                    <p>{new Date(created_at).toLocaleDateString()} | {new Date(created_at).toLocaleTimeString()}</p>
                    <img src="/delete.png" alt="Delete Post" className={styles.delbtn} title='Delete Post' onClick={e => delPost(e, id)} />
                </div>
                <p className={styles.postbody}>{body}</p>
            </Link>
        ));

    const pcStyles = showPC ? styles.postcreated : cnx(styles.postcreated, styles.hidepc);

    return (
        <div className={styles.blog}>
            <div className={styles.blogheader}>
                <h1 className={styles.welcome}>Welcome to NextBlog</h1>
                <p className={styles.nextproject}>Built using <img src='/next.svg' className={styles.nextlogo} alt="Next.js Logo" /></p>
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

            <div className={cookiesBox ? styles.cookiesbox : cnx(styles.cookiesbox, styles.hidepc)}>
                We use cookies and similar technologies to deliver, maintain, improve our services and for security purposes.
                <div className={styles.acceptbtns}>
                    <button className={cnx(styles.acceptbtn, styles.denybtn)} onClick={acceptCookies}>Reject</button>
                    <button className={styles.acceptbtn} onClick={acceptCookies}>Accept</button>
                </div>
            </div>
        </div>
    );
}
