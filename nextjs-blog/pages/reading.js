import Layout from '../components/layout'
import VlogCard from '../components/vlogCard'
import { getSortedVlogsData } from '../lib/vlogs'

export default function Reading() {
    const vlogs = getSortedVlogsData()

    return (
        <Layout>
            <div className="max-w-4xl mx-auto px-4 py-8">
                <h1 className="text-4xl font-bold text-center mb-8 text-gray-900">
                    My Vlogs
                </h1>
                <p className="text-lg text-gray-600 text-center mb-12 max-w-2xl mx-auto">
                    Check out my latest video content where I share insights, tutorials, and thoughts on web development and technology.
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