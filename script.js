document.addEventListener('DOMContentLoaded', function() {
  Papa.parse('data.csv', {
    download: true,
    header: true,
    complete: function(results) {
      // Helper: Shuffle array (Fisher-Yates)
      function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
      }

      const gallery = document.getElementById('gallery');
      const shuffled = shuffle(results.data); // Randomize order

      shuffled.forEach(row => {
        if (!row.image || !row.Data_ || !row.Data_Label) return;

        const card = document.createElement('div');
        card.className = 'card';

        const link = document.createElement('a');
        link.href = row.Data_;
        link.target = '_blank';

        const img = document.createElement('img');

        // Fix Wikimedia Commons URL for HTTPS + mobile-safe redirect
        let fixedUrl = row.image.trim()
          .replace(/^http:\/\//, 'https://')
          .replace(
            'commons.wikimedia.org/wiki/Special:FilePath/',
            'commons.wikimedia.org/wiki/Special:Redirect/file/'
          );

        img.src = fixedUrl;
        img.alt = row.Data_Label;
        img.loading = 'lazy';

        const caption = document.createElement('div');
        caption.className = 'caption';
        caption.textContent = row.Data_Label;

        link.appendChild(img);
        card.appendChild(link);
        card.appendChild(caption);
        gallery.appendChild(card);
      });
    }
  });
});
