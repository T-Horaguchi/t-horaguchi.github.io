async function loadNewsEn() {
    const container = document.getElementById("news-container");
    if (!container) return;

    const response = await fetch("data/news.json");
    const newsList = await response.json();

    // Newest first
    newsList.sort((a, b) => new Date(b.date) - new Date(a.date));

    newsList.forEach(news => {
        const item = document.createElement("div");
        item.className = "news-item";

        const newLabel = news.is_new
            ? '<span class="news-label-new">NEW</span> '
            : "";

        // Paper block
        let paperHtml = "";
        if (news.paper) {
            const p = news.paper;
            const journalText =
                `${p.journal} <strong>${p.volume}</strong>, ${p.pages} (${p.year})`;

            const journalLink = p.url
                ? `<a href="${p.url}" target="_blank" rel="noopener noreferrer">${journalText}</a>`
                : journalText;

            paperHtml = `
                <div class="news-paper">
                    ${p.authors}<br>
                    <strong>"${p.title}"</strong><br>
                    ${journalLink}
                </div>
            `;
        }

        // Related links (English labels)
        let linksHtml = "";
        if (news.links && news.links.length > 0) {
            linksHtml = `
                <div class="news-related">
                    <span class="news-related-label">Related:</span>
                    <ul class="news-links">
                        ${news.links.map(l => `
                            <li>★ <a href="${l.url}" target="_blank" rel="noopener noreferrer">
                                ${l.label_en}
                            </a></li>
                        `).join("")}
                    </ul>
                </div>
            `;
        }

        item.innerHTML = `
            <div class="news-date">${news.date}</div>
            <div class="news-body">
                <div class="news-tag">
                    ${newLabel}[${news.tag_en}]
                </div>
                <strong>${news.title_en}</strong><br>
                ${news.body_en}
                ${paperHtml}
                ${linksHtml}
            </div>
        `;

        container.appendChild(item);
    });
}

loadNewsEn();
