example-descriptors.bin: proto/*
	npx buf build ./proto \
		--output=$@ \
		--as-file-descriptor-set
