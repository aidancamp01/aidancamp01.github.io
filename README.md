# aidancamp01.github.io

Aidan Campbell's portfolio, presented as a walk-through 3D gallery. Scrolling moves the visitor down a museum hall, one room per section, with each experience or project hung as a framed exhibit. A plain view (button in the top right, or `?view=plain`) shows the same content as a fast, readable page.

## Editing content

All text lives in [`js/content.js`](js/content.js). The gallery and the plain view are both generated from it.

- Add an item to a section to hang a new frame.
- Add `image: "assets/your-image.jpg"` to an item to use a photo inside its frame.
- Put a resume PDF in `assets/` and set `resumeUrl` to show the Resume button.

## Running locally

It is a static site with no build step:

```
python3 -m http.server
```

then open http://localhost:8000.

Built with [three.js](https://threejs.org) (MIT, vendored in `vendor/`).
