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

        overview._changeShownState = function (state) {
            const allowed = ALLOWED_TRANSITIONS[this._shownState];
            if (allowed && !allowed.includes(state))
                return;

            return original.call(this, state);
        };
    }

    disable() {
        if (this._originalChangeShownState)
            Main.overview._changeShownState = this._originalChangeShownState;

        this._originalChangeShownState = null;
    }
}
