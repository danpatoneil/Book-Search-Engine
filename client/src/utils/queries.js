import { gql } from '@apollo/client';

export const GET_ME = gql`
query Query {
  me {
    _id
    bookCount
    email
    savedBooks {
      link
      authors
      bookId
      description
      image
      title
    }
    username
  }
}
`;
