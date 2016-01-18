var Model = require('../../../lib/model'),
    createSearchMeta = require('../../../index').tasks.page.createSearchMeta;

describe('tasks-page/search-meta', function() {
    var model = new Model(),
        pages = [
            {url: '/', title: '/ title'},
            {url: '/url1', title: 'url1 title', tags: ['tag1', 'tag2']}
        ];

    beforeEach(function() {
        model.setPages(pages);
    });

    it('should return function as result', function() {
        createSearchMeta(model).should.be.instanceOf(Function);
    });

    it('should set valid search meta-information for page without tags', function() {
        return createSearchMeta(model)().then(function(result) {
            result.getPages()[0].meta.should.eql({
                breadcrumbs: [
                    {url: '/', title: '/ title'}
                ],
                fields: {
                    type: 'doc',
                    keywords: []
                }
            });
        });
    });

    it('should set valid search meta-information for tagged pages', function() {
        return createSearchMeta(model)().then(function(result) {
            result.getPages()[1].meta.should.eql({
                breadcrumbs: [
                    {url: '/', title: '/ title'},
                    {url: '/url1', title: 'url1 title'}
                ],
                fields: {
                    type: 'doc',
                    keywords: ['tag1', 'tag2']
                }
            });
        });
    });
});
