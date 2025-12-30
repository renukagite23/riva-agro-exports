const id = '6943e8650bfb5a096f7449fa';
const url = `http://localhost:9002/api/products/${id}`;

const form = new FormData();
form.append('name', 'Makka Debug Updated');
form.append('description', 'updated desc');
form.append('category', 'grains--pulses');
form.append('hsCode', '10021');
form.append('variants', JSON.stringify([{ name: 'Yellow makka', price: 100 }]));
form.append('featured', 'true');
form.append('status', 'active');
form.append('existingImages', '/uploads/1766058085810-Gemini_Generated_Image_9gqykr9gqykr9gqy.png');

(async () => {
  try {
    const res = await fetch(url, { method: 'PUT', body: form });
    console.log('status', res.status);
    const text = await res.text();
    console.log('body', text);
  } catch (err) {
    console.error('error', err);
  }
})();