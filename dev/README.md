# dev/

Not part of the widget build. These are throwaway files used while testing
against a local backend:

- `tes.py` — a tiny FastAPI stub for manually testing the `/debug` SOAP
  generator endpoint shape (`pip install fastapi uvicorn`, then
  `uvicorn tes:app --reload`).
- `dump.json` — a sample response payload used while building the SOAP
  result view.

Safe to delete if you don't need them; nothing in `src/` imports from here.
