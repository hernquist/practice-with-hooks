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

export { CREATE_PIN_MUTATION, DELETE_PIN_MUTATION };
