const ME_QUERY = `
  {
    me {
      _id
      name
      picture
      email
    }
  }
`;

const GET_PINS_QUERY = `
  {
    getPins {
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
      comments {
        text
        createdAt
        author {
          _id
          name
          picture
        }
      }
    }
  }
`;

export { ME_QUERY, GET_PINS_QUERY };
