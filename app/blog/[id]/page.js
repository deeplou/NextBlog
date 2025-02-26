import { redirect } from "next/navigation";
import styles from './post.module.css';
import ucfirst from "@/components/ucfirst";

export default async function Post({ params }) {
    const { id } = await params;
    const url = process.env.API_URL;

    try {
        const formData = new FormData();
        formData.append('id', id);

        const res = await fetch(url + '/api/post', {
            method: 'POST',
            body: formData
        });
        const data = await res.json();

        const { name, title, body, created_at } = data;

        return (
            <div className={styles.posts}>
                <h1>Post ID: {id}</h1>

                <div className={styles.post}>
                    <div className={styles.postheader}>
                        <h2>{title}</h2>
                        <p>Posted by {ucfirst(name)}</p>
                        <p>{new Date(created_at).toLocaleDateString()} | {new Date(created_at).toLocaleTimeString()}</p>
                    </div>
                    <p className={styles.postbody}>{body}</p>
                </div>
            </div>
        );
    } catch (error) {
        redirect('/');
    }
}
