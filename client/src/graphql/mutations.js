const CREATE_PIN_MUTATION = `
  mutation($input: CreatePinInput!) {
    createPin(input: $input){
      _id
      createdAt
      title
      image
      content
      latitude
      longitude
      author {
        _id
        name
        email
        picture
      }
    }
  }
`;

const DELETE_PIN_MUTATION = `
  mutation($pinId: ID!) {
    deletePin(pinId: $pinId) {
      _id
    }
  }
`;

const CREATE_COMMENT_MUTATION = `
  mutation($pinId: ID!, $text: String!) {
    createComment(pinId: $pinId, text: $text) {
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

export { CREATE_PIN_MUTATION, DELETE_PIN_MUTATION, CREATE_COMMENT_MUTATION };
