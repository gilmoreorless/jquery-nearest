SRC = src/jquery.nearest.js
MIN = src/jquery.nearest.min.js

uglify:
	uglifyjs $(SRC) -c -m --comments '/^\!/' > $(MIN)

.PHONY: uglify
