# AORUS K9 HID protocol notes

## Device selection

| Field | Value |
| --- | --- |
| Vendor ID | `0x1044` |
| Product ID | `0x7A35` |
| Interface | `0` |
| Usage page | `0xFF02` |
| Usage | `1` |
| HID feature payload | 8 bytes |
| HID output/input payload | 64 bytes |

The Windows HID API includes a leading zero report-ID byte for feature writes and output writes: 9 and 65 bytes respectively. Input table chunks contain 64 bytes on the wire. SignalRGB 2.5.86 exposes each input chunk as **65 bytes including a leading zero report ID**: request 65, verify the byte count, then remove the first byte. Requesting only 64 through SignalRGB loses the last payload byte of every chunk.

## Feature commands

The last byte is `(0xFF - sum(previous seven payload bytes)) & 0xFF`. The leading Windows report-ID byte is zero.

| Purpose | Eight-byte USB payload |
| --- | --- |
| Uniform RGB | `20 00 00 RR GG BB 00 CC` |
| Prepare table read | `82 00 00 00 00 00 00 7D` |
| Request eight input chunks | `92 00 00 08 00 00 00 65` |
| Prepare eight output chunks | `12 00 00 08 00 00 00 E5` |
| Enter the captured custom mode | `08 00 33 0B 1E 01 01 99` |

For a table read, send `0x82`, read its feature acknowledgement, send `0x92`, read its acknowledgement, then read eight input packets (65 bytes each through SignalRGB, yielding 512 payload bytes after report IDs are removed). For a table update, send `0x12`, read its acknowledgement, then write eight 64-byte output payloads with their leading Windows report IDs.

The 512-byte table holds RGB triplets. A logical position occupies three bytes at `slot * 3`; slots are arranged as 22 columns of six positions. The source maps the 104 ANSI keys and logo, preserving unused bytes from the initial readback.

Examples verified against captures and physical keys:

| Key | Slot |
| --- | --- |
| Esc | 0 |
| A | 15 |
| W | 20 |
| S | 21 |
| D | 27 |
| Left Arrow | 95 |
| Up Arrow | 100 |
| Down Arrow | 101 |
| Right Arrow | 107 |
| AORUS logo | 108 |

## Streaming and verification

**Continuous per-key streaming is excluded from the released plugin.** This section records the investigation, not a recommended operating mode.

Reading the complete color table while a frame stream is active can interrupt the protocol and produce timeouts or an invalid comparison. Stop the stream and allow at least 300 ms of idle time before beginning the readback sequence.

The experimental stream used a 5 ms feature-command guard before checking the `0x12` acknowledgement, followed by eight output reports. Even when data read back correctly, the physical LEDs flickered.

The final static writer uses a 100 ms command guard, eight output packets with a 5 ms gap, and the captured custom-mode command. It writes only settled, changed colors, with at least one second between complete table updates. It does not stream frames from an animated canvas.

Transport validation confirms accepted writes and final table contents. It cannot prove that every intermediate LED frame was displayed or that the keyboard applies all eight chunks atomically. Physical video comparison is necessary when assessing flicker or motion quality.

## Firmware animations

The captured palette command is `14 00 06 RR GG BB 00 CC`. Mode setup is `08 00 MM SS BB 06 DD CC`, where the captured brightness byte is `0x1E` at the configured maximum.

| Mode | `MM` | Captured speed | Direction |
| --- | --- | --- | --- |
| Breathing | `02` | `08` | `00` |
| Rainbow wave | `03` | `03` or `08` | `02` |
| Ripple on keypress | `06` | `08` | `00` |
| Reactive keys | `07` | `08` | `00` |

After configuration these effects run in the keyboard. The plugin does not resend an identical mode or palette. Brightness and color changes cause a single configuration update. Uniform mode uses the captured static/off setup before sending real-time `0x20` RGB commands, and samples one canvas point instead of averaging different hues across the keyboard.
