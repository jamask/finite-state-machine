class FSM {
    /**
     * Creates new FSM instance.
     * @param config
     */
    constructor(config) {
        this.config = config;
        this.historyStates = [];
        this.historyStates.push(config.initial);
        this.currentStateInHistory = 0;
        this.lastWasTrigger = 0;
    }

    /**
     * Returns active state.
     * @returns {String}
     */
    getState() {
        return this.historyStates[this.currentStateInHistory];
    }

    /**
     * Goes to specified state.
     * @param state
     */
    changeState(state) {
        if (state in this.config.states) {
            this.historyStates.push(state);
            this.currentStateInHistory++;
            this.lastWasTrigger = 1;
        } else {
            throw new Error();
        }
    }

    /**
     * Changes state according to event transition rules.
     * @param event
     */
    trigger(event) {
        let current = this.historyStates[this.currentStateInHistory];
        
        if (event in this.config.states[current].transitions) {
            let st = this.config.states[current].transitions[event];
            this.historyStates.push(st);
            this.currentStateInHistory++;
            this.lastWasTrigger = 1;
        } else {
            throw new Error();
        }
    }

    /**
     * Resets FSM state to initial.
     */
    reset() {
        this.historyStates.push(this.config.initial);
        this.currentStateInHistory++;
        this.lastWasTrigger = 0;
    }

    /**
     * Returns an array of states for which there are specified event transition rules.
     * Returns all states if argument is undefined.
     * @param event
     * @returns {Array}
     */
    getStates(event) {
        if (!event) {
            let objSett = [];
            for (let key in this.config.states) {
                objSett.push(key);
            }
            return objSett;
        } else {
            let objSett = [];
            for (let key in this.config.states) {
                for (let j in this.config.states[key].transitions) {
                    if (j == event) {
                        objSett.push(key);
                    }
                }
            }
            if (objSett.length != 0) {
                return objSett;
            } else {
                return [];
            }
        }
    }

    /**
     * Goes back to previous state.
     * Returns false if undo is not available.
     * @returns {Boolean}
     */
    undo() {
        if ((this.historyStates.length >= 2) && (this.currentStateInHistory != 0)) {
            this.currentStateInHistory--;
            this.lastWasTrigger = 0;
            return true;
            
        } else {
            return false;
        }
        
    }

    /**
     * Goes redo to state.
     * Returns false if redo is not available.
     * @returns {Boolean}
     */
    redo() {
        if (((this.currentStateInHistory + 1) < this.historyStates.length) 
                        && (this.lastWasTrigger != 1)) {
            this.currentStateInHistory++;
            return true;
        } else {
            return false;
        }
    }

    /**
     * Clears transition history
     */
    clearHistory() {
        this.historyStates = [];
        this.currentStateInHistory = -1;
    }
}

module.exports = FSM;

/** @Created by Uladzimir Halushka **/
