//this is for an async/sync functions scale

// const SERVER_URL = "http://localhost:3000"
// async function sequentialFetch() {
//     const start = Date.now();
//     const response1 = await fetch(SERVER_URL + '/blast/all');
//     const response2 = await fetch(SERVER_URL + '/mailinglist/all');
//     console.log(`Sequential fetch took ${Date.now() - start} ms`);
//   }

//   sequentialFetch();

//   async function parallelFetch() {
//     const start = Date.now();
//     const [response1, response2] = await Promise.all([
//       fetch(SERVER_URL + '/blast/all'),
//       fetch(SERVER_URL + '/mailinglist/all')
//     ]);
//     console.log(`Parallel fetch took ${Date.now() - start} ms`);
//   }

//   parallelFetch();