# demo/

Standalone HTML pages for manually trying out the built widget
(`npm run build:lib` first, so `dist/his_ai_widget.js` exists), or for
mocking up how it looks dropped into a real HIS page.

- `simple_demo.html` — minimal page, just the widget script tag.
- `sdk-demo.html` — widget embedded next to a mock HIS dashboard.
- `demo2.html` — snapshot of an existing HIS page used as a visual
  reference; most of its asset links point at the original system and
  won't resolve here, that's expected.
