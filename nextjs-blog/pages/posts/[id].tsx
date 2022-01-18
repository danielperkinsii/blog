import Layout from '../../components/layout'
import { getAllPostIds, getPostData } from '../../lib/posts'
import Head from 'next/head'
import Date from '../../components/date'
import { GetStaticProps, GetStaticPaths } from 'next'

export default function Post({
  postData 
}: {
  postData: {
    title: string
    date: string
    contentHtml: string
  }
}) {
  console.log(postData.contentHtml)
  return (
    <Layout>
      <Head>
        <title>{postData.title}</title>
      </Head>
      <article className="max-w-md">
        <h1 className="font-semibold text-2xl pt-2">{postData.title}</h1>
        <div className="pb-2">
          <Date dateString={postData.date}/>
        </div>
        <div className="style-none" dangerouslySetInnerHTML={{ __html: postData.contentHtml }}/>
      </article>
    </Layout>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
    const paths = getAllPostIds()
    return {
      paths,
      fallback: false
    }
  }

  export const getStaticProps: GetStaticProps = async ({ params }) => {
    const postData = await getPostData(params?.id as string)
    return {
      props: {
        postData
      }
    }
  }