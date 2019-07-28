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

export { CREATE_PIN_MUTATION };
