import { GetServerSideProps } from "next"
import Link from "next/link"
import Layout from "../../components/Layout"

type Props = {
  color: string,
  fruit: string,
  name: string | null,
}

function KeywordsPage({ color, fruit, name }: Props) {
  return <Layout title="Hi there!">
    <h1>Hi there, {name || 'friend'}!</h1>
    <p>Here's something just for you!</p>
    <p>
      <img style={{ borderStyle: 'dashed', borderWidth: '1em', borderColor: color }} src={`https://keywordimg.com/420x420/${fruit}`} />
    </p>
    <p>
      <Link href="/">Back home</Link>
    </p>
  </Layout>
}

export const getServerSideProps : GetServerSideProps<Props> = async (context) => {

  const [color, fruit, name] = context.params?.keywords || []

  return { props: {
    color: color || 'orange',
    fruit: fruit || 'mango',
    name: name || null,
  } }
}

export default KeywordsPage