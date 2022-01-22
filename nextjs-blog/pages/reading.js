import Layout from '../components/layout'

export default function Reading() {
    return (
        <>
            <Layout reading>
                <p className="text-red-500">A list of useful books, blog posts, and articles.</p>
                <ul>
                    <li><a href='https://copywritingcourse.com/content-creation-process/'>Copy Writing</a></li>
                    <li><a href='http://www.paulgraham.com/makersschedule.html'>Maker's Schedule, Manager's Schedule</a></li>
                    <li><a href='https://www.goodreads.com/book/show/34466963-why-we-sleep'>Why We Sleep</a></li>
                    <li><a href='https://www.goodreads.com/book/show/8146619-the-right-stuff'>The Right Stuff</a></li>
                    <li><a href='https://www.goodreads.com/book/show/2195464.What_I_Talk_About_When_I_Talk_About_Running'>What I Talk About When I Talk About Running</a></li>
                    <li><a href='https://www.goodreads.com/book/show/11275.The_Wind_Up_Bird_Chronicle'>The Wind-Up Bird Chronical</a></li>
                    <li><a href='https://johnnydecimal.com/'>Johnny Decimal Organization</a></li>
                    <li><a href='https://www.goodreads.com/book/show/1078.The_Good_Earth'>The Good Earth</a></li>
                </ul>
            </Layout>
        </>
    )
}