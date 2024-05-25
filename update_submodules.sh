#!/bin/bash

# 更新submodules
git submodule update --init --recursive
git submodule foreach git pull origin master