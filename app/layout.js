import Root from "@/components/root";
import Footer from "@/components/footer";
import "./globals.css";

export const metadata = {
    title: "NextBlog",
    description: "Stay updated with the latest trends, tutorials, and insights on Next.js and React. Build better web apps today!",
    keywords: ["Next.js", "React", "Web Development", "JavaScript", "Frontend"],
    author: "Enterprise Web Dev",
    robots: "index, follow",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>
                <Root>
                    {children}
                    <Footer />
                </Root>
            </body>
        </html>
    );
}
