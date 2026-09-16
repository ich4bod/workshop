export const entries = [
  {
    id: "wifi-missing",
    title: "Wi-Fi adapter is absent after install",
    class: "Wireless network adapter",
    symptoms: ["wifi", "wireless", "no network", "adapter missing"],
    clue: "`lspci -nnk` shows a Network controller but no `Kernel driver in use`.",
    next: "Record the PCI ID with `lspci -nn`; compare it against the kernel's supported IDs before installing anything."
  },
  {
    id: "bluetooth-vanished",
    title: "Bluetooth toggle disappeared",
    class: "Bluetooth USB controller",
    symptoms: ["bluetooth", "toggle", "headphones", "wireless"],
    clue: "`lsusb` still lists the controller while `bluetoothctl list` is empty.",
    next: "Check `dmesg | grep -i bluetooth` for firmware load messages and preserve the exact USB ID."
  },
  {
    id: "audio-no-output",
    title: "Audio device has no output",
    class: "HD audio codec",
    symptoms: ["audio", "sound", "speaker", "headphones"],
    clue: "`aplay -l` lists a card, but the desktop sound panel has no usable profile.",
    next: "Save `aplay -l` and the active profile; test a different profile before changing drivers."
  },
  {
    id: "touchpad-basic-mode",
    title: "Touchpad only clicks or moves",
    class: "I2C HID touchpad",
    symptoms: ["touchpad", "gestures", "trackpad", "i2c"],
    clue: "`libinput list-devices` sees a pointer but reports no scroll or gesture capabilities.",
    next: "Capture the touchpad name from `libinput list-devices` and look for I2C errors in `dmesg`."
  },
  {
    id: "webcam-black",
    title: "Webcam opens to a black image",
    class: "USB Video Class camera",
    symptoms: ["webcam", "camera", "black", "video"],
    clue: "`v4l2-ctl --list-devices` exposes `/dev/video0`, but its format list is unexpectedly short.",
    next: "Record `v4l2-ctl --all` and test one listed format; do not add random camera modules."
  },
  {
    id: "graphics-low-resolution",
    title: "Display is stuck at low resolution",
    class: "Graphics adapter",
    symptoms: ["display", "resolution", "graphics", "monitor"],
    clue: "`lspci -nnk` names the GPU and shows `Kernel driver in use: simpledrm` or none.",
    next: "Keep the PCI ID and `dmesg | grep -Ei 'drm|firmware'` output; confirm the exact GPU generation."
  },
  {
    id: "ethernet-link-down",
    title: "Ethernet cable is connected but no link",
    class: "Ethernet controller",
    symptoms: ["ethernet", "wired", "link", "network"],
    clue: "`ip link` shows the interface, while `ethtool` reports `Link detected: no`.",
    next: "Try a known-good cable and record the controller PCI ID plus `ethtool` output."
  }
];

export function searchEntries(query) {
  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (!terms.length) return entries;
  return entries.filter((entry) => {
    const text = [entry.title, entry.class, entry.clue, entry.next, ...entry.symptoms].join(" ").toLowerCase();
    return terms.every((term) => text.includes(term));
  });
}
