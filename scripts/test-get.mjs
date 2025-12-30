const url = 'http://localhost:9002/api/products';

(async () => {
  try {
    const res = await fetch(url);
    console.log('status', res.status);
    const json = await res.json();
    console.log('body', JSON.stringify(json, null, 2));
  } catch (err) {
    console.error('error', err);
  }
})();