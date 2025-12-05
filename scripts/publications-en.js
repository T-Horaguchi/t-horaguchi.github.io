async function loadPublicationsEn() {
    try {
        const response = await fetch("data/publications.json");
        const data = await response.json();

        /* ========== Journal Articles ========== */
        const journalContainer = document.getElementById("journal-container");
        const journal = (data.journal || []).slice();

        // 年ごとにグループ化
        const journalByYear = {};
        journal.forEach(pub => {
            let year = pub.year;
            if (!year && pub.date && pub.date.length >= 4) {
                year = parseInt(pub.date.slice(0, 4), 10);
            }
            year = year || "Others";
            if (!journalByYear[year]) {
                journalByYear[year] = [];
            }
            journalByYear[year].push(pub);
        });

        // 年を降順ソート
        const journalYears = Object.keys(journalByYear).sort((a, b) => {
            const na = parseInt(a, 10) || 0;
            const nb = parseInt(b, 10) || 0;
            return nb - na;
        });
        const latestJournalYear = journalYears[0];

        journalYears.forEach(year => {
            const yearBlock = document.createElement("div");
            yearBlock.className = "year-block";

            const h3 = document.createElement("h3");
            h3.className = "year-heading";
            h3.textContent = year;
            if (year === latestJournalYear) {
                h3.classList.add("latest-year");
            }
            yearBlock.appendChild(h3);

            const ul = document.createElement("ul");
            ul.className = "publications-list";

            journalByYear[year].forEach(pub => {
                const y = pub.year ? pub.year : "";
                const date = pub.date ? ` (${pub.date})` : "";

                // ジャーナル文字列
                let jText = pub.journal || "";
                if (pub.volume) {
                    jText += ` <strong>${pub.volume}</strong>`;
                }
				if (pub.pages) {
					jText += `, ${pub.pages}`;
				}
                if (y) {
                    jText += ` (${y})`;
                }

                // 将来URLを入れられるように（pub.url があればリンクにする）
                let journalHtml;
                if (pub.url) {
                    journalHtml =
                        `<a href="${pub.url}" target="_blank" rel="noopener noreferrer">${jText}</a>`;
                } else {
                    journalHtml = jText;
                }

                const li = document.createElement("li");
                li.innerHTML = `
                    <div class="pub-title"><strong>${pub.title_en}</strong></div>
                    <div class="pub-authors">${pub.authors_en}</div>
                    <div class="pub-journal">${journalHtml}</div>
                `;
                ul.appendChild(li);
            });

            yearBlock.appendChild(ul);
            journalContainer.appendChild(yearBlock);
        });

        /* ========== Conference Presentations ========== */
        const presContainer = document.getElementById("presentation-container");
        const pres = (data.presentations || []).slice();

        const presByYear = {};
        pres.forEach(p => {
            let year = null;
            if (p.year) {
                year = p.year;
            } else if (p.date && p.date.length >= 4) {
                year = parseInt(p.date.slice(0, 4), 10);
            }
            year = year || "Others";
            if (!presByYear[year]) {
                presByYear[year] = [];
            }
            presByYear[year].push(p);
        });

        const presYears = Object.keys(presByYear).sort((a, b) => {
            const na = parseInt(a, 10) || 0;
            const nb = parseInt(b, 10) || 0;
            return nb - na;
        });
        const latestPresYear = presYears[0];

        presYears.forEach(year => {
            const yearBlock = document.createElement("div");
            yearBlock.className = "year-block";

            const h3 = document.createElement("h3");
            h3.className = "year-heading";
            h3.textContent = year;
            if (year === latestPresYear) {
                h3.classList.add("latest-year");
            }
            yearBlock.appendChild(h3);

            const ul = document.createElement("ul");
            ul.className = "publications-list";

            presByYear[year].forEach(p => {
                const date = p.date ? `, ${p.date}` : "";

                const li = document.createElement("li");
                li.innerHTML = `
                    <div class="pub-title"><strong>${p.title_en}</strong></div>
                    <div class="pub-authors">${p.authors_en}</div>
                    <div class="pub-journal">${p.conference_en}${date}</div>
                `;
                ul.appendChild(li);
            });

            yearBlock.appendChild(ul);
            presContainer.appendChild(yearBlock);
        });

    } catch (e) {
        console.error("Failed to load publications (EN):", e);
    }
}

loadPublicationsEn();
