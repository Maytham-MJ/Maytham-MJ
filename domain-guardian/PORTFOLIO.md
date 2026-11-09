# Portfolio notes

## Resume bullet

Built a JavaScript Manifest V3 browser-extension prototype for lookalike-domain detection using edit distance, hostname-boundary checks, and local protected-domain settings, with explainable warnings and automated tests in GitHub Actions.

## Demo without visiting suspicious domains

Load unpacked, open the extension popup, and enter `githbu.com` in the offline checker. Explain the adjacent letter swap, inspect the suggested `github.com` root link, then compare `paypal.com.evil.test` with `paypal.com`. Add an independently verified custom domain and demonstrate persistence.

## Interview discussion

- Why parse URLs instead of searching raw strings? Userinfo, paths, and query strings can contain misleading brand names.
- Why say “unknown”? Absence of a heuristic match is not evidence of safety.
- Why local checks? Avoid transmitting browsing data and remove server availability dependencies.
- Why isolate the detector? Pure functions make regression tests straightforward.
- What is the biggest limit? The current warning happens after navigation commits, and heuristic detection is incomplete.
- What would improve evaluation? A labeled dataset, false-positive/negative measurements, and browser integration tests.

This project was developed with AI assistance. Review the code, run the checks, and be able to explain its limits before presenting it as your work.
