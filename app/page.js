import Posts from "./blog/posts";

export default async function Blog() {
    const url = process.env.API_URL;
    console.log({ url });
    const res = await fetch(`${url}/api/blog`, { cache: 'no-store' });
    const data = await res.json();
    return <Posts initialPosts={data} />;
}
