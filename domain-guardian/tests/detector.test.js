import{test}from'node:test';
import assert from'node:assert/strict';
import{analyze,distance,validateDomain}from'../extension/detector.js';
for(const domain of ['githbu.com','githb.com','githhub.com','githup.com','g00gle.com','paypal.com.evil.test','paypal-login.test','github.net','xn--pple-43d.com']){
  test(`warns about ${domain}`,()=>assert.equal(analyze(domain).status,'warning'));
}
for(const domain of ['github.com','https://LOGIN.GITHUB.COM./hello','https://github.com/path/paypal.com']){
  test(`matches ${domain}`,()=>assert.equal(analyze(domain).status,'matched'));
}
test('unrecognized domain does not mean safe',()=>assert.equal(analyze('unique-example.test').status,'unknown'));
test('URL credentials do not spoof hostname',()=>assert.equal(analyze('https://github.com@unrelated.test').status,'unknown'));
test('paths and query strings do not affect matching',()=>assert.equal(analyze('https://unrelated.test/github.com?q=paypal.com').status,'unknown'));
test('custom multipart domain is protected',()=>assert.equal(analyze('login.school.ac.uk',['school.ac.uk']).status,'matched'));
test('custom domain lookalike is detected',()=>assert.equal(analyze('schoool.ac.uk',['school.ac.uk']).status,'warning'));
test('unsupported protocols',()=>assert.equal(analyze('chrome://extensions').status,'unsupported'));
test('invalid input',()=>assert.equal(analyze('not a url').status,'unsupported'));
test('adjacent transposition',()=>assert.equal(distance('github','githbu'),1));
test('domain validation normalizes IDNs',()=>assert.match(validateDomain('bücher.de'),/^xn--/));
for(const value of ['https://example.com','user@example.com','foo/bar','-bad.com','bad..com','localhost']){
  test(`rejects custom input ${value}`,()=>assert.throws(()=>validateDomain(value)));
}
