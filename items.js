import http from 'k6/http';

const serverUrl = 'https://demo-open.msupply.org:8000/graphql';
const query = `
query items($storeId: String!, $first:Int, $offset:Int) {
  items(storeId: $storeId, page: {first: $first, offset: $offset}) {
    ... on ItemConnector {
      nodes {
        code
        id
        name
      }
    }
  }
}
`;

const authQuery = `
query authToken($username: String!, $password: String!) {
    authToken(password: $password, username: $username) {
      ... on AuthToken {
        __typename
        token
      }
    }
  }
`;

const headers = {
  'Content-Type': 'application/json',
  Authorization: '',
};

export default function () {
  const res = http.post(
    serverUrl,
    JSON.stringify({
      query: authQuery,
      variables: {
        username: '---',
        password: '---',
      },
    }),
    { headers }
  );
  const token = res.json('data.authToken.token');
  headers.Authorization = `Bearer ${token}`;

  const response = http.post(
    serverUrl,
    JSON.stringify({
      query,
      variables: {
        storeId: '3934979D64934D12A1757BA65F07931D',
        first: 500,
        offset: 0,
      },
    }),
    { headers }
  );
  console.log(response.body);
}
