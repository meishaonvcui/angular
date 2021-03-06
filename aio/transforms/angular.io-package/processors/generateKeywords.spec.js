const testPackage = require('../../helpers/test-package');
const mockLogger = require('dgeni/lib/mocks/log')(false);
const processorFactory = require('./generateKeywords');
const Dgeni = require('dgeni');

const mockReadFilesProcessor = {
  basePath: 'base/path'
};

describe('generateKeywords processor', () => {

  it('should be available on the injector', () => {
    const dgeni = new Dgeni([testPackage('angular.io-package')]);
    const injector = dgeni.configureInjector();
    const processor = injector.get('generateKeywordsProcessor');
    expect(processor.$process).toBeDefined();
  });

  it('should run after "paths-computed"', () => {
    const processor = processorFactory(mockLogger, mockReadFilesProcessor);
    expect(processor.$runAfter).toEqual(['paths-computed']);
  });

  it('should run before "rendering-docs"', () => {
    const processor = processorFactory(mockLogger, mockReadFilesProcessor);
    expect(processor.$runBefore).toEqual(['rendering-docs']);
  });

  it('should ignore internal and private exports', () => {
    const processor = processorFactory(mockLogger, mockReadFilesProcessor);
    const docs = [
      { docType: 'class', name: 'PublicExport' },
      { docType: 'class', name: 'PrivateExport', privateExport: true },
      { docType: 'class', name: 'InternalExport', internal: true }
    ];
    processor.$process(docs);
    expect(docs[docs.length - 1].data).toEqual([
      jasmine.objectContaining({ title: 'PublicExport', type: 'class'})
    ]);
  });
});
