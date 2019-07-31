import gql from "graphql-tag";

const PIN_ADDED_SUBSCRIPTION = gql`
  subscription {
    pinAdded {
      _id
      createdAt
      title
      content
      image
      latitude
      longitude
      author {
        _id
        name
      }
      comments {
        text
        createdAt
        author {
          name
          picture
        }
      }
    }
  }
`;

const PIN_UPDATED_SUBSCRIPTION = gql`
  subscription {
    pinUpdated {
      _id
      createdAt
      title
      content
      image
      latitude
      longitude
      author {
        _id
        name
      }
      comments {
        text
        createdAt
        author {
          name
          picture
        }
      }
    }
  }
`;

const PIN_DELETED_SUBSCRIPTION = gql`
  subscription {
    pinDeleted {
      _id
    }
  }
`;

export {
  PIN_ADDED_SUBSCRIPTION,
  PIN_DELETED_SUBSCRIPTION,
  PIN_UPDATED_SUBSCRIPTION
};
