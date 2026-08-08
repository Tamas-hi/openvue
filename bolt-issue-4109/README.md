# OpenVue issue #4109 reproduction

This is a small standalone playground for verifying row groups with virtual scrolling against 10,000 loaded customers.

1. Start the app with `npm run dev`.
2. Scroll the table vertically through the full 10,000-row dataset.
3. Confirm that each representative group header stays aligned with its rows while virtual scrolling recycles the viewport.

The `openvue.min.js` bundle is generated from the `feature/fix-4109` source tree so this playground does not need to import the full OpenVue monorepo.
