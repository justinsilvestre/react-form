import { useCallback } from 'react'
import Layout from '../components/Layout'
import TextForm from '../components/TextForm'
import { useRouter } from 'next/router'

const FIELDS = [
  { name: 'name', label: 'Your name' },
  { name: 'email', label: 'E-mail address', validate: { email: true } },
  { name: 'favoriteColor', label: 'Favorite color', validate: { maxLength: 12, required: true } },
  { name: 'favoriteFruit', label: 'Favorite fruit', validate: { required: true } },
]

const IndexPage = () => {
  const router = useRouter()

  const handleSubmit = useCallback((fields: { [name: string]: string }) => {
    const { favoriteColor, favoriteFruit, name = '' } = fields
    router.push(`/submit/${favoriteColor}/${favoriteFruit}/${name}`)
  }, [])

  return (
    <Layout title="React form component">
      <TextForm fields={FIELDS} onSubmit={handleSubmit} />
    </Layout>
  )
}

export default IndexPage
