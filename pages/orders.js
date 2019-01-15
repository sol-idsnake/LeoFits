import PleaseSignIn from '../components/PleaseSignIn';
import OrderList from '../components/Order';

const OrderPage = props => (
  <div>
    <PleaseSignIn>
      <OrderList />
    </PleaseSignIn>
  </div>
);

export default OrderPage;
