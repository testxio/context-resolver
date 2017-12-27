const assert = require('assert');
const resolver = require('.');

const context = {
  one: 1,
  funcOne: () => 1,
  True: true,
  arr: [1, 2, 3],
  obj: { one: 1, two: '2', three: 3 },
  undef: undefined,
  nil: null,
};

const cr = resolver(context);

assert.equal(cr('{{one}}'), context.one);
assert.notStrictEqual(cr('{{one}}'), '1');
assert.equal(cr('${one}'), context.one);
assert.equal(cr('${funcOne}'), context.funcOne());
assert.equal(cr('${True}'), context.True);
assert.equal(cr('hmm ${True}, yeah'), 'hmm true, yeah');
assert.deepEqual(cr('${arr}'), context.arr);
assert.deepEqual(
  cr({
    'abc ${funcOne} xyz': '11 ${one}',
    'hmm ${True}, yeah': null,
    'haha ${True}': ['one', '${one}', 'one {{funcOne}}'],
    'haha ${funcOne}': '${obj}',
  }),
  {
    'abc 1 xyz': '11 1',
    'hmm true, yeah': null,
    'haha true': ['one', '1', 'one 1'],
    'haha 1': { one: 1, two: '2', three: 3 },
  },
);
assert.deepStrictEqual(
  cr(['abc ${funcOne} xyz', '11 ${one}', 'hmm ${True}, yeah', null]),
  ['abc 1 xyz', '11 1', 'hmm true, yeah', null],
);
assert(cr('undef'), undefined);
assert(cr('nil'), null);
