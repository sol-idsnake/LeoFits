import React from 'react';
import Downshift, { resetIdCounter } from 'downshift';
import Router from 'next/router';
import { ApolloConsumer } from 'react-apollo';
import gql from 'graphql-tag';
import debounce from 'lodash.debounce';
import { DropDown, DropDownItem, SearchStyles } from './styles/DropDown';

const SEARCH_ITEMS_QUERY = gql`
  query SEARCH_ITEMS_QUERY($searchTerm: String!) {
    items(
      where: {
        OR: [
          # provided by prisma in prisma.graphql
          # search for itemWhereInput
          { title_contains: $searchTerm }
          { description_contains: $searchTerm }
        ]
      }
    ) {
      id
      image
      title
    }
  }
`;

function routeToItem(item) {
  Router.push({
    pathname: '/item',
    query: {
      id: item.id,
    },
  });
}

// Don't wrap search in Query, because it would fire on page load
// Need direct access to apollo client
class AutoComplete extends React.Component {
  state = {
    items: [],
    loading: false,
  };

  // debounce saves resources by firing once every 350ms during typing a search item in
  onChange = debounce(async (e, client) => {
    // turn loading on
    this.setState({ loading: true });

    // Manually query Apollo Client
    const res = await client.query({
      query: SEARCH_ITEMS_QUERY,
      variables: { searchTerm: e.target.value },
    });

    this.setState({ items: res.data.items, loading: false });
  }, 350);

  render() {
    const { items, loading } = this.state;
    resetIdCounter();

    return (
      <SearchStyles>
        {/* itemToString converts the title to a string when clicked and inserts it into the search bar */}
        <Downshift
          itemToString={item => (item === null ? '' : item.title)}
          onChange={routeToItem}
        >
          {/* destructured payload */}
          {({
            getInputProps,
            getItemProps,
            isOpen,
            inputValue,
            highlightedIndex,
          }) => (
            <div>
              <ApolloConsumer>
                {client => (
                  <input
                    type="search"
                    {...getInputProps({
                      type: 'Search',
                      placeholder: 'Search for an item',
                      id: 'search',
                      className: loading ? 'loading' : '',
                      onChange: e => {
                        // need to use persist() so that when debounce gets
                        // to e.target.value in the query the value still exists
                        e.persist();
                        this.onChange(e, client);
                      },
                    })}
                  />
                )}
              </ApolloConsumer>
              {/* Let's the search results disappear on focus change */}
              {isOpen && (
                <DropDown>
                  {items.map((item, index) => (
                    <DropDownItem
                      {...getItemProps({ item })}
                      key={item.id}
                      // provides styling in DropDown.js component
                      highlighted={index === highlightedIndex}
                    >
                      <img src={item.image} width="50" alt={item.title} />
                      {item.title}
                    </DropDownItem>
                  ))}
                  {!items.length && !loading && (
                    <DropDownItem>Nothing found for: {inputValue}</DropDownItem>
                  )}
                </DropDown>
              )}
            </div>
          )}
        </Downshift>
      </SearchStyles>
    );
  }
}

export default AutoComplete;
