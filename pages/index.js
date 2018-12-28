import Items from '../components/Items';

const Home = props => {
  const { page } = props.query;
  return (
    <div>
      <Items page={parseFloat(page) || 1} />
    </div>
  );
};

export default Home;
