import Layout from '../components/layout'
import utilStyles from '../styles/utils.module.css'

export default function About() {
    return (
        <>
            <Layout about>
                <p className={`${utilStyles.paragraphXl}`}>Hi, I'm Daniel.</p>
            </Layout>
        </>
    )
}