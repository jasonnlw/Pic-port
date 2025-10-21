document.addEventListener('DOMContentLoaded', () => {
  console.log("📦 Loading CSV...");

  Papa.parse('data.csv', {
    download: true,
    header: true,
    skipEmptyLines: true,

    complete: results => {
      console.log("✅ CSV loaded. Rows:", results.data.length);

      // Fisher–Yates shuffle
      const shuffle = arr => {
        for (let i = arr.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
      };

      // Thumbnail width by screen size
      const thumbWidth =
        (window.innerWidth || 1024) <= 480 ? 400 :
        (window.innerWidth || 1024) <= 1024 ? 600 : 800;

      const galleryEl = document.getElementById('gallery');
      shuffle(results.data).forEach(row => {
        const imgURL = row.image;
        const snarcURL = row.Data_;
        const label = row.Data_Label;

        if (!imgURL || !snarcURL || !label) return;

        // Build fast, mobile-safe Commons thumbnail URL
        let src = imgURL.trim().replace(/^http:\/\//, 'https://');

        try {
          if (src.includes('/Special:FilePath/')) {
            const parts = src.split('/Special:FilePath/');
            const fileName = parts[1]; // already URL-encoded
            if (!fileName) throw new Error('No filename in FilePath URL');
            src = `https://commons.wikimedia.org/wiki/Special:Redirect/file/${fileName}?width=${thumbWidth}`;
          } else if (src.includes('/wiki/Special:Redirect/file/')) {
            const [base, q = ''] = src.split('?');
            const params = new URLSearchParams(q);
            params.set('width', String(thumbWidth));
            src = `${base}?${params.toString()}`;
          }
          // else: direct upload URL — leave as-is
        } catch (e) {
          console.error('⚠️ Skipping row due to bad image URL:', imgURL, e);
          return;
        }

        // Card
        const card = document.createElement('div');
        card.className = 'card';

        // Link (same tab)
        const link = document.createElement('a');
        link.href = snarcURL; // open in current window/tab

        // Image
        const img = document.createElement('img');
        img.src = src;
        img.alt = label;
        img.loading = 'lazy';

        // Caption
        const caption = document.createElement('div');
        caption.className = 'caption';
        caption.textContent = label;

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
