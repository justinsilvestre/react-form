import Link from 'next/link'
import Layout from '../components/Layout'

const AboutPage = () => (
  <Layout title="React form component">
    <h1>About</h1>
    <p>Here's my solution.</p>
    <p>Thanks for having a look!</p>
    <p>
      <Link href="/">
        <a>Go home</a>
      </Link>
    </p>
  </Layout>
)

export default AboutPage
