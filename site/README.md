# Council site

This is a plain static site. It has no build step or dependencies.

Preview it locally from the repository root:

```sh
python3 -m http.server 4173 --directory site --bind 127.0.0.1
```

Open <http://127.0.0.1:4173> in a browser. Keep styles, scripts, and assets as relative paths so the site works at the project Pages URL:

<https://mattakins.github.io/Council/>

The GitHub Actions workflow uploads `site/` when changes land on `main`. In the repository’s Settings → Pages, set **Source** to **GitHub Actions** to enable publishing. Adding the workflow does not enable Pages by itself.

Use `site/assets/council-brand.png` as the exact approved brand artwork. Do not redesign it.

The examples support horizontal scrolling, arrow buttons, and keyboard navigation. Installation commands remain available when JavaScript is disabled.
