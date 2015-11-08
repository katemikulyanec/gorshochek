var fsExtra = require('fs-extra'),
    sinon = require('sinon'),
    should = require('should'),
    Logger = require('bem-site-logger'),
    Base = require('../../../../lib/model/libraries/base');

describe('Base', function() {
    var sandbox = sinon.sandbox.create(),
        base;

    beforeEach(function() {
        sandbox.stub(fsExtra, 'outputJSON');
        sandbox.stub(fsExtra, 'outputFile');
        base = new Base();
    });

    afterEach(function() {
        sandbox.restore();
    });

    it('should have embedded logger', function() {
        base.logger.should.be.instanceOf(Logger);
    });

    it('should have empty data after initialization', function() {
        base.getData().should.be.instanceOf(Object).and.be.empty;

    });

    it('should set value for given key', function() {
        base.setValue('foo', 'bar');
        base.getData().foo.should.equal('bar');
    });

    it('should set value for given key and language', function() {
        base.setValue('foo', 'bar', 'en');
        base.getData()['en'].foo.should.equal('bar');
    });

    describe('saveFile', function() {
        it('should call valid method for saving JSON file', function() {
            fsExtra.outputJSON.yields(null, './file.json');
            base.saveFile('./file.json', {foo: 'bar'}, true).then(function() {
                fsExtra.outputJSON.should.be.calledOnce();
            });
        });

        it('should call valid method for saving text/html file', function() {
            fsExtra.outputFile.yields(null, './file.txt');
            base.saveFile('./file.json', {foo: 'bar'}, false).then(function() {
                fsExtra.outputFile.should.be.calledOnce();
            });
        });

        it('should return file path of saved file on successfully saving', function() {
            fsExtra.outputJSON.yields(null, './file.json');
            base.saveFile('./file.json', {foo: 'bar'}, true).then(function(filePath) {
                filePath.should.equal('./file.json');
            });
        });

        it('should trow error if error was occur while saving file', function() {
            fsExtra.outputJSON.yields(new Error('file error'));
            base.saveFile('./file.json', {foo: 'bar'}, true).catch(function(error) {
                error.message.should.equal('file error');
            });
        });
    });
});