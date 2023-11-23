Load testing using K6

I had the login as part of the request, but that meant the login happened on *every* request which is terribly slow!
Couldn't get the cookie jar to persist across test iterations or see how to run a pre-test script, so have manually logged in and copied either the JWT or token into the script.

## Running

To run the tests:

Firstly, add the auth tokens / JWT to the test script, then simply run:

omSupply: `k6 run invoices.js`
mSupply: `k6 run customerInvoice.js`

You can specify the number of virtual users and duration directly:

`k6 run --vus 1 --duration 1s customerInvoice.js`

## Statistics

To output results as a csv you can run with the csv parameter:

`k6 run --out csv=invoices.csv invoices.js`

From there, I've imported the csv files into postgres, and run the following query to compare mSupply and omSupply:

```
with omSupply as (
	select avg(ci.metric_value) as duration, count(*) as requests, timestamp
	from csvinvoices ci 
	where metric_name = 'http_req_duration'
	group by "timestamp" 
), mSupply as (
	select avg(metric_value) as duration, count(*) as requests, timestamp
	from customerinvoices 
	where metric_name = 'http_req_duration'
	group by "timestamp" 
),
o as (
	select duration, requests, timestamp - (select min(timestamp) from omSupply) as seconds
	from omSupply
),
m as (
	select duration, requests, timestamp - (select min(timestamp) from mSupply) as seconds
	from mSupply
)
duration as omSupply, m.duration as mSupply
select o.seconds, /*o.requests, m.requests, */o.duration as omSupply, m.duration as mSupply
from o
full outer join m on o.seconds = m.seconds
order by 1
```

and finally, plotted the result in excel