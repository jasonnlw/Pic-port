document.addEventListener('DOMContentLoaded', function() {

  console.log("📦 Loading CSV...");

  Papa.parse('data.csv', {
    download: true,
    header: true,
    skipEmptyLines: true,
    complete: function(results) {
      console.log("✅ CSV loaded. Rows:", results.data.length);

      if (!results.data || results.data.length === 0) {
        console.error("⚠️ No data found in CSV or failed to load.");
        return;
      }

      // Shuffle array (Fisher-Yates)
      function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
      }

      const gallery = document.getElementById('gallery');
      const shuffled = shuffle(results.data);

      shuffled.forEach(row => {
        const imgURL = row.image;
        const snarcURL = row.Data_;
        const label = row.Data_Label;

        if (!imgURL || !snarcURL || !label) return;

        // Create card
        const card = document.createElement('div');
        card.className = 'card';

        // Link to SNARC entity
        const link = document.createElement('a');
        link.href = snarcURL;
        link.target = '_blank';

        // Fix Wikimedia Commons URLs (HTTPS + Redirect)
        let fixedUrl = imgURL.trim()
          .replace(/^http:\/\//, 'https://')
          .replace(
            'commons.wikimedia.org/wiki/Special:FilePath/',
            'commons.wikimedia.org/wiki/Special:Redirect/file/'
          );

        const img = document.createElement('img');
        img.src = fixedUrl;
        img.alt = label;
        img.loading = 'lazy';

        const caption = document.createElement('div');
        caption.className = 'caption';
        caption.textContent = label;

        // Assemble card
        link.appendChild(img);
        card.appendChild(link);
        card.appendChild(caption);
        gallery.appendChild(card);
      });

      console.log("🎨 Gallery rendered successfully.");
    },
    error: function(err) {
      console.error("❌ PapaParse failed:", err);
    }
  });
});
