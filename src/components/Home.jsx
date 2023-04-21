
import Posts from './Posts';

function Home() {

  return (
    <div className="container-fluid">
      <Posts filter="all" />
    </div>
  )
}

export default Home;