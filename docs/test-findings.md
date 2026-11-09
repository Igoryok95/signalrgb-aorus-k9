# Test findings

Tested on November 9, 2026 with an AORUS K9 Optical (`1044:7A35`) and SignalRGB 2.5.86 on Windows.

# LIVE PER-KEY ANIMATION FLICKER IS LIKELY NOT FIXABLE IN A SIGNALRGB PLUGIN

This is an inference from the tested controller behavior, not a vendor-confirmed hardware specification. No smooth real-time per-key update path was found. A new device protocol or firmware change could alter that conclusion.

## What was observed

- A single `0x20` RGB command changes the entire keyboard. The user confirmed smooth uniform animation without the per-key flicker.
- The per-key color table can be read and written correctly. Esc, WASD, arrows, and all main ANSI rows were visually checked.
- An experimental 40 Hz stream completed 800 frames in 20 seconds and its final 512-byte readback matched.
- Successful USB writes did not mean usable animation: the user reported judder and flicker with Rainbow and supplied before/after videos.
- Repeatedly sending the **same unchanged per-key frame** also caused visible flicker. This rules out the Rainbow effect's color calculation as the sole cause.
- An output-only trial, which omitted the normal preparation command after the first frame, froze color movement and disrupted typing. It was stopped immediately, and typing recovered without disconnecting the keyboard. That trial is not included in the release.
- Sampling a spatial average of the rainbow reduced saturation. The final uniform mode uses a single canvas point, preserving the selected color's gamut.
- During one active-animation sample SignalRGB used roughly 0.34 of one CPU core, about 1.1% of total capacity on the tested 32-logical-processor system. This sample does not rule out short stalls and does not establish the cause of reported system stutter.

The supplied videos are private test material and are not included in this repository.

## Final behavior

**UNIFORM COLOR MODE IS RECOMMENDED. Static per-key lighting is only conditionally supported; live per-key animations are not supported.**

The released plugin uses uniform effect synchronization, standalone firmware animations, and static per-key painting. Continuous per-key bulk streaming and the output-only experiment are removed.

Static painting waits until canvas colors have been unchanged for 500 ms, suppresses animated input, limits full-table writes to one per second, and skips identical tables. Firmware effects receive configuration only when a setting changes.

## Verification boundary

The final live check received acknowledgements for all four captured firmware mode commands. A static color table was written and read back through SignalRGB's own API with all 512 payload bytes matching. This check also caught and corrected SignalRGB's extra zero report-ID byte on input reports.

Automated tests cover both language variants and simulate the HID transport. Live device acknowledgements can verify that captured mode commands were accepted, while final visual checks of breathing, keypress ripple, and reactive-key behavior require observation of the keyboard. Acknowledgements alone are not claimed as proof of visible animation quality.
