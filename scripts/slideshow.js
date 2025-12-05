// 画像スライドの表示時間 [ms]
const IMAGE_DURATION_MS = 4000;
// 動画のメタデータがまだ読めていない場合のデフォルト [ms]
const DEFAULT_VIDEO_DURATION_MS = 5000;

let slideDurations = [];   // 各スライドの表示時間
let currentIndex = 0;      // 現在表示中のインデックス
let slideTimeoutId = null; // setTimeout のID
let totalSlides = 0;

async function loadSlideshow() {
    try {
        const res = await fetch("data/images.json");
        const data = await res.json();

        const files = data.images || [];
        const container = document.getElementById("slideshow-container");
        const dotsContainer = document.getElementById("slideshow-dots");

        if (!container || !dotsContainer || !files.length) {
            console.warn("Slideshow: container or files not found.");
            return;
        }

        totalSlides = files.length;
        slideDurations = new Array(totalSlides);

        files.forEach((filename, index) => {
            const slideDiv = document.createElement("div");
            slideDiv.className = "slides fade";

            const ext = filename.split(".").pop().toLowerCase();
            let element;

            // ---- 動画スライド ----
            if (["mp4", "webm", "ogg"].includes(ext)) {
                const video = document.createElement("video");
                video.src = "images/" + filename;
                video.muted = true;
                video.playsInline = true;
                video.controls = false;
                video.preload = "metadata"; // duration取得用
                element = video;

                // とりあえずデフォルト値を入れておく
                slideDurations[index] = DEFAULT_VIDEO_DURATION_MS;

                // メタデータ読み込み後に duration を反映
                video.addEventListener("loadedmetadata", () => {
                    if (video.duration && !isNaN(video.duration)) {
                        slideDurations[index] = video.duration * 1000;
                    }
                });

            // ---- 画像スライド ----
            } else {
                const img = document.createElement("img");
                img.src = "images/" + filename;
                element = img;

                slideDurations[index] = IMAGE_DURATION_MS;
            }

            element.alt = `slide-${index + 1}`;
            slideDiv.appendChild(element);
            container.appendChild(slideDiv);

            // ドット生成 & クリックでそのスライドへ
            const dot = document.createElement("span");
            dot.className = "dot";
            dot.addEventListener("click", () => {
                showSlide(index);
            });
            dotsContainer.appendChild(dot);
        });

        // 最初のスライドを表示
        showSlide(0);

    } catch (err) {
        console.error("スライドショー読み込みエラー:", err);
    }
}

function showSlide(index) {
    const slides = document.getElementsByClassName("slides");
    const dots = document.getElementsByClassName("dot");
    if (!slides.length) return;

    // index を範囲内に丸める
    if (index < 0) index = slides.length - 1;
    if (index >= slides.length) index = 0;

    // すべてのスライドを隠し、動画は停止
    for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
        dots[i].classList.remove("active-dot");

        const v = slides[i].querySelector("video");
        if (v) {
            v.pause();
            v.currentTime = 0;
        }
    }

    // 対象スライドを表示
    slides[index].style.display = "flex";
    dots[index].classList.add("active-dot");

    // 動画なら再生開始
    const activeVideo = slides[index].querySelector("video");
    if (activeVideo) {
        activeVideo.play().catch(() => {
            // 自動再生ブロック時は無視
        });
    }

    currentIndex = index;

    // 既存タイマーをクリア
    if (slideTimeoutId !== null) {
        clearTimeout(slideTimeoutId);
    }

    // このスライドの表示時間を決定
    const duration = slideDurations[index] || IMAGE_DURATION_MS;

    // duration 経過後に次スライドへ
    slideTimeoutId = setTimeout(() => {
        showSlide(index + 1);
    }, duration);
}

// DOM 準備完了で開始
document.addEventListener("DOMContentLoaded", loadSlideshow);
