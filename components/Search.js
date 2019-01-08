import React from "react";
import Downshift from "downshift";
import Router from "next/router";
import { ApolloConsumer } from "react-adopt";
import gql from "graphql-tag";
import debounce from "lodash.debounce";
import { DropDown, DropDownItem, SearchStyles } from "./styles/DropDown";

const SEARCH_ITEMS_QUERY = gql`
  query SEARCH_ITEMS_QUERY($searchTerm: String!) {
    item(
      where: { title_contains: $searchTerm, description_contains: $searchTerm }
    )
  }
`;

class AutoComplete extends React.Component {
  render() {
    return (
      <SearchStyles>
        <div>
          <input type="search" />
          <DropDown>
            <p>Items will go here</p>
          </DropDown>
        </div>
      </SearchStyles>
    );
  }
}

export default AutoComplete;
