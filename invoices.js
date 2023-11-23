import http from 'k6/http';

const serverUrl = 'https://demo-open.msupply.org:8000/graphql';
const query = `
query invoices($storeId: String!, $first: Int, $offset: Int) {
    invoices(
      storeId: $storeId
      filter: {type: {equalTo: OUTBOUND_SHIPMENT}}
      page: {first: $first, offset: $offset}
    ) {
      ... on InvoiceConnector {
        nodes {
          invoiceNumber
          comment
          theirReference
          createdDatetime
          deliveredDatetime
          verifiedDatetime
          shippedDatetime
          lines {
            nodes {
              batch
              expiryDate
              packSize
              sellPricePerPack
              numberOfPacks
              totalAfterTax
              itemCode
              itemName
              item {
                unitName
              }
              stockLine {
                barcode
              }
              pricing {
                totalAfterTax
              }
            }
          }
          pricing {
            totalAfterTax
          }
        }
        totalCount
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
  Authorization:
    'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE3MDA3MDcyMTUsImF1ZCI6IkFwaSIsImlhdCI6MTcwMDcwMzYxNSwiaXNzIjoib20tc3VwcGx5LXJlbW90ZS1zZXJ2ZXIiLCJzdWIiOiIwNzYzRTJFMzA1M0Q0QzQ3OEUxRTZCNkIwM0ZFQzIwNyJ9.KYQyL2pECB9j2hhf5d4xXocLmZki_RC8j02WgxP8pdw',
};

export const options = {
  scenarios: {
    contacts: {
      executor: 'ramping-vus',
      startVUs: 10,
      stages: [{ duration: '30s', target: 250 }],
      gracefulRampDown: '0s',
    },
  },
};

export default function () {
  //   const res = http.post(
  //     serverUrl,
  //     JSON.stringify({
  //       query: authQuery,
  //       variables: {
  //         username: '---',
  //         password: '---',
  //       },
  //     }),
  //     { headers }
  //   );
  //   const token = res.json('data.authToken.token');
  //   headers.Authorization = `Bearer ${token}`;

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
  //   console.log(response.body);
  if (response.json('data.invoices.totalCount') === undefined) {
    throw new Error('Something has gone wrong!!!', response.body);
  }
}
