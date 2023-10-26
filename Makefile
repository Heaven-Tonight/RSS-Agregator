install: install-deps
	npx simple-git-hooks

run:
	bin/nodejs-package.js 10

install-deps:
	npm ci

lint:
	npx eslint .

publish:
	npm publish

test:
	npm run test

test-coverage:
	npm test -- --coverage --coverageProvider=v8

.PHONY: test