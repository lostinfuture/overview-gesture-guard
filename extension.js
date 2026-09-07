import {Extension} from 'resource:///org/gnome/shell/extensions/extension.js';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';

const ALLOWED_TRANSITIONS = {
    HIDDEN: ['SHOWING'],
    HIDING: ['HIDDEN', 'SHOWING'],
    SHOWING: ['SHOWN', 'HIDING'],
    SHOWN: ['HIDING'],
};

export default class OverviewGestureGuard extends Extension {
    enable() {
        const overview = Main.overview;
        const original = overview._changeShownState;

        this._originalChangeShownState = original;

        const wrapper = function (state) {
            const allowed = ALLOWED_TRANSITIONS[this._shownState];
            if (allowed && !allowed.includes(state)) {
                console.debug(`Overview Gesture Guard: ignored ${this._shownState} → ${state}`);
                return;
            }

            return original.call(this, state);
        };

        this._wrapper = wrapper;
        overview._changeShownState = wrapper;
    }

    disable() {
        const overview = Main.overview;

        if (overview._changeShownState !== this._wrapper) {
            console.warn('Overview Gesture Guard: _changeShownState was replaced by another extension; not restoring the original');
        } else if (this._originalChangeShownState) {
            overview._changeShownState = this._originalChangeShownState;
        }

        this._originalChangeShownState = null;
        this._wrapper = null;
    }
}
