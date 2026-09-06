# Overview Gesture Guard

GNOME Shell extension for GNOME 50. It stops an illegal Activities
overview state change that throws during cancelled 3-finger touchpad
swipes and hitchs workspace switching.

## What it fixes

GNOME Shell only allows these overview states:

`HIDDEN → SHOWING → SHOWN → HIDING → HIDDEN`

A cancelled 3-finger swipe (or a mostly-horizontal workspace swipe that
also hits the vertical overview tracker) can request `HIDDEN → HIDING`.
Shell throws:

```
JS ERROR: Error: Invalid overview shown transition from HIDDEN to HIDING
  _changeShownState@.../overview.js
  _gestureEnd@.../overview.js
  _endTouchpadGesture@.../swipeTracker.js
```

The throw aborts `controls.gestureEnd()`, so a gesture that already
called `gestureBegin()` never finishes. Workspace slides hitch.

This extension wraps `_changeShownState` and ignores illegal
transitions. The swipe tracker keeps a bound copy of `_gestureEnd` from
`init()`, so replacing `_gestureEnd` itself does nothing.

There is no user interface and no settings.

## Install from source

```sh
gnome-extensions pack --extra-source=LICENSE
gnome-extensions install -f overview-gesture-guard@lostinfuture.github.io.shell-extension.zip
```

Then log out and back in (Wayland), and enable **Overview Gesture Guard**
in the Extensions app.

## Pack for extensions.gnome.org

```sh
gnome-extensions pack --force --extra-source=LICENSE
```

Upload the zip at <https://extensions.gnome.org/upload/>.

The `url` field in `metadata.json` must point at a public git repository
that contains this source. Create that repository and push before, or
right after, the upload.

## License

GPL-2.0-or-later. GNOME Shell extensions that import Shell modules must
be GPL-compatible.
