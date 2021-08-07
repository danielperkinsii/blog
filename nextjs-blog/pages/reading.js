import Layout from '../components/layout'
import utilStyles from '../styles/utils.module.css'

export default function Reading() {
    return (
        <>
            <Layout reading>
                <p className={`${utilStyles.paragraphXl}`}>A list of empowering and challenging books, blog posts, and articles.</p>
                <ul>
                    <li><a href='#'>Book 1</a></li>
                    <li><a href='#'>Book 2</a></li>
                    <li><a href='#'>Book 3</a></li>
                </ul>
            </Layout>
        </>
    )
}