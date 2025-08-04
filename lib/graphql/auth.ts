import { gql } from "@apollo/client";

// export const LOGIN_MUTATION = gql`
//   mutation Login($input: LoginInput!) {
//     login(input: $input) {
//       user {
//         email
//         phone
//         source
//         password
//       }
//       // token
//     }
//   }
// `;

export const LOGIN_MUTATION = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      user {
        id
        email
        name
        role
        schoolId
      }
      access_token
      refresh_token
    }
  }
`;

export const REGISTER_MUTATION = gql`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      user {
        id
        email
        name
        role
      }
      token
    }
  }
`;

export const REFRESH_TOKENS_MUTATION = gql`
  mutation RefreshToken($refreshToken: String!) {
    refreshTokens(refreshToken: $refreshToken) {
      access_token
      refresh_token
    }
  }
`;
