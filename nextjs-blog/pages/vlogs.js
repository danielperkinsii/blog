import Layout from '../components/layout'
import VlogCard from '../components/vlogCard'
import { getSortedVlogsData } from '../lib/vlogs'

export default function Reading() {
    const vlogs = getSortedVlogsData()

    return (
        <Layout>
            <div className="max-w-4xl mx-auto px-4 py-8">
                <h1 className="text-4xl font-bold text-center mb-2 text-gray-900">
                    My Vlogs
                </h1>
                <p className="text-md text-gray-900 text-center mb-12 max-w-2xl mx-auto">
                    Running Vlogs from my Passion Project, The Life in Stride Podcast.
                </p>
                <div className="space-y-8">
                    {vlogs.map((vlog) => (
                        <VlogCard key={vlog.id} vlog={vlog} />
                    ))}
                </div>
            </div>
        </Layout>
    )
}