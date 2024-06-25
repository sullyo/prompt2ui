include .env
include config.mk

build:
	docker build --tag $(IMAGE_TAG) .


run:
	docker run \
		-p 3000:3000 \
		-e ANTHROPIC_API_KEY=$(ANTHROPIC_API_KEY)\
		$(IMAGE_TAG)