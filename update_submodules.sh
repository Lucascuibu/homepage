#!/bin/bash

# 初始化并更新 submodules
git submodule update --init --recursive
git submodule foreach 'git switch main || git switch master || true'
git submodule foreach 'git pull origin main || git pull origin master || true'