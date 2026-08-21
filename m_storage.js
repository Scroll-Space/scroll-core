export class PluginStorage {
    // Приватные переменные для хранения состояния
    /** @type {Window} */
    #win;
    /** @type {String} */
    #prefix;
    /** @type {Boolean} */
    #idMoveByOpenFlag;
    /** @type {Boolean} */
    #idSaveByCloseFlag;

    /**
     * @param {Window} win
     */
    constructor(win = window) {
        this.#win = win;
        this.#prefix = "oautoscroll_plugin_";
        this.#idMoveByOpenFlag = this.#prefix + "move_by_open";
        this.#idSaveByCloseFlag = this.#prefix + "save_by_close";
    }

    getIdDoc() {
        return this.#prefix + (this.#win.Asc?.plugin?.info?.documentTitle || "default_doc");
    }

    saveScroll(y) {
        if (y === null) return;

        try {
            localStorage.setItem(this.getIdDoc(), y.toString());
        } catch (e) {
            console.error("PluginStorage [saveScroll]: ", e);
        }
    }

    getScroll() {
        const rawData = localStorage.getItem(this.getIdDoc());
        if (!rawData) return null;

        const parsedY = parseFloat(rawData);
        return isNaN(parsedY) ? null : parsedY;
    }

    isFirstOpen() {
        return localStorage.getItem(this.getIdDoc()) === null;
    }

    removeScroll() {
        localStorage.removeItem(this.getIdDoc());
    }

    // --- Настройки (Чекбоксы) ---

    getMoveByOpenFlag() {
        const rawData = localStorage.getItem(this.#idMoveByOpenFlag);
        return rawData ? JSON.parse(rawData) : false;
    }

    setMoveByOpenFlag(flag) {
        if (flag) {
            try {
                localStorage.setItem(this.#idMoveByOpenFlag, flag.toString());
            } catch (e) {
                console.error("PluginStorage [setMoveByOpenFlag]: ", e);
            }
        } else {
            localStorage.removeItem(this.#idMoveByOpenFlag);
        }
    }

    getSaveByCloseFlag() {
        const rawData = localStorage.getItem(this.#idSaveByCloseFlag);
        return rawData ? JSON.parse(rawData) : false;
    }

    setSaveByCloseFlag(flag) {
        if (flag) {
            try {
                localStorage.setItem(this.#idSaveByCloseFlag, flag.toString());
            } catch (e) {
                console.error("PluginStorage [setSaveByCloseFlag]: ", e);
            }
        } else {
            localStorage.removeItem(this.#idSaveByCloseFlag);
        }
    }

    count() {
        let total = 0;
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith(this.#prefix)) {
                total++;
            }
        }
        return total;
    }

    clearAll() {
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith(this.#prefix)) {
                keysToRemove.push(key);
            }
        }
        keysToRemove.forEach(k => localStorage.removeItem(k));
    }
}