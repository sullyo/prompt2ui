include .env
include config.mk

build:
	docker build --tag $(IMAGE_TAG) .


dev:build
	docker run \
		-p 3000:3000 \
		-e ANTHROPIC_API_KEY=$(ANTHROPIC_API_KEY)\
		$(IMAGE_TAG) \
		npm run dev


run: build
	docker run \
		-p 3000:3000 \
		-e ANTHROPIC_API_KEY=$(ANTHROPIC_API_KEY)\
		$(IMAGE_TAG)