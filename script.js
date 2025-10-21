document.addEventListener('DOMContentLoaded', function() {
  Papa.parse('data.csv', {
    download: true,
    header: true,
    complete: function(results) {
      const gallery = document.getElementById('gallery');
      results.data.forEach(row => {
        if (!row.image || !row.Data_ || !row.Data_Label) return;

        const card = document.createElement('div');
        card.className = 'card';

        const link = document.createElement('a');
        link.href = row.Data_;
        link.target = '_blank';

        const img = document.createElement('img');
        // Fix Wikimedia Commons file path and enforce HTTPS
        let filename = row.image.split('/Special:FilePath/')[1];
        let fixedUrl = 'https://commons.wikimedia.org/wiki/Special:Redirect/file/' + filename + '?width=600';
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
