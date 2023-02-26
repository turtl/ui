.PHONY: all clean lint release test watch watch-vite

SRC := src
BUILD := dist
PATH := $(PATH):$(shell pwd)/node_modules/.bin

LINT = npx eslint $(LINTARGS) -c ./.eslintrc.cjs "src/**/*.js" "src/**/*.svelte" "test/**/*.test.js"
MKDIR = mkdir -p ${dir $@}

allsrc := $(shell find $(SRC)/ -type f)


all: $(BUILD)/index.html

release: $(BUILD)/index.html $(BUILD)/.linted

clean:
	rm -rf $(BUILD)

lint:
	$(LINT)

test:
	npx vitest run src/ test/ -t '$(TEST)'

watch:
	while true; do inotifywait -qr -e close_write src/ index.html *.config.js *.config.cjs; make; done

watch-vite:
	vite

$(BUILD)/index.html: $(allsrc) index.html *.config.js *.config.cjs
	@$(MKDIR)
	vite build

$(BUILD)/.linted: $(allsrc) .eslintrc.cjs
	@$(MKDIR)
	$(LINT)
	@touch $@
	

