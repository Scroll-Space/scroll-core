export class EditorController {
    /** @type {Window} */
    #win;

    /**
     * @param {Window} win
     */
    constructor(win = window) {
        this.#win = win;
    }

    /**
     * @typedef { Object } ViewState
     * @property { number } x - Координата X скролла
     * @property { number } y - Координата Y скролла
     * @property { number } zoom - Значение масштаба(в процентах, например 130)
     */

    /**
     * @returns {ViewState | null} Объект состояния или null, если данных нет
     */
    getView() {
        try {
            const scrollInfo = this.#win?.parent?.Asc?.editor?.getCurScroll();
            const zoomText = this.#win?.parent?.document?.querySelector('#label-zoom')?.textContent;

            const res = {
                x: scrollInfo?.x ?? null,
                y: scrollInfo?.y ?? null,
                zoom: zoomText ? Number(zoomText.split(' ').at(-1).slice(0, -1)) : null
            };

            // Если хоты бы одно из значений null, undefined или NaN — возвращаем null
            const hasInvalidValue = Object.values(res).some(
                val => val === null || val === undefined || Number.isNaN(val)
            );

            return hasInvalidValue ? null : res;
        } catch (e) {
            return null;
        }
    }

    /**
     * @param {ViewState | null} view - Объект состояния или null
     */
    setView(view) {
        if (view) {
            this.#win?.parent?.Asc?.editor.zoom(view.zoom);
            this.#win?.parent?.Asc?.editor.scrollToXY(view.x, view.y);
        }
    }
}