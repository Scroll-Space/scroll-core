export class EditorController {
    /** @type {Window} */
    #win;
    
    /**
     * @param {Window} win
     */
    constructor(win = window) {
        this.#win = win;
    }

    getScrollY() {
        let scrollInfo = this.#win.parent?.Asc?.editor?.getCurScroll();
        return scrollInfo ? scrollInfo.y : null;
    }

    moveScroll(y) {
        if (y !== null && this.#win.parent?.Asc?.editor) {
            // Получаем текущий X, чтобы не сбить горизонтальный скролл
            let currentScroll = this.#win.parent.Asc.editor.getCurScroll();
            let currentX = currentScroll ? currentScroll.x : 0;

            this.#win.parent.Asc.editor.scrollToXY(currentX, y);
        }
    }
   
}