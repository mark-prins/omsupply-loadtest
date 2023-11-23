import http from 'k6/http';

const serverUrl = 'https://demo-open.msupply.org:8000/graphql';
const query = `
query stockLines($first: Int, $offset: Int, $key: StockLineSortFieldInput!, $desc: Boolean, $filter: StockLineFilterInput, $storeId: String!) {
    stockLines(
      storeId: $storeId
      filter: $filter
      page: {first: $first, offset: $offset}
      sort: {key: $key, desc: $desc}
    ) {
      ... on StockLineConnector {
        __typename
        nodes {
          __typename
          ...StockLineRow
        }
        totalCount
      }
    }
  }
  
  fragment StockLineRow on StockLineNode {
    availableNumberOfPacks
    batch
    costPricePerPack
    expiryDate
    id
    itemId
    locationId
    locationName
    onHold
    packSize
    sellPricePerPack
    storeId
    totalNumberOfPacks
    supplierName
    location {
      ...LocationRow
    }
    item {
      code
      name
      unitName
    }
    barcode
  }
  
  fragment LocationRow on LocationNode {
    __typename
    id
    name
    onHold
    code
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
  //     'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2OTk1MTMwNzEsImF1ZCI6IkFwaSIsImlhdCI6MTY5OTUwOTQ3MSwiaXNzIjoib20tc3VwcGx5LXJlbW90ZS1zZXJ2ZXIiLCJzdWIiOiIwNzYzRTJFMzA1M0Q0QzQ3OEUxRTZCNkIwM0ZFQzIwNyJ9.i_Z3DJiEtaBLBF_-h6qj4oc8lyOB1CzUegZYmKWPszQ',
};

export default function () {
  const res = http.post(
    serverUrl,
    JSON.stringify({
      query: authQuery,
      variables: {
        username: 'Admin',
        password: 'pass',
      },
    }),
    { headers }
  );
  const token = res.json('data.authToken.token');
  headers.Authorization = `Bearer ${token}`;
  //   console.log(res.body);

  const response = http.post(
    serverUrl,
    JSON.stringify({
      query,
      variables: {
        storeId: '3934979D64934D12A1757BA65F07931D',
        first: 500,
        offset: 0,
        key: 'expiryDate',
        desc: true,
        filter: {
          hasPacksInStore: true,
        },
      },
    }),
    { headers }
  );
  console.log(response.body);
}
