document.addEventListener('DOMContentLoaded', () => {

  console.log("📦 Loading CSV...");

  Papa.parse('data.csv', {
    download: true,
    header: true,
    skipEmptyLines: true,

    complete: results => {
      console.log("✅ CSV loaded. Rows:", results.data.length);

      const shuffle = arr => {
        for (let i = arr.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
      };

      const galleryEl = document.getElementById('gallery');
      shuffle(results.data).forEach(row => {
        if (!row.image || !row.Data_ || !row.Data_Label) return;

        const card = document.createElement('div');
        card.className = 'card';

        const link = document.createElement('a');
        link.href = row.Data_;
        link.target = '_blank';

        const img = document.createElement('img');
        img.src = row.image.trim()
          .replace(/^http:\/\//, 'https://')
          .replace(
            'commons.wikimedia.org/wiki/Special:FilePath/',
            'commons.wikimedia.org/wiki/Special:Redirect/file/'
          );
        img.alt = row.Data_Label;
        img.loading = 'lazy';

        const caption = document.createElement('div');
        caption.className = 'caption';
        caption.textContent = row.Data_Label;

        link.appendChild(img);
        card.appendChild(link);
        card.appendChild(caption);
        galleryEl.appendChild(card);
      });

      console.log("🎨 Gallery rendered successfully.");
    },

    error: err => console.error("❌ PapaParse failed:", err)
  });

});
