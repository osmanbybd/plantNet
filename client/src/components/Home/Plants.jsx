import Card from './Card'
import Container from '../Shared/Container'
import { useLoaderData } from 'react-router'
import EmptyState from '../Shared/EmptyState'

const Plants = () => {
  const plants = useLoaderData()
  console.log(plants)
  return (
    <Container>
    {
      plants?.length > 0 ? (
        <div className='my-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6'>
          {plants?.map((plant) => (
            <Card key={plant._id} plant={plant} />
          ))} 
        </div>
      ) : <EmptyState message='No Data Available Right Now!'></EmptyState>
    }
    </Container>
  )
}

export default Plants
