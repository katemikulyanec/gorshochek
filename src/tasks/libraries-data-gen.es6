/**
 * Module for libraries files generation
 * @module src/tasks/libraries-data-gen.es6
 * @author Kuznetsov Andrey
 */

import os from 'os';
import workerFarm from 'worker-farm';
import LibrariesBase from './libraries-base';

/**
 * @exports
 * @class LibrariesDataGen
 * @desc Generates library version model structure and saves on filesystem
 */
export default class LibrariesDataGen extends LibrariesBase {

    /**
     * Constructor
     * @param {Config} baseConfig common configuration instance
     * @param {Object} taskConfig special task configuration object
     */
    constructor(baseConfig, taskConfig) {
        super(baseConfig, taskConfig);

        this.getTaskConfig().baseUrl = this.getTaskConfig().baseUrl || '/libs';
        this.workers = workerFarm(require.resolve('../worker'));
    }

    /**
     * Returns module instance for log purposes
     * @returns {Module}
     * @static
     */
    static getLoggerName() {
        return module;
    }

    /**
     * Return task human readable description
     * @returns {String} path
     * @static
     */
    static getName() {
        return 'generate libraries files';
    }

    /**
     * Finds library versions in changes model
     * @param {Model} model object
     * @param {String} type of changes
     * @returns {Objects[]}
     * @private
     */
    _findLibraryChanges(model, type) {
        return model.getChanges().pages[type].filter(item => {
            return item.lib && item.version;
        });
    }

    /**
     * Separates all library versions that should be generated by process sets
     * @param {Object[]} libVersions objects
     * @param {Number} numOfProcesses - number of processes
     * @returns {Array}
     * @private
     */
    _spreadByProcesses(libVersions, numOfProcesses) {
        const result = [];
        let processNum = 0;

        for(let i = 0; i < numOfProcesses; i++) {
            result[i] = [];
        }

        return libVersions.reduce((prev, item) => {
            prev[processNum++].push(item);
            processNum === numOfProcesses && (processNum = 0);
            return prev;
        }, result);
    }

    /**
     * Performs task
     * @public
     * @returns {Promise}
     * @public
     */
    run(model) {
        this.beforeRun();

        const numberOfProcesses = os.cpus().length;
        const processesQueues = this._spreadByProcesses([]
                .concat(this._findLibraryChanges(model, 'added'))
                .concat(this._findLibraryChanges(model, 'modified')), numberOfProcesses);
        let count = 0;

        return new Promise(resolve => {
            const callback = (error, output) => {
                if(error) {
                    this.logger
                        .error('Error occur while processing library versions for process %s', output)
                        .error('Error: %s', error.message);
                }

                if(++count === numberOfProcesses) {
                    workerFarm.end(this.workers);
                    resolve(model);
                }
            };

            for(let i = 0; i < numberOfProcesses; i++) {
                this.workers({
                    baseUrl: this.getTaskConfig().baseUrl,
                    basePath: this.getLibrariesCachePath(),
                    data: processesQueues[i],
                    languages: this.getBaseConfig().getLanguages()
                }, callback);
            }
        });
    }
}
