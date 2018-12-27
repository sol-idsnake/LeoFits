import UpdateItem from '../components/UpdateItem';

// destructure query from props
const Sell = ({ query }) => (
  <div>
    <UpdateItem id={query.id} />
  </div>
);

export default Sell;
