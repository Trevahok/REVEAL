# REVEAL — Project Page

Project website for **"Stress Tests REVEAL Fragile Temporal and Visual Grounding in Video-Language Models"** (ECCV 2026).

REVEAL is a diagnostic benchmark that isolates when and why Video-Language Models discount visual evidence — through five controlled stress tests paired with mechanistic probing.

## Quick Start

```bash
cd Academic-project-page-template
python3 -m http.server 8765
```

Then open [http://localhost:8765](http://localhost:8765).

## Structure

```
├── index.html                  # Main page
├── static/
│   ├── css/
│   │   ├── bulma.min.css       # Bulma framework
│   │   ├── bulma-carousel.min.css
│   │   ├── bulma-slider.min.css
│   │   └── index.css           # REVEAL custom styles
│   ├── js/
│   │   ├── bulma-carousel.min.js
│   │   ├── bulma-slider.min.js
│   │   ├── fontawesome.all.min.js
│   │   └── index.js            # Interactions (accordion, counters, copy)
│   ├── images/                 # GIF demos & assets
│   └── videos/                 # Video demo placeholders
└── .nojekyll                   # GitHub Pages bypass
```

## Sections

| Section | Description |
|---|---|
| Hero | Title, tagline, venue badge, quick links (Paper / Code / arXiv / Benchmark) |
| Headline Stats | Animated counters for key numbers (5 stress tests, 4,600 QA pairs, etc.) |
| Key Finding Banner | KL = 0.10 highlight |
| Abstract | Full paper abstract |
| Failure Demos | Carousel of video demos with prompts, ground truth (green), and model predictions (red) |
| Three Failure Modes | Side-by-side cards: description + sample GIF with prompt/GT/pred |
| Five Stress Tests | Expandable accordion with per-test descriptions and results tables |
| Mechanistic Probing | Pipeline visualization (Vision Encoder → Projector → LLM) with insight cards |
| Benchmark Composition | Color-coded table of all stress tests, video/QA counts, and source datasets |
| Key Findings | Six quotable results from the paper |
| How REVEAL Compares | Comparison grid vs. prior benchmarks |
| BibTeX | Citation block with copy button |

## Customization

- **Colors** — CSS variables at the top of `static/css/index.css` (`--re-blue`, `--ve-violet`, `--al-pink`)
- **Content** — Edit `index.html` directly; sections are labeled with HTML comments
- **Placeholder assets** — Replace GIFs in `static/images/` and videos in `static/videos/` with real demos

## Deployment

Works with GitHub Pages out of the box. Push to a `gh-pages` branch or enable Pages on `main`.

## Credits

Built on the [Academic Project Page Template](https://github.com/eliahuhorwitz/Academic-project-page-template) by Eliah Horwitz. Licensed under [CC BY-SA 4.0](http://creativecommons.org/licenses/by-sa/4.0/).
