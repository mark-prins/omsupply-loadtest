import http from 'k6/http';

export const options = {
  scenarios: {
    contacts: {
      executor: 'ramping-vus',
      startVUs: 10,
      stages: [
        { duration: '30s', target: 300 },
        { duration: '10s', target: 10 },
      ],
      gracefulRampDown: '0s',
    },
  },
};

export default function () {
  const base_url = 'https://demo-open.msupply.org:2048/api/v4/';
  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  const vuJar = http.cookieJar();
  vuJar.set(
    base_url,
    'mSupplyJWT',
    'eyJhbGciOiJub25lIn0.eyJzZXJ2aWNlIjoiaW52b2ljZSIsInN0b3JlSUQiOiIxRTMxQjM1NzVBMjg0QjdEQjI3RUU3NTUxMDI0NDZGRSIsInVzZXJGaXJzdE5hbWUiOiJUZXN0IiwidXNlcklEIjoiODYxMTAyRjYyNDM1NEYxNUFCRUI0OERDMjA3QTRDMkQiLCJ1c2VySm9iVGl0bGUiOiIiLCJ1c2VyTGFzdE5hbWUiOiJVc2VyIiwidXNlclR5cGUiOiJjb250YWN0IiwidXNlcm5hbWUiOiJrb3B1In0.'
  );
  const cookiesForURL = vuJar.cookiesForURL(`${base_url}/login`);

  //   const auth = http.post(
  //     `${base_url}/login`,
  //     JSON.stringify({
  //       username: '---',
  //       password: '---',
  //       loginType: 'invoice',
  //     }),
  //     params
  //   );
  //   if (auth.json('status') !== 'success') {
  //     throw new Error('Login failed');
  //   }

  const payload = JSON.stringify({});
  const res = http.get(`${base_url}/customerInvoice`, payload, params);
  const response = JSON.parse(res.body);

  if (response.length === 0 || !response[0].ID) throw new Error('No ID found');
}
