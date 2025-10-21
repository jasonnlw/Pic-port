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

      // Helper: Shuffle array (Fisher-Yates)
      function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
      }

      const galleryEl = document.getElementById('gallery'); // renamed variable
      const shuffled = shuffle(results.data);

      shuffled.forEach(row => {
        const imgURL = row.image;
        const snarcURL = row.Data_;
        const label = row.Data_Label;

        if (!imgURL || !snarcURL || !label) return;

        // Create card container
        const card = document.createElement('div');
        card.className = 'card';

        // Link wrapper
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

        // Image element
        const img = document.createElement('img');
        img.src = fixedUrl;
        img.alt = label;
        img.loading = 'lazy';

        // Caption
        const caption = document.createElement('div');
        caption.className = 'caption';
        caption.textContent = label;

        // Build structure
        link.appendChild(img);
        card.appendChild(link);
        card.appendChild(caption);
        galleryEl.appendChild(card);
      });

      console.log("🎨 Gallery rendered successfully.");
    },
    error: function(err) {
      console.error("❌ PapaParse failed
