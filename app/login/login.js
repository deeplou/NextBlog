"use client";
import { useState } from 'react';
import cnx from '@/components/cnx';
import styles from './login.module.css';

export default function Login() {
    const [loginState, setLoginState] = useState(null);
    const loginAPI = '/api/login';

    function login(e) {
        e.preventDefault();

        const form = e.target;
        const formData = new FormData(form);

        fetch(loginAPI, {
            method: 'POST',
            body: formData
        })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                setLoginState(data);
            })
            .catch(err => console.error(err));
    }

    function Message() {
        if (loginState) {
            const { msg, error } = loginState;

            return (
                msg ? <p className={cnx(styles.res, styles.ok)}>{msg}</p> : <p className={styles.res}>{error}</p>
            );
        }
        return null;
    }

    return (
        <div className={styles.login}>
            <h1>NextBlog Login</h1>
            <p>Log in to post your own blogs.</p>

            <form className={styles.loginform} onSubmit={login}>
                <input type="text" name="name" placeholder="Full Name" autoComplete='name' />
                <input type="email" name="email" placeholder="Email" autoComplete='email' />
                <button className={styles.formbtn}>Log In</button>
                <Message />
                <small className={styles.info}>An email will be sent to you with a secure login link.</small>
            </form>
        </div>
    );
}
