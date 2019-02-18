import { shallow } from 'enzyme';
import ItemComponent from '../components/Item';

const fakeItem = {
  id: 'ABC123',
  title: 'Example Item',
  price: 1200,
  description: 'Lorem Ipsum',
  image: 'bla.jfif',
  largeImage: 'blaLarge.jfif',
};

describe('<Item/>', () => {
  it('renders and displays properly', () => {
    const wrapper = shallow(<ItemComponent item={fakeItem} />);
    // console.log(wrapper.debug());
    const PriceTag = wrapper.find('PriceTag');
    expect(PriceTag.children().text()).toBe('$12');
    expect(wrapper.find('Title a').text()).toBe(fakeItem.title);
  });
});
