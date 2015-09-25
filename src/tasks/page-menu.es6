import builderCore from 'bs-builder-core';

export default class PageMenu extends builderCore.tasks.Base {

    /**
     * Returns logger module
     * @returns {module|Object|*}
     */
    static getLoggerName() {
        return module;
    }

    /**
     * Return task human readable description
     * @returns {String}
     */
    static getName() {
        return 'create page menu';
    }

    /**
     * Performs task
     * @returns {Promise}
     * @public
     */
    run(model) {
        this.beforeRun();

        this.logger.info(`Successfully finish task "${this.constructor.getName()}"`);
        return Promise.resolve(model);
    }
}
