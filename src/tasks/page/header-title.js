import * as util from './util';

/*
 Для каждой страницы создаем
 поле header.title в котором находится строка состоящая из
 соответствующих title-ов всех родительских страниц начиная от корневой
 и заканчивая текущей страницей. title-ы страниц разделены символом "/".
 */

/**
 * Returns execution function for page header title creation
 * @param {Model} model - application model instance
 * @param {Object} [options] - task options
 * @param {String} [options.delimiter] - delimiter for page title chunks separation
 * @returns {Function}
 * @example
 * var Q = require('q');
 * var gorshochek = require('gorshochek');
 * var model = gorshochek.createModel();
 * Q()
 *    .then(tasks.core.mergeModels(model, {modelPath: './examples/model.ru.json'}))
 *    .then(tasks.core.normalizeModel(model))
 *    .then(tasks.page.createHeaderTitle(model, {delimiter: '/'}))
 *    .then(tasks.core.saveModel(model))
 *    .then(tasks.core.rsync(model, {
 *        dest: './data',
 *        exclude: ['*.meta.json', 'model.json', '*.md']
 *    }))
 *    .done();
 */
export default function createPageTitle(model, options = {delimiter: ' / '}) {
    return util.getExecFunction(model, (map, page) => {
        const urlSet = util.getParentUrls(page).reverse();
        page.header || (page.header = {});
        page.header.title = urlSet.map(url => map[url]).join(options.delimiter);
    });
}
