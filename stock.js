import http from 'k6/http';

export default function () {
  const url = 'https://demo-open.msupply.org:2048/api/v4/stock';
  const payload = JSON.stringify({});

  const params = {
    headers: {
      'Content-Type': 'application/json',
      Authorization:
        'Bearer eyJhbGciOiJub25lIn0.eyJzZXJ2aWNlIjoiaW52b2ljZSIsInN0b3JlSUQiOiIxRTMxQjM1NzVBMjg0QjdEQjI3RUU3NTUxMDI0NDZGRSIsInVzZXJGaXJzdE5hbWUiOiJUZXN0IiwidXNlcklEIjoiODYxMTAyRjYyNDM1NEYxNUFCRUI0OERDMjA3QTRDMkQiLCJ1c2VySm9iVGl0bGUiOiIiLCJ1c2VyTGFzdE5hbWUiOiJVc2VyIiwidXNlclR5cGUiOiJjb250YWN0IiwidXNlcm5hbWUiOiJrb3B1In0.',
    },
  };

  http.get(url, payload, params);
}
