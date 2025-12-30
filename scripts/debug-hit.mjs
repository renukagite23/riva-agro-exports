const url = 'http://localhost:9002/api/debug/product-test?id=6943e8650bfb5a096f7449fa';
(async () => {
  try {
    const r = await fetch(url);
    console.log('status', r.status);
    const j = await r.json();
    console.log('body', JSON.stringify(j, null, 2));
  } catch (err) {
    console.error(err);
  }
})();