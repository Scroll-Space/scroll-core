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

    getTempIdDoc() {
        return this.#prefix + "temp_" + (this.#win.Asc?.plugin?.info?.documentTitle || "default_doc");
    }

    /**
     * @typedef { Object } ViewState
     * @property { number } x - Координата X скролла
     * @property { number } y - Координата Y скролла
     * @property { number } zoom - Значение масштаба(в процентах, например 130)
     */

    /**
     * Сохраняет состояние отображения в localStorage
     * @param {ViewState | null} view - Объект состояния или null
     * @param {boolean} [isTemp=false] - Флаг временного сохранения
     */
    saveView(view, isTemp = false) {
        if (!view) return;

        let storageKey = isTemp ? this.getTempIdDoc() : this.getIdDoc();

        try {
            localStorage.setItem(storageKey, JSON.stringify(view));
        } catch (e) {
            console.error("PluginStorage [saveView]: ", e);
        }
    }

    /**
     * Получает сохраненное состояние отображения из localStorage
     * 
     * @param {boolean} [isTemp=false] - Флаг чтения из временного хранилища
     * @returns {ViewState | null} Объект состояния или null, если данных нет
     */
    getView(isTemp = false) {
        let storageKey = isTemp ? this.getTempIdDoc() : this.getIdDoc();
        const rawData = localStorage.getItem(storageKey);
        if (!rawData) return null;

        try {
            const parsedData = JSON.parse(rawData);
            if (typeof parsedData === 'object' && parsedData !== null) {
                return parsedData;
            }
        } catch (e) {
            console.error("PluginStorage [getView]: ", e);
        }

        return null;
    }

    /**
     * @param {boolean} [isTemp=false] - Флаг чтения из временного хранилища
     */
    removeView(isTemp = false) {
        let storageKey = isTemp ? this.getTempIdDoc() : this.getIdDoc();
        localStorage.removeItem(storageKey);
    }

    isFirstOpen() {
        return localStorage.getItem(this.getIdDoc()) === null;
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