import { gql } from '@apollo/client';

export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;


export const ADD_USER = gql`
  mutation addUser($username:String!, $email:String!, $password:String!) {
    addUser(username: $username, email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;
export const SAVE_BOOK = gql`
  mutation Mutation($input: BookInput) {
  saveBook(input: $input) {
    _id
    bookCount
    email
    savedBooks {
      bookId
      authors
      description
      title
      image
      link
    }
    username
  }
}
`;
export const REMOVE_BOOK = gql`
mutation Mutation($bookId: String!) {
  removeBook(bookId: $bookId) {
    _id
    bookCount
    email
    username
    savedBooks {
      authors
      bookId
      description
      image
      link
      title
    }
  }
}
`;
